"""L0–L3: численная проверка предсказаний Бартини+."""

from __future__ import annotations

import json
from pathlib import Path

import numpy as np

from bartini_plus.life import RULE_ORDER, Life2D
from bartini_plus.urn import ClockUrn, effective_time_dimension
from bartini_plus.wave import Wave1D


C_CLOCKS = (0.18, 0.40, 0.62)
C_REF = float(np.mean(C_CLOCKS))
DX = 1.0
DT = 0.40
N_LAT = 128
LOCK_P = 0.95


def _fit_gamma(t: np.ndarray, amp: np.ndarray) -> float:
    """Γ из ln A = const − Γ T. Берём участок, где A ещё выше шума."""
    a = np.asarray(amp, dtype=np.float64)
    tt = np.asarray(t, dtype=np.float64)
    mask = a > max(1e-8, 0.02 * float(a[0]) if a[0] > 0 else 1e-8)
    if mask.sum() < 8:
        return float("nan")
    lo = max(2, int(0.08 * mask.sum()))
    idx = np.where(mask)[0][lo:]
    if idx.size < 6:
        return float("nan")
    y = np.log(a[idx])
    x = tt[idx]
    slope = float(np.polyfit(x, y, 1)[0])
    return -slope


def _k_phys(mode: int) -> float:
    return 2.0 * np.pi * mode / (N_LAT * DX)


def run_wave_ensemble(
    theta: float,
    modes: list[int],
    steps: int,
    n_runs: int,
    seed: int,
    record_every: int = 4,
) -> dict:
    rng_master = np.random.default_rng(seed)
    out: dict = {"theta": theta, "modes": {}, "lock_steps": []}
    for mode in modes:
        amps = []
        lock_at = []
        p_hist = []
        dt_hist = []
        gamma_pre = []
        gamma_post = []
        for r in range(n_runs):
            rng = np.random.default_rng(int(rng_master.integers(0, 2**31 - 1)))
            urn = ClockUrn(theta=theta, rng=rng)
            wave = Wave1D(N_LAT, DX, DT, C_CLOCKS)
            wave.seed_mode(mode)
            t_rec = []
            a_rec = []
            p_rec = []
            d_rec = []
            lock_step = None
            for s in range(steps):
                alpha = urn.step()
                wave.step(alpha)
                if urn.locked(LOCK_P) and lock_step is None:
                    lock_step = s
                if s % record_every == 0:
                    t_rec.append(s * DT)
                    a_rec.append(wave.mode_amp(mode, C_REF))
                    p_rec.append(urn.p.copy())
                    d_rec.append(effective_time_dimension(urn.p))
            t_arr = np.asarray(t_rec)
            a_arr = np.asarray(a_rec)
            amps.append(a_arr)
            lock_at.append(lock_step if lock_step is not None else steps)
            p_hist.append(np.stack(p_rec))
            dt_hist.append(np.asarray(d_rec))
            if lock_step is None:
                gamma_pre.append(_fit_gamma(t_arr, a_arr))
                gamma_post.append(float("nan"))
            else:
                cut = lock_step // record_every
                gamma_pre.append(_fit_gamma(t_arr[:cut], a_arr[:cut]))
                gamma_post.append(_fit_gamma(t_arr[cut:], a_arr[cut:]))
        amp_mean = np.mean(np.stack(amps), axis=0)
        t = np.arange(amp_mean.size) * record_every * DT
        out["modes"][str(mode)] = {
            "k": _k_phys(mode),
            "k2": _k_phys(mode) ** 2,
            "t": t.tolist(),
            "amp_mean": amp_mean.tolist(),
            "gamma_all": _fit_gamma(t, amp_mean),
            "gamma_pre_mean": float(np.nanmean(gamma_pre)),
            "gamma_post_mean": float(np.nanmean(gamma_post)),
            "p_mean": np.mean(np.stack(p_hist), axis=0).tolist(),
            "dT_mean": np.mean(np.stack(dt_hist), axis=0).tolist(),
        }
        out["lock_steps"].extend(lock_at)
    return out


def run_l1_urn(theta: float, steps: int, n_runs: int, seed: int) -> dict:
    rng_master = np.random.default_rng(seed)
    winners = []
    lock_steps = []
    locked_flags = []
    dT_curves = []
    p_curves = []
    sample_every = max(1, steps // 200)
    for _ in range(n_runs):
        rng = np.random.default_rng(int(rng_master.integers(0, 2**31 - 1)))
        urn = ClockUrn(theta=theta, rng=rng)
        d_rec = []
        p_rec = []
        lock_step = None
        for s in range(steps):
            urn.step()
            if urn.locked(LOCK_P) and lock_step is None:
                lock_step = s
            if s % sample_every == 0:
                d_rec.append(effective_time_dimension(urn.p))
                p_rec.append(urn.p.copy())
        winners.append(urn.winner())
        lock_steps.append(lock_step if lock_step is not None else steps)
        locked_flags.append(bool(urn.locked(LOCK_P)))
        dT_curves.append(d_rec)
        p_curves.append(np.stack(p_rec))
    winners_arr = np.asarray(winners)
    counts = [int(np.sum(winners_arr == i)) for i in range(3)]
    dT_mean = np.mean(np.asarray(dT_curves), axis=0)
    p_mean = np.mean(np.stack(p_curves), axis=0)
    k_axis = (np.arange(dT_mean.size) * sample_every).tolist()
    return {
        "theta": theta,
        "n_runs": n_runs,
        "steps": steps,
        "winner_counts": counts,
        "lock_frac": float(np.mean(locked_flags)),
        "lock_step_median": float(np.median(lock_steps)),
        "lock_step_mean": float(np.mean(lock_steps)),
        "k": k_axis,
        "dT_mean": dT_mean.tolist(),
        "p_mean": p_mean.tolist(),
        "dT_final_mean": float(dT_mean[-1]),
    }


def run_l3_life(
    theta: float,
    steps: int,
    n_runs: int,
    size: int,
    seed: int,
    initial: str,
) -> dict:
    rng_master = np.random.default_rng(seed)
    structured_end = []
    pop_hist = []
    winners = []
    lock_steps = []
    structured_frac_t = []
    for _ in range(n_runs):
        rng = np.random.default_rng(int(rng_master.integers(0, 2**31 - 1)))
        urn = ClockUrn(theta=theta, rng=rng)
        life = Life2D(size, rng)
        if initial == "glider":
            life.seed_glider()
        else:
            life.seed_random(0.14)
        pops = []
        struct = []
        lock_step = None
        for s in range(steps):
            alpha = urn.step()
            life.step(alpha)
            pops.append(life.population)
            struct.append(life.structured())
            if urn.locked(LOCK_P) and lock_step is None:
                lock_step = s
        structured_end.append(life.structured())
        pop_hist.append(pops)
        winners.append(urn.winner())
        lock_steps.append(lock_step if lock_step is not None else steps)
        structured_frac_t.append(struct)
    pop_mean = np.mean(np.asarray(pop_hist, dtype=np.float64), axis=0)
    struct_mean = np.mean(np.asarray(structured_frac_t, dtype=np.float64), axis=0)
    winners_arr = np.asarray(winners)
    by_winner = {}
    for i, name in enumerate(RULE_ORDER):
        mask = winners_arr == i
        if mask.any():
            by_winner[name] = float(np.mean(np.asarray(structured_end)[mask]))
        else:
            by_winner[name] = float("nan")
    return {
        "theta": theta,
        "initial": initial,
        "n_runs": n_runs,
        "structured_end_frac": float(np.mean(structured_end)),
        "pop_mean": pop_mean.tolist(),
        "struct_frac_t": struct_mean.tolist(),
        "winner_counts": [int(np.sum(winners_arr == i)) for i in range(3)],
        "structured_by_winner": by_winner,
        "lock_frac": float(np.mean([s < steps for s in lock_steps])),
        "lock_step_median": float(np.median(lock_steps)),
    }


def _downsample(xs: list, n: int = 40) -> list:
    if len(xs) <= n:
        return xs
    idx = np.linspace(0, len(xs) - 1, n).astype(int)
    return [xs[i] for i in idx]


def _downsample_rows(rows: list, n: int = 40) -> list:
    if len(rows) <= n:
        return rows
    idx = np.linspace(0, len(rows) - 1, n).astype(int)
    return [rows[i] for i in idx]


def run_all(out_path: Path) -> dict:
    modes = [2, 4, 6, 8, 10]

    l0 = run_wave_ensemble(
        theta=0.0, modes=modes, steps=4500, n_runs=6, seed=11
    )
    l1_th0 = run_l1_urn(theta=0.0, steps=5000, n_runs=40, seed=21)
    l1_th1 = run_l1_urn(theta=1.0, steps=5000, n_runs=40, seed=22)
    l1_th2 = run_l1_urn(theta=2.0, steps=5000, n_runs=90, seed=23)
    l2 = run_wave_ensemble(
        theta=2.0, modes=modes, steps=7000, n_runs=6, seed=31
    )
    l3_mix = run_l3_life(
        theta=0.0, steps=400, n_runs=24, size=48, seed=41, initial="glider"
    )
    l3_lock = run_l3_life(
        theta=2.5, steps=400, n_runs=36, size=48, seed=42, initial="glider"
    )
    l3_soup_mix = run_l3_life(
        theta=0.0, steps=300, n_runs=16, size=48, seed=43, initial="random"
    )
    l3_soup_lock = run_l3_life(
        theta=2.5, steps=300, n_runs=24, size=48, seed=44, initial="random"
    )

    l0_gamma = []
    l0_k2 = []
    for m in modes:
        rec = l0["modes"][str(m)]
        l0_gamma.append(rec["gamma_all"])
        l0_k2.append(rec["k2"])
    # Γ = β k²  →  β = mean(Γ / k²) на валидных точках
    pairs = [(g, k2) for g, k2 in zip(l0_gamma, l0_k2) if np.isfinite(g) and k2 > 0]
    if pairs:
        beta = float(np.mean([g / k2 for g, k2 in pairs]))
        resid = float(np.mean([(g - beta * k2) ** 2 for g, k2 in pairs]) ** 0.5)
    else:
        beta, resid = float("nan"), float("nan")

    l2_pre = [l2["modes"][str(m)]["gamma_pre_mean"] for m in modes]
    l2_post = [l2["modes"][str(m)]["gamma_post_mean"] for m in modes]

    verdicts = {
        "L0_gamma_positive": all(g > 0 for g in l0_gamma if np.isfinite(g)),
        "L0_gamma_grows_with_k2": (
            np.corrcoef(l0_k2, l0_gamma)[0, 1] > 0.7
            if all(np.isfinite(l0_gamma))
            else False
        ),
        "L1_theta0_no_lock": l1_th0["lock_frac"] < 0.05,
        "L1_theta2_locks": l1_th2["lock_frac"] > 0.85,
        "L1_dT_to_1": l1_th2["dT_final_mean"] < 1.25,
        "L1_winner_not_degenerate": min(l1_th2["winner_counts"]) > 0,
        "L2_post_smaller_than_pre": (
            float(np.nanmean(l2_post)) < 0.45 * float(np.nanmean(l2_pre))
            if np.isfinite(np.nanmean(l2_pre)) and np.nanmean(l2_pre) > 0
            else False
        ),
        "L3_lock_glider_beats_mix": (
            l3_lock["structured_end_frac"] > l3_mix["structured_end_frac"]
        ),
    }

    compact = {
        "c_clocks": list(C_CLOCKS),
        "verdicts": verdicts,
        "L0": {
            "modes": modes,
            "k2": l0_k2,
            "gamma": l0_gamma,
            "beta_gamma_over_k2": beta,
            "fit_rms": resid,
            "amp_t": _downsample(l0["modes"]["6"]["t"]),
            "amp_mode2": _downsample(l0["modes"]["2"]["amp_mean"]),
            "amp_mode6": _downsample(l0["modes"]["6"]["amp_mean"]),
            "amp_mode10": _downsample(l0["modes"]["10"]["amp_mean"]),
        },
        "L1": {
            "theta0": {
                "lock_frac": l1_th0["lock_frac"],
                "dT_final": l1_th0["dT_final_mean"],
                "winner_counts": l1_th0["winner_counts"],
                "k": _downsample(l1_th0["k"]),
                "dT": _downsample(l1_th0["dT_mean"]),
            },
            "theta1": {
                "lock_frac": l1_th1["lock_frac"],
                "dT_final": l1_th1["dT_final_mean"],
                "winner_counts": l1_th1["winner_counts"],
                "k": _downsample(l1_th1["k"]),
                "dT": _downsample(l1_th1["dT_mean"]),
            },
            "theta2": {
                "lock_frac": l1_th2["lock_frac"],
                "lock_step_median": l1_th2["lock_step_median"],
                "dT_final": l1_th2["dT_final_mean"],
                "winner_counts": l1_th2["winner_counts"],
                "k": _downsample(l1_th2["k"]),
                "dT": _downsample(l1_th2["dT_mean"]),
                "p_mean": _downsample_rows(l1_th2["p_mean"]),
            },
        },
        "L2": {
            "modes": modes,
            "k2": [l2["modes"][str(m)]["k2"] for m in modes],
            "gamma_pre": l2_pre,
            "gamma_post": l2_post,
            "amp_t": _downsample(l2["modes"]["6"]["t"]),
            "amp_mode6": _downsample(l2["modes"]["6"]["amp_mean"]),
            "dT": _downsample(l2["modes"]["6"]["dT_mean"]),
            "lock_step_median": float(np.median(l2["lock_steps"])),
        },
        "L3": {
            "mix_glider": {
                "structured_end": l3_mix["structured_end_frac"],
                "pop": _downsample(l3_mix["pop_mean"]),
                "struct_t": _downsample(l3_mix["struct_frac_t"]),
            },
            "lock_glider": {
                "structured_end": l3_lock["structured_end_frac"],
                "pop": _downsample(l3_lock["pop_mean"]),
                "struct_t": _downsample(l3_lock["struct_frac_t"]),
                "by_winner": l3_lock["structured_by_winner"],
                "winner_counts": l3_lock["winner_counts"],
                "lock_frac": l3_lock["lock_frac"],
            },
            "mix_soup": {"structured_end": l3_soup_mix["structured_end_frac"]},
            "lock_soup": {
                "structured_end": l3_soup_lock["structured_end_frac"],
                "by_winner": l3_soup_lock["structured_by_winner"],
            },
        },
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(compact, indent=2), encoding="utf-8")
    return compact


if __name__ == "__main__":
    path = Path(__file__).resolve().parents[1] / "results" / "bartini_plus.json"
    data = run_all(path)
    print(json.dumps(data["verdicts"], indent=2))
    print("wrote", path)
