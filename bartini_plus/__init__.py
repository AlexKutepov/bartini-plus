"""Стохастическая надстройка над геометрией Бартини 3+3 (Бартини+)."""

from bartini_plus.urn import ClockUrn, effective_time_dimension
from bartini_plus.wave import Wave1D
from bartini_plus.life import Life2D, RULES

__all__ = [
    "ClockUrn",
    "effective_time_dimension",
    "Wave1D",
    "Life2D",
    "RULES",
]
