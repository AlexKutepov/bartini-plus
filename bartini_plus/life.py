"""Клеточный автомат Бартини–Life: три правила, одно выбирается на тике."""

from __future__ import annotations

import numpy as np

# (рождение, выживание) по числу соседей Мура
RULES: dict[str, tuple[set[int], set[int]]] = {
    "B3/S23": ({3}, {2, 3}),
    "B36/S23": ({3, 6}, {2, 3}),
    "B3/S234": ({3}, {2, 3, 4}),
}

RULE_ORDER = ("B3/S23", "B36/S23", "B3/S234")


class Life2D:
    def __init__(self, size: int, rng: np.random.Generator) -> None:
        self.size = int(size)
        self.rng = rng
        self.grid = np.zeros((self.size, self.size), dtype=np.uint8)

    def clear(self) -> None:
        self.grid[:] = 0

    def seed_glider(self, y: int = 2, x: int = 2) -> None:
        """Классический глайдер Conway (5 клеток)."""
        self.clear()
        cells = ((0, 1), (1, 2), (2, 0), (2, 1), (2, 2))
        for dy, dx in cells:
            self.grid[(y + dy) % self.size, (x + dx) % self.size] = 1

    def seed_random(self, density: float = 0.12) -> None:
        self.grid = (self.rng.random((self.size, self.size)) < density).astype(np.uint8)

    def neighbors(self) -> np.ndarray:
        g = self.grid
        s = np.zeros_like(g, dtype=np.int16)
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                if dy == 0 and dx == 0:
                    continue
                s += np.roll(np.roll(g, dy, axis=0), dx, axis=1)
        return s

    def step(self, alpha: int) -> None:
        name = RULE_ORDER[alpha]
        birth, survive = RULES[name]
        n = self.neighbors()
        alive = self.grid == 1
        nxt = np.zeros_like(self.grid)
        for b in birth:
            nxt[(~alive) & (n == b)] = 1
        for s in survive:
            nxt[alive & (n == s)] = 1
        self.grid = nxt

    @property
    def population(self) -> int:
        return int(self.grid.sum())

    def structured(self, lo: int = 3, hi: int = 40) -> bool:
        """Глайдер/малая структура: жива и не взорвалась."""
        p = self.population
        return lo <= p <= hi
