# Closing the gaps: theorems and one prohibition

**Authors:** Alexander Kutepov and LLMs.  
**Run:** `node bartini_plus/close_gaps.mjs` → `results/close_gaps.json`; T8–T9: `node bartini_plus/aether_bounds.mjs` → `results/aether_bounds.json`.

**T1.** If $n=6$ comes from maximizing direction measure, the same functional on $p+q=6$ uniquely selects $(3,3)$ and forbids $(4,2)$ inside this chain.

**T2.** Frobenius $n\wedge dn=0$ in $T^3$ gives $n=d\tau/|d\tau|$. Time reparameterization gauges $\tau$. Physical Goldstones: 0. A mass $m_n$ is unnecessary.

**T3 (no-go).** A Fourier mode along a hidden *time* yields $m^2<0$. Positive $m^2$ flips that direction to space. Particle mass is not a theorem of $3+3$. Import Higgs on the slice.

**T4.** If $\mathcal L=\mathcal L(n\cdot\partial_t\phi,\nabla\phi)$, shifts $\phi\mapsto\phi+\varepsilon(q_\perp)$ are symmetries. $\phi=\phi(x,T)$ is gauge fixing.

**T5.** $g_{\mathrm{phys}}$ has eigenvalues $(1,1,1,-1,0,0)$: rank 4, signature $(3,1)$, kernel 2. Compactifying the kernel makes no CTC in $g_{\mathrm{phys}}$.

**T6.** Projected $H=\tfrac12\pi^2+\tfrac12 c^2k^2>0$. The unprojected Klein–Gordon product is indefinite. After reduction there are no extra-time ghosts.

**T7.** After T2–T6 the slice is GR (plus at most a khronon). No live number distinct from GR remains. M3: physical $d_s=4$; UV-six belongs to the unreduced operator, which the chain forbids to quantise. The CDT tension is not a prediction of the slice.

**T8 (testability by relaxing T2).** Drop Frobenius and give the time axis a stiffness $f^2=E_{\mathrm{lock}}^2$. On the slice $u^\mu$ becomes a dynamical unit timelike vector: Einstein-aether (Jacobson–Mattingly). The 6D Dirichlet energy with $\partial_\perp=0$ (T4) maps to $c_1=(E_{\mathrm{lock}}/M_{\mathrm{Pl}})^2\equiv\varepsilon$, $c_2=c_3=c_4=0$; no free coefficients for cancellations. Then $s_2^2=1/(1-\varepsilon)$ and GW170817 ($c_{\mathrm{gw}}/c-1<7\cdot10^{-16}$) gives


$$
\varepsilon\le1.6\cdot10^{-15}\iff E_{\mathrm{lock}}\le 9.7\cdot10^{10}\ \mathrm{GeV}.
$$



$E_{\mathrm{lock}}=M_{\mathrm{Pl}}$: $c_{13}=1$, spin-2 kinetic term flips sign — dead. $10^{16}$ GeV: killed by GW170817 and $\alpha_2$. $\le5\cdot10^{10}$ GeV: passes GW170817, gravitational Cherenkov (all $s_i^2\ge1$), pulsar $|\alpha_1|<4\cdot10^{-5}$, $|\alpha_2|<1.6\cdot10^{-9}$, BBN $|G_{\mathrm{cosmo}}/G_N-1|<0.13$, ghost-freedom. Generic Einstein-aether at $\varepsilon=O(1)$ survives only on a sliver ($c_{13}=0$ to $7\cdot10^{-16}$, $c_{14}/c_1\approx3\cdot10^{-9}$, $c_2\sim10^{-4}$); the Bartini+ map cannot reach it. None of the 80 sign patterns $\{-1,0,1\}\varepsilon$ survives $\varepsilon\ge1$. Correction to T2: with $f\ne0$ the khronon is physical even under Frobenius (khronometric gravity, $\beta=c_{13}=\varepsilon$), same GW bound; T2 is exact only at $f=0$. **Result:** Bartini+ with Dirichlet stiffness is falsifiable and already bounded: $E_{\mathrm{lock}}\lesssim10^{11}$ GeV, or $f=0$ and the theory is GR (T7). The Planck scale is excluded. A live number, negative.

**T9.** Dropping $\partial_\perp=0$ in space as well, $\pi_2(S^2)=\mathbb Z$ gives global monopoles of $n$ with solid-angle deficit $8\pi G\eta^2$. Planck defect bounds $G\eta^2\lesssim10^{-6}$ give $\eta\lesssim1.2\cdot10^{16}$ GeV — five orders weaker than T8. In the Frobenius sector there are no hedgehogs; T9 adds nothing beyond T8.

The measure principle is still not a law of nature. Bartini is not a fact about the Universe. What is proved is a consistent reduction $3+3\to 3+1$ without an urn, without time-KK tachyons, without physical-metric CTCs, and without Goldstones if time is a single gradient with zero stiffness; with nonzero stiffness the lock scale is bounded above by GW170817.
