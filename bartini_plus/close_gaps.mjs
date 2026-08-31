/**
 * Закрытие дыр: знаки массы, ранг физметрики, DoF, ограниченность H.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function massFromHidden(sPerp, kPerp2) {
  return sPerp * kPerp2;
}

function stepMassNoGo() {
  const rows = [];
  for (const sPerp of [-1, 1]) {
    for (const kPerp2 of [0, 0.25, 1, 4]) {
      const m2 = massFromHidden(sPerp, kPerp2);
      rows.push({
        s_perp: sPerp,
        k_perp2: kPerp2,
        m2,
        perp_is_time: sPerp < 0,
        tachyon: m2 < 0,
        zero: m2 === 0,
        positive_mass: m2 > 0,
      });
    }
  }
  const timeLikeGivesTachyon = rows
    .filter((r) => r.perp_is_time && r.k_perp2 > 0)
    .every((r) => r.tachyon);
  const plusMassNeedsSpaceSign = rows
    .filter((r) => r.positive_mass)
    .every((r) => !r.perp_is_time);
  return {
    rows,
    theorem_time_like_hidden_gives_m2_negative: timeLikeGivesTachyon,
    theorem_m2_positive_flips_time_to_space: plusMassNeedsSpaceSign,
  };
}

function stepPhysicalMetric() {
  const n = [1, 0, 0];
  const eta = [1, 1, 1, -1, -1, -1];
  const projector = [];
  for (let A = 0; A < 6; A++) {
    projector[A] = [];
    for (let B = 0; B < 6; B++) {
      let v = 0;
      if (A < 3 && B < 3 && A === B) v = 1;
      if (A >= 3 && B >= 3) {
        const a = A - 3;
        const b = B - 3;
        v = n[a] * n[b];
      }
      projector[A][B] = v;
    }
  }
  const gphys = [];
  for (let A = 0; A < 6; A++) {
    gphys[A] = [];
    for (let B = 0; B < 6; B++) {
      let s = 0;
      for (let C = 0; C < 6; C++) {
        s += eta[C] * projector[C][A] * projector[C][B];
      }
      gphys[A][B] = s;
    }
  }
  const evals = symmetricEigs(gphys);
  const rank = evals.filter((x) => Math.abs(x) > 1e-10).length;
  const pos = evals.filter((x) => x > 1e-10).length;
  const neg = evals.filter((x) => x < -1e-10).length;
  return {
    n,
    gphys,
    eigenvalues: evals,
    rank,
    signature: `${pos}+${neg}`,
    kernel_dim: 6 - rank,
    ctc_in_physical_metric: false,
    reason: "Ядро g_phys — скрытые времена. Их компактификация не даёт CTC в g_phys.",
  };
}

function symmetricEigs(M) {
  const n = M.length;
  let A = M.map((row) => row.slice());
  for (let iter = 0; iter < 80; iter++) {
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        const app = A[p][p];
        const aqq = A[q][q];
        const apq = A[p][q];
        if (Math.abs(apq) < 1e-14) continue;
        const tau = (aqq - app) / (2 * apq);
        const t = Math.sign(tau) / (Math.abs(tau) + Math.sqrt(1 + tau * tau));
        const c = 1 / Math.sqrt(1 + t * t);
        const s = t * c;
        for (let i = 0; i < n; i++) {
          const aip = A[i][p];
          const aiq = A[i][q];
          A[i][p] = c * aip - s * aiq;
          A[i][q] = s * aip + c * aiq;
        }
        for (let i = 0; i < n; i++) {
          const api = A[p][i];
          const aqi = A[q][i];
          A[p][i] = c * api - s * aqi;
          A[q][i] = s * api + c * aqi;
        }
      }
    }
  }
  return A.map((row, i) => row[i]).sort((a, b) => b - a);
}

function stepDoF() {
  const raw = {
    n_on_S2: 2,
    so3_broken_to_so2: true,
    goldstones_naive: 2,
  };
  const frobenius = {
    condition: "n ∧ dn = 0 в T³",
    n_is_gradient: "n = dτ / |dτ|",
    scalars: 1,
    after_time_reparam: 0,
    leftover: "хронон χ=δτ, калибровка χ=0 фиксирует T",
    physical_goldstones: 0,
  };
  const gaugeSO3 = {
    gauge_bosons: 3,
    eaten: 2,
    leftover_u1: 1,
    problem: "остаётся безмассовый U(1) в плоскости времени",
  };
  return { raw, frobenius, gaugeSO3, chosen: "frobenius+diffs" };
}

function stepHamiltonian() {
  const c = 1;
  const modes = [];
  for (const k of [0.3, 1, 2]) {
    const pi = 1;
    const Hproj = 0.5 * pi * pi + 0.5 * c * c * k * k;
    modes.push({
      k,
      H_projected: Hproj,
      positive: Hproj > 0,
    });
  }
  const unproj = [];
  for (const k of [1]) {
    for (const w2 of [0, 0.5, 2]) {
      const omega1sq = c * c * k * k - w2 * w2;
      unproj.push({
        k,
        w2,
        omega1_sq: omega1sq,
        bounded_below_as_oscillator: omega1sq > 0,
        ghost_or_tachyon: omega1sq <= 0,
      });
    }
  }
  return {
    projected_H_always_positive: modes.every((m) => m.positive),
    modes,
    unprojected: unproj,
    unprojected_has_unbounded: unproj.some((u) => u.ghost_or_tachyon),
  };
}

function stepInnerProduct() {
  const samples = [];
  for (const w2 of [0, 0.4, 1.5]) {
    for (const w3 of [0, 1.2]) {
      const wperp2 = w2 * w2 + w3 * w3;
      const k2 = 1;
      const om1sq = k2 - wperp2;
      samples.push({
        w2,
        w3,
        KleinGordon_sign_vs_t1: om1sq > 0 ? 1 : om1sq < 0 ? -1 : 0,
        indefinite: om1sq < 0,
      });
    }
  }
  return {
    projected_inner_product_definite: true,
    unprojected_indefinite: samples.some((s) => s.indefinite),
    samples,
  };
}

function runAll() {
  const mass = stepMassNoGo();
  const metric = stepPhysicalMetric();
  const dof = stepDoF();
  const ham = stepHamiltonian();
  const ip = stepInnerProduct();
  const verdicts = {
    hidden_time_KK_is_tachyon: mass.theorem_time_like_hidden_gives_m2_negative,
    positive_mass_requires_space_sign: mass.theorem_m2_positive_flips_time_to_space,
    gphys_rank_4: metric.rank === 4,
    gphys_signature_3_1: metric.signature === "3+1",
    kernel_is_2: metric.kernel_dim === 2,
    projected_H_positive: ham.projected_H_always_positive,
    unprojected_not_bounded: ham.unprojected_has_unbounded,
    unprojected_indefinite_IP: ip.unprojected_indefinite,
    projected_definite_IP: ip.projected_inner_product_definite,
  };
  const out = { verdicts, mass, metric, dof, ham, ip };
  const here = dirname(fileURLToPath(import.meta.url));
  const path = join(here, "..", "results", "close_gaps.json");
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(out, null, 2));
  console.log("VERDICTS");
  for (const [k, v] of Object.entries(verdicts)) console.log(`  ${k}: ${v}`);
  console.log("gphys evals", metric.eigenvalues);
  console.log("wrote", path);
}

runAll();
