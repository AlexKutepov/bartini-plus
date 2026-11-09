# Note for researchers

**Project:** Bartini+ — reconstruction of R. O. di Bartini’s $3+3$ programme, a stochastic extension, a field reduction, discrete temporal branching at bifurcation points, and an explicit registry of theorems, no-go results, and errors uncovered in the primary and secondary sources.  
**Authors:** Alexander Kutepov ([@AlexKutepov](https://github.com/AlexKutepov)) and large language models in a 2026 Cursor / Antigravity research chain. Kutepov posed the hypothesis and is responsible for the publication. The LLMs produced the reconstructions, proofs, and code jointly with him.  
**Repo:** https://github.com/AlexKutepov/bartini-plus  
**Licence:** MIT  
**Cite:** `CITATION.cff`

This note is the map. The proofs are in the files listed at the end. Read this first if you intend to reuse, refute, or continue the work.

---

## Registry of Uncovered Errors in Bartini (1965) and Secondary Literature

To prevent researchers from wasting time reproducing historical artifacts, we record four strictly verified findings (full derivations and code in [DEEP_RESEARCH.md](DEEP_RESEARCH.md) and `bartini_plus/deep_research.mjs`):

1. **Manual tuning of $E$ to fit 1965 $\alpha^{-1}$ ($71\,373\,\sigma$ discrepancy against CODATA-2022).**
   - In Table 2 of Bartini’s paper (*Doklady Akademii Nauk SSSR*, 1965, Vol. 163, No. 4, pp. 861–864), the positive global maximum of the unit-sphere surface function $S_{n+1}(z) = 2\pi^z/\Gamma(z)$ at $n_+ = +6.2569464$ ($+S_{\max} = +33.161194485$) is divided by the negative extremum on the mirror branch $k=3$ at $n_{-3} = -5.9912841 \approx -6$ ($-S_{\min} = -0.1209542108$).
   - Their **exact analytical ratio** is $\bar{E} = S_{\max}/\lvert S_{\min}\rvert = 274.16320829$, which gives $\bar{E}/2 = 137.0816041$ — missing $\alpha^{-1}$ by $+3.33\cdot 10^{-4}$.
   - To match the mid-1960s experimental value ($\alpha^{-1}_{1965} \approx 137.0375$), Bartini manually replaced $\bar{E}$ with the shifted constant $E = 274.074996 \approx \frac{1}{4}e^{6.9996968}$ ($E/2 = 137.037498$). Modern CODATA-2022 ($\alpha^{-1} = 137.035999177(21)$) **excludes this value at $71\,373\,\sigma$**.
2. **Look-elsewhere artifact in the constant table.**
   - Bartini’s multiplicative basis $2^a 3^b 5^e \pi^{c/2} E^d$ with small integer exponents generates $7\,761$ grid points in $[100, 2000]$ with a median spacing of **$1.10\cdot 10^{-4}$**. A uniform random number lands within $\le 3.33\cdot 10^{-4}$ of a grid point with **$76.0\%$ probability**.
3. **Gross OCR corruption in secondary reprints ($B = 2885.3453$).**
   - Secondary online reprints (`trinitas.ru`, `krasnostup.com`, etc.) write the formula for $B = 2885.3453$ as $\sqrt{6}\cdot E/\pi$ ($= 213.69$) or $\sqrt{6E}/\pi$ ($= 12.91$). In reality, Bartini’s formula contains the 6-torus volume $V_6 = \frac{16\pi^3}{15} \approx 33.07336$:
     $$B = \frac{V_6\,E}{\pi} = \frac{16\pi^2}{15}\,E = 2885.3459,$$
     where the italic symbol $V_6$ was corrupted into a square root $\sqrt{6}$ during optical character recognition.
4. **Impossibility of simultaneously dynamical 3D time in a continuous 6D bulk (`T3`, `T10`).**
   - Bartini (1965) postulated the $3+3$ split without a dynamical reduction mechanism $3+3 \to 3+1$. In an open 6D bulk, hidden-time momentum gives tachyonic mass $m^2 < 0$ (`T3`), and in the 6D Dirichlet action on $H^{3,2}$ spacetime boosts $u^i$ and internal temporal rotations $\hat{n}^\alpha \in S^2$ have **opposite kinetic signs** (`No-Go T10`). Continuous bulk multi-time dynamics produces ghosts; consistency requires either a gauge-frozen $(3,1)$ slice or **piecewise-Frobenius temporal branching at discrete bifurcation hypersurfaces (`B1–B5`)**.

---

## What we did, in order

1. Reconstructed $m(n)=\Gamma(\frac{n+1}{2})/(2\pi^{(n+1)/2})$ and solved $\psi(\frac{n+1}{2})=\ln\pi$: $n_*=6.25694641$, integer local minimum $n=6$.
2. Classified flat $(3,3)$ geodesics and proved that a $3+1$ observer is a slice, not an automatic corollary.
3. Formulated Bartini+ axioms ($\theta>1$ lock-in, $d_T:3\to 1$, coherent decay $\Gamma\approx\frac12\mathrm{Var}(c)\,k^2\Delta t$) and verified **L0–L3** (`experiments.mjs`).
4. Stress-tested **P5** (`p5_stress.mjs`): Rubin boundary $\theta_c=1$, mean-field critical scaling $\ln\tau_{\rm lock}\sim C/(\theta-1)$, and breakdown under persistent exploration noise.
5. Proved $m(n)=1/\mathrm{Area}(S^n)$, Fourier self-duality of $e^{-\pi x^2}$, and maximal null-cone volume at $(3,3)$ (`four_steps.mjs`).
6. Closed **T1–T7** (`close_gaps.mjs`) and **T8–T9** (`aether_bounds.mjs`): GW170817 bounds $E_{\mathrm{lock}}\le9.7\cdot10^{10}$ GeV.
7. Proved **M1–M3** (`math_tighten.mjs`): maxent + unitary Fourier fixes $a=\pi$; physical spectral dimension on the slice is $d_s=4$.
8. Proved **R1–R4 / M4–M5 / P5+ / H1** (`deep_research.mjs`): exact $H^{3,2}$ bundle identity, opposite-sign kinetic theorem (`No-Go T10`), symmetry-protected $c_{13}=0$ with pulsar bound $E_{\mathrm{lock}}\le 6.26\cdot 10^{14}$ GeV, fast-logit-noise eigenvalue $\lambda_{\mathrm{eff}}=\theta\chi(\sigma)-1$, 2D coupled lattice global consensus, and 10-digit audit of Bartini (1965).
9. Proved **B1–B5** (`branching_time.mjs`): piecewise-Frobenius sheet splitting in $\mathbb{R}^{3,3}$ without interior ghosts (`B1`), Thom transversality showing $q_{\min}=3$ time dimensions are required for collision-free branching trees ($94.5\%$ collision rate in 2D time vs $0\%$ in 3D time, `B2`), two-time saddle duality $d_T=2\to 1$ at decision nodes (`B3`), $S^2$ geodesic switch instanton and Gaussian decoherence $\tau_{\mathrm{decoh}}=\ell_t/\sin(\vartheta_{12}/2)$ (`B4`), and exact tree unitarity (`B5`).

---

## How to reproduce

Requires Node.js.

```bash
node bartini_plus/experiments.mjs   # L0–L3 → results/bartini_plus.json
node bartini_plus/four_steps.mjs    # measure, (3,3), n-field → results/four_steps.json
node bartini_plus/close_gaps.mjs    # T3, T5, T6 numerics → results/close_gaps.json
node bartini_plus/p5_stress.mjs     # P5 monopoly, critical time, noise → results/p5_stress.json
node bartini_plus/aether_bounds.mjs # T8–T9 Einstein-aether / defect bounds → results/aether_bounds.json
node bartini_plus/n_times.mjs       # N clocks / cone volumes → results/n_times.json
node bartini_plus/math_tighten.mjs  # M1–M3 measure / aether embed / d_s → results/math_tighten.json
node bartini_plus/deep_research.mjs # R1–R4 (M4–M5, P5+, H1) → results/deep_research.json
node bartini_plus/branching_time.mjs # B1–B5 branching time & duality → results/branching_time.json
```

---

## File map

| File | Content |
|---|---|
| [PROOF](PROOF.md) | Full chain from Bartini to Bartini+ and L0–L3 |
| [P5_STRESS](P5_STRESS.md) | P5 monopoly theorem, critical lock time, noise robustness |
| [FOUR_STEPS](FOUR_STEPS.md) | Measure, signature, field $n$, Einstein / no-go |
| [CLOSE_GAPS](CLOSE_GAPS.md) | T1–T9 |
| [MATH_TIGHTEN](MATH_TIGHTEN.md) | M1–M3 |
| [DEEP_RESEARCH](DEEP_RESEARCH.md) | R1–R4: $H^{3,2}$ bundle (`M4/T10`), symmetry $c_{13}=0$ (`M5`), fast noise & coupled lattice (`P5+`), 1965 paper audit (`H1`) |
| [BRANCHING_TIME](BRANCHING_TIME.md) | B1–B5: many-worlds branching, decision-point time duality, Thom transversality ($q_{\min}=3$), branch decoherence |
| `bartini_plus/*.mjs` | Simulation and proof runners |
| `results/*.json` | Raw numbers |

Russian and Chinese translations sit in `docs/ru/` and `docs/zh/` with the same names.
