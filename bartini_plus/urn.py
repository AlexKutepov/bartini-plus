"""Нелинейная урна выбора тикающего часа (П5)."""

from __future__ import annotations

import numpy as np


def effective_time_dimension(p: np.ndarray) -> float:
    """d_T = (sum p)^2 / sum p^2. При sum p = 1 это 1 / ||p||^2."""
    s2 = float(np.dot(p, p))
    if s2 <= 0.0:
        return 0.0
    s = float(np.sum(p))
    return (s * s) / s2


class ClockUrn:
    """Три часа. Вероятность тика p_α ∝ n_α^θ.

    θ = 0: фиксированное равномерное p (контроль L0).
    θ = 1: классическая урна Пойа, сходимость внутрь симплекса.
    θ > 1: запирание на одной вершине почти наверное.
    """

    def __init__(
        self,
        theta: float,
        rng: np.random.Generator,
        n0: float = 1.0,
        n_clocks: int = 3,
    ) -> None:
        self.theta = float(theta)
        self.rng = rng
        self.n = np.full(n_clocks, float(n0), dtype=np.float64)
        self.ticks = np.zeros(n_clocks, dtype=np.int64)
        self.k = 0

    @property
    def p(self) -> np.ndarray:
        if self.theta == 0.0:
            return np.full(self.n.size, 1.0 / self.n.size)
        w = np.power(self.n, self.theta)
        s = float(w.sum())
        if s <= 0.0:
            return np.full(self.n.size, 1.0 / self.n.size)
        return w / s

    def step(self) -> int:
        alpha = int(self.rng.choice(self.n.size, p=self.p))
        self.n[alpha] += 1.0
        self.ticks[alpha] += 1
        self.k += 1
        return alpha

    def locked(self, threshold: float = 0.95) -> bool:
        return bool(self.p.max() >= threshold)

    def winner(self) -> int:
        return int(np.argmax(self.ticks))
