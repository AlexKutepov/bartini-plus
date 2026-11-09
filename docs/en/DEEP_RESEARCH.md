# Deep Research R1–R4: $H^{3,2}$ Bundle Decomposition, Symmetry-Protected $c_{13}=0$, Stochastic P5$\leftrightarrow$P4 Flow, and Primary-Source Audit of Bartini (1965)

Reproducible verification script: `node bartini_plus/deep_research.mjs` $\to$ `results/deep_research.json` (**15/15** checks `true`).

---

## Executive Summary

| Block | Topic | Core Mathematical Result | Numerical Verdict |
|---|---|---|---|
| **R1 (`M4` / `T10`)** | Bundle decomposition of $H^{3,2}$ over the $(3,1)$ slice & correction of `M2` | Exact nonlinear identity $\eta^{\mu\nu}\eta_{AB}\partial_\mu U^A \partial_\nu U^B = C_1[u] - (1+\lvert\mathbf{u}\rvert^2)\eta^{\mu\nu}\delta_{\alpha\beta}\partial_\mu\hat{n}^\alpha\partial_\nu\hat{n}^\beta$. The internal sphere $\hat{n}\in S^2\subset\mathbb{R}^3_{\text{time}}$ decouples from spin-2 ($c_{\text{gw}}=c$); spacetime boosts $u^i$ and internal rotations $\hat{n}^\alpha$ carry **opposite** kinetic signs (**No-Go T10**) | Pointwise identity relative error $1.69\cdot 10^{-16}$; 3D boosts $L_D/C_1 = 1.000000000000000$ |
| **R2 (`M5`)** | 6D curvature reduction, Maxwell aether, and symmetry-protected $c_{13}=0$ | Linearized gradient shift symmetry $U_A \mapsto U_A + \partial_A\varphi$ singles out $F_{AB}F^{AB}=2(C_1-C_3)$, enforcing $c_3=-c_1 \implies c_{13}=0$ and $s_2^2=s_1^2=1$ identically. Yet the pulsar bound $\lvert\alpha_2\rvert \approx \varepsilon/2 < 1.6\cdot 10^{-9}$ still excludes the Planck and GUT scales | $\varepsilon_{\max}(c_{13}=0) = 6.61\cdot 10^{-8}$, $E_{\text{lock}} \le 6.26\cdot 10^{14}\text{ GeV} \ll M_{\text{GUT}}$ |
| **R3 (`P5+`)** | Fast bounded logit noise & coupled lattice urns (`P5` $\leftrightarrow$ `P4`) | Exact simplex-center eigenvalue: $\lambda_{\text{eff}}(\theta,\sigma) = \theta\chi(\sigma)-1$, with $\chi(\sigma)=1-\frac{9}{2}\mathrm{Var}(\pi_1)=1-\sigma^2/9+O(\sigma^4)$. At $\sigma=2$ the lock-time exponent $1/\lambda_{\text{eff}}$ stretches by $2.29\times$; for $\sigma>\sigma_c(2)\approx 3.553$ a Kramers barrier $a_{\text{sep}} \approx 1-2(\sigma/\sinh\sigma)^2$ emerges. On a 2D lattice, coupling $J>0$ turns domain chaos ($d_T^{\text{global}}=2.91$) into global temporal consensus ($d_T^{\text{global}}=1.14$, $100\%$ consensus) | $1/\lambda_{\text{eff}}(2,2.0)=2.291$; $a_{\text{sep}}(4.0)=0.9318$; lattice consensus $1.000$ at $J=0.35$ vs $0.400$ at $J=0$ |
| **R4 (`H1`)** | Primary-source audit of Bartini (*Dokl. Akad. Nauk SSSR*, 1965) | Bartini's Table 2 is reproduced to **10 significant digits**: $+S_{\max}=+33.1611944850$ ($n_+ = +6.2569464$) and $-S_{\min}=-0.1209542108$ on the mirror negative branch $k=3$ ($n_{-3} = -5.9912841 \approx -6$), giving $\bar{E}=274.1632083$. The shift to $E=274.074996$ was tuned to $\alpha^{-1}_{1965}\approx 137.0375$ and is excluded by CODATA-2022 at **$>71\,000\,\sigma$**. Exposes the OCR corruption $V_6 \to \sqrt{6}$ in $B=2885.3453$ | Matches Table 2 to $1.5\cdot 10^{-11}$; CODATA-2022 discrepancy $71\,373\,\sigma$; median grid spacing $1.10\cdot 10^{-4}$ |

---

## R1 (`M4` / `T10`). Exact Bundle Decomposition of $H^{3,2}$ over the $(3,1)$ Slice & Correction of `M2`

### 1.1. Geometric Flaw Uncovered in `M2` (`math_tighten.mjs`)

In block `M2` (`bartini_plus/math_tighten.mjs`, lines 270–281), the Goldstone modes of the spherical vacuum $S^2 \subset \mathbb{R}^3_{\text{time}}$ were embedded into a 4-vector as
$$u_{\text{old}}^\mu = \bigl(\varepsilon_1,\; \varepsilon_2,\; 0,\; \sqrt{1 - \varepsilon_1^2 - \varepsilon_2^2}\bigr).$$
This ansatz has three mathematical defects:
1. **Violation of the Lorentzian unit-norm constraint:** under $\eta_{\mu\nu} = \mathrm{diag}(+1,+1,+1,-1)$, the norm of $u_{\text{old}}^\mu$ is
   $$\eta_{\mu\nu} u_{\text{old}}^\mu u_{\text{old}}^\nu = \varepsilon_1^2 + \varepsilon_2^2 - (1 - \varepsilon_1^2 - \varepsilon_2^2) = -1 + 2(\varepsilon_1^2 + \varepsilon_2^2) \neq -1.$$
   At amplitudes $a=0.30, b=0.25$, the norm violation is $+2(a^2+b^2) = 0.3050$, which caused $L_D/C_1$ in `M2` to deviate from unity ($1.00707$ instead of $1$).
2. **Artificial breaking of $\mathrm{SO}(3)_{\text{space}}$:** the third spatial component was hardcoded to zero ($u^z = 0$).
3. **Conflation of two distinct bundles:** the 2-sphere $S^2 \subset \mathbb{R}^3_{\text{time}}$ (internal temporal rotations) was conflated with the spatial boost components $u^i \in \mathbb{R}^3_{\text{space}}$ of the 4D aether velocity.

### 1.2. Exact Bundle Decomposition Theorem (`M4`)

The full vacuum manifold of unit timelike 6-vectors in $\mathbb{R}^{3,3}$ with metric $\eta_{AB} = \mathrm{diag}(+1,+1,+1,-1,-1,-1)$ is the 5-dimensional pseudosphere
$$H^{3,2} = \bigl\{U^A \in \mathbb{R}^{3,3} \;\big|\; \delta_{ij}U^i U^j - \delta_{\alpha\beta}U^\alpha U^\beta = -1\bigr\} \cong \mathbb{R}^3_{\text{boost}} \times S^2_{\text{time}}.$$
Any smooth section $U^A(x)$ over the $(3,1)$ spacetime slice is uniquely parameterized by:
- three spatial boost components $\mathbf{u}(x) = (u^1, u^2, u^3) \in \mathbb{R}^3_{\text{space}}$, defining a unit timelike 4D aether vector
  $$u^\mu(x) = \bigl(u^1, u^2, u^3, \gamma\bigr), \qquad \gamma = \sqrt{1 + \lvert\mathbf{u}\rvert^2}, \qquad \eta_{\mu\nu}u^\mu u^\nu = -1\text{ (exact)};$$
- a unit internal temporal direction $\hat{\mathbf{n}}(x) \in S^2 \subset \mathbb{R}^3_{\text{time}}$ ($\delta_{\alpha\beta}\hat{n}^\alpha\hat{n}^\beta = 1$):
  $$U^A(x) = \bigl(u^1(x),\; u^2(x),\; u^3(x);\; \gamma(x)\hat{n}^1(x),\; \gamma(x)\hat{n}^2(x),\; \gamma(x)\hat{n}^3(x)\bigr).$$

Since $\hat{n}_\alpha \partial_\mu \hat{n}^\alpha = 0$, the cross terms between $\partial_\mu \gamma$ and $\partial_\mu \hat{n}^\alpha$ vanish identically:
$$\delta_{\alpha\beta}\partial_\mu(\gamma\hat{n}^\alpha)\partial_\nu(\gamma\hat{n}^\beta) = (\partial_\mu\gamma)(\partial_\nu\gamma) + \gamma^2\delta_{\alpha\beta}\partial_\mu\hat{n}^\alpha\partial_\nu\hat{n}^\beta.$$
Substituting into the 6D Dirichlet density yields the **exact nonlinear identity** (valid for arbitrary amplitudes $\lvert\mathbf{u}\rvert$ and $\hat{\mathbf{n}}$):
$$\boxed{\eta^{\mu\nu}\eta_{AB}\partial_\mu U^A \partial_\nu U^B = C_1[u] - \bigl(1 + \lvert\mathbf{u}\rvert^2\bigr)\,\eta^{\mu\nu}\delta_{\alpha\beta}\partial_\mu\hat{n}^\alpha\partial_\nu\hat{n}^\beta, \qquad C_1[u] \equiv \eta^{\mu\nu}\eta_{\rho\sigma}\partial_\mu u^\rho \partial_\nu u^\sigma.}$$

Numerical verification across 200 random configurations with $\lvert\mathbf{u}\rvert \sim 1$ and on a periodic $8^4$ lattice confirms a relative error of $1.69\cdot 10^{-16}$ and $L_D/C_1 = 1.000000000000000$.

### 1.3. Physical Consequences and the Opposite-Sign Kinetic Theorem (`No-Go T10`)

1. **Pure internal $S^2$ sector ($\mathbf{u}=0$):** when $u^i = 0$, the 4D aether vector is constant ($u^\mu = (0,0,0,1)$), so $C_1[u]=C_2[u]=C_3[u]=C_4[u]=0$. The two Goldstone modes $\hat{\mathbf{n}}(x) \in S^2$ transform in the $(\mathbf{1},\mathbf{3})$ representation of $\mathrm{SO}(3)_{\text{space}}\times\mathrm{SO}(3)_{\text{time}}$ — a triplet of 4D Lorentz scalars. Thus $c_{\text{gw}} = c$ identically, and **GW170817 does not constrain $E_{\text{lock}}$ for a purely internal $S^2$ vacuum**.
2. **Pure boost sector ($\hat{\mathbf{n}} = \text{const}$, Frobenius foliation):** the three modes $u^i(x) \in \mathbb{R}^3$ generate the full $\mathrm{SO}(3)$-invariant Einstein–aether functional $C_1[u]$ without breaking isotropy ($u^z \neq 0$) or clipping large amplitudes.
3. **Opposite-Sign Kinetic Theorem (`No-Go T10`):** in the Lagrangian $L = -\frac{\kappa}{2}\eta^{\mu\nu}\eta_{AB}\partial_\mu U^A \partial_\nu U^B$, time derivatives ($\mu=\nu=t$, $\eta^{tt}=-1$) enter as
   $$L_{\text{kin}} = +\frac{\kappa}{2}\biggl(\sum_{i=1}^3 (\dot{u}^i)^2 - (\dot{\gamma})^2\biggr) - \frac{\kappa}{2}\bigl(1+\lvert\mathbf{u}\rvert^2\bigr)\sum_{\alpha=1}^3 (\dot{\hat{n}}^\alpha)^2.$$
   For $\kappa > 0$, spacetime boosts $u^i$ have positive kinetic energy whereas internal rotations $\hat{n}^\alpha$ have negative kinetic energy (ghosts); for $\kappa < 0$, the signs flip. Consequently, in signature $(3,3)$ a single 6D Dirichlet term **cannot propagate both boosts $u^i$ and internal angles $\hat{n}^\alpha$ without ghosts**: one of the two sectors must be gauge-frozen.

---

## R2 (`M5`). 6D Curvature Reduction, Symmetry-Protected $c_{13}=0$, and Pulsar Bounds

### 2.1. Ricci Identity and Maxwell Invariant

Coupling $U^A$ to 6D geometry introduces the Ricci projection alongside quadratic gradient invariants:
$$R_{AB} U^A U^B = \nabla_A\bigl(U^B\nabla_B U^A - U^A\nabla_B U^B\bigr) + (\nabla_A U^A)^2 - (\nabla_A U_B)(\nabla^B U^A) = \text{div} + C_2 - C_3.$$
The antisymmetric vorticity tensor $F_{AB} = \nabla_A U_B - \nabla_B U_A$ (which measures Frobenius non-integrability) satisfies the identity
$$F_{AB}F^{AB} = 2\bigl(\nabla_A U_B \nabla^A U^B - \nabla_A U_B \nabla^B U^A\bigr) = 2(C_1 - C_3),$$
verified on the periodic $8^4$ lattice to $1.95\cdot 10^{-13}$ relative error.

### 2.2. Symmetry Protection of $c_{13}=0$ vs. Preferred-Frame Pulsar Bounds

In `T8`, the general 4-parameter ansatz required fine-tuning $c_3 \approx -c_1$ to $10^{-15}$ to pass GW170817 ($\lvert c_{\text{gw}}/c - 1\rvert \le 7\cdot 10^{-16}$). Can a symmetry enforce $c_{13} = c_1 + c_3 = 0$ naturally?

Yes: **linearized gradient shift symmetry** $U_A \mapsto U_A + \partial_A\varphi$ restricts the transverse kinetic action to the Maxwell term $-\frac{\kappa}{4}F_{AB}F^{AB}$ (supplemented by the gauge-fixing divergence $-\frac{c_2}{2}(\nabla\cdot U)^2$). This yields
$$c_1 = \varepsilon, \qquad c_3 = -\varepsilon, \qquad c_4 = 0 \implies c_{13} = c_1 + c_3 = 0 \quad \text{(identically)},$$
which guarantees exact unit speeds for spin-2 and spin-1 modes at **all** scales $\varepsilon$:
$$s_2^2 = \frac{1}{1 - c_{13}} \equiv 1, \qquad s_1^2 = \frac{2c_1 - c_1^2 + c_3^2}{2(c_1+c_4)(1-c_{13})} = \frac{2\varepsilon}{2\varepsilon} \equiv 1.$$

However, the PPN preferred-frame parameters $\alpha_1$ and $\alpha_2$ at $c_1 = -c_3 = \varepsilon, c_4 = 0$ **do not vanish**:
$$\alpha_1 = -\frac{8(c_3^2 + c_1 c_4)}{2c_1 - c_1^2 + c_3^2} = -4\varepsilon, \qquad \alpha_2 = \frac{\alpha_1}{2} - \frac{(c_1 + 2c_3)(2c_1 + 3c_2 + c_3)}{c_2(2 - c_1)} = -\frac{\varepsilon}{2} + O\Bigl(\frac{\varepsilon^2}{c_2}\Bigr).$$
Cancelling $\alpha_1$ and $\alpha_2$ requires $c_4 = -c_3^2/c_1 = -\varepsilon$, but the quartic self-acceleration term $c_4(U^A\nabla_A U_B)^2$ explicitly breaks gradient shift symmetry.

Therefore, for the symmetry-protected Maxwell aether ($c_{13}=0, c_4=0$), the binary-pulsar bound $\lvert\alpha_2\rvert \le 1.6\cdot 10^{-9}$ (together with $s_0^2 \ge 1$) limits:
$$\varepsilon_{\max}\bigl(c_{13}=0\bigr) = 6.61\cdot 10^{-8} \iff E_{\text{lock}} = \sqrt{\varepsilon_{\max}}\,M_{\text{Pl}} \le 6.26\cdot 10^{14}\text{ GeV}.$$
While three orders of magnitude higher than the generic `T8` bound ($9.7\cdot 10^{10}$ GeV), **this still excludes both the Planck scale ($2.435\cdot 10^{18}$ GeV) and the GUT scale ($10^{16}$ GeV)**.

---

## R3 (`P5+`). Exact Theory of Fast Logit Noise & Coupled Lattice Urns

### 3.1. Exact Eigenvalue under Fast Bounded Logit Noise

In `P5_STRESS`, fast bounded logit noise $w_\alpha = n_\alpha^\theta e^{\sigma\xi_\alpha}$ ($\xi_\alpha \sim U[-1,1]$ i.i.d. per step) preserves Rubin's asymptotic monopoly as $N \to \infty$, yet at $\sigma = 2.0$ delays locking by over an order of magnitude (reducing the fraction of runs hitting $p_{\max} \ge 0.95$ within $30\,000$ steps from $100\%$ to $37.5\%$).

By Pemantle's stochastic approximation theorem, the share vector $x_\alpha = n_\alpha/N$ follows the noise-averaged drift $\bar{q}_\alpha(x) = \mathbb{E}_\xi[\pi_\alpha(x,\xi)]$. At the symmetric point $x_* = (1/3,1/3,1/3)$, the factor $x_\alpha^\theta$ cancels and $\pi_\alpha = e^{\sigma\xi_\alpha}/\sum_\beta e^{\sigma\xi_\beta}$ satisfies $\mathbb{E}[\pi_\alpha] = 1/3$ by permutation symmetry. The Jacobian entries of $\bar{q}_1(x)$ at $x_*$ are
$$\frac{\partial \bar{q}_1}{\partial x_1}\Big|_{x_*} = 3\theta\,\mathbb{E}\bigl[\pi_1(1-\pi_1)\bigr], \qquad \frac{\partial \bar{q}_1}{\partial x_2}\Big|_{x_*} = -3\theta\,\mathbb{E}[\pi_1\pi_2] = -\frac{3\theta}{2}\,\mathbb{E}\bigl[\pi_1(1-\pi_1)\bigr].$$
On the simplex tangent plane ($\delta_1 + \delta_2 + \delta_3 = 0$), the linearized growth rate $\dot{\delta}_1 = \lambda_{\text{eff}}(\theta,\sigma)\delta_1$ takes the exact closed form:
$$\boxed{\lambda_{\text{eff}}(\theta,\sigma) = \theta\,\chi(\sigma) - 1, \qquad \chi(\sigma) = \frac{9}{2}\,\mathbb{E}\bigl[\pi_1(1-\pi_1)\bigr] = 1 - \frac{9}{2}\,\mathrm{Var}\bigl(\pi_1(\sigma)\bigr) = 1 - \frac{\sigma^2}{9} + O(\sigma^4).}$$

This reveals two distinct dynamical regimes (shown for $\theta = 2$):
1. **Power-law time-stretching regime ($0 < \sigma < \sigma_c \approx 3.553$):** while $\chi(\sigma) > 1/2$, $x_*$ remains unstable ($\lambda_{\text{eff}} > 0$), but the step count needed to amplify an initial fluctuation to $p_{\max} = 0.95$ scales as $(N_{\text{lock}}/N_0) \asymp (N_{\text{lock}}(0)/N_0)^{1/\lambda_{\text{eff}}}$. At $\sigma = 2.0$, $\chi(2.0) = 0.7182$ and $\lambda_{\text{eff}}(2, 2.0) = 0.4364$, so **the lock-time exponent $1/\lambda_{\text{eff}}$ increases from $1.000$ to $2.291$**, stretching the characteristic lock time from $\sim 1.3\cdot 10^3$ to $> 3\cdot 10^4$ steps.
2. **Subcritical bifurcation and Kramers barrier ($\sigma > \sigma_c \approx 3.553$):** when $\chi(\sigma) < 1/\theta$ (e.g. $\lambda_{\text{eff}}(2, 4.0) = -0.081 < 0$), the symmetric point $x_* = (1/3,1/3,1/3)$ becomes **locally stable** in the mean-field ODE! Meanwhile, near any vertex ($a = 1 - 2\delta$, $\delta \ll 1$), using $\mathbb{E}[e^{\sigma(\xi_2-\xi_1)}] = (\sinh\sigma/\sigma)^2$, the asymptotic drift remains positive:
   $$\bar{q}_1(1-2\delta) - (1-2\delta) \simeq 2\delta\biggl[1 - \delta^{\theta-1}\Bigl(\frac{\sinh\sigma}{\sigma}\Bigr)^2\biggr] > 0 \quad \text{for} \quad \delta < \delta_{\text{sep}}(\sigma) = \Bigl(\frac{\sigma}{\sinh\sigma}\Bigr)^{\frac{2}{\theta-1}},$$
   creating an unstable Kramers separatrix $a_{\text{sep}}(\sigma) \approx 1 - 2(\sigma/\sinh\sigma)^2$ between the locally stable center and the absorbing vertices (at $\sigma=4.0$: numerical $a_{\text{sep}} = 0.9318$, asymptotic formula $0.9585$).

### 3.2. Bridging `P5` $\leftrightarrow$ `P4`: Coupled Lattice Urns and Global Foliation

A single Pólya urn (`P5`) selects a time axis at a single point. What happens on an $L \times L$ spatial lattice ($6\times 6$) when all sites start in the symmetric pre-geometric phase $n_x(0) = (1,1,1)$?
- **Uncoupled sites ($J = 0$):** each site locks locally ($\langle d_T^{\text{local}}\rangle = 1.017$), but different sites lock onto different temporal axes ($\approx 1/3$ of the lattice per axis). The global effective dimension across the lattice remains $\langle d_T^{\text{global}}\rangle = 2.907 \approx 3$ with consensus fraction $0.400$ — a mosaic of causally incompatible domains.
- **Spatially coupled sites ($J = 0.35$, neighbor reinforcement + discrete Laplacian $\Delta_{\text{lat}} n_\alpha$):** non-zero spatial modes $k \neq 0$ decay exponentially at rate $-J(2 - \cos k_x - \cos k_y) < 0$, while the uniform zero mode $k = 0$ grows via the nonlinear Pólya instability $\theta - 1 > 0$. Across **100% of runs**, the entire lattice locks onto **the same global time axis** ($\text{consensus} = 1.000$, $\langle d_T^{\text{global}}\rangle = \langle d_T^{\text{local}}\rangle = 1.137 \to 1$), providing a direct microscopic derivation of `P4` harmonic stiffness from `P5` collective dynamics.

---

## R4 (`H1`). Primary-Source Audit of Bartini (*Dokl. Akad. Nauk SSSR*, 1965)

We audited R. O. di Bartini's original paper *"Some Relations Between Physical Constants"* (*Doklady Akademii Nauk SSSR*, 1965, Vol. 163, No. 4, pp. 861–864; communicated by Academician B. M. Pontecorvo).

### 4.1. Exact 10-Digit Reconstruction of Bartini's Table 2

Bartini studies the surface area of the unit sphere in $n+1$ dimensions:
$$S_{n+1}(z) = \frac{2\pi^z}{\Gamma(z)}, \qquad z = \frac{n+1}{2},$$
whose extrema satisfy $\psi(z) = \ln\pi \approx 1.1447298858$.
1. **Positive global maximum ($z > 0$):**
   $$z_+ = 3.6284732021 \implies n_+ + 1 = +7.2569464042 \quad (n_+ = +6.2569464042 \approx +6),$$
   $$S_{n+1}(z_+) = +33.1611944850 \quad \text{(Bartini Table 2: } +33.161194485,\text{ relative match } 1.2\cdot 10^{-12}\text{)}.$$
2. **Negative extremum ($z < 0$):** on each interval $z_{-k} \in (-k, -k+1)$ ($k=1,2,3,\dots$) between the poles of $\Gamma(z)$, there is a unique root $\psi(z_{-k}) = \ln\pi$. Evaluating $S_{n+1}(z_{-k})$ across the first five branches gives:
   - $k=1$ ($n_1 = -1.763290$): $S = -0.3404265284$;
   - $k=2$ ($n_2 = -3.906498$): $S = +0.1535643609$;
   - **$k=3$ ($z_{-3} = -2.4956420472$, $n_{-3} = -5.9912840945 \approx -6$):**
     $$S_{n+1}(z_{-3}) = -0.120954210785 \quad \text{(Bartini Table 2: } -0.1209542108,\text{ relative match } 1.5\cdot 10^{-11}\text{)};$$
   - $k=4$ ($n_4 = -8.050638$): $S = +0.1351585728$;
   - $k=5$ ($n_5 = -10.095701$): $S = -0.1951763248$.

   Branch $k=3$ is uniquely singled out in two ways: first, it achieves the **global minimum of the extremum envelope $\lvert S_{n+1}(z_{-k})\rvert$** over all negative branches $k \ge 1$ (since $\pi^{-k}k!$ decreases for $k < \pi$ and grows for $k > \pi$); second, its effective dimension $n_{-3} = -5.9913 \approx -6$ is the mirror image of the positive peak $n_+ = +6.2569 \approx +6$.
3. **Ratio of extrema $\bar{E}$:**
   $$\bar{E} = \frac{S_{n+1}(z_+)}{\lvert S_{n+1}(z_{-3})\rvert} = 274.16320829 \quad \text{(Bartini Table 2: } 274.163208\text{)}.$$

### 4.2. Manual Tuning $\bar{E} \to E$ to 1965 $\alpha^{-1}$ vs. CODATA-2022

Half of the pure analytical extremum ratio is
$$\frac{\bar{E}}{2} = 137.0816041,$$
which misses $\alpha^{-1}$ by $+3.33\cdot 10^{-4}$ ($+0.0456$). To match the mid-1960s experimental value $\alpha^{-1}_{1965} \approx 137.0375(5)$, Bartini manually replaced $\bar{E}$ with the shifted constant
$$E = 274.074996 \approx \frac{1}{4}\,e^{6.9996968} \implies \frac{E}{2} = 137.037498.$$
While this matched $\alpha^{-1}_{1965}$ to $1.5\cdot 10^{-8}$, against CODATA-2022 ($\alpha^{-1} = 137.035999177(21)$) it is off by $+10.9\text{ ppm}$ — **a $71\,373\,\sigma$ discrepancy**.

### 4.3. Exposing the OCR Corruption in Secondary Sources ($B = 2885.3453$)

Numerous secondary Russian reprints (`trinitas.ru`, `krasnostup.com`, etc.) print Bartini's formula for $B = 2885.3453$ as $\sqrt{6}\cdot E/\pi$ or $\sqrt{6E}/\pi$. Direct evaluation proves that this is an optical character recognition (OCR) corruption that turned the italic 6-torus volume symbol $V_6 = S_7 = \frac{16\pi^3}{15} \approx 33.0733618$ into a square-root sign $\sqrt{6}$:
$$B_{\text{true}} = \frac{V_6\,E}{\pi} = \frac{16\pi^2}{15}\,E = 2885.3459 \quad (\text{Bartini: } 2885.3453,\text{ match } 2.2\cdot 10^{-7}),$$
whereas $\sqrt{6}\,E/\pi = 213.688$ and $\sqrt{6E}/\pi = 12.910$. From $B = \frac{16\pi^2}{15}E$, Bartini's proton-to-electron mass ratio is $\frac{2}{\pi}B = \frac{32\pi}{15}E = 1836.868$ (cf. Lenz's $6\pi^5 = \frac{90}{\pi}V_6 = 1836.118$ and CODATA-2022: $1836.15267343$).

### 4.4. Look-Elsewhere Statistical Test

Bartini's multiplicative basis $K = 2^a \cdot 3^b \cdot 5^e \cdot \pi^{c/2} \cdot E^d$ (where $5^{-1}$ and half-integer powers of $\pi$ enter explicitly via $\Gamma(7/2) = \frac{15}{8}\sqrt{\pi}$ in $V_6 = \frac{16\pi^3}{15}$) with modest integer exponents $a\in[-8,8], b\in[-4,4], e\in[-2,2], c\in[-10,10], d\in[-2,2]$ generates **$7\,761$ grid points** inside $[100, 2000]$. The median relative distance from a uniform random number in $[100, 2000]$ to the nearest grid point is **$1.10\cdot 10^{-4}$**, and a random target lands within $\le 3.33\cdot 10^{-4}$ with **$76.0\%$ probability**. Thus $10^{-4}$-level numerical hits in the constant table are explained by the density of the 5-parameter multiplicative lattice (look-elsewhere effect), whereas the geometric core of the 1965 paper — the sphere surface/volume extremum at $n \approx 6$ — is mathematically exact.
