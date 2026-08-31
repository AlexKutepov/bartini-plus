# Note for researchers

**Project:** Bartini+ — reconstruction of R. O. di Bartini’s \(3+3\) programme, a stochastic extension, a field reduction, and an explicit list of theorems and no-go results.  
**Authors:** Alexander Kutepov ([@AlexKutepov](https://github.com/AlexKutepov)) and large language models in a 2026 Cursor research chain. Kutepov posed the hypothesis and is responsible for the publication. The LLMs produced the reconstructions, proofs, and code jointly with him.  
**Repo:** https://github.com/AlexKutepov/bartini-plus  
**Licence:** MIT  
**Cite:** `CITATION.cff`

This note is the map. The proofs are in the files listed at the end. Read this first if you intend to reuse, refute, or continue the work.

---

## What this is

An open, reproducible attempt to separate four layers that are usually mixed in popular accounts of Bartini:

1. **Historical Bartini** — dimension tables \(L^a T^b\), a 1965-style integral whose minimum sits near \(n=6\), and a postulated split \(M_6=M_3^{\mathrm{space}}\times M_3^{\mathrm{time}}\).
2. **Geometry of signature \((3,3)\)** — the flat metric \(\eta=\mathrm{diag}(1,1,1,-1,-1,-1)\), geodesics, projections onto a single time, ultrahyperbolic waves, Cauchy problem, mass sign.
3. **Bartini+** — a *new* stochastic mechanism (nonlinear Pólya urn) that selects one ticking clock. This is not in Bartini’s texts.
4. **Reduction without the urn** — a unit field \(n\in S^2\) in the time 3-plane, then Frobenius + a degenerate physical metric of rank 4.

The chain that closes *mathematically* is:

\[
\text{Fourier-self-dual Gaussian}\to n=6\to\max(\text{null-cone volume})\to(3,3)\to n\text{-field / khronon}\to\text{Einstein on the slice}.
\]

The chain does **not** enter nature until the measure principle is a law and a distinctive, still-living prediction exists. We do not claim that it does.

---

## What we did, in order

1. Reconstructed the integral \(m(n)=\Gamma(\frac{n+1}{2})/(2\pi^{(n+1)/2})\) and solved \(\psi(\frac{n+1}{2})=\ln\pi\). Result: \(n_*=6.25694641\), integer local minimum \(n=6\).
2. Wrote the flat \((3,3)\) metric, classified geodesics, and showed that a \(3+1\) observer is a *slice*, not a corollary. Hidden times give \(v_{\mathrm{obs}}\ge c\) if one coordinate is used as time, \(m_{\mathrm{eff}}^2\le 0\) in the 6-momentum projection, and an ill-posed Cauchy problem for the ultrahyperbolic wave operator.
3. Stated Bartini+ axioms (meta-step, one clock per tick, \(p\propto n^\theta\)). Derived lock-in for \(\theta>1\), \(d_T:3\to 1\), and coherent decay \(\Gamma=-\Delta t^{-1}\ln|\langle e^{-ic_\alpha k\Delta t}\rangle|\approx\frac12\mathrm{Var}(c)\,k^2\Delta t\). The factor \(\frac12\) corrects an earlier Kubo estimate.
4. Ran numerical tests **L0–L3** (`bartini_plus/experiments.mjs`). All ten pre-registered verdicts passed. Wave *energy* with switching \(c\) pumps (parametric); the correct observable is \(|\langle\psi\rangle|\).
5. Replaced the ad hoc \(e^{-\pi x^2}\) by Fourier self-duality and by the identity \(m(n)=1/\mathrm{Area}(S^n)\) (**four steps**). Other widths \(a\neq\pi\) do not give six. Among splits of 6, \((3,3)\) uniquely maximizes the real null-cone volume; \(\mathrm{Vol}_{3+3}/\mathrm{Vol}_{2+4}=4/\pi\).
6. Replaced the urn by Dirichlet energy of \(n:M\to S^2\) and harmonic-map heat flow. Random data lock when topology allows (\(T^2\): \(12/12\); \(S^1\): \(11/12\)).
7. Closed the remaining holes (**T1–T7**, `close_gaps.mjs`): Goldstones are gauge under Frobenius; hidden-time KK mass is a no-go; \(\partial_\perp=0\) is gauge; \(g_{\mathrm{phys}}\) has spectrum \((1,1,1,-1,0,0)\); projected \(H>0\). No live number distinct from GR remains.

---

## What we proved

| Claim | Status | Where |
|---|---|---|
| \(m(n)=1/\mathrm{Area}(S^n)\) | identity, error \(<10^{-15}\) | four_steps, FOUR_STEPS |
| \(e^{-\pi x^2}=\mathcal F[e^{-\pi x^2}]\) | \(L^2\) error \(1.93\times10^{-15}\) | four_steps |
| \(n_*=6.25694641\), integer min at 6 | theorem for this \(m\) | PROOF, four_steps |
| Other \(a\) move \(n_*\) off 6 | computed | four_steps |
| \((3,3)\) maximizes null volume among \(p+q=6\) | theorem, \(4/\pi\) | FOUR_STEPS |
| \((3,3)\) metric exists; \(3+1\) is a slice | geometry | PROOF |
| Extra times do not give \(3+1\) automatically | no-go list | PROOF §§3–4 |
| Urn \(\theta>1\) locks one clock | theory + L1 | experiments |
| \(\Gamma\) matches \(\frac12\mathrm{Var}(c)k^2\Delta t\) to \(2.9\%\) | L0 | experiments |
| Life-like CA structures survive only after lock + life-rule | L3 | experiments |
| **T1** \((4,2)\) forbidden *inside the same chain* | consistency | CLOSE_GAPS |
| **T2** Frobenius + diffs \(\Rightarrow\) 0 physical Goldstones | DoF count | CLOSE_GAPS |
| **T3** \(m^2>0\) from hidden *time* is impossible | sign table | close_gaps.json |
| **T4** \(\partial_\perp=0\) is gauge fixing | symmetry | CLOSE_GAPS |
| **T5** \(g_{\mathrm{phys}}\) rank 4, signature \((3,1)\), no CTC in it | eigenvalues \((1,1,1,-1,0,0)\) | close_gaps |
| **T6** projected Hamiltonian bounded below; no extra-time ghosts | \(H>0\) | close_gaps |
| **T7** a still-living number \(\neq\) GR | **not obtained** | CLOSE_GAPS |

---

## What we did not prove (do not cite us as if we did)

- That the physical Universe is six-dimensional.
- That Bartini derived \(\alpha\), \(G\), \(\hbar\), or mass ratios from dimensions. Dimensional analysis does not fix dimensionless numbers.
- That one of \(t_1,t_2,t_3\) is chosen at random at every instant of the locked world. After lock, one clock ticks; branching is ensemble statistics, not a per-tick lottery.
- That Fourier self-duality / maximal direction measure is a law of nature. It is a *named* principle. If you drop it, \(n=6\) and \((3,3)\) fall together.
- That particle masses come from extra times. **T3 forbids that.** Mass on the slice must be imported (e.g. Higgs).
- A new laboratory number that GR/SR/QFT do not already cover and that current Lorentz tests have not already killed.

After T2–T6 the slice is ordinary \(3+1\) GR (at most a khronon before gauge fixing). That is the cost of a consistent reduction.

---

## What is ours and what is Bartini’s

| Item | Bartini (historical) | This repo |
|---|---|---|
| \(L,T\) dimension matrix | yes | reconstructed, limits stated |
| Integral / \(n\approx 6\) | yes (1965 line, OCR-sensitive) | reproduced exactly |
| Split \(3+3\) | postulated | derived *if* the measure principle is kept |
| Stochastic clock / urn | no | Bartini+, then retired |
| Field \(n\), Frobenius, \(g_{\mathrm{phys}}\) | no | 2026 |
| “Many-worlds every tick” | later folklore | rejected |

Treat popular claims that “Bartini computed all constants” as unverified until a primary formula, its inputs, and its number of free parameters are shown. We did not find such a derivation in the material we used.

---

## How to reproduce

Requires Node.js (no Python required for the published runs).

```bash
node bartini_plus/experiments.mjs   # L0–L3 → results/bartini_plus.json
node bartini_plus/four_steps.mjs    # measure, (3,3), n-field → results/four_steps.json
node bartini_plus/close_gaps.mjs    # T3, T5, T6 numerics → results/close_gaps.json
```

Seeds are fixed in the scripts. Verdict objects are boolean and are printed on stdout. If you change \(c_\alpha\), \(\theta\), or the Fourier convention, \(n_*\) and \(\Gamma\) *must* move; that is a feature of the claims, not a bug.

Python files under `bartini_plus/*.py` are a parallel write-up of the urn, wave, and Life rules. They were not the production runner (Python was missing in the original environment).

---

## If you continue this

The only openings that still change the scientific status:

1. **Derive the measure principle** from something already accepted (modular invariance of scale, maxent + unitary Fourier as a symmetry), not from a taste for \(\pi\).
2. **A live prediction** that survives Lorentz bounds \(\sim 10^{-15}\) and is not inflated away. UV spectral dimension \(\approx 6\) versus CDT \(\approx 2\) is tension, not confirmation, unless those calculations are wrong or measure a different \(n\).
3. **Primary Bartini sources.** Several formulae circulate as late typescripts. A mismatch in the exponent of the Gaussian or in the definition of \(m(n)\) kills the numerical coincidence with \(n_*\).

Do not “improve” the theory by giving hidden times a space-like kinetic sign in order to get \(m^2>0\). That is T3: they are then not times.

---

## File map

| File | Content |
|---|---|
| [PROOF](PROOF.md) | Full chain from Bartini to Bartini+ and L0–L3 |
| [FOUR_STEPS](FOUR_STEPS.md) | Measure, signature, field \(n\), Einstein / no-go |
| [CLOSE_GAPS](CLOSE_GAPS.md) | T1–T7 |
| `bartini_plus/experiments.mjs` | L0–L3 |
| `bartini_plus/four_steps.mjs` | Sphere volumes, heat flow |
| `bartini_plus/close_gaps.mjs` | Mass signs, \(g_{\mathrm{phys}}\) spectrum, \(H\) |
| `results/*.json` | Raw numbers |

Russian and Chinese translations sit in `docs/ru/` and `docs/zh/` with the same names.
