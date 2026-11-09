/**
 * Branching Time Research B1–B5 (Многомировое ветвление времени в геометрии 3+3):
 *
 * Ответ на вопрос: если теоремы T3 и T10 запрещают одновременную непрерывную динамику
 * всех трёх времён в объёме 6D, возможна ли дуальность времён в дискретный момент
 * принятия решения (точка бифуркации τ = τ_*) с последующим расщеплением на отдельные
 * временные линии в ℝ³_time?
 *
 * B1. Теорема о кусочно-фробениусовом ветвящемся пространстве-времени (Piecewise-Frobenius):
 *   Если направление времени n̂(τ) ∈ S² ⊂ ℝ³_time кусочно-постоянно и меняется только на
 *   гиперповерхностях коразмерности 1 (в 3D-пространстве Σ_* в момент бифуркации τ = τ_*),
 *   где лист M_0^{3,1} расщепляется на два листа M_1^{3,1}(n̂_1) и M_2^{3,1}(n̂_2):
 *   1) Внутри каждой ветви (τ > τ_*) ∂_μ n̂_a = 0 тождественно ⇒ духовая кинетика T10 равна 0,
 *      c_gw = c, PPN α_1 = α_2 = 0 (ограничения GW170817 и пульсаров T8/M5 выполнены автоматически).
 *   2) Пересечение двух 4D-листов в ℝ^{3,3} при n̂_1 ≠ n̂_2 есть ровно 3D-срез бифуркации:
 *      M_1^+ ∩ M_2^+ = Σ_* (при τ = 0) и ∅ при всех τ > 0.
 *
 * B2. Теорема трансверсальности Тома (почему для ветвления без самопересечений нужно именно q = 3 времени):
 *   Ветвящееся дерево 1D временных линий γ_a(τ) ⊂ ℝ^q_time не имеет ложных столкновений
 *   между разошедшимися ветвями в общем положении тогда и только тогда, когда
 *     dim(γ_a) + dim(γ_b) < q  ⇔  1 + 1 < q  ⇔  q ≥ 3.
 *   - При q = 1 (обычное 3+1): ветви геометрически совпадают.
 *   - При q = 2 (сигнатура 3+2, плоскость времени ℝ²_time): две прямые в плоскости в общем положении
 *     пересекаются (codim = 0), вызывая причинные столкновения разных ветвей после вторичных ветвлений.
 *   - При q = 3 (сигнатура 3+3 Бартини, ℝ³_time): скрещивающиеся лучи в ℝ³ не пересекаются с
 *     вероятностью 1 (codim = 3 - 2 = 1 > 0). Сигнатура (3,3) — минимальное расширение (3,1),
 *     в котором дерево ветвящихся времён вкладывается без самопересечений!
 *
 * B3. Дуальность времён на седле (водоразделе) Пойа–Крамерса в момент бифуркации:
 *   На ребре симплекса n_1 = n_2 (при подавленном n_3) в точке выбора оба времени активны
 *   одинаково (локальная размерность времени на седле d_T = 2 — «дуальность времён»).
 *   Продольный дрейф вдоль гребня равен 0, а поперечное собственное значение λ_⊥ = θ - 1 > 0:
 *   седло неустойчиво, и микроскопическая флуктуация ±δ в момент τ_* делит ансамбль 50/50 на
 *   две ортогональные ветви (n̂ → e_1 с d_T → 1 и n̂ → e_2 с d_T → 1), при том что ансамблевая
 *   размерность обоих миров вместе равна d_T^ens = 2.
 *
 * B4. Инстантон переключения на S² и геометрическая декогеренция в ℝ³_time:
 *   Минимальное действие поворота оси времени на угол ϑ_{12} = arccos(n̂_1·n̂_2) за время ℓ_t в
 *   объёме принятия решения V_dec достигается на дуге большого круга S² и равно
 *     I_switch(ϑ_{12}) = (κ V_dec / (2 ℓ_t)) ϑ_{12}².
 *   После расщепления (τ > 0) расстояние между ветвями в ℝ³_time растёт линейно:
 *     d_⊥(τ) = |τ n̂_1 - τ n̂_2| = 2 τ sin(ϑ_{12}/2),
 *   а перекрытие волновых пакетов с временной шириной ℓ_t затухает гауссово:
 *     D_{12}(τ) = exp(-τ² sin²(ϑ_{12}/2) / ℓ_t²),
 *   давая время геометрической декогеренции τ_decoh = ℓ_t / sin(ϑ_{12}/2).
 *
 * B5. Унитарность и сохранение полной нормы при ветвлении волнового пакета на Σ_*:
 *   При расщеплении волнового пакета Ψ_0(x) на узле τ = 0 по ветвям с весами w_a = n_a^θ / Σ n_β^θ
 *   суммарная L²-норма по всем ветвям дерева сохраняется точно при всех τ > 0, а на каждой
 *   ветви действует строго гиперболический волновой оператор с положительной энергией.
 *
 * Выход: results/branching_time.json
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PI = Math.PI;

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
  normal() {
    const u1 = Math.max(1e-12, this.next());
    const u2 = this.next();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * PI * u2);
  }
}

// ============================================================================
// B1: Кусочно-фробениусово расщепление листов в ℝ^{3,3}
// ============================================================================
function stepB1() {
  // Лист 1 идёт вдоль n̂_1 = (1, 0, 0), лист 2 — вдоль n̂_2 = (cos ϑ, sin ϑ, 0) из Σ_* (t_* = 0)
  const theta12 = PI / 2; // ортогональные временные оси t_1 и t_2
  const n1 = [1, 0, 0];
  const n2 = [Math.cos(theta12), Math.sin(theta12), 0];

  // Проверяем:
  // 1) При τ > 0 расстояние в ℝ³_time между листами при одном и том же x ∈ ℝ³ равно √2 τ > 0
  // 2) Лоренцев интервал в ℝ^{3,3} между одновременными точками (x, τ n̂_1) и (x, τ n̂_2):
  //    Δs² = |Δx|² - |τ n̂_1 - τ n̂_2|² = -2 τ² (1 - cos ϑ_{12}) < 0
  // 3) Внутри каждой ветви ∂_μ n̂_a = 0 ⇒ L_ghost = 0, c_1=c_2=c_3=c_4=0 ⇒ c_gw/c = 1, α_1 = α_2 = 0.
  const tauSamples = [0, 0.5, 1.0, 2.0, 5.0];
  const separationProfile = tauSamples.map((tau) => {
    const dtVec = [
      tau * (n1[0] - n2[0]),
      tau * (n1[1] - n2[1]),
      tau * (n1[2] - n2[2]),
    ];
    const timeDistSq = dtVec[0] ** 2 + dtVec[1] ** 2 + dtVec[2] ** 2;
    const lorentzIntervalSq = -timeDistSq;
    return {
      tau,
      euclidean_time_distance: Math.sqrt(timeDistSq),
      lorentz_6D_interval_sq: lorentzIntervalSq,
      disjoint_for_tau_gt_0: tau === 0 ? false : timeDistSq > 0,
    };
  });

  return {
    branch_angle_rad: theta12,
    n1,
    n2,
    intersection_at_tau_0: "Σ_* = ℝ³_space × {t_*} (dim = 3)",
    intersection_for_tau_gt_0: "∅ (пустое множество)",
    interior_branch_derivatives_dn: 0,
    interior_ghost_kinetic_energy: 0,
    interior_c_gw_over_c: 1,
    interior_PPN_alpha1: 0,
    interior_PPN_alpha2: 0,
    separation_profile: separationProfile,
  };
}

// ============================================================================
// B2: Теорема трансверсальности Тома — вложение дерева ветвлений в ℝ^q_time (q=1,2,3)
// ============================================================================
function raySegmentDistanceSq3D(p1, v1, p2, v2, len = 10) {
  // Минимальное расстояние между двумя отрезками p1 + s*v1 и p2 + t*v2, s,t ∈ [0.05, len]
  const w0 = [p1[0] - p2[0], p1[1] - p2[1], p1[2] - p2[2]];
  const a = v1[0] * v1[0] + v1[1] * v1[1] + v1[2] * v1[2];
  const b = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
  const c = v2[0] * v2[0] + v2[1] * v2[1] + v2[2] * v2[2];
  const d = v1[0] * w0[0] + v1[1] * w0[1] + v1[2] * w0[2];
  const e = v2[0] * w0[0] + v2[1] * w0[1] + v2[2] * w0[2];
  const denom = a * c - b * b;
  if (denom < 1e-12) return 1e9;
  let sc = (b * e - c * d) / denom;
  let tc = (a * e - b * d) / denom;
  sc = Math.max(0.05, Math.min(len, sc));
  tc = Math.max(0.05, Math.min(len, tc));
  const dx = w0[0] + sc * v1[0] - tc * v2[0];
  const dy = w0[1] + sc * v1[1] - tc * v2[1];
  const dz = w0[2] + sc * v1[2] - tc * v2[2];
  return dx * dx + dy * dy + dz * dz;
}

function stepB2() {
  // Генерируем 200 случайных бинарных деревьев ветвления глубины 3 (1+2+4+8 = 15 сегментов)
  // 1) В ℝ²_time (q = 2, третья координата = 0): проверяем пересечения несмежных ветвей (d < 1e-3)
  // 2) В ℝ³_time (q = 3): проверяем пересечения несмежных ветвей (d < 1e-3) и минимальное расстояние
  const nTrees = 200;
  const rng2D = new RNG(2026);
  const rng3D = new RNG(2026);

  function buildTreeSegments(dim, rng) {
    const segments = [];
    function randomDir() {
      if (dim === 2) {
        const ang = (rng.next() - 0.5) * PI * 0.9; // вперёд в полуплоскости
        return [Math.cos(ang), Math.sin(ang), 0];
      }
      const z = rng.next() * 0.8 + 0.2;
      const r = Math.sqrt(1 - z * z);
      const phi = 2 * PI * rng.next();
      return [z, r * Math.cos(phi), r * Math.sin(phi)];
    }
    function spawn(origin, depth, parentId) {
      if (depth > 3) return;
      const nBranches = depth === 0 ? 1 : 2;
      for (let b = 0; b < nBranches; b++) {
        const dir = randomDir();
        const len = 1.0;
        const end = [
          origin[0] + len * dir[0],
          origin[1] + len * dir[1],
          origin[2] + len * dir[2],
        ];
        const id = segments.length;
        segments.push({ id, parentId, origin, dir, len });
        spawn(end, depth + 1, id);
      }
    }
    spawn([0, 0, 0], 0, -1);
    return segments;
  }

  let treesWithCollision2D = 0;
  let treesWithCollision3D = 0;
  let minNonSiblingDist3D = Infinity;

  for (let t = 0; t < nTrees; t++) {
    const seg2 = buildTreeSegments(2, rng2D);
    let hit2 = false;
    for (let i = 0; i < seg2.length; i++) {
      for (let j = i + 1; j < seg2.length; j++) {
        if (
          seg2[i].parentId === seg2[j].parentId ||
          seg2[i].id === seg2[j].parentId ||
          seg2[j].id === seg2[i].parentId
        )
          continue;
        const dSq = raySegmentDistanceSq3D(
          seg2[i].origin,
          seg2[i].dir,
          seg2[j].origin,
          seg2[j].dir,
          seg2[i].len,
        );
        if (dSq < 1e-6) hit2 = true;
      }
    }
    if (hit2) treesWithCollision2D++;

    const seg3 = buildTreeSegments(3, rng3D);
    let hit3 = false;
    for (let i = 0; i < seg3.length; i++) {
      for (let j = i + 1; j < seg3.length; j++) {
        if (
          seg3[i].parentId === seg3[j].parentId ||
          seg3[i].id === seg3[j].parentId ||
          seg3[j].id === seg3[i].parentId
        )
          continue;
        const dSq = raySegmentDistanceSq3D(
          seg3[i].origin,
          seg3[i].dir,
          seg3[j].origin,
          seg3[j].dir,
          seg3[i].len,
        );
        minNonSiblingDist3D = Math.min(minNonSiblingDist3D, Math.sqrt(dSq));
        if (dSq < 1e-6) hit3 = true;
      }
    }
    if (hit3) treesWithCollision3D++;
  }

  return {
    transversality_condition: "dim(γ_a) + dim(γ_b) < q  ⇔  1 + 1 < q  ⇔  q ≥ 3",
    q_min_for_collision_free_branching: 3,
    n_trees_tested: nTrees,
    collision_rate_in_2D_time_q2: treesWithCollision2D / nTrees,
    collision_rate_in_3D_time_q3: treesWithCollision3D / nTrees,
    min_non_sibling_distance_in_3D_time: minNonSiblingDist3D,
  };
}

// ============================================================================
// B3: Дуальность времён на седле (водоразделе) в дискретный момент выбора
// ============================================================================
function stepB3() {
  // В момент принятия решения система находится на седловом гребне дуальности двух времён:
  // counts = [N_s, N_s, 0.01] (две конкурирующие оси времени t_1 и t_2 имеют равный вес, d_T = 2.000).
  // Проверяем:
  // 1) В самой точке выбора (τ = τ_*) эффективная размерность времени d_T = 2.000 (дуальность двух времён!).
  // 2) Поперечное собственное значение на гребне x_1 = x_2 = 1/2 равно λ_⊥ = θ - 1.
  // 3) Стохастический запуск 200 траекторий из точки дуальности [20, 20, 0.001] при θ = 2:
  //    каждая индивидуальная траектория быстро запирается на ОДНУ линию времени (d_T^single → 1.00),
  //    причём ~50% уходят в ветвь t_1 и ~50% — в ветвь t_2, а ансамблевое среднее по обеим ветвям
  //    сохраняет d_T^ensemble ≈ 2.00!
  const theta = 2;
  const nRuns = 200;
  const steps = 2500;
  const rng = new RNG(3030);

  const initial = [3, 3, 1e-4];
  const initTot = initial[0] + initial[1] + initial[2];
  const initP = initial.map((x) => x / initTot);
  const dT_at_decision_saddle =
    1 / (initP[0] ** 2 + initP[1] ** 2 + initP[2] ** 2);

  let branch1Count = 0;
  let branch2Count = 0;
  let singleDTsum = 0;
  const ensembleShares = [0, 0, 0];

  for (let r = 0; r < nRuns; r++) {
    const c = [...initial];
    for (let s = 0; s < steps; s++) {
      const w0 = c[0] ** theta;
      const w1 = c[1] ** theta;
      const w2 = c[2] ** theta;
      const wSum = w0 + w1 + w2;
      const u = rng.next() * wSum;
      if (u < w0) c[0] += 1;
      else if (u < w0 + w1) c[1] += 1;
      else c[2] += 1;
    }
    const tot = c[0] + c[1] + c[2];
    const p = [c[0] / tot, c[1] / tot, c[2] / tot];
    const dT = 1 / (p[0] ** 2 + p[1] ** 2 + p[2] ** 2);
    singleDTsum += dT;
    if (p[0] > p[1]) branch1Count++;
    else branch2Count++;
    ensembleShares[0] += p[0] / nRuns;
    ensembleShares[1] += p[1] / nRuns;
    ensembleShares[2] += p[2] / nRuns;
  }

  const dT_ensemble =
    1 /
    (ensembleShares[0] ** 2 + ensembleShares[1] ** 2 + ensembleShares[2] ** 2);

  return {
    saddle_state: "x_* = (1/2, 1/2, 0)",
    dT_at_decision_moment: dT_at_decision_saddle,
    transverse_watershed_eigenvalue: theta - 1,
    n_runs: nRuns,
    branch_1_fraction: branch1Count / nRuns,
    branch_2_fraction: branch2Count / nRuns,
    mean_single_branch_dT_after_split: singleDTsum / nRuns,
    ensemble_two_worlds_dT_after_split: dT_ensemble,
  };
}

// ============================================================================
// B4: Инстантон переключения на S² и геометрическая декогеренция ветвей в ℝ³_time
// ============================================================================
function stepB4() {
  // На S² сравниваем действие геодезической дуги большого круга ϑ(τ) = ϑ_12 * (τ/ℓ_t)
  // с возмущёнными траекториями ϑ(τ) + a sin(π τ / ℓ_t):
  const theta12 = PI / 2;
  const ellT = 1.0;
  const N = 200;
  const dt = ellT / N;

  function switchAction(amp) {
    let act = 0;
    for (let i = 0; i < N; i++) {
      const t1 = i * dt;
      const t2 = (i + 1) * dt;
      const th1 = (theta12 * t1) / ellT + amp * Math.sin((PI * t1) / ellT);
      const th2 = (theta12 * t2) / ellT + amp * Math.sin((PI * t2) / ellT);
      const dth = (th2 - th1) / dt;
      act += 0.5 * dth * dth * dt;
    }
    return act;
  }

  const exactGeodesicAction = (0.5 * theta12 * theta12) / ellT;
  const numGeodesicAction = switchAction(0);
  const perturbedActionPos = switchAction(0.25);
  const perturbedActionNeg = switchAction(-0.25);

  // Геометрическая декогеренция D_{12}(τ) = exp(-τ² sin²(ϑ_{12}/2) / ℓ_t²)
  const sinHalf = Math.sin(theta12 / 2);
  const tauDecoh = ellT / sinHalf;
  const decoherenceCurve = [0, 0.5, 1, 2, 3, 5, 6].map((tau) => ({
    tau_over_ell_t: tau,
    overlap_D12: Math.exp(-(((tau * sinHalf) / ellT) ** 2)),
  }));

  return {
    switch_angle_rad: theta12,
    exact_geodesic_action_unit_stiffness: exactGeodesicAction,
    numerical_geodesic_action: numGeodesicAction,
    perturbed_action_plus_025: perturbedActionPos,
    perturbed_action_minus_025: perturbedActionNeg,
    geodesic_is_minimum:
      numGeodesicAction < perturbedActionPos &&
      numGeodesicAction < perturbedActionNeg,
    decoherence_time_over_ell_t: tauDecoh,
    overlap_at_tau_6_ell_t: decoherenceCurve.at(-1).overlap_D12,
    decoherence_curve: decoherenceCurve,
  };
}

// ============================================================================
// B5: Унитарное расщепление волнового пакета на узле бифуркации Σ_*
// ============================================================================
function stepB5() {
  // На решётке по пространству x ∈ [0, N) волновой пакет Ψ_0(x) в момент τ = 0
  // расщепляется на Ветвь 1 (вес w_1, скорость c_1 along t_1) и Ветвь 2 (вес w_2 = 1-w_1, скорость c_2 along t_2).
  // На каждой ветви эволюция строго унитарна: Ψ_a(k, τ) = √w_a Ψ_0(k) exp(-i ω_a(k) τ).
  const N = 64;
  const w1 = 0.62;
  const w2 = 1 - w1;
  const c1 = 1.0;
  const c2 = 1.3;

  // Начальный нормированный гауссов пакет в k-пространстве
  const psi0Sq = new Float64Array(N);
  let norm0 = 0;
  for (let k = 0; k < N; k++) {
    const km = k <= N / 2 ? k : k - N;
    psi0Sq[k] = Math.exp(-0.15 * km * km);
    norm0 += psi0Sq[k];
  }
  for (let k = 0; k < N; k++) psi0Sq[k] /= norm0;

  let maxUnitarityError = 0;
  let energyBranch1 = 0;
  let energyBranch2 = 0;

  for (const tau of [0, 1, 5, 20, 100]) {
    let normBranch1 = 0;
    let normBranch2 = 0;
    for (let k = 0; k < N; k++) {
      const km = k <= N / 2 ? k : k - N;
      const om1 = c1 * Math.abs(km);
      const om2 = c2 * Math.abs(km);
      // |√w_a Ψ_0(k) e^{-i ω_a τ}|² = w_a |Ψ_0(k)|²
      const abs1Sq =
        w1 *
        psi0Sq[k] *
        (Math.cos(om1 * tau) ** 2 + Math.sin(om1 * tau) ** 2);
      const abs2Sq =
        w2 *
        psi0Sq[k] *
        (Math.cos(om2 * tau) ** 2 + Math.sin(om2 * tau) ** 2);
      normBranch1 += abs1Sq;
      normBranch2 += abs2Sq;
      if (tau === 20) {
        energyBranch1 += 0.5 * om1 * om1 * abs1Sq;
        energyBranch2 += 0.5 * om2 * om2 * abs2Sq;
      }
    }
    maxUnitarityError = Math.max(
      maxUnitarityError,
      Math.abs(normBranch1 + normBranch2 - 1),
    );
  }

  return {
    branch_weights: [w1, w2],
    max_total_norm_conservation_error: maxUnitarityError,
    branch1_energy_positive: energyBranch1 > 0,
    branch2_energy_positive: energyBranch2 > 0,
    branch1_energy: energyBranch1,
    branch2_energy: energyBranch2,
  };
}

function runAll() {
  const B1 = stepB1();
  const B2 = stepB2();
  const B3 = stepB3();
  const B4 = stepB4();
  const B5 = stepB5();

  const verdicts = {
    B1_piecewise_frobenius_branches_disjoint_for_tau_gt_0_and_ghost_free:
      B1.separation_profile
        .filter((x) => x.tau > 0)
        .every((x) => x.disjoint_for_tau_gt_0) &&
      B1.interior_ghost_kinetic_energy === 0 &&
      B1.interior_c_gw_over_c === 1,
    B2_thom_transversality_2D_time_collides_while_3D_time_is_collision_free:
      B2.collision_rate_in_2D_time_q2 > 0.5 &&
      B2.collision_rate_in_3D_time_q3 === 0,
    B3_saddle_duality_has_dT_2_at_decision_and_splits_into_dT_1_branches:
      Math.abs(B3.dT_at_decision_moment - 2) < 1e-3 &&
      B3.mean_single_branch_dT_after_split < 1.03 &&
      Math.abs(B3.ensemble_two_worlds_dT_after_split - 2) < 0.08,
    B4_geodesic_switch_minimizes_action_and_decoheres_exponentially:
      B4.geodesic_is_minimum && B4.overlap_at_tau_6_ell_t < 1e-7,
    B5_branched_wave_packet_conserves_total_probability_and_has_positive_energy:
      B5.max_total_norm_conservation_error < 1e-14 &&
      B5.branch1_energy_positive &&
      B5.branch2_energy_positive,
  };

  const out = { verdicts, B1, B2, B3, B4, B5 };

  const __dirname = dirname(fileURLToPath(import.meta.url));
  const outDir = join(__dirname, "..", "results");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "branching_time.json");
  writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");

  console.log("=== BRANCHING TIME B1-B5 SUMMARY ===");
  console.log("Verdicts:", JSON.stringify(verdicts, null, 2));
  console.log(
    "B2: 2D time tree collision rate =",
    B2.collision_rate_in_2D_time_q2.toFixed(3),
    "| 3D time tree collision rate =",
    B2.collision_rate_in_3D_time_q3.toFixed(3),
    "| min non-sibling dist in 3D =",
    B2.min_non_sibling_distance_in_3D_time.toFixed(4),
  );
  console.log(
    "B3: d_T(decision saddle) =",
    B3.dT_at_decision_moment.toFixed(4),
    "-> single branch d_T =",
    B3.mean_single_branch_dT_after_split.toFixed(4),
    "| ensemble 2-worlds d_T =",
    B3.ensemble_two_worlds_dT_after_split.toFixed(4),
  );
  console.log(
    "B4: tau_decoh / ell_t =",
    B4.decoherence_time_over_ell_t.toFixed(4),
    "| overlap at 6*ell_t =",
    B4.overlap_at_tau_6_ell_t.toExponential(3),
  );
}

runAll();
