# Proofs and reasoning: Bartini and Bartini+

**Hypothesis and verification:** Alexander Kutepov and large language models (LLMs).  
**Recorded:** 31 August 2026.  
**Status:** open research. The physical six-dimensionality of the Universe is not proven. The numerical consequences of Bartini+ have been checked.

This document records the full chain: from R. O. di Bartini’s construction to the stochastic extension and experiments L0–L3.

---

## 0. Subject

Roberto Oros di Bartini (Robert Ludwigovich Bartini) proposed a six-dimensional world: three spatial and three temporal coordinates. Physical quantities were written as \(L^a T^b\).

Standard physics:

\[
(x,y,z,t),\qquad 3+1.
\]

Bartini:

\[
(x,y,z,t_1,t_2,t_3),\qquad 3+3.
\]

The task: separate what follows from Bartini’s mathematics from later readings, then add the missing mechanism that selects observed time, and test it.

---

## 1. Bartini’s historical construction

### 1.1. Dimension matrix

Fundamental categories: \(L\) (length) and \(T\) (time). Quantities are \(L^a T^b\).

\[
v=LT^{-1},\qquad a=LT^{-2}.
\]

Dimensional analysis fixes the class \([Q]\), not dimensionless coefficients (\(\alpha\), \(m_e/m_p\)). The claim “Bartini derived all constants” is unproven until concrete formulae, inputs, and the number of free parameters are shown.

### 1.2. Six dimensions as a product

\[
M_6=M_3^{\mathrm{space}}\times M_3^{\mathrm{time}},
\]

a “(3+3)-dimensional complex manifold”: a spacelike 3-extent orthogonal to a timelike 3-extent.

### 1.3. “Variant worlds” and “speed of time”

Extra time axes are sometimes read as history branches. Coordinates alone do not give the many-worlds interpretation. That interpretation needs a Hilbert space, unitary evolution, decoherence, and a measure. Three axes \(t_\alpha\) are not three fates.

“Speed of time” / “height of time” means a position in the internal time space. Bartini’s known texts do not contain a finished selection law for the axis.

---

## 2. Derivation of the number 6 (reproducible)

### 2.1. Function and integral

A reconstruction of the 1965 paper uses

\[
j(n)=n^n e^{-\pi n^2}
\]

and a quantity linked to the expected transition rate,

\[
m(n)=\int_0^\infty x^n e^{-\pi x^2}\,dx.
\]

\[
\int_0^\infty x^n e^{-a x^2}\,dx=\tfrac12 a^{-(n+1)/2}\,\Gamma\bigl(\tfrac{n+1}{2}\bigr).
\]

For \(a=\pi\):

\[
\boxed{m(n)=\dfrac{\Gamma\bigl(\tfrac{n+1}{2}\bigr)}{2\pi^{(n+1)/2}}.}
\]

### 2.2. Extremum

\[
\frac{d\ln m}{dn}=\tfrac12\psi\bigl(\tfrac{n+1}{2}\bigr)-\tfrac12\ln\pi=0
\implies
\boxed{\psi\bigl(\tfrac{n+1}{2}\bigr)=\ln\pi.}
\]

Numerically:

\[
\frac{n+1}{2}\approx 3.628473202,\qquad n_*\approx 6.256946404.
\]

Bartini’s table has \(n+1=+7.256946404\), the same \(n_*\).

### 2.3. Nearest integer

\[
m(5)\approx 0.03225,\quad m(6)\approx 0.03024,\quad m(7)\approx 0.03080.
\]

\[
\boxed{m(6)<m(5),\quad m(6)<m(7).}
\]

The local integer minimum is \(n=6\).

### 2.4. What this does not prove

1. The function \(j(n)\) and \(a=\pi\) are not derived from physics. Another \(a\) moves the minimum: \(\psi((n+1)/2)=\ln a\).
2. “Extremum of \(m(n)\) ⇒ physical dimension” is an extra postulate.
3. Rounding \(6.2569\to 6\) is an extra assumption.
4. \(n=6\) does not imply \(3+3\). Splits \(5+1\), \(4+2\), \(2+4\) are possible. The split is postulated.

**Conditional theorem.** *For this \(m(n)\) and \(a=\pi\), the nearest integer to the continuous minimum is 6, and it is locally minimal on \(\mathbb{Z}\).*  
**Not a theorem.** *The Universe is six-dimensional.*

---

## 3. Geometry of \(3+3\)

### 3.1. Flat metric

\(X^A=(x^i,q^\alpha)\), \(q^\alpha=ct_\alpha\),

\[
ds^2=dx^2-c^2(dt_1^2+dt_2^2+dt_3^2),\qquad \eta_{AB}=\mathrm{diag}(1,1,1,-1,-1,-1).
\]

Signature \((3,3)\). Mathematically admissible.

### 3.2. Geodesics

Christoffel symbols vanish. Free motion is a straight line. Timelike / null / spacelike according to \(|u|^2-|w|^2\).

### 3.3. Two ways to recover a \(3+1\) observer

**Total time** \(dT=c^{-1}|dq|\) yields an SR-like interval along a trajectory, with \(v_T<c\) for timelike paths. \(T\) is a path length in internal time, not a single clock reading.

**One coordinate** \(t=t_1\) makes hidden motion in \(t_2,t_3\) look superluminal: \(v_{\mathrm{obs}}\ge c\). Ordinary SR requires \(dt_2=dt_3=0\) by hand.

**Conclusion.** \(3+3\) contains \(3+1\) as a slice. It does not explain why that slice is realized.

### 3.4. Momenta and mass

A massless 6-particle satisfies \(|p|^2=|\pi|^2\). Projection onto \(t_1\) gives \(m_{\mathrm{eff}}^2\le 0\) (tachyon sign). Total time \(T\) gives \(E_T=c|p|\) — still no mass. An extra mechanism is required.

### 3.5. Wave equation and Cauchy problem

The \((3,3)\) wave operator is ultrahyperbolic. If hidden frequencies exceed \(c|k|\), the \(t_1\) amplitude grows exponentially. The Cauchy problem in \(t_1\) is ill-posed for arbitrary data. A nonlocal spectral constraint is needed. Bartini’s usual presentation has no such mechanism.

### 3.6. Causality

Three time directions: no canonical before/after. The null set is related to \(S^2\times S^2\). Compact time almost inevitably produces closed timelike curves.

---

## 4. The “choose \(T\) every instant” hypothesis

The idea: at each instant one of \(t_1,t_2,t_3\) is selected and the world becomes \(3+1\).

This is **not a corollary** of the \(3+3\) metric. It is an extra postulate.

- Observed time may be any \(T=n\cdot t\) with \(n\in S^2\). The set of options is a continuum, not three points.
- “Every instant” needs a meta-parameter \(\lambda\), or the selection is timed by the time it is supposed to create.
- A random rule needs a probability, a locus of choice, and observer agreement.
- Ordinary experiments show no jumps in the flow of time; any such mechanism is hidden.

Three readings without the urn:

| | Content | Axis choice |
|---|---|---|
| A | Static 6D block; our world is a slice | none |
| B | Dynamical direction \(n(x)\) | law / observer |
| C | Branching histories | needs a quantum measure |

Bartini is closer to geometric programme A. Instant-by-instant choice is an add-on.

---

## 5. Bartini+ axioms

**P1.** Coordinates \((x_i,t_\alpha)\), metric \(ds^2=dx^2-c^2\sum dt_\alpha^2\).

**P2.** Meta-step \(k=0,1,2,\ldots\). Exactly one clock \(\alpha_k\) ticks: \(t_\alpha\mapsto t_\alpha+\varepsilon\).

**P3.** The field evolves with the ticking clock. In the numerics, a complex mode \(\psi\mapsto\psi\exp(-i c_\alpha k\Delta t)\). Clocks may carry different \(c_\alpha\).

**P4.** Observed time is \(T=\varepsilon k\). Separate \(t_\alpha\) are not observable.

**P5.** \(p_\alpha\propto n_\alpha^\theta\). For \(\theta>1\), a nonlinear Pólya urn (increasing returns).

**P6.** An observer is a structure inside the field / cellular automaton.

This is not historical Bartini.

---

## 6. Analytic consequences

### 6.1. Lock-in \(3+3\to 3+1\)

For \(\theta>1\) the process locks on one vertex almost surely:

\[
p_\alpha(k)\to\delta_{\alpha,\alpha^*}.
\]

The winner is random given a symmetric start. The condition \(t_2=t_3=\mathrm{const}\) appears dynamically. Different runs lock on different axes: a tree of worlds as ensemble statistics.

\(\theta=0\): uniform \(p\), no lock. \(\theta=1\): classical Pólya, convergence into the simplex interior.

### 6.2. Decay in the mixed phase

Independent ticks give

\[
\boxed{\Gamma=-\frac1{\Delta t}\ln\bigl|\langle e^{-i c_\alpha k\Delta t}\rangle\bigr|}\approx\tfrac12\mathrm{Var}(c)\,k^2\Delta t.
\]

The earlier estimate \(\Gamma=\mathrm{Var}(c)\,k^2\Delta t\) is wrong by a factor \(1/2\).

Energy of a single second-order wave realization **grows** when \(c\) jumps (parametric pumping). The measure \(\langle|A|\rangle\) is the wrong one. The correct measure is \(|\langle\psi\rangle|\).

### 6.3. After lock-in

\(\Gamma\to 0\). Lorentz invariance is restored dynamically. Residual foreign ticks scale as \(k^{-(\theta-1)}\).

### 6.4. Effective time dimension

\[
d_T=\frac{(\sum p_\alpha)^2}{\sum p_\alpha^2}\in[1,3],
\]

a \(3\to 1\) transition visible in simulation.

---

## 7. Numerical experiments

Code: `bartini_plus/experiments.mjs`.  
Data: `results/bartini_plus.json`.  
Run: `node bartini_plus/experiments.mjs`.

Clocks \(c=(0.18,0.40,0.62)\), \(\Delta t=0.4\), mode lattice \(N=128\).

### L0. Control \(\theta=0\)

64 runs, modes \(2,4,6,8,10\). \(\Gamma>0\); \(\Gamma\) grows with \(k^2\); \(\beta_{\mathrm{fit}}/\beta_{\mathrm{th}}-1=-2.9\%\).

### L1. Urn

| \(\theta\) | \(n_0\) | lock | median lock | final \(d_T\) | winners |
|---|---|---|---|---|---|
| 0 | 1 | 0 | — | 3 | — |
| 1 | 1 | 0 | — | 2.12 | — |
| 2 | 25 | 0.938 | 1397 | 1.034 | 24 / 26 / 30 |
| 2 | 1 | 1 | 9 | 1.000 | 31 / 23 / 36 |

With \(n_0=1\), \(\theta=2\) the mixed phase is almost absent.

### L2. Noise before and after lock

\(\theta=2\), \(n_0=25\), 64 runs, median lock 1475. \(\Gamma\) after lock is much smaller than before.

### L3. Bartini–Life

Grid \(48\times 48\). Rules B3/S23, B36/S23, B3/S234. Seed: Conway glider. “Structured”: 3–40 live cells.

| regime | structured fraction at end |
|---|---|
| \(\theta=0\), mixed | \(4.2\%\) |
| \(\theta=2.5\), lock | \(47\%\) |
| lock, winner B3/S23 | \(75\%\) |
| lock, winner B36/S23 | \(85\%\) |
| lock, winner B3/S234 | \(0\%\) |
| random soup, mixed | \(0\%\) |
| random soup, lock | \(4\%\) |

Mixing destroys the glider. Lock preserves it only if the winning rule supports gliders. B3/S234 explodes the population. Inside the model, observers are possible after lock and only in worlds whose winning clock is “life-supporting”.

**Toy-theory success criterion:** 10/10 pre-registered verdicts.

---

## 8. Statement table

| Claim | Mathematics | Nature |
|---|---|---|
| Minimum of this \(m(n)\) near 6 | yes | depends on the function |
| A \((3,3)\) metric exists | yes | not shown to be nature |
| A \(3+1\) slice is possible | yes, with constraints | constraints are extra |
| Hidden times produce mass | no, wrong sign | needs a mechanism |
| Cauchy problem for arbitrary data | no | no |
| Bartini proved a 6D Universe | no | no |
| \(\theta>1\) urn locks one time | yes (theory + L1) | model |
| \(\Gamma\approx\frac12\mathrm{Var}(c)k^2\Delta t\) | yes (L0) | model |
| Life stable only after lock + life-rule | yes (L3) | model |

---

## 9. Direct answer on “choice every instant”

No. In Bartini+, after lock-in, one clock ticks. Random axis selection is a property of the **early mixed phase** and of **different realizations**, not of each tick of an already locked world. If the model is right, foreign ticks now are rare and decay as a power of \(k\).

---

## 10. Open items

Field equations are not derived from a variational principle. Ghost-free quantization is not built. Mass and dimensionless constants are not obtained. Experimental Lorentz-violation bounds have not been mapped onto \((\Delta c)^2\varepsilon\) in this code version.
