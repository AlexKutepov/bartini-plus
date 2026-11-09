# Many-Worlds Temporal Branching and Time Duality at Bifurcation Points (B1–B5)

Reproducible verification script: `node bartini_plus/branching_time.mjs` $\to$ `results/branching_time.json` (**5/5** checks `true`).

---

## Problem Statement

Theorems `T3` and `No-Go T10` prove that all three times $(t_1, t_2, t_3)$ **cannot be simultaneously dynamical across a continuous 6D bulk**: continuous excitation of transverse times in the bulk yields a tachyonic mass sign ($m^2 < 0$, `T3`), an ill-posed Cauchy problem, and opposite kinetic signs between spacetime boosts $u^i$ and internal temporal angles $\hat{n}^\alpha \in S^2$ (`T10`).

However, a natural question arises at the intersection of Everett's Many-Worlds Interpretation (1957) and Belnap's Branching Spacetimes (1992):
> **What if continuous evolution is strictly 1-temporal ($\hat{\mathbf{n}}(\tau) = \text{const}$, $d_T = 1$) inside every branch, while temporal duality ($d_T = 2$) is activated only at discrete decision/bifurcation moments ($\tau = \tau_*$), where a 4D spacetime sheet splits in $\mathbb{R}^3_{\text{time}}$ into separate temporal world-lines?**

We prove below that this construction **completely evades the `T3`, `T8`, `T10`, and `M5` no-go bounds on the interior of every branch**, and provides a striking topological explanation for **why a collision-free tree of branching timelines requires at least $q_{\min} = 3$ time dimensions (Bartini's $3+3$ signature)**.

---

## Summary of Theorems B1–B5

| Theorem | Mathematical Content | Numerical Verdict (`branching_time.json`) |
|---|---|---|
| **B1 (Piecewise-Frobenius)** | When $\hat{\mathbf{n}}(\tau)$ is piecewise-constant and changes only across a 3D branching hypersurface $\Sigma_* = \mathbb{R}^3_{\text{space}}\times\{\mathbf{t}_*\}$, the two outgoing 4D sheets $\mathcal{M}_1^+(\hat{\mathbf{n}}_1)$ and $\mathcal{M}_2^+(\hat{\mathbf{n}}_2)$ are disjoint for all $\tau > 0$ ($\mathcal{M}_1^+\cap\mathcal{M}_2^+ = \emptyset$). Inside each branch $\partial_\mu\hat{\mathbf{n}}_a \equiv 0 \implies$ `T10` ghost kinetic energy is zero, $c_{\text{gw}} = c$, $\alpha_1 = \alpha_2 = 0$ | $\mathcal{M}_1^+\cap\mathcal{M}_2^+ = \emptyset$ for $\tau > 0$; $E_{\text{ghost}} = 0$; $c_{\text{gw}}/c = 1$ |
| **B2 (Thom Transversality, $q_{\min}=3$)** | Two 1D branch timelines $\gamma_a(\tau) \subset \mathbb{R}^q_{\text{time}}$ are generically disjoint if and only if $\dim\gamma_a + \dim\gamma_b < q \iff 1 + 1 < q \iff q \ge 3$. In $\mathbb{R}^2_{\text{time}}$ ($3+2$), branches generically collide after secondary splits; in $\mathbb{R}^3_{\text{time}}$ ($3+3$), skew rays never intersect | Branch collision rate in 2D time: **$94.5\%$**; in 3D time: **$0.0\%$** ($200$ trees) |
| **B3 (Pólya–Kramers Duality Saddle)** | On the simplex edge $n_1 = n_2 \gg n_3$ at a decision node, the local temporal dimension is $d_T(\tau_*) = 2$ (two-time duality). Longitudinal drift vanishes while the transverse eigenvalue is $\lambda_\perp = \theta - 1 > 0$: a micro-fluctuation splits the ensemble $50/50$ into two locked $d_T^{\text{single}} \to 1$ branches while preserving $d_T^{\text{ensemble}} = 2$ | $d_T(\tau_*) = 2.0001 \to \langle d_T^{\text{single}}\rangle = 1.0264$; two-world ensemble $d_T^{\text{ens}} = 2.0000$ |
| **B4 (Switch Instanton & Decoherence)** | The minimum-action rotation by angle $\vartheta_{12}$ over duration $\ell_t$ in decision volume $V_{\text{dec}}$ is the $S^2$ great-circle geodesic $I_{\text{switch}} = \frac{\kappa V_{\text{dec}}}{2\ell_t}\vartheta_{12}^2$. For $\tau > 0$, inter-branch wave-packet overlap decays as $\mathcal{D}_{12}(\tau) = \exp(-\tau^2\sin^2(\vartheta_{12}/2)/\ell_t^2)$ | $\tau_{\text{decoh}}/\ell_t = \sqrt{2} \approx 1.4142$; at $\tau = 6\ell_t$, overlap is $1.52\cdot 10^{-8}$ |
| **B5 (Tree Unitarity)** | Splitting a wave packet $\Psi_0(x)$ across $\Sigma_*$ with weights $w_a = n_a^\theta/\sum_\beta n_\beta^\theta$ conserves total norm $\sum_a \lVert\Psi_a(\tau)\rVert_{L^2}^2 = 1$ exactly, with strictly hyperbolic positive-energy evolution on each branch | Total norm conservation error $2.22\cdot 10^{-16}$; $H_1, H_2 > 0$ |

---

## B1. Piecewise-Frobenius Sheet Splitting in $\mathbb{R}^{3,3}$

In standard $(3,1)$ spacetime there is only a single time coordinate, so Everett branches live only in abstract Hilbert space rather than as geometrically separated submanifolds.

In $\mathbb{R}^{3,3}$, each $(3,1)$ sheet with fixed temporal direction $\hat{\mathbf{n}}_a \in S^2 \subset \mathbb{R}^3_{\text{time}}$ is a 4-dimensional submanifold of **codimension 2**:
$$\mathcal{M}_a^+ = \bigl\{(x,\, \mathbf{t}_* + \tau\hat{\mathbf{n}}_a) \;\big|\; x \in \mathbb{R}^3_{\text{space}},\; \tau \ge 0\bigr\} \subset \mathbb{R}^{3,3}.$$
When an incoming sheet $\mathcal{M}_0^-$ bifurcates at the 3D Cauchy hypersurface $\Sigma_* = \mathbb{R}^3_{\text{space}} \times \{\mathbf{t}_*\}$ ($\tau = 0$) into two sheets $\mathcal{M}_1^+(\hat{\mathbf{n}}_1)$ and $\mathcal{M}_2^+(\hat{\mathbf{n}}_2)$ with $\hat{\mathbf{n}}_1 \neq \hat{\mathbf{n}}_2$:
1. **Geometric separation for $\tau > 0$:**
   $$\mathcal{M}_1^+ \cap \mathcal{M}_2^+ = \Sigma_* \quad (\text{at }\tau = 0), \qquad \mathcal{M}_1^+\big|_{\tau>0} \cap \mathcal{M}_2^+\big|_{\tau>0} = \emptyset.$$
2. **Exact absence of ghosts and GW170817 compliance inside each branch:**
   On the open interior of every branch ($\tau > 0$), $\hat{\mathbf{n}}_a = \text{const} \implies \partial_\mu\hat{\mathbf{n}}_a \equiv 0$. Consequently, the `T10` ghost kinetic term $-\frac{\kappa}{2}(1+\lvert\mathbf{u}\rvert^2)(\partial_\mu\hat{\mathbf{n}}_a)^2$ vanishes identically, and for $\mathbf{u} = 0$ all Einstein–aether coefficients vanish ($c_1=c_2=c_3=c_4=0 \implies c_{\text{gw}} = c$, $\alpha_1 = \alpha_2 = 0$). All Frobenius vorticity is localized as a measure-zero Dirac delta $\dot{\hat{\mathbf{n}}}(\tau) = (\hat{\mathbf{n}}_a - \hat{\mathbf{n}}_0)\delta(\tau)$ on the decision surface $\Sigma_*$.

---

## B2. Why Branching Trees Require $q = 3$ Time Dimensions: Thom Transversality

Suppose the universe branches repeatedly, forming a tree $\mathcal{T} = \bigcup_a \gamma_a(\tau_a)$ of 1-dimensional temporal rays $\gamma_a : \mathbb{R}_+ \to \mathbb{R}^q_{\text{time}}$ ($\dim\gamma_a = 1$). If two non-sibling branches $\gamma_a$ and $\gamma_b$ intersect at some point $\mathbf{t}_{\text{coll}} \in \mathbb{R}^q_{\text{time}}$, the two 4D worlds $\mathcal{M}_a = \mathbb{R}^3_{\text{space}}\times\gamma_a$ and $\mathcal{M}_b = \mathbb{R}^3_{\text{space}}\times\gamma_b$ collide across the entire 3D space $\mathbb{R}^3_{\text{space}}\times\{\mathbf{t}_{\text{coll}}\}$.

By Thom's transversality theorem, two smooth submanifolds of dimensions $d_1, d_2$ in $\mathbb{R}^q$ are generically disjoint if and only if
$$\boxed{\dim\gamma_a + \dim\gamma_b < q \iff 1 + 1 < q \iff q \ge 3.}$$
- **$q = 1$ ($\mathbb{R}^1_{\text{time}}$):** $\dim\text{int} = 1$ — branches overlap on intervals.
- **$q = 2$ ($\mathbb{R}^2_{\text{time}}$, signature $3+2$):** $\dim\text{int} = 1 + 1 - 2 = 0$ — generic lines in the plane cross at isolated points (**$94.5\%$ of random 4-generation trees suffer spurious branch collisions**).
- **$q = 3$ ($\mathbb{R}^3_{\text{time}}$, Bartini's $3+3$):** $\dim\text{int} = 1 + 1 - 3 = -1 < 0$ — generic rays in $\mathbb{R}^3_{\text{time}}$ are skew lines and never collide (**$0.0\%$ collisions** across 200 trees).

Thus **signature $(3,3)$ is the minimal Lorentzian extension of $(3,1)$ in which a tree of 1D branching timelines embeds without causal collisions**.

---

## B3–B5. Saddle Duality ($d_T = 2 \to 1$), Geodesic Instanton, and Geometric Decoherence

1. **Duality Saddle (`B3`):** On the simplex edge $x_{\text{saddle}}^{(12)} = (1/2, 1/2, 0)$, two clocks are equally active ($d_T = 2$). The transverse watershed eigenvalue is $\lambda_\perp = \theta - 1 > 0$: a discrete fluctuation at $\tau = \tau_*$ splits trajectories $50/50$ into two locked $d_T \to 1$ branches while the two-world ensemble maintains $d_T^{\text{ens}} = 2$.
2. **Switch Action & Decoherence (`B4`):** Rotating $\hat{\mathbf{n}}$ by angle $\vartheta_{12}$ over time $\ell_t$ inside decision volume $V_{\text{dec}}$ costs geodesic action $I_{\text{switch}} = \frac{\kappa V_{\text{dec}}}{2\ell_t}\vartheta_{12}^2$ (suppressing macroscopic branching as $V_{\text{dec}}\to\infty$ while allowing microscopic critical splits). For $\tau > 0$, transverse separation $d_\perp(\tau) = 2\tau\sin(\vartheta_{12}/2)$ drives Gaussian decoherence $\mathcal{D}_{12}(\tau) = \exp(-\tau^2\sin^2(\vartheta_{12}/2)/\ell_t^2)$ with $\tau_{\text{decoh}} = \ell_t/\sin(\vartheta_{12}/2)$.
3. **Tree Unitarity (`B5`):** Wave-packet splitting $\Psi_a = \sqrt{w_a}\Psi_0$ across $\Sigma_*$ conserves $\sum_a \lVert\Psi_a(\tau)\rVert_{L^2}^2 = 1$ to $2.22\cdot 10^{-16}$ with positive energy $H_a > 0$ on every branch.
