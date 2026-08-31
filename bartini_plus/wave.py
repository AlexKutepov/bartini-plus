"""1D волна с тикающим часом: π → π + ε c_α² ∇²φ, φ → φ + ε π."""

from __future__ import annotations

import numpy as np


class Wave1D:
    def __init__(
        self,
        n: int,
        dx: float,
        dt: float,
        c: tuple[float, float, float],
    ) -> None:
        self.n = int(n)
        self.dx = float(dx)
        self.dt = float(dt)
        self.c = np.asarray(c, dtype=np.float64)
        self.phi = np.zeros(self.n, dtype=np.float64)
        self.pi = np.zeros(self.n, dtype=np.float64)
        cfl = float(self.c.max() * self.dt / self.dx)
        if cfl >= 1.0:
            raise ValueError(f"CFL={cfl:.3f} >= 1, схема неустойчива")

    def seed_mode(self, mode: int, amplitude: float = 1.0) -> None:
        x = np.arange(self.n, dtype=np.float64)
        self.phi = amplitude * np.sin(2.0 * np.pi * mode * x / self.n)
        self.pi[:] = 0.0

    def laplacian(self) -> np.ndarray:
        return (np.roll(self.phi, -1) - 2.0 * self.phi + np.roll(self.phi, 1)) / (
            self.dx * self.dx
        )

    def step(self, alpha: int) -> None:
        c2 = self.c[alpha] * self.c[alpha]
        self.pi = self.pi + self.dt * c2 * self.laplacian()
        self.phi = self.phi + self.dt * self.pi

    def mode_amp(self, mode: int, c_ref: float) -> float:
        """Огибающая моды: A² = |φ̂|² + |π̂|² / ω², ω = c_ref k."""
        ph = np.fft.rfft(self.phi)
        pn = np.fft.rfft(self.pi)
        k = 2.0 * np.pi * mode / (self.n * self.dx)
        omega2 = (c_ref * k) ** 2
        if omega2 <= 0.0:
            return float(np.abs(ph[mode]))
        return float(np.sqrt(np.abs(ph[mode]) ** 2 + np.abs(pn[mode]) ** 2 / omega2))
