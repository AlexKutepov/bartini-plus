/**
 * Бартини+: стохастический выбор тикающего часа.
 * L0 контроль θ=0, L1 запирание урны, L2 шум до/после, L3 Life.
 *
 * Гипотеза: Александр Кутепов. Математика и прогон: Кутепов + LLM, 2026.
 * Это не исторический Бартини, а проверяемая надстройка.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const C_CLOCKS = [0.18, 0.4, 0.62];
const C_REF = C_CLOCKS.reduce((a, b) => a + b, 0) / 3;
const DX = 1.0;
const DT = 0.4;
const N_LAT = 128;
const LOCK_P = 0.95;
const RULE_ORDER = ["B3/S23", "B36/S23", "B3/S234"];
const RULES = {
  "B3/S23": { birth: new Set([3]), survive: new Set([2, 3]) },
  "B36/S23": { birth: new Set([3, 6]), survive: new Set([2, 3]) },
  "B3/S234": { birth: new Set([3]), survive: new Set([2, 3, 4]) },
};

class RNG {
  constructor(seed) {
    this.s = seed >>> 0 || 1;
  }
  next() {
    this.s = (Math.imul(1664525, this.s) + 1013904223) >>> 0;
    return this.s / 4294967296;
  }
  choice(p) {
    let u = this.next();
    for (let i = 0; i < p.length; i++) {
      u -= p[i];
      if (u <= 0) return i;
    }
    return p.length - 1;
  }
}

function effectiveTimeDimension(p) {
  let s = 0;
  let s2 = 0;
  for (const x of p) {
    s += x;
    s2 += x * x;
  }
  return s2 <= 0 ? 0 : (s * s) / s2;
}

class ClockUrn {
  constructor(theta, rng, n0 = 1, nClocks = 3) {
    this.theta = theta;
    this.rng = rng;
    this.n = Array(nClocks).fill(n0);
    this.ticks = Array(nClocks).fill(0);
  }
  get p() {
    if (this.theta === 0) {
      return this.n.map(() => 1 / this.n.length);
    }
    const w = this.n.map((x) => x ** this.theta);
    const s = w.reduce((a, b) => a + b, 0);
    return w.map((x) => x / s);
  }
  step() {
    const alpha = this.rng.choice(this.p);
    this.n[alpha] += 1;
    this.ticks[alpha] += 1;
    return alpha;
  }
  locked(th = LOCK_P) {
    return Math.max(...this.p) >= th;
  }
  winner() {
    let best = 0;
    for (let i = 1; i < this.ticks.length; i++) {
      if (this.ticks[i] > this.ticks[best]) best = i;
    }
    return best;
  }
}

function clockVariance() {
  const m = C_REF;
  return C_CLOCKS.reduce((s, c) => s + (c - m) ** 2, 0) / C_CLOCKS.length;
}

/**
 * |⟨e^{-i c k Δt}⟩| ≈ 1 − (1/2) Var(c) k² Δt²
 * ⇒ Γ ≈ (1/2) Var(c) k² Δt. Множитель 1/2 — разложение, не Var(c)Δt.
 */
const BETA_THEORY = 0.5 * clockVariance() * DT;

function exactGamma(k) {
  let re = 0;
  let im = 0;
  for (const c of C_CLOCKS) {
    const th = c * k * DT;
    re += Math.cos(th);
    im += Math.sin(th);
  }
  re /= C_CLOCKS.length;
  im /= C_CLOCKS.length;
  const r = Math.hypot(re, im);
  if (r <= 0 || r >= 1) return 0;
  return -Math.log(r) / DT;
}

/**
 * ψ → ψ exp(-i c_α k Δt). |ψ| = 1 в каждой реализации.
 * Затухание Kubo–Anderson — у |⟨ψ⟩|, не у энергии одной траектории.
 */
class ModeOscillator {
  constructor(mode) {
    this.k = (2 * Math.PI * mode) / (N_LAT * DX);
    this.re = 1;
    this.im = 0;
  }
  step(alpha) {
    const phase = C_CLOCKS[alpha] * this.k * DT;
    const c = Math.cos(phase);
    const s = Math.sin(phase);
    const re = this.re * c - this.im * s;
    const im = this.re * s + this.im * c;
    this.re = re;
    this.im = im;
  }
}

class Life2D {
  constructor(size) {
    this.size = size;
    this.grid = new Uint8Array(size * size);
  }
  idx(y, x) {
    const s = this.size;
    return ((y + s) % s) * s + ((x + s) % s);
  }
  clear() {
    this.grid.fill(0);
  }
  seedGlider(y = 2, x = 2) {
    this.clear();
    for (const [dy, dx] of [
      [0, 1],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ]) {
      this.grid[this.idx(y + dy, x + dx)] = 1;
    }
  }
  seedRandom(rng, density = 0.14) {
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = rng.next() < density ? 1 : 0;
    }
  }
  neighbors() {
    const s = this.size;
    const n = new Int16Array(s * s);
    const g = this.grid;
    for (let y = 0; y < s; y++) {
      for (let x = 0; x < s; x++) {
        let acc = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dy === 0 && dx === 0) continue;
            acc += g[this.idx(y + dy, x + dx)];
          }
        }
        n[y * s + x] = acc;
      }
    }
    return n;
  }
  step(alpha) {
    const rule = RULES[RULE_ORDER[alpha]];
    const n = this.neighbors();
    const nxt = new Uint8Array(this.grid.length);
    for (let i = 0; i < this.grid.length; i++) {
      const nb = n[i];
      if (this.grid[i]) nxt[i] = rule.survive.has(nb) ? 1 : 0;
      else nxt[i] = rule.birth.has(nb) ? 1 : 0;
    }
    this.grid = nxt;
  }
  get population() {
    let s = 0;
    for (const v of this.grid) s += v;
    return s;
  }
  structured(lo = 3, hi = 40) {
    const p = this.population;
    return p >= lo && p <= hi;
  }
}

function kPhys(mode) {
  return (2 * Math.PI * mode) / (N_LAT * DX);
}

function fitGamma(t, amp, floor = 0.28) {
  const a0 = amp[0] || 0;
  const cut = Math.max(floor, 0.12 * a0);
  const idx = [];
  for (let i = 0; i < amp.length; i++) if (amp[i] > cut) idx.push(i);
  if (idx.length < 10) return NaN;
  const lo = Math.max(1, Math.floor(0.04 * idx.length));
  const use = idx.slice(lo);
  if (use.length < 8) return NaN;
  const xs = use.map((i) => t[i]);
  const ys = use.map((i) => Math.log(amp[i]));
  const n = xs.length;
  let sx = 0;
  let sy = 0;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sx += xs[i];
    sy += ys[i];
    sxx += xs[i] * xs[i];
    sxy += xs[i] * ys[i];
  }
  const den = n * sxx - sx * sx;
  if (Math.abs(den) < 1e-18) return NaN;
  const slope = (n * sxy - sx * sy) / den;
  return -slope;
}

function mean(xs) {
  const v = xs.filter((x) => Number.isFinite(x));
  if (!v.length) return NaN;
  return v.reduce((a, b) => a + b, 0) / v.length;
}

function median(xs) {
  const v = [...xs].sort((a, b) => a - b);
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : 0.5 * (v[m - 1] + v[m]);
}

function corr(x, y) {
  const n = x.length;
  const mx = mean(x);
  const my = mean(y);
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i++) {
    const a = x[i] - mx;
    const b = y[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  return num / Math.sqrt(dx * dy);
}

function downsample(xs, n = 40) {
  if (xs.length <= n) return xs;
  const out = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.round((i * (xs.length - 1)) / (n - 1));
    out.push(xs[idx]);
  }
  return out;
}

function runWaveEnsemble({
  theta,
  modes,
  steps,
  nRuns,
  seed,
  n0 = 1,
  recordEvery = 4,
}) {
  const rngMaster = new RNG(seed);
  const out = { theta, modes: {}, lockSteps: [] };
  for (const mode of modes) {
    const reRuns = [];
    const imRuns = [];
    const lockAt = [];
    const dTHist = [];
    for (let r = 0; r < nRuns; r++) {
      const rng = new RNG((rngMaster.next() * 2 ** 31) >>> 0);
      const urn = new ClockUrn(theta, rng, n0);
      const osc = new ModeOscillator(mode);
      const reRec = [];
      const imRec = [];
      const dRec = [];
      let lockStep = null;
      for (let s = 0; s < steps; s++) {
        osc.step(urn.step());
        if (lockStep === null && urn.locked()) lockStep = s;
        if (s % recordEvery === 0) {
          reRec.push(osc.re);
          imRec.push(osc.im);
          dRec.push(effectiveTimeDimension(urn.p));
        }
      }
      reRuns.push(reRec);
      imRuns.push(imRec);
      lockAt.push(lockStep === null ? steps : lockStep);
      dTHist.push(dRec);
    }
    const nSamp = reRuns[0].length;
    const ampCoh = [];
    const t = [];
    for (let i = 0; i < nSamp; i++) {
      const re = mean(reRuns.map((a) => a[i]));
      const im = mean(imRuns.map((a) => a[i]));
      ampCoh.push(Math.hypot(re, im));
      t.push(i * recordEvery * DT);
    }
    const lockMed = median(lockAt);
    const cut = Math.max(8, Math.floor(lockMed / recordEvery));
    const dTMean = dTHist[0].map((_, i) => mean(dTHist.map((a) => a[i])));
    out.modes[mode] = {
      k: kPhys(mode),
      k2: kPhys(mode) ** 2,
      t,
      ampMean: ampCoh,
      gammaAll: fitGamma(t, ampCoh),
      gammaPreMean: fitGamma(t.slice(0, cut), ampCoh.slice(0, cut)),
      gammaPostMean: fitGamma(t.slice(cut), ampCoh.slice(cut)),
      dTMean,
    };
    out.lockSteps.push(...lockAt);
  }
  return out;
}

function runL1Urn({ theta, steps, nRuns, seed, n0 = 1 }) {
  const rngMaster = new RNG(seed);
  const winners = [];
  const lockSteps = [];
  const lockedFlags = [];
  const dTCurves = [];
  const pCurves = [];
  const sampleEvery = Math.max(1, Math.floor(steps / 200));
  for (let r = 0; r < nRuns; r++) {
    const rng = new RNG((rngMaster.next() * 2 ** 31) >>> 0);
    const urn = new ClockUrn(theta, rng, n0);
    const dRec = [];
    const pRec = [];
    let lockStep = null;
    for (let s = 0; s < steps; s++) {
      urn.step();
      if (lockStep === null && urn.locked()) lockStep = s;
      if (s % sampleEvery === 0) {
        dRec.push(effectiveTimeDimension(urn.p));
        pRec.push(urn.p.slice());
      }
    }
    winners.push(urn.winner());
    lockSteps.push(lockStep === null ? steps : lockStep);
    lockedFlags.push(urn.locked());
    dTCurves.push(dRec);
    pCurves.push(pRec);
  }
  const counts = [0, 1, 2].map((i) => winners.filter((w) => w === i).length);
  const dTMean = dTCurves[0].map((_, i) => mean(dTCurves.map((a) => a[i])));
  const pMean = pCurves[0].map((_, i) =>
    [0, 1, 2].map((j) => mean(pCurves.map((a) => a[i][j])))
  );
  const k = dTMean.map((_, i) => i * sampleEvery);
  return {
    theta,
    nRuns,
    steps,
    winnerCounts: counts,
    lockFrac: mean(lockedFlags.map((x) => (x ? 1 : 0))),
    lockStepMedian: median(lockSteps),
    lockStepMean: mean(lockSteps),
    k,
    dTMean,
    pMean,
    dTFinalMean: dTMean[dTMean.length - 1],
  };
}

function runL3Life({ theta, steps, nRuns, size, seed, initial, n0 = 1 }) {
  const rngMaster = new RNG(seed);
  const structuredEnd = [];
  const popHist = [];
  const winners = [];
  const lockSteps = [];
  const structuredT = [];
  for (let r = 0; r < nRuns; r++) {
    const rng = new RNG((rngMaster.next() * 2 ** 31) >>> 0);
    const urn = new ClockUrn(theta, rng, n0);
    const life = new Life2D(size);
    if (initial === "glider") life.seedGlider();
    else life.seedRandom(rng, 0.14);
    const pops = [];
    const struct = [];
    let lockStep = null;
    for (let s = 0; s < steps; s++) {
      life.step(urn.step());
      pops.push(life.population);
      struct.push(life.structured() ? 1 : 0);
      if (lockStep === null && urn.locked()) lockStep = s;
    }
    structuredEnd.push(life.structured() ? 1 : 0);
    popHist.push(pops);
    winners.push(urn.winner());
    lockSteps.push(lockStep === null ? steps : lockStep);
    structuredT.push(struct);
  }
  const popMean = popHist[0].map((_, i) => mean(popHist.map((a) => a[i])));
  const structMean = structuredT[0].map((_, i) =>
    mean(structuredT.map((a) => a[i]))
  );
  const byWinner = {};
  for (let i = 0; i < 3; i++) {
    const vals = structuredEnd.filter((_, r) => winners[r] === i);
    byWinner[RULE_ORDER[i]] = vals.length ? mean(vals) : NaN;
  }
  return {
    theta,
    initial,
    nRuns,
    structuredEndFrac: mean(structuredEnd),
    popMean,
    structFracT: structMean,
    winnerCounts: [0, 1, 2].map((i) => winners.filter((w) => w === i).length),
    structuredByWinner: byWinner,
    lockFrac: mean(lockSteps.map((s) => (s < steps ? 1 : 0))),
    lockStepMedian: median(lockSteps),
  };
}

function runAll(outPath) {
  const modes = [2, 4, 6, 8, 10];
  console.log("L0 coherent θ=0");
  const l0 = runWaveEnsemble({
    theta: 0,
    modes,
    steps: 5000,
    nRuns: 64,
    seed: 11,
  });
  console.log("L1 urns");
  const l1th0 = runL1Urn({ theta: 0, steps: 5000, nRuns: 40, seed: 21, n0: 1 });
  const l1th1 = runL1Urn({ theta: 1, steps: 5000, nRuns: 40, seed: 22, n0: 1 });
  const l1th2fast = runL1Urn({ theta: 2, steps: 4000, nRuns: 90, seed: 23, n0: 1 });
  const l1th2 = runL1Urn({ theta: 2, steps: 8000, nRuns: 80, seed: 24, n0: 25 });
  console.log("L2 coherent θ=2 n0=25");
  const l2 = runWaveEnsemble({
    theta: 2,
    modes,
    steps: 8000,
    nRuns: 64,
    seed: 31,
    n0: 25,
  });
  console.log("L3 Life");
  const l3mix = runL3Life({
    theta: 0,
    steps: 400,
    nRuns: 24,
    size: 48,
    seed: 41,
    initial: "glider",
  });
  const l3lock = runL3Life({
    theta: 2.5,
    steps: 400,
    nRuns: 36,
    size: 48,
    seed: 42,
    initial: "glider",
  });
  const l3soupMix = runL3Life({
    theta: 0,
    steps: 300,
    nRuns: 16,
    size: 48,
    seed: 43,
    initial: "random",
  });
  const l3soupLock = runL3Life({
    theta: 2.5,
    steps: 300,
    nRuns: 24,
    size: 48,
    seed: 44,
    initial: "random",
  });

  const l0gamma = modes.map((m) => l0.modes[m].gammaAll);
  const l0k2 = modes.map((m) => l0.modes[m].k2);
  const pairs = l0gamma
    .map((g, i) => [g, l0k2[i]])
    .filter(([g, k2]) => Number.isFinite(g) && k2 > 0);
  const beta = mean(pairs.map(([g, k2]) => g / k2));
  const resid = Math.sqrt(mean(pairs.map(([g, k2]) => (g - beta * k2) ** 2)));
  const betaRelErr = Math.abs(beta - BETA_THEORY) / BETA_THEORY;

  const l2pre = modes.map((m) => l2.modes[m].gammaPreMean);
  const l2post = modes.map((m) => l2.modes[m].gammaPostMean);

  const verdicts = {
    L0_gamma_positive: l0gamma.every((g) => g > 0),
    L0_gamma_grows_with_k2: corr(l0k2, l0gamma) > 0.7,
    L0_beta_matches_theory: betaRelErr < 0.25,
    L1_theta0_no_lock: l1th0.lockFrac < 0.05,
    L1_theta2_locks: l1th2.lockFrac > 0.85,
    L1_dT_to_1: l1th2.dTFinalMean < 1.25,
    L1_winner_not_degenerate: Math.min(...l1th2.winnerCounts) > 0,
    L1_fast_lock_n0_1: l1th2fast.lockStepMedian < 50,
    L2_post_smaller_than_pre:
      Number.isFinite(mean(l2pre)) &&
      mean(l2pre) > 0 &&
      mean(l2post) < 0.45 * mean(l2pre),
    L3_lock_glider_beats_mix: l3lock.structuredEndFrac > l3mix.structuredEndFrac,
  };

  const compact = {
    c_clocks: C_CLOCKS,
    verdicts,
    L0: {
      modes,
      k2: l0k2,
      gamma: l0gamma,
      gamma_theory: modes.map((m) => exactGamma(kPhys(m))),
      gamma_theory_quad: l0k2.map((k2) => BETA_THEORY * k2),
      beta_gamma_over_k2: beta,
      beta_theory: BETA_THEORY,
      beta_rel_err: betaRelErr,
      fit_rms: resid,
      amp_t: downsample(l0.modes[6].t),
      amp_mode2: downsample(l0.modes[2].ampMean),
      amp_mode6: downsample(l0.modes[6].ampMean),
      amp_mode10: downsample(l0.modes[10].ampMean),
    },
    L1: {
      theta0: {
        lock_frac: l1th0.lockFrac,
        dT_final: l1th0.dTFinalMean,
        winner_counts: l1th0.winnerCounts,
        k: downsample(l1th0.k),
        dT: downsample(l1th0.dTMean),
      },
      theta1: {
        lock_frac: l1th1.lockFrac,
        dT_final: l1th1.dTFinalMean,
        winner_counts: l1th1.winnerCounts,
        k: downsample(l1th1.k),
        dT: downsample(l1th1.dTMean),
      },
      theta2: {
        lock_frac: l1th2.lockFrac,
        lock_step_median: l1th2.lockStepMedian,
        dT_final: l1th2.dTFinalMean,
        winner_counts: l1th2.winnerCounts,
        k: downsample(l1th2.k),
        dT: downsample(l1th2.dTMean),
        p_mean: downsample(l1th2.pMean),
        n0: 25,
      },
      theta2_fast: {
        lock_frac: l1th2fast.lockFrac,
        lock_step_median: l1th2fast.lockStepMedian,
        dT_final: l1th2fast.dTFinalMean,
        winner_counts: l1th2fast.winnerCounts,
        n0: 1,
      },
    },
    L2: {
      modes,
      k2: modes.map((m) => l2.modes[m].k2),
      gamma_pre: l2pre,
      gamma_post: l2post,
      amp_t: downsample(l2.modes[6].t),
      amp_mode6: downsample(l2.modes[6].ampMean),
      dT: downsample(l2.modes[6].dTMean),
      lock_step_median: median(l2.lockSteps),
    },
    L3: {
      mix_glider: {
        structured_end: l3mix.structuredEndFrac,
        pop: downsample(l3mix.popMean),
        struct_t: downsample(l3mix.structFracT),
      },
      lock_glider: {
        structured_end: l3lock.structuredEndFrac,
        pop: downsample(l3lock.popMean),
        struct_t: downsample(l3lock.structFracT),
        by_winner: l3lock.structuredByWinner,
        winner_counts: l3lock.winnerCounts,
        lock_frac: l3lock.lockFrac,
      },
      mix_soup: { structured_end: l3soupMix.structuredEndFrac },
      lock_soup: {
        structured_end: l3soupLock.structuredEndFrac,
        by_winner: l3soupLock.structuredByWinner,
      },
    },
  };

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(compact, null, 2));
  return compact;
}

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "results", "bartini_plus.json");
const data = runAll(out);
console.log("VERDICTS");
for (const [k, v] of Object.entries(data.verdicts)) console.log(`  ${k}: ${v}`);
console.log("wrote", out);
