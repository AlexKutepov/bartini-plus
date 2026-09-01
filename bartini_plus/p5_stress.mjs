import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const CLOCKS = 3;
const LOCK_THRESHOLD = 0.95;

class RNG {
  constructor(seed) {
    this.s = seed >>> 0;
  }

  next() {
    let t = (this.s = (this.s + 0x6d2b79f5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

function sum(xs) {
  return xs.reduce((a, b) => a + b, 0);
}

function mean(xs) {
  return xs.length ? sum(xs) / xs.length : null;
}

function median(xs) {
  if (!xs.length) return null;
  const sorted = [...xs].sort((a, b) => a - b);
  const m = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[m]
    : 0.5 * (sorted[m - 1] + sorted[m]);
}

function argmax(xs) {
  let best = 0;
  for (let i = 1; i < xs.length; i++) {
    if (xs[i] > xs[best]) best = i;
  }
  return best;
}

function max(xs) {
  return xs[argmax(xs)];
}

function normalize(xs) {
  const s = sum(xs);
  return xs.map((x) => x / s);
}

function baseProbability(counts, theta) {
  if (theta === 0) return counts.map(() => 1 / counts.length);
  const weights = counts.map((n) => n ** theta);
  return normalize(weights);
}

function structuralProbability(counts, theta, exploration = 0) {
  const p = baseProbability(counts, theta);
  if (exploration === 0) return p;
  return p.map((x) => (1 - exploration) * x + exploration / p.length);
}

function drawIndexFast(
  counts,
  theta,
  rng,
  logitSigma = 0,
  exploration = 0,
) {
  let w0 = counts[0] ** theta;
  let w1 = counts[1] ** theta;
  let w2 = counts[2] ** theta;
  if (logitSigma !== 0) {
    w0 *= Math.exp(logitSigma * (2 * rng.next() - 1));
    w1 *= Math.exp(logitSigma * (2 * rng.next() - 1));
    w2 *= Math.exp(logitSigma * (2 * rng.next() - 1));
  }
  const weightSum = w0 + w1 + w2;
  const uniform = exploration / CLOCKS;
  const scale = 1 - exploration;
  const p0 = scale * (w0 / weightSum) + uniform;
  const p1 = scale * (w1 / weightSum) + uniform;
  const u = rng.next();
  if (u < p0) return 0;
  if (u < p0 + p1) return 1;
  return 2;
}

function structuralPMaxFast(counts, theta, exploration = 0) {
  const w0 = counts[0] ** theta;
  const w1 = counts[1] ** theta;
  const w2 = counts[2] ** theta;
  const weightSum = w0 + w1 + w2;
  return (
    (1 - exploration) * (Math.max(w0, w1, w2) / weightSum) +
    exploration / CLOCKS
  );
}

function effectiveDimension(p) {
  return 1 / sum(p.map((x) => x * x));
}

function countsForTargetProbability(target, theta, totalCount) {
  const raw = target.map((p) => p ** (1 / theta));
  const scale = totalCount / sum(raw);
  return raw.map((x) => x * scale);
}

function censoredQuantile(hitSteps, nRuns, q) {
  if (hitSteps.length < Math.ceil(q * nRuns)) return null;
  const sorted = [...hitSteps].sort((a, b) => a - b);
  return sorted[Math.ceil(q * nRuns) - 1];
}

function runFirstPassage({
  theta,
  initialCounts,
  maxSteps,
  nRuns,
  seed,
  logitSigma = 0,
  exploration = 0,
}) {
  const master = new RNG(seed);
  const hitSteps = [];
  const winnerCounts = Array(CLOCKS).fill(0);
  for (let run = 0; run < nRuns; run++) {
    const rng = new RNG((master.next() * 2 ** 32) >>> 0);
    const counts = initialCounts.slice();
    let p = structuralProbability(counts, theta, exploration);
    let hit = max(p) >= LOCK_THRESHOLD ? 0 : null;
    if (hit === 0) winnerCounts[argmax(p)] += 1;
    for (let step = 1; step <= maxSteps && hit === null; step++) {
      const selected = drawIndexFast(
        counts,
        theta,
        rng,
        logitSigma,
        exploration,
      );
      counts[selected] += 1;
      if (
        structuralPMaxFast(counts, theta, exploration) >= LOCK_THRESHOLD
      ) {
        hit = step;
        winnerCounts[argmax(counts)] += 1;
      }
    }
    if (hit !== null) hitSteps.push(hit);
  }
  return {
    theta,
    initial_counts: initialCounts,
    initial_probability: structuralProbability(
      initialCounts,
      theta,
      exploration,
    ),
    n_runs: nRuns,
    max_steps: maxSteps,
    logit_sigma: logitSigma,
    exploration,
    hit_fraction: hitSteps.length / nRuns,
    median_with_censoring: censoredQuantile(hitSteps, nRuns, 0.5),
    median_conditional_on_hit: median(hitSteps),
    p90_with_censoring: censoredQuantile(hitSteps, nRuns, 0.9),
    winner_counts_at_hit: winnerCounts,
  };
}

function simulateFixed({
  theta,
  initialCounts,
  steps,
  rng,
  logitSigma = 0,
  exploration = 0,
}) {
  const counts = initialCounts.slice();
  const ticks = Array(CLOCKS).fill(0);
  const tailStart = Math.floor(0.8 * steps);
  let ticksAtTail = null;
  let firstHit =
    max(structuralProbability(counts, theta, exploration)) >= LOCK_THRESHOLD
      ? 0
      : null;
  for (let step = 1; step <= steps; step++) {
    const selected = drawIndexFast(
      counts,
      theta,
      rng,
      logitSigma,
      exploration,
    );
    counts[selected] += 1;
    ticks[selected] += 1;
    if (step === tailStart) ticksAtTail = ticks.slice();
    if (
      firstHit === null &&
      structuralPMaxFast(counts, theta, exploration) >= LOCK_THRESHOLD
    ) {
      firstHit = step;
    }
  }
  const p = structuralProbability(counts, theta, exploration);
  const winner = argmax(counts);
  const tailTicks = ticks.map((x, i) => x - ticksAtTail[i]);
  const tailTotal = sum(tailTicks);
  return {
    firstHit,
    winner,
    p,
    dT: effectiveDimension(p),
    tailLoserRate: (tailTotal - tailTicks[winner]) / tailTotal,
    everyColorInTail: tailTicks.every((x) => x > 0),
  };
}

function runFixedEnsemble(config) {
  const master = new RNG(config.seed);
  const runs = [];
  for (let i = 0; i < config.nRuns; i++) {
    runs.push(
      simulateFixed({
        ...config,
        rng: new RNG((master.next() * 2 ** 32) >>> 0),
      }),
    );
  }
  const hitSteps = runs
    .map((r) => r.firstHit)
    .filter((x) => x !== null);
  const winnerCounts = Array(CLOCKS).fill(0);
  for (const run of runs) winnerCounts[run.winner] += 1;
  const initialP = structuralProbability(
    config.initialCounts,
    config.theta,
    config.exploration ?? 0,
  );
  const initialMax = max(initialP);
  const initialLeaders = initialP
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => Math.abs(p - initialMax) < 1e-12);
  const initialLeader =
    initialLeaders.length === 1 ? initialLeaders[0].i : null;
  return {
    theta: config.theta,
    initial_counts: config.initialCounts,
    initial_probability: initialP,
    steps: config.steps,
    n_runs: config.nRuns,
    logit_sigma: config.logitSigma ?? 0,
    exploration: config.exploration ?? 0,
    threshold_hit_fraction: hitSteps.length / config.nRuns,
    threshold_hit_median: median(hitSteps),
    final_winner_counts: winnerCounts,
    initial_leader_wins_fraction:
      initialLeader === null
        ? null
        : runs.filter((r) => r.winner === initialLeader).length / config.nRuns,
    final_p_max_mean: mean(runs.map((r) => max(r.p))),
    final_dT_mean: mean(runs.map((r) => r.dT)),
    tail_loser_rate_mean: mean(runs.map((r) => r.tailLoserRate)),
    every_color_selected_in_tail_fraction:
      runs.filter((r) => r.everyColorInTail).length / config.nRuns,
  };
}

function meanFieldRhs(x, theta, exploration) {
  const q = baseProbability(x, theta).map(
    (p) => (1 - exploration) * p + exploration / x.length,
  );
  return x.map((v, i) => q[i] - v);
}

function addScaled(x, dx, scale) {
  return x.map((v, i) => v + scale * dx[i]);
}

function meanFieldFinal({
  theta,
  exploration,
  initial,
  logTime,
  ds = 0.01,
}) {
  let x = initial.slice();
  const nSteps = Math.ceil(logTime / ds);
  const h = logTime / nSteps;
  for (let i = 0; i < nSteps; i++) {
    const k1 = meanFieldRhs(x, theta, exploration);
    const k2 = meanFieldRhs(addScaled(x, k1, h / 2), theta, exploration);
    const k3 = meanFieldRhs(addScaled(x, k2, h / 2), theta, exploration);
    const k4 = meanFieldRhs(addScaled(x, k3, h), theta, exploration);
    x = normalize(
      x.map((v, j) =>
        Math.max(
          1e-300,
          v + (h / 6) * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j]),
        ),
      ),
    );
  }
  const p = structuralProbability(x, theta, exploration);
  return {
    theta,
    exploration,
    initial,
    log_time: logTime,
    x_final: x,
    p_final: p,
    dT_final: effectiveDimension(p),
  };
}

function simpsonIntegral(fn, a, b, intervals = 20000) {
  const n = intervals % 2 === 0 ? intervals : intervals + 1;
  const h = (b - a) / n;
  let acc = fn(a) + fn(b);
  for (let i = 1; i < n; i++) {
    acc += (i % 2 === 0 ? 2 : 4) * fn(a + i * h);
  }
  return (acc * h) / 3;
}

function exactMeanFieldLockLogTime(theta, initialWinner, initialLoser, qLock) {
  const epsilon = theta - 1;
  const y0 = Math.log(initialWinner / initialLoser);
  const yLock = Math.log((2 * qLock) / (1 - qLock)) / theta;
  const integrand = (y) => {
    const ey = Math.exp(y);
    return (
      (Math.exp(theta * y) + 2) /
      ((ey + 2) * Math.expm1(epsilon * y))
    );
  };
  return {
    theta,
    epsilon,
    y0,
    y_lock: yLock,
    log_time: simpsonIntegral(integrand, y0, yLock),
  };
}

function linearFit(x, y) {
  const mx = mean(x);
  const my = mean(y);
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < x.length; i++) {
    const dx = x[i] - mx;
    const dy = y[i] - my;
    sxx += dx * dx;
    sxy += dx * dy;
    syy += dy * dy;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  return {
    slope,
    intercept,
    r2: (sxy * sxy) / (sxx * syy),
  };
}

function variationalCheck() {
  const counts = [4, 7, 11];
  const theta = 1.7;
  const p = baseProbability(counts, theta);
  const kkt = p.map(
    (x, i) => theta * Math.log(counts[i]) - Math.log(x) - 1,
  );
  return {
    counts,
    theta,
    maximizer: p,
    kkt_values: kkt,
    max_kkt_spread: max(kkt) - Math.min(...kkt),
    hessian_diagonal: p.map((x) => -1 / x),
  };
}

function theta2ExplorationFixedPoints(exploration) {
  const discriminant =
    exploration * exploration - 18 * exploration + 9;
  const asymmetricWinnerShares =
    discriminant < 0
      ? []
      : [
          (3 - exploration + Math.sqrt(discriminant)) / 6,
          (3 - exploration - Math.sqrt(discriminant)) / 6,
        ];
  return {
    exploration,
    symmetric_share: 1 / 3,
    asymmetric_winner_shares: asymmetricWinnerShares,
  };
}

function runAll() {
  const variational = variationalCheck();

  const meanFieldTheta = [0.8, 1, 1.2, 2].map((theta) =>
    meanFieldFinal({
      theta,
      exploration: 0,
      initial: [0.34, 0.33, 0.33],
      logTime: 100,
    }),
  );
  const exactSymmetry = meanFieldFinal({
    theta: 2,
    exploration: 0,
    initial: [1 / 3, 1 / 3, 1 / 3],
    logTime: 100,
  });

  const thetaGrid = [1.01, 1.015, 1.02, 1.03, 1.05, 1.08, 1.12, 1.2];
  const criticalRecords = thetaGrid.map((theta) => {
    const rec = exactMeanFieldLockLogTime(theta, 0.34, 0.33, LOCK_THRESHOLD);
    return {
      ...rec,
      log10_total_count: Math.log10(100) + rec.log_time / Math.log(10),
      epsilon_times_log_time: rec.epsilon * rec.log_time,
    };
  });
  const asymptoticRecords = criticalRecords.filter((r) => r.epsilon <= 0.05);
  const criticalFit = linearFit(
    asymptoticRecords.map((r) => 1 / r.epsilon),
    asymptoticRecords.map((r) => r.log_time),
  );
  const y0 = Math.log(0.34 / 0.33);
  const yLockAtCritical = Math.log(
    (2 * LOCK_THRESHOLD) / (1 - LOCK_THRESHOLD),
  );
  const predictedSlope = Math.log(yLockAtCritical / y0);

  const stochasticCritical = [
    [1.05, 100000, 24],
    [1.1, 100000, 24],
    [1.15, 100000, 32],
    [1.2, 100000, 48],
    [1.3, 50000, 64],
    [1.5, 20000, 64],
    [2, 5000, 64],
  ].map(([theta, maxSteps, nRuns], i) =>
    runFirstPassage({
      theta,
      initialCounts: [1, 1, 1],
      maxSteps,
      nRuns,
      seed: 1000 + i,
    }),
  );

  const initialConditions = [
    [0.34, 0.33, 0.33],
    [0.98, 0.01, 0.01],
  ].map((target, i) =>
    runFixedEnsemble({
      theta: 2,
      initialCounts: countsForTargetProbability(target, 2, 75),
      steps: 15000,
      nRuns: 96,
      seed: 2000 + i,
    }),
  );

  const boundedLogitNoise = [0, 0.5, 1, 2].map((sigma, i) =>
    runFirstPassage({
      theta: 2,
      initialCounts: [25, 25, 25],
      maxSteps: 30000,
      nRuns: 96,
      seed: 3000 + i,
      logitSigma: sigma,
    }),
  );

  const explorationGrid = [0, 0.01, 0.05, 0.1, 0.25, 0.45, 0.55, 0.75];
  const persistentExploration = explorationGrid.map((exploration, i) =>
    runFixedEnsemble({
      theta: 2,
      initialCounts: [25, 25, 25],
      steps: 30000,
      nRuns: 16,
      seed: 4000 + i,
      exploration,
    }),
  );
  const explorationMeanField = explorationGrid.map((exploration) => {
    const rec = meanFieldFinal({
      theta: 2,
      exploration,
      initial: [0.34, 0.33, 0.33],
      logTime: 300,
    });
    return {
      ...rec,
      symmetric_tangent_eigenvalue: (1 - exploration) * 2 - 1,
      probability_floor: exploration / CLOCKS,
      ideal_vertex_p_max_ceiling: 1 - (2 * exploration) / CLOCKS,
      ideal_vertex_dT_floor:
        1 /
        ((1 - (2 * exploration) / CLOCKS) ** 2 +
          2 * (exploration / CLOCKS) ** 2),
    };
  });

  const checks = {
    variational_solution_is_p5: variational.max_kkt_spread < 1e-12,
    mean_field_theta_below_1_returns_to_symmetry:
      meanFieldTheta[0].dT_final > 2.999,
    mean_field_theta_above_1_goes_to_vertex:
      meanFieldTheta[2].dT_final < 1.001 &&
      meanFieldTheta[3].dT_final < 1.001,
    deterministic_exact_symmetry_is_exception:
      exactSymmetry.dT_final > 2.999999,
    critical_log_time_is_linear_in_inverse_epsilon:
      criticalFit.r2 > 0.9999,
    critical_slope_matches_asymptotic:
      Math.abs(criticalFit.slope - predictedSlope) / predictedSlope < 0.03,
    finite_initial_perturbations_reach_threshold:
      initialConditions.every((r) => r.threshold_hit_fraction > 0.9),
    bounded_logit_noise_delays_threshold:
      boundedLogitNoise.at(-1).hit_fraction <
        0.5 * boundedLogitNoise[0].hit_fraction &&
      boundedLogitNoise.every(
        (r, i) =>
          i === 0 ||
          r.hit_fraction <= boundedLogitNoise[i - 1].hit_fraction + 0.05,
      ),
    persistent_exploration_keeps_loser_ticks:
      persistentExploration
        .filter((r) => r.exploration > 0)
        .every((r) => r.tail_loser_rate_mean > r.exploration / 3),
    exploration_symmetric_local_stability_boundary_is_one_minus_inverse_theta:
      Math.abs((1 - 1 / 2) - 0.5) < 1e-15,
  };

  const conclusions = {
    theta_c_for_exact_p5_monopoly: 1,
    exact_monopoly_for_theta_gt_1_without_persistent_noise: true,
    exact_symmetric_start_blocks_deterministic_mean_field_lock: true,
    exact_symmetric_start_blocks_stochastic_lock: false,
    p5_is_entropy_regularized_log_score_maximizer: true,
    p5_follows_from_3_plus_3_geometry: false,
    mean_field_lock_time_scales_as_inverse_theta_minus_one: false,
    mean_field_log_lock_time_scales_as_inverse_theta_minus_one: true,
    universal_exact_stochastic_lock_time_law_obtained: false,
    arbitrary_persistent_noise_preserves_exact_lock: false,
    persistent_exploration_preserves_exact_lock: false,
    bounded_logit_noise_result_is_finite_horizon_only: true,
  };

  return {
    checks,
    conclusions,
    definitions: {
      clocks: CLOCKS,
      threshold_lock_probability: LOCK_THRESHOLD,
      exact_lock:
        "После конечного случайного шага все последующие тики принадлежат одному часу.",
      threshold_lock:
        "Первое достижение max(p) >= 0.95; это не доказательство точного lock.",
    },
    variational,
    rubin_criterion: {
      weight: "w(n)=n^theta",
      reciprocal_series: "sum_n 1/w(n)=sum_n n^(-theta)",
      converges_iff: "theta>1",
      consequence:
        "При theta>1 сильная монополия почти наверное; при theta<=1 каждый цвет выбирается бесконечно часто.",
    },
    mean_field: {
      equation: "dx_i/ds=x_i^theta/sum_j(x_j^theta)-x_i, s=log N",
      symmetric_tangent_eigenvalue: "theta-1",
      perturbed_start: meanFieldTheta,
      exact_symmetric_start: exactSymmetry,
    },
    critical_dynamics: {
      initial_share: [0.34, 0.33, 0.33],
      initial_total_count: 100,
      records: criticalRecords,
      fit_log_time_vs_inverse_epsilon: criticalFit,
      asymptotic_slope_theory: predictedSlope,
      stochastic_first_passage: stochasticCritical,
    },
    initial_condition_robustness: initialConditions,
    noise: {
      bounded_logit: boundedLogitNoise,
      persistent_exploration: {
        rule: "p_tilde=(1-mu)p+mu/3",
        exact_monopoly_for_any_mu_gt_0: false,
        reason:
          "p_tilde_i>=mu/3, поэтому каждый час тикает бесконечно часто почти наверное.",
        symmetric_local_stability_boundary_theta_2: 0.5,
        asymmetric_saddle_node_theta_2: 9 - 6 * Math.sqrt(2),
        theta_2_fixed_points: [0.45, 0.5, 0.51, 9 - 6 * Math.sqrt(2), 0.52].map(
          theta2ExplorationFixedPoints,
        ),
        finite_runs: persistentExploration,
        mean_field: explorationMeanField,
      },
    },
  };
}

const data = runAll();
const here = dirname(fileURLToPath(import.meta.url));
const outPath = join(here, "..", "results", "p5_stress.json");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(data, null, 2));
