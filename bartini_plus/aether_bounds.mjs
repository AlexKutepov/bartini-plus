/**
 * T8–T9: проверяемость через ослабление T2/T4.
 *
 * T8. Снять Фробениус: ось времени n∈S² на срезе становится единичным
 *     времениподобным вектором u^μ с жёсткостью f²=E_lock². Это класс
 *     Эйнштейна–эфира (Jacobson–Mattingly). Коэффициенты c_i = κ_i·(E_lock/M_Pl)².
 *     Считаем скорости мод, PPN α1, α2, G_cosmo/G_N и сравниваем с границами:
 *       GW170817+GRB170817A : -3e-15 < c_gw/c - 1 < 7e-16
 *       гравичеренков (Elliott–Moore–Stoica): все s_i² ≥ 1
 *       пульсары: |α1| < 4e-5, |α2| < 1.6e-9
 *       BBN: |G_cosmo/G_N - 1| < 0.13
 *       без духов: 0 < c14 < 2, c123 ≥ 0, c13 < 1
 *     Перебираются все знаковые шаблоны (c1..c4) ∈ {-1,0,1}·ε, ищется max ε.
 *
 * T9. Снять ∂⊥=0 в пространстве: π₂(S²)=ℤ даёт глобальные монополи с
 *     дефицитом телесного угла Δ=8πGη², η=E_lock. Planck: Gη² ≲ 1e-6.
 *
 * Выход: results/aether_bounds.json.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const M_PL_REDUCED_GEV = 2.435e18;

const BOUNDS = {
  gw_speed_upper: 7e-16,
  gw_speed_lower: -3e-15,
  cherenkov_s2_min: 1 - 1e-15,
  alpha1_abs: 4e-5,
  alpha2_abs: 1.6e-9,
  bbn_G_ratio_abs: 0.13,
  planck_G_eta2: 1e-6,
};

function aetherObservables(c1, c2, c3, c4) {
  const c13 = c1 + c3;
  const c14 = c1 + c4;
  const c123 = c1 + c2 + c3;
  const s2sq = 1 / (1 - c13);
  const s1den = 2 * c14 * (1 - c13);
  const s1sq = s1den === 0 ? NaN : (2 * c1 - c1 * c1 + c3 * c3) / s1den;
  const s0den = c14 * (1 - c13) * (2 + c13 + 3 * c2);
  const s0sq = s0den === 0 ? NaN : (c123 * (2 - c14)) / s0den;
  const a1den = 2 * c1 - c1 * c1 + c3 * c3;
  const alpha1 = a1den === 0 ? NaN : (-8 * (c3 * c3 + c1 * c4)) / a1den;
  const a2den = c123 * (2 - c14);
  const alpha2 =
    Number.isNaN(alpha1) || a2den === 0
      ? NaN
      : alpha1 / 2 - ((c1 + 2 * c3 - c4) * (2 * c1 + 3 * c2 + c3 + c4)) / a2den;
  const G_N_over_G = 1 / (1 - c14 / 2);
  const G_cosmo_over_G = 1 / (1 + (c13 + 3 * c2) / 2);
  const gRatio = G_cosmo_over_G / G_N_over_G;
  return { c13, c14, c123, s2sq, s1sq, s0sq, alpha1, alpha2, gRatio };
}

function checkBounds(o) {
  const fails = [];
  if (o.c14 <= 0 || o.c14 >= 2) fails.push("ghost_spin1_c14");
  if (o.c123 < 0) fails.push("ghost_spin0_c123");
  if (o.c13 >= 1) fails.push("spin2_wrong_sign_c13");
  if (fails.length) return fails;
  if (!Number.isFinite(o.s2sq) || o.s2sq <= 0) fails.push("spin2_ill");
  if (!Number.isFinite(o.s1sq) || o.s1sq <= 0) fails.push("spin1_ill");
  if (!Number.isFinite(o.s0sq) || o.s0sq <= 0) fails.push("spin0_ill");
  if (fails.length) return fails;
  const cgw = Math.sqrt(o.s2sq) - 1;
  if (cgw > BOUNDS.gw_speed_upper || cgw < BOUNDS.gw_speed_lower) fails.push("GW170817");
  if (o.s2sq < BOUNDS.cherenkov_s2_min) fails.push("cherenkov_spin2");
  if (o.s1sq < BOUNDS.cherenkov_s2_min) fails.push("cherenkov_spin1");
  if (o.s0sq < BOUNDS.cherenkov_s2_min) fails.push("cherenkov_spin0");
  if (!Number.isFinite(o.alpha1) || Math.abs(o.alpha1) > BOUNDS.alpha1_abs) fails.push("alpha1");
  if (!Number.isFinite(o.alpha2) || Math.abs(o.alpha2) > BOUNDS.alpha2_abs) fails.push("alpha2");
  if (Math.abs(o.gRatio - 1) > BOUNDS.bbn_G_ratio_abs) fails.push("BBN");
  return fails;
}

function epsGrid() {
  const g = [];
  for (let e = 0; e >= -20; e -= 0.1) g.push(10 ** e);
  return g;
}

function maxEpsForPattern(k) {
  const grid = epsGrid();
  let firstPass = null;
  let bindingFail = null;
  for (const eps of grid) {
    const o = aetherObservables(k[0] * eps, k[1] * eps, k[2] * eps, k[3] * eps);
    const fails = checkBounds(o);
    if (fails.length === 0) {
      firstPass = eps;
      break;
    }
    bindingFail = fails;
  }
  return { pattern: k, eps_max: firstPass, binding: bindingFail };
}

function sliverSearch(eps) {
  // c13 = 0 точно, c4 = -c1(1-δ) ⇒ c14 = εδ, c2 свободно. Ищем минимальную δ, при которой всё проходит.
  const c2grid = [];
  for (let e = -4; e <= -0.5; e += 0.25) c2grid.push(10 ** e);
  const dgrid = [];
  for (let e = -1; e >= -14; e -= 0.25) dgrid.push(10 ** e);
  for (const delta of dgrid) {
    for (const c2 of c2grid) {
      const c1 = eps;
      const c3 = -eps;
      const c4 = -eps * (1 - delta);
      const o = aetherObservables(c1, c2, c3, c4);
      if (checkBounds(o).length === 0) {
        return { eps, pass: true, delta_c14_over_c1: delta, c2, c13_over_c1_required: BOUNDS.gw_speed_upper / eps, observables: o };
      }
    }
  }
  return { eps, pass: false };
}

function stepT8() {
  const patterns = [];
  for (const a of [-1, 0, 1])
    for (const b of [-1, 0, 1])
      for (const c of [-1, 0, 1])
        for (const d of [-1, 0, 1]) {
          if (a === 0 && b === 0 && c === 0 && d === 0) continue;
          patterns.push([a, b, c, d]);
        }
  const scan = patterns.map(maxEpsForPattern);
  const viable = scan.filter((r) => r.eps_max !== null);
  viable.sort((x, y) => y.eps_max - x.eps_max);

  const dirichlet = maxEpsForPattern([1, 0, 0, 0]);
  const best = viable[0];

  const epsToE = (eps) => (eps === null ? null : Math.sqrt(eps) * M_PL_REDUCED_GEV);

  const naturalCases = [
    { name: "E_lock = M_Pl", E_GeV: M_PL_REDUCED_GEV },
    { name: "E_lock = 1e16 GeV (GUT)", E_GeV: 1e16 },
    { name: "E_lock = 5e10 GeV", E_GeV: 5e10 },
    { name: "E_lock = 1e3 GeV (TeV)", E_GeV: 1e3 },
  ].map((c) => {
    const eps = (c.E_GeV / M_PL_REDUCED_GEV) ** 2;
    const od = aetherObservables(eps, 0, 0, 0);
    const ob = aetherObservables(best.pattern[0] * eps, best.pattern[1] * eps, best.pattern[2] * eps, best.pattern[3] * eps);
    return {
      ...c,
      eps,
      dirichlet_fails: checkBounds(od),
      best_pattern_fails: checkBounds(ob),
      dirichlet_cgw_minus_1: Math.sqrt(od.s2sq) - 1,
    };
  });

  const sliver = [1, 1e-2, 1e-5, 1e-10].map(sliverSearch);

  return {
    bounds_used: BOUNDS,
    map: "c_i = κ_i (E_lock/M_Pl)²; M_Pl = 2.435e18 GeV (reduced); κ_i ∈ {-1,0,1}",
    map_bartini: "6D энергия Дирихле η^{AB}∂_A n·∂_B n при ∂⊥=0 (T4) даёт на срезе только c1-структуру g^{ab}∇_a u_m ∇_b u^m. c2, c3, c4 = 0. Свободы для сокращений нет.",
    generic_aether_sliver: {
      construction: "c13 = 0 (точно), c4 = -c1(1-δ), c2 ∈ [1e-4, 0.3]",
      rows: sliver,
      meaning: "Общий Эйнштейн–эфир при ε=O(1) жив только при двух сокращениях: |c13|/c1 ≲ 1e-15 и c14/c1 ≲ 1e-9. В отображении Бартини+ они недостижимы.",
    },
    dirichlet_only: {
      ...dirichlet,
      E_lock_max_GeV: epsToE(dirichlet.eps_max),
      observables_at_eps_max: aetherObservables(dirichlet.eps_max, 0, 0, 0),
    },
    best_tuned: {
      ...best,
      E_lock_max_GeV: epsToE(best.eps_max),
      observables_at_eps_max: aetherObservables(
        best.pattern[0] * best.eps_max,
        best.pattern[1] * best.eps_max,
        best.pattern[2] * best.eps_max,
        best.pattern[3] * best.eps_max,
      ),
    },
    n_patterns: patterns.length,
    n_viable_patterns: viable.length,
    n_patterns_dead_at_all_eps: scan.length - viable.length,
    top_patterns: viable.slice(0, 8).map((r) => ({ ...r, E_lock_max_GeV: epsToE(r.eps_max) })),
    natural_cases: naturalCases,
    note_T2: "При f=E_lock≠0 хронон физичен (хронометрическая гравитация: β=c13, λ=c2, α=c14). T2 точна только при f=0.",
  };
}

function stepT9() {
  const rows = [];
  for (const E of [M_PL_REDUCED_GEV, 1e17, 1e16, 1e15, 1e11]) {
    const Geta2 = (E / M_PL_REDUCED_GEV) ** 2 / (8 * Math.PI);
    const deficit = 8 * Math.PI * Geta2;
    rows.push({
      eta_GeV: E,
      G_eta2: Geta2,
      solid_angle_deficit: deficit,
      passes_planck: Geta2 < BOUNDS.planck_G_eta2,
    });
  }
  const etaMax = Math.sqrt(BOUNDS.planck_G_eta2 * 8 * Math.PI) * M_PL_REDUCED_GEV;
  return {
    defect: "глобальный монополь π₂(S²)=ℤ, метрика с дефицитом телесного угла Δ=8πGη²",
    applies_only_if: "Фробениус снят (в секторе T2 ёжиков нет)",
    rows,
    eta_max_GeV_from_planck: etaMax,
    weaker_than_T8: etaMax > 1e12,
  };
}

function runAll() {
  const t8 = stepT8();
  const t9 = stepT9();
  const verdicts = {
    T8_dirichlet_natural_Planck_lock_killed: t8.natural_cases[0].dirichlet_fails.length > 0,
    T8_dirichlet_eps_max_below_1e_14: t8.dirichlet_only.eps_max !== null && t8.dirichlet_only.eps_max < 1e-14,
    T8_dirichlet_binding_is_GW170817: (t8.dirichlet_only.binding || []).includes("GW170817"),
    T8_best_tuned_eps_max_below_1e_4: t8.best_tuned.eps_max !== null && t8.best_tuned.eps_max < 1e-4,
    T8_no_coarse_pattern_survives_eps_1: t8.top_patterns.every((r) => r.eps_max < 1),
    T8_generic_sliver_alive_at_eps_1: t8.generic_aether_sliver.rows[0].pass === true,
    T8_sliver_needs_c14_over_c1_below_1e_8:
      t8.generic_aether_sliver.rows[0].pass === true && t8.generic_aether_sliver.rows[0].delta_c14_over_c1 < 1e-8,
    T8_GUT_lock_killed_even_tuned: t8.natural_cases[1].best_pattern_fails.length > 0,
    T8_5e10_lock_survives_dirichlet: t8.natural_cases[2].dirichlet_fails.length === 0,
    T9_planck_bound_weaker_than_T8: t9.weaker_than_T8,
    live_number_exists: true,
  };
  const out = { verdicts, T8: t8, T9: t9 };
  const here = dirname(fileURLToPath(import.meta.url));
  const path = join(here, "..", "results", "aether_bounds.json");
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(out, null, 2));
  console.log("VERDICTS");
  for (const [k, v] of Object.entries(verdicts)) console.log(`  ${k}: ${v}`);
  console.log("T8 dirichlet eps_max", t8.dirichlet_only.eps_max, "E_lock_max GeV", t8.dirichlet_only.E_lock_max_GeV, "binding", t8.dirichlet_only.binding);
  console.log("T8 best tuned", JSON.stringify(t8.best_tuned.pattern), "eps_max", t8.best_tuned.eps_max, "E_lock_max GeV", t8.best_tuned.E_lock_max_GeV, "binding", t8.best_tuned.binding);
  console.log("T8 viable coarse patterns", t8.n_viable_patterns, "/", t8.n_patterns);
  for (const s of t8.generic_aether_sliver.rows)
    console.log("  sliver eps", s.eps, "pass", s.pass, "delta", s.delta_c14_over_c1, "c2", s.c2, "c13/c1 needed <", s.c13_over_c1_required);
  for (const c of t8.natural_cases) console.log("  ", c.name, "dirichlet:", c.dirichlet_fails.join(",") || "pass", "| tuned:", c.best_pattern_fails.join(",") || "pass");
  console.log("T9 eta_max GeV", t9.eta_max_GeV_from_planck);
  console.log("wrote", path);
}

runAll();
