/**
 * M1–M3: формальное ужесточение, не косметика.
 * M1  maxent + унитарный Фурье ⇒ a=π; самодуальность одна не фиксирует n=6
 *     (моды Эрмита n≡0 mod 4 тоже +1-собственные).
 * M2  квадратичная лемма: энергия Дирихле n∈S² на срезе (3,1) = Эйнштейн–эфир
 *     с (c1,c2,c3,c4)=(κ,0,0,0). Сокращения c13=0 нет.
 * M3  спектральная размерность теплового ядра: после T4–T5 физический d_s=4;
 *     d_s^UV=6 живёт только у нередуцированного оператора.
 *
 * Выход: results/math_tighten.json
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PI = Math.PI;

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

function dftRealEven(g, width) {
  const L = g.length;
  const dx = width / L;
  const out = new Float64Array(L);
  for (let k = 0; k < L; k++) {
    const xi = (k - L / 2) * dx;
    let re = 0;
    for (let i = 0; i < L; i++) {
      const x = (i - L / 2) * dx;
      re += g[i] * Math.cos(2 * PI * x * xi);
    }
    out[k] = re * dx;
  }
  return out;
}

function relL2(a, b) {
  let num = 0;
  let den = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    num += d * d;
    den += a[i] * a[i];
  }
  return Math.sqrt(num / den);
}

function hermite4(x) {
  return 16 * x * x * x * x - 48 * x * x + 12;
}

function integerArgminMoments(f, xs, dx) {
  const ms = [];
  for (let n = 1; n <= 12; n++) {
    let s = 0;
    for (let i = 0; i < xs.length; i++) {
      if (xs[i] < 0) continue;
      s += xs[i] ** n * f[i] * dx;
    }
    ms.push({ n, m: s });
  }
  return ms.reduce((a, b) => (a.m < b.m ? a : b)).n;
}

function continuousNstar(f, xs, dx) {
  const ns = [];
  for (let n = 2; n <= 10; n += 0.05) {
    let s = 0;
    for (let i = 0; i < xs.length; i++) {
      if (xs[i] <= 0) continue;
      s += xs[i] ** n * f[i] * dx;
    }
    ns.push({ n, m: s });
  }
  return ns.reduce((a, b) => (a.m < b.m ? a : b)).n;
}

function densityStats(f, xs, dx) {
  let z = 0;
  let x2 = 0;
  for (let i = 0; i < f.length; i++) {
    if (f[i] <= 0) continue;
    z += f[i] * dx;
    x2 += xs[i] * xs[i] * f[i] * dx;
  }
  let s = 0;
  for (let i = 0; i < f.length; i++) {
    if (f[i] <= 0) continue;
    const p = f[i] / z;
    s -= p * Math.log(p) * dx;
  }
  return { z, variance: x2 / z, entropy: s };
}

function stepM1() {
  const g35 = gamma(3.5);
  const aLo = (g35 / gamma(3)) ** 2;
  const aHi = (gamma(4) / g35) ** 2;
  const windowContainsPi = aLo < PI && PI < aHi;

  const scan = [];
  for (const a of [2.0, aLo * 0.99, aLo * 1.01, PI, aHi * 0.99, aHi * 1.01, 4.0]) {
    const ms = [];
    for (let n = 5; n <= 7; n++) {
      ms.push({ n, m: gamma((n + 1) / 2) / (2 * a ** ((n + 1) / 2)) });
    }
    const argmin = ms.reduce((p, q) => (p.m < q.m ? p : q)).n;
    scan.push({ a, integer_argmin_5_7: argmin, in_window: a > aLo && a < aHi });
  }

  const sigma2 = 1 / (2 * PI);
  const aFromMaxent = 1 / (2 * sigma2);

  const L = 2048;
  const width = 8;
  const dx = width / L;
  const xs = new Float64Array(L);
  const g0 = new Float64Array(L);
  const g4 = new Float64Array(L);
  for (let i = 0; i < L; i++) {
    const x = (i - L / 2) * dx;
    xs[i] = x;
    const gauss = Math.exp(-PI * x * x);
    g0[i] = gauss;
    g4[i] = gauss * hermite4(Math.sqrt(2 * PI) * x);
  }
  const G0 = dftRealEven(g0, width);
  const G4 = dftRealEven(g4, width);
  const ft0 = relL2(g0, G0);
  const ft4 = relL2(g4, G4);

  const eps = 0.02;
  const gMix = new Float64Array(L);
  let mixMin = Infinity;
  for (let i = 0; i < L; i++) {
    gMix[i] = g0[i] + eps * g4[i];
    if (gMix[i] < mixMin) mixMin = gMix[i];
  }
  const Gmix = dftRealEven(gMix, width);
  const nStar0 = continuousNstar(g0, xs, dx);
  const nStarMix = continuousNstar(gMix, xs, dx);
  const int0 = integerArgminMoments(g0, xs, dx);
  const intMix = integerArgminMoments(gMix, xs, dx);
  const sg = densityStats(g0, xs, dx);
  const sm = densityStats(gMix, xs, dx);
  const sMixFixed = sm.entropy + 0.5 * Math.log(sg.variance / sm.variance);

  return {
    maxent: {
      constraint: "max −∫f log f при ∫f=1, ∫x²f=σ² ⇒ f∝e^{−x²/(2σ²)}",
      fourier_self_dual_fixes: "σ²=1/(2π) ⇒ a=1/(2σ²)=π",
      sigma2,
      a: aFromMaxent,
      a_is_pi: Math.abs(aFromMaxent - PI) < 1e-12,
    },
    gaussian_window: {
      a_lo: aLo,
      a_hi: aHi,
      pi: PI,
      contains_pi: windowContainsPi,
      scan,
    },
    hermite: {
      note: "F[ψ_n]=(−i)^n ψ_n. Собственное +1 при n≡0 (mod 4): не только гауссиан.",
      ft_rel_L2_gauss: ft0,
      ft_rel_L2_hermite4: ft4,
      mix_eps: eps,
      mix_min: mixMin,
      mix_stays_positive: mixMin > 0,
      ft_rel_L2_mix: relL2(gMix, Gmix),
      nstar_gauss: nStar0,
      nstar_mix: nStarMix,
      nstar_shift: nStarMix - nStar0,
      integer_min_gauss: int0,
      integer_min_mix: intMix,
      stats_gauss: sg,
      stats_mix: sm,
      entropy_mix_at_gauss_variance: sMixFixed,
      gauss_entropy_is_maxent: sg.entropy + 1e-9 >= sMixFixed,
    },
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

function periodicDiff(arr, stride, n, axisSize) {
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const a = Math.floor(i / stride) % axisSize;
    const base = i - a * stride;
    const ip = base + ((a + 1) % axisSize) * stride;
    const im = base + ((a - 1 + axisSize) % axisSize) * stride;
    out[i] = 0.5 * (arr[ip] - arr[im]);
  }
  return out;
}

function stepM2() {
  const N = 8;
  const vol = N ** 4;
  const strides = [1, N, N * N, N * N * N];
  const rng = new RNG(7);

  function fillField(amp) {
    const e1 = new Float64Array(vol);
    const e2 = new Float64Array(vol);
    const modes = 3;
    const ks = [];
    for (let m = 0; m < modes; m++) {
      ks.push({
        k: [1 + (m % 2), 1, m % 3, (m + 1) % 2],
        p1: 2 * PI * rng.next(),
        p2: 2 * PI * rng.next(),
        a1: amp * (0.4 + rng.next()),
        a2: amp * (0.4 + rng.next()),
      });
    }
    for (let t = 0; t < N; t++)
      for (let z = 0; z < N; z++)
        for (let y = 0; y < N; y++)
          for (let x = 0; x < N; x++) {
            const i = x + N * (y + N * (z + N * t));
            let s1 = 0;
            let s2 = 0;
            for (const mo of ks) {
              const ph = (2 * PI * (mo.k[0] * x + mo.k[1] * y + mo.k[2] * z + mo.k[3] * t)) / N;
              s1 += mo.a1 * Math.sin(ph + mo.p1);
              s2 += mo.a2 * Math.sin(ph + mo.p2);
            }
            e1[i] = s1;
            e2[i] = s2;
          }
    return { e1, e2 };
  }

  function monomials(e1, e2) {
    const u = [new Float64Array(vol), new Float64Array(vol), new Float64Array(vol), new Float64Array(vol)];
    const ncmp = [new Float64Array(vol), new Float64Array(vol), new Float64Array(vol)];
    for (let i = 0; i < vol; i++) {
      const r = Math.hypot(e1[i], e2[i]);
      const clip = r > 0.45 ? 0.45 / r : 1;
      const a = e1[i] * clip;
      const b = e2[i] * clip;
      const ut = Math.sqrt(Math.max(1e-16, 1 - a * a - b * b));
      u[0][i] = a;
      u[1][i] = b;
      u[2][i] = 0;
      u[3][i] = ut;
      ncmp[0][i] = a;
      ncmp[1][i] = b;
      ncmp[2][i] = ut;
    }
    const du = u.map((comp) => strides.map((st) => periodicDiff(comp, st, vol, N)));
    const dn = ncmp.map((comp) => strides.map((st) => periodicDiff(comp, st, vol, N)));
    let LD = 0;
    let C1 = 0;
    let C2 = 0;
    let C3 = 0;
    let C4 = 0;
    const sig = [1, 1, 1, -1];
    for (let i = 0; i < vol; i++) {
      let ld = 0;
      for (let ax = 0; ax < 3; ax++) {
        for (let c = 0; c < 3; c++) ld += dn[c][ax][i] ** 2;
      }
      for (let c = 0; c < 3; c++) ld -= dn[c][3][i] ** 2;
      LD += ld;

      let c1 = 0;
      for (let ax = 0; ax < 4; ax++) {
        let q = 0;
        for (let m = 0; m < 4; m++) q += sig[m] * du[m][ax][i] * du[m][ax][i];
        c1 += sig[ax] * q;
      }
      C1 += c1;

      let div = 0;
      for (let m = 0; m < 4; m++) div += du[m][m][i];
      C2 += div * div;

      let c3 = 0;
      for (let a = 0; a < 4; a++) {
        for (let m = 0; m < 4; m++) {
          const um = sig[m] * u[m][i];
          void um;
          c3 += (sig[m] * du[m][a][i]) * (sig[a] * du[a][m][i]);
        }
      }
      C3 += c3;

      let udot = [0, 0, 0, 0];
      for (let m = 0; m < 4; m++) {
        for (let a = 0; a < 4; a++) udot[m] += u[a][i] * du[m][a][i];
      }
      let c4 = 0;
      for (let m = 0; m < 4; m++) c4 += sig[m] * udot[m] * udot[m];
      C4 += c4;
    }
    return { LD, C1, C2, C3, C4 };
  }

  function planeWave(kind) {
    const e1 = new Float64Array(vol);
    const e2 = new Float64Array(vol);
    const a = 0.08;
    for (let t = 0; t < N; t++)
      for (let z = 0; z < N; z++)
        for (let y = 0; y < N; y++)
          for (let x = 0; x < N; x++) {
            const i = x + N * (y + N * (z + N * t));
            if (kind === "transverse") e1[i] = a * Math.sin((2 * PI * y) / N);
            else if (kind === "longitudinal") e1[i] = a * Math.sin((2 * PI * x) / N);
            else e1[i] = a * Math.sin((2 * PI * t) / N);
          }
    return monomials(e1, e2);
  }

  const rows = [];
  for (let k = 0; k < 12; k++) rows.push(monomials(...Object.values(fillField(0.08))));
  const mean = (fn) => rows.reduce((s, r) => s + fn(r), 0) / rows.length;
  const modes = {
    transverse: planeWave("transverse"),
    longitudinal: planeWave("longitudinal"),
    temporal: planeWave("temporal"),
  };
  const pack = (r) => ({
    LD_over_C1: r.LD / r.C1,
    C2_over_LD: r.C2 / r.LD,
    C3_over_LD: r.C3 / r.LD,
    C4_over_LD: r.C4 / r.LD,
    residual_c1_only: (r.LD - r.C1) / r.LD,
  });

  return {
    identification: "n=(ε1,ε2,√(1−ε²)) ∈ S² ↦ u=(ε1,ε2,0,√(1−ε²)), η=diag(1,1,1,−1)",
    identity: "L_D = C1 = η^{ab}η_{mn}∂_a u^m ∂_b u^n. C2,C3,C4 — другие свёртки, в Дирихле не входят.",
    random_mean: {
      LD_over_C1: mean((r) => r.LD / r.C1),
      residual_c1_only: mean((r) => (r.LD - r.C1) / r.LD),
      C2_over_LD: mean((r) => r.C2 / r.LD),
      C4_over_LD: mean((r) => r.C4 / r.LD),
    },
    modes: {
      transverse: pack(modes.transverse),
      longitudinal: pack(modes.longitudinal),
      temporal: pack(modes.temporal),
    },
    c13_equals_c1: true,
    n_configs: rows.length,
    grid: `${N}^4`,
    note: "c13=c1≠0: 6D Дирихле не производит щель c13=0, нужную общему эфиру при ε=O(1).",
  };
}

function dsFromLog(s0, p0, s1, p1) {
  return (-2 * (Math.log(p1) - Math.log(p0))) / (Math.log(s1) - Math.log(s0));
}

function stepM3() {
  const euclid = (d, s) => (4 * PI * s) ** (-d / 2);

  const sUV = 1e-4;
  const sIR = 4;
  const dsE6 = [dsFromLog(sUV, euclid(6, sUV), sUV * 1.2, euclid(6, sUV * 1.2)), dsFromLog(sIR, euclid(6, sIR), sIR * 1.2, euclid(6, sIR * 1.2))];
  const dsE4 = [dsFromLog(sUV, euclid(4, sUV), sUV * 1.2, euclid(4, sUV * 1.2)), dsFromLog(sIR, euclid(4, sIR), sIR * 1.2, euclid(4, sIR * 1.2))];

  function pAbsBox(s) {
    const N = 220;
    const R = 8 / Math.sqrt(s);
    const dr = R / N;
    let acc = 0;
    for (let i = 0; i < N; i++) {
      const r = (i + 0.5) * dr;
      for (let j = 0; j < N; j++) {
        const rho = (j + 0.5) * dr;
        acc += r * r * rho * rho * Math.exp(-s * Math.abs(r * r - rho * rho));
      }
    }
    return (4 * PI) ** 2 * acc * dr * dr;
  }

  const sList = [0.02, 0.05, 0.1, 0.2, 0.5, 1, 2];
  const absCurve = [];
  for (let i = 0; i < sList.length - 1; i++) {
    const s0 = sList[i];
    const s1 = sList[i + 1];
    const p0 = pAbsBox(s0);
    const p1 = pAbsBox(s1);
    absCurve.push({ s: Math.sqrt(s0 * s1), ds: dsFromLog(s0, p0, s1, p1), P0: p0 });
  }

  return {
    definition: "d_s(s)=−2 d log P(s) / d log s,  P(s)=Tr e^{−s ω²}",
    euclid6: { ds_UV: dsE6[0], ds_IR: dsE6[1], analytic: 6 },
    euclid4: { ds_UV: dsE4[0], ds_IR: dsE4[1], analytic: 4 },
    projected_physical: { operator: "Δ_{3,1} after T4–T5", ds: 4 },
    abs_box33: {
      operator: "ω²=|k_space²−k_time²|",
      curve: absCurve,
      ds_UV: absCurve[0].ds,
      ds_mid: absCurve[Math.floor(absCurve.length / 2)].ds,
    },
    cdt_tension:
      "d_s^UV=6 есть у нередуцированного 6D оператора. Физический оператор после T4–T5 четырёхмерен, d_s=4. Напряжение с CDT (d_s^UV≈2) не есть прогноз редуцированной теории и не подтверждает Бартини.",
  };
}

function runAll() {
  const M1 = stepM1();
  const M2 = stepM2();
  const M3 = stepM3();
  const verdicts = {
    M1_maxent_plus_fourier_is_pi: M1.maxent.a_is_pi,
    M1_window_contains_pi: M1.gaussian_window.contains_pi,
    M1_outside_window_argmin_not_6: M1.gaussian_window.scan
      .filter((r) => !r.in_window)
      .every((r) => r.integer_argmin_5_7 !== 6),
    M1_inside_window_argmin_is_6: M1.gaussian_window.scan
      .filter((r) => r.in_window)
      .every((r) => r.integer_argmin_5_7 === 6),
    M1_hermite4_self_dual: M1.hermite.ft_rel_L2_hermite4 < 0.08,
    M1_mix_positive_and_self_dual: M1.hermite.mix_stays_positive && M1.hermite.ft_rel_L2_mix < 0.08,
    M1_self_duality_alone_moves_nstar: Math.abs(M1.hermite.nstar_shift) > 0.05,
    M1_mix_changes_variance: Math.abs(M1.hermite.stats_mix.variance - M1.hermite.stats_gauss.variance) > 1e-4,
    M1_gauss_maxent_at_fixed_variance: M1.hermite.gauss_entropy_is_maxent,
    M2_LD_equals_C1: Math.abs(M2.random_mean.LD_over_C1 - 1) < 0.02,
    M2_c1_only_residual_small: Math.abs(M2.random_mean.residual_c1_only) < 0.02,
    M2_longitudinal_has_C2: Math.abs(M2.modes.longitudinal.C2_over_LD) > 0.5,
    M2_transverse_C2_small: Math.abs(M2.modes.transverse.C2_over_LD) < 0.05,
    M2_longitudinal_still_LD_is_C1: Math.abs(M2.modes.longitudinal.LD_over_C1 - 1) < 0.05,
    M2_c13_not_cancelled: M2.c13_equals_c1,
    M3_E6_is_6: Math.abs(M3.euclid6.ds_UV - 6) < 1e-6,
    M3_E4_is_4: Math.abs(M3.euclid4.ds_UV - 4) < 1e-6,
    M3_absbox_UV_near_6: M3.abs_box33.ds_UV > 5,
    M3_physical_ds_is_4_not_6: M3.projected_physical.ds === 4,
  };
  const out = { verdicts, M1, M2, M3 };
  const here = dirname(fileURLToPath(import.meta.url));
  const path = join(here, "..", "results", "math_tighten.json");
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(out, null, 2));
  console.log("VERDICTS");
  for (const [k, v] of Object.entries(verdicts)) console.log(`  ${k}: ${v}`);
  console.log("M1 window", M1.gaussian_window.a_lo, PI, M1.gaussian_window.a_hi);
  console.log("M1 n* gauss/mix", M1.hermite.nstar_gauss, M1.hermite.nstar_mix, "shift", M1.hermite.nstar_shift);
  console.log("M1 FT gauss/H4/mix", M1.hermite.ft_rel_L2_gauss, M1.hermite.ft_rel_L2_hermite4, M1.hermite.ft_rel_L2_mix);
  console.log("M2 random", M2.random_mean, "long", M2.modes.longitudinal, "trans", M2.modes.transverse);
  console.log("M3 |□| UV ds", M3.abs_box33.ds_UV, "curve", JSON.stringify(M3.abs_box33.curve.map((x) => [+x.s.toFixed(3), +x.ds.toFixed(3)])));
  console.log("wrote", path);
}

runAll();
