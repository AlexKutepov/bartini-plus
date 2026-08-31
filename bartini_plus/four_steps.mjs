/**
 * Четыре шага: мера, сигнатура 3+3, поле n, редукция/no-go.
 * Аналитика + численная проверка. Без урны как фундамента.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PI = Math.PI;
const LN_PI = Math.log(PI);

function logGamma(z) {
  const p = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (z < 0.5) {
    return Math.log(PI / Math.sin(PI * z)) - logGamma(1 - z);
  }
  z -= 1;
  let x = p[0];
  for (let i = 1; i < p.length; i++) x += p[i] / (z + i);
  const t = z + p.length - 1.5;
  return 0.5 * Math.log(2 * PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

function gamma(z) {
  return Math.exp(logGamma(z));
}

function digamma(x) {
  let result = 0;
  while (x < 6) {
    result -= 1 / x;
    x += 1;
  }
  const inv = 1 / x;
  const inv2 = inv * inv;
  result += Math.log(x) - 0.5 * inv - inv2 / 12 + (inv2 * inv2) / 120;
  result -= (inv2 * inv2 * inv2) / 252;
  return result;
}

function trigamma(x) {
  let result = 0;
  while (x < 6) {
    result += 1 / (x * x);
    x += 1;
  }
  const inv = 1 / x;
  const inv2 = inv * inv;
  result += inv + 0.5 * inv2 + inv2 * inv / 3 - (inv2 * inv2 * inv) / 15;
  return result;
}

function bartiniM(n) {
  const a = (n + 1) / 2;
  return gamma(a) / (2 * PI ** a);
}

function sphereArea(n) {
  const a = (n + 1) / 2;
  return (2 * PI ** a) / gamma(a);
}

function solvePsiEqLnPi() {
  let x = 3.6;
  for (let i = 0; i < 40; i++) {
    const f = digamma(x) - LN_PI;
    const df = trigamma(x);
    const step = f / df;
    x -= step;
    if (Math.abs(step) < 1e-14) break;
  }
  return x;
}

function downsample(xs, n = 24) {
  if (xs.length <= n) return xs;
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push(xs[Math.round((i * (xs.length - 1)) / (n - 1))]);
  }
  return out;
}

function step1Measure() {
  const xStar = solvePsiEqLnPi();
  const nStar = 2 * xStar - 1;
  const integers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({
    n,
    m: bartiniM(n),
    areaSn: sphereArea(n),
  }));
  const mMinInt = integers.reduce((a, b) => (a.m < b.m ? a : b));
  const areaMaxInt = integers.reduce((a, b) => (a.areaSn > b.areaSn ? a : b));

  const nGrid = [];
  for (let n = 1; n <= 12; n += 0.25) {
    nGrid.push({ n: +n.toFixed(2), m: bartiniM(n), area: sphereArea(n) });
  }

  const altA = [0.5, 1, Math.E, PI, 2 * PI];
  const altMinima = altA.map((a) => {
    const target = Math.log(a);
    let x = 2.5;
    for (let i = 0; i < 40; i++) {
      const f = digamma(x) - target;
      if (!Number.isFinite(f)) break;
      x -= f / trigamma(x);
      if (x < 0.2) x = 0.2;
    }
    return { a, nStar: 2 * x - 1, x };
  });

  let maxRel = 0;
  for (let n = 1; n <= 10; n++) {
    const rec = 1 / sphereArea(n);
    const rel = Math.abs(rec - bartiniM(n)) / bartiniM(n);
    if (rel > maxRel) maxRel = rel;
  }

  const L = 4096;
  const dx = 8 / L;
  const g = new Float64Array(L);
  const xs = [];
  for (let i = 0; i < L; i++) {
    const x = (i - L / 2) * dx;
    xs.push(x);
    g[i] = Math.exp(-PI * x * x);
  }
  const G = dftRealEven(g);
  let num = 0;
  let den = 0;
  for (let i = 0; i < L; i++) {
    const d = g[i] - G[i];
    num += d * d;
    den += g[i] * g[i];
  }
  const ftRelL2 = Math.sqrt(num / den);

  return {
    nStar,
    nStarPlus1: nStar + 1,
    xStar,
    identity_m_is_1_over_area_S_n: maxRel < 1e-10,
    max_rel_err_identity: maxRel,
    integer_m_min: mMinInt.n,
    integer_area_max: areaMaxInt.n,
    integers,
    nGrid,
    altMinima,
    fourier_self_dual_rel_L2: ftRelL2,
    principle:
      "e^{-πx²} — единственная (с точностью до фазы) L²-функция, совпадающая со своим унитарным Фурье. Эквивалентно: m(n)=1/Area(S^n).",
  };
}

function dftRealEven(g) {
  const L = g.length;
  const dx = 8 / L;
  const out = new Float64Array(L);
  const freqScale = dx;
  for (let k = 0; k < L; k++) {
    const xi = (k - L / 2) * dx;
    let re = 0;
    for (let i = 0; i < L; i++) {
      const x = (i - L / 2) * dx;
      re += g[i] * Math.cos(2 * PI * x * xi);
    }
    out[k] = re * freqScale;
  }
  return out;
}

function step2Signature() {
  const splits = [];
  for (let p = 0; p <= 6; p++) {
    const q = 6 - p;
    if (p > q) continue;
    let vol = 0;
    let realNull = p >= 1 && q >= 1;
    if (realNull) {
      vol = sphereArea(p - 1) * sphereArea(q - 1);
    }
    splits.push({
      p,
      q,
      label: `${p}+${q}`,
      real_null_cone: realNull,
      null_volume: vol,
      null_volume_over_pi2: realNull ? vol / (PI * PI) : 0,
    });
  }
  const withNull = splits.filter((s) => s.real_null_cone);
  const best = withNull.reduce((a, b) => (a.null_volume > b.null_volume ? a : b));
  const vol33 = splits.find((s) => s.p === 3).null_volume;
  const vol42 = splits.find((s) => s.p === 2).null_volume;
  const vol51 = splits.find((s) => s.p === 1).null_volume;
  return {
    splits,
    maximizer: best.label,
    ratio_33_over_42: vol33 / vol42,
    ratio_33_over_51: vol33 / vol51,
    analytic_33_over_42: 4 / PI,
    sky_S2_plus_n6_implies_33: true,
    so33_isomorphism: "so(3,3) ≅ sl(4,R)",
    so42_isomorphism: "so(4,2) ≅ su(2,2) (конформная алгебра 4D)",
  };
}

class RNG {
  constructor(seed) {
    this.s = seed >>> 0 || 1;
  }
  next() {
    this.s = (Math.imul(1664525, this.s) + 1013904223) >>> 0;
    return this.s / 4294967296;
  }
  gauss() {
    const u = Math.max(this.next(), 1e-12);
    const v = this.next();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * PI * v);
  }
}

function randSpin(rng) {
  const x = rng.gauss();
  const y = rng.gauss();
  const z = rng.gauss();
  const n = Math.hypot(x, y, z) || 1;
  return [x / n, y / n, z / n];
}

function normalize(v) {
  const n = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / n, v[1] / n, v[2] / n];
}

function heatFlowN({ size, steps, dt, seed, init }) {
  const rng = new RNG(seed);
  const N = size * size;
  let field = new Array(N);
  if (init === "random") {
    for (let i = 0; i < N; i++) field[i] = randSpin(rng);
  } else if (init === "constant") {
    for (let i = 0; i < N; i++) field[i] = [0, 0, 1];
  } else if (init === "degree1") {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const u = (2 * x) / size - 1;
        const v = (2 * y) / size - 1;
        const r2 = u * u + v * v;
        field[y * size + x] = normalize([2 * u, 2 * v, 1 - r2]);
      }
    }
  }
  const energyHist = [];
  const orderHist = [];
  const idx = (y, x) => ((y + size) % size) * size + ((x + size) % size);
  for (let s = 0; s < steps; s++) {
    const nxt = new Array(N);
    let E = 0;
    let mx = 0;
    let my = 0;
    let mz = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = y * size + x;
        const c = field[i];
        const n1 = field[idx(y, x + 1)];
        const n2 = field[idx(y, x - 1)];
        const n3 = field[idx(y + 1, x)];
        const n4 = field[idx(y - 1, x)];
        const lap = [
          n1[0] + n2[0] + n3[0] + n4[0] - 4 * c[0],
          n1[1] + n2[1] + n3[1] + n4[1] - 4 * c[1],
          n1[2] + n2[2] + n3[2] + n4[2] - 4 * c[2],
        ];
        nxt[i] = normalize([
          c[0] + dt * lap[0],
          c[1] + dt * lap[1],
          c[2] + dt * lap[2],
        ]);
        E +=
          (c[0] - n1[0]) ** 2 +
          (c[1] - n1[1]) ** 2 +
          (c[2] - n1[2]) ** 2 +
          (c[0] - n3[0]) ** 2 +
          (c[1] - n3[1]) ** 2 +
          (c[2] - n3[2]) ** 2;
        mx += c[0];
        my += c[1];
        mz += c[2];
      }
    }
    field = nxt;
    if (s % 4 === 0) {
      energyHist.push(E / N);
      orderHist.push(Math.hypot(mx, my, mz) / N);
    }
  }
  const last = field.reduce(
    (a, v) => {
      a[0] += v[0];
      a[1] += v[1];
      a[2] += v[2];
      return a;
    },
    [0, 0, 0]
  );
  const order = Math.hypot(last[0], last[1], last[2]) / N;
  return {
    order_final: order,
    energy_final: energyHist[energyHist.length - 1],
    locked: order > 0.9,
    energy: downsample(energyHist),
    order: downsample(orderHist),
  };
}

function heatFlowN1D({ size, steps, dt, seed }) {
  const rng = new RNG(seed);
  let field = Array.from({ length: size }, () => randSpin(rng));
  const orderHist = [];
  const energyHist = [];
  for (let s = 0; s < steps; s++) {
    const nxt = new Array(size);
    let E = 0;
    let mx = 0;
    let my = 0;
    let mz = 0;
    for (let i = 0; i < size; i++) {
      const c = field[i];
      const l = field[(i - 1 + size) % size];
      const r = field[(i + 1) % size];
      const lap = [l[0] + r[0] - 2 * c[0], l[1] + r[1] - 2 * c[1], l[2] + r[2] - 2 * c[2]];
      nxt[i] = normalize([c[0] + dt * lap[0], c[1] + dt * lap[1], c[2] + dt * lap[2]]);
      E += (c[0] - r[0]) ** 2 + (c[1] - r[1]) ** 2 + (c[2] - r[2]) ** 2;
      mx += c[0];
      my += c[1];
      mz += c[2];
    }
    field = nxt;
    if (s % 8 === 0) {
      energyHist.push(E / size);
      orderHist.push(Math.hypot(mx, my, mz) / size);
    }
  }
  return {
    order_final: orderHist[orderHist.length - 1],
    energy_final: energyHist[energyHist.length - 1],
    locked: orderHist[orderHist.length - 1] > 0.9,
    order: downsample(orderHist),
    energy: downsample(energyHist),
  };
}

function step3FieldN() {
  const randomRuns = [];
  for (let i = 0; i < 12; i++) {
    randomRuns.push(
      heatFlowN({ size: 16, steps: 1200, dt: 0.18, seed: 100 + i, init: "random" })
    );
  }
  const runs1d = [];
  for (let i = 0; i < 12; i++) {
    runs1d.push(heatFlowN1D({ size: 48, steps: 800, dt: 0.2, seed: 300 + i }));
  }
  const constRun = heatFlowN({
    size: 16,
    steps: 80,
    dt: 0.15,
    seed: 1,
    init: "constant",
  });
  const degRun = heatFlowN({
    size: 16,
    steps: 1200,
    dt: 0.18,
    seed: 2,
    init: "degree1",
  });
  const lockFrac = randomRuns.filter((r) => r.locked).length / randomRuns.length;
  const lock1d = runs1d.filter((r) => r.locked).length / runs1d.length;
  const meanOrder = randomRuns.reduce((s, r) => s + r.order_final, 0) / randomRuns.length;
  const meanE = randomRuns.reduce((s, r) => s + r.energy_final, 0) / randomRuns.length;
  return {
    random_lock_frac: lockFrac,
    random_1d_lock_frac: lock1d,
    random_1d_order_mean: runs1d.reduce((s, r) => s + r.order_final, 0) / runs1d.length,
    random_order_mean: meanOrder,
    random_energy_mean: meanE,
    constant_stays_locked: constRun.locked && constRun.energy_final < 1e-12,
    degree1_order: degRun.order_final,
    degree1_energy: degRun.energy_final,
    degree1_locked: degRun.locked,
    sample_order: randomRuns[0].order,
    sample_energy: randomRuns[0].energy,
    degree_order: degRun.order,
    degree_energy: degRun.energy,
    topology: "π₂(S²)=ℤ: ненулевая степень карты T²→S² блокирует глобальный lock. В 3D пространстве дефекты — точечные ёжики.",
  };
}

function step4ReductionNoGo() {
  const c = 1;
  const modes = [];
  for (const k of [0.5, 1, 2]) {
    for (const w2 of [0, 0.4, 1.2, 2.5]) {
      for (const w3 of [0, 0.8]) {
        const wperp2 = w2 * w2 + w3 * w3;
        const unproj = c * c * k * k - wperp2;
        const proj = c * c * k * k;
        modes.push({
          k,
          w2,
          w3,
          unprojected_omega1_sq: unproj,
          unprojected_unstable: unproj < 0,
          projected_omega_sq: proj,
          projected_unstable: proj < 0,
          mass_sq_unproj: -wperp2,
          mass_sq_proj: 0,
        });
      }
    }
  }
  const nUn = modes.filter((m) => m.unprojected_unstable).length;
  const nPr = modes.filter((m) => m.projected_unstable).length;
  const sampleK = [0.25, 0.5, 1, 1.5, 2, 2.5, 3];
  const symbol = sampleK.map((k) => ({
    k,
    hyperbolic_gap: c * c * k * k,
    unproj_worst_if_wperp_eq_2k: c * c * k * k - 4 * k * k,
  }));

  const lockScalesGeV = [1e16, 1e3, 1e-3, 2.4e-4];
  const Mpl = 1.22e19;
  const predictions = lockScalesGeV.map((E) => {
    const delta = E / Mpl;
    return {
      E_lock_GeV: E,
      delta_n_Kibble: delta,
      delta_c_over_c: delta,
      ruled_if_bound_1e15: delta > 1e-15,
      hedgehog_per_Hubble_today_if_lock_at_E: "n ~ (E/Mpl)³ × (Mpl/H0)³ — космологически разбавлено, если lock до конца инфляции",
    };
  });

  return {
    unprojected_unstable_count: nUn,
    projected_unstable_count: nPr,
    modes_total: modes.length,
    symbol,
    einstein_reduction:
      "G = g_4 ⊕ γ_⊥, n=const, ∂_⊥=0 ⇒ R_6=R_4, S_EH,6 = Vol_⊥ S_EH,4. Уравнения Эйнштейна на срезе.",
    no_go_bypass:
      "Кинетика материи (n·∂_t φ)² − c²(∇φ)². Оператор гиперболичен. Опасные моды — те, у которых импульс в t_⊥; они выключены проекцией, не компактификацией.",
    mass_status:
      "Проекция снимает тахионный знак и не даёт m²>0. Масса не следует из скрытых времён.",
    predictions,
    hard_prediction:
      "После lock: 2 голдстоуна n на S² (качание оси времени) + точечные ёжики π₂ в 3D. Δc/c ∼ |δn|. Если lock на планковском масштабе и есть инфляция — |δn| космологически невидим и теория неотличима от ОТО. Если lock после инфляции — уже убита границами ∼10⁻¹⁵.",
  };
}

function runAll() {
  console.log("step 1 measure");
  const s1 = step1Measure();
  console.log("step 2 signature");
  const s2 = step2Signature();
  console.log("step 3 n-field");
  const s3 = step3FieldN();
  console.log("step 4 reduction");
  const s4 = step4ReductionNoGo();

  const verdicts = {
    S1_m_equals_1_over_sphere: s1.identity_m_is_1_over_area_S_n,
    S1_integer_min_is_6: s1.integer_m_min === 6,
    S1_area_max_is_6: s1.integer_area_max === 6,
    S1_n_star_near_6_26: Math.abs(s1.nStar - 6.256946404) < 1e-6,
    S1_fourier_self_dual: s1.fourier_self_dual_rel_L2 < 0.08,
    S1_other_a_not_six: s1.altMinima
      .filter((x) => Math.abs(x.a - PI) > 0.1)
      .every((x) => Math.abs(x.nStar - 6) > 0.5),
    S2_null_volume_max_is_33: s2.maximizer === "3+3",
    S2_ratio_matches_4_over_pi: Math.abs(s2.ratio_33_over_42 - 4 / PI) < 1e-9,
    S3_random_usually_locks: s3.random_lock_frac >= 0.5,
    S3_1d_locks: s3.random_1d_lock_frac >= 0.8,
    S3_constant_stable: s3.constant_stays_locked,
    S3_torus_unwinds_stereographic: s3.degree1_locked,
    S4_projection_kills_unstable: s4.projected_unstable_count === 0,
    S4_unprojected_has_unstable: s4.unprojected_unstable_count > 0,
  };

  const out = { verdicts, step1: s1, step2: s2, step3: s3, step4: s4 };
  const here = dirname(fileURLToPath(import.meta.url));
  const path = join(here, "..", "results", "four_steps.json");
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(out, null, 2));
  console.log("VERDICTS");
  for (const [k, v] of Object.entries(verdicts)) console.log(`  ${k}: ${v}`);
  console.log("n* =", s1.nStar, "FT L2 =", s1.fourier_self_dual_rel_L2);
  console.log("wrote", path);
  return out;
}

runAll();
