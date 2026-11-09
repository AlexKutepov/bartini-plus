# P5 stress test: monopoly theorem, critical lock time, and noise robustness

**Code:** `node bartini_plus/p5_stress.mjs`  
**Data:** `results/p5_stress.json`  
**Status:** the mathematical claims for P5 are proved; a physical origin for P5 is not obtained.

---

## 1. Summary

| Question | Result |
|---|---|
| Does $p_\alpha\propto n_\alpha^\theta$ follow from the $(3,3)$ metric? | no |
| Does P5 have an exact variational form? | yes, as entropy-regularized choice |
| Where is the exact strong-monopoly boundary? | $\theta_c=1$ |
| Does the stochastic urn lock for $\theta>1$? | almost surely, from any finite positive start |
| Is a symmetric start an exception? | only in deterministic mean-field, not in the urn |
| Does $\tau_{\rm lock}\sim(\theta-1)^{-1}$ hold? | no |
| What diverges as $(\theta-1)^{-1}$? | $\log\tau_{\rm lock}$ in mean-field near symmetry |
| Is exact lock stable under arbitrary persistent noise? | no |
| Does this make P5 a law of nature? | no |

Key distinction: in the simulation code the threshold

$$
\max_\alpha p_\alpha\ge 0.95
$$

is only **first passage of a threshold**. Exact lock (strong monopoly) means the existence of a finite random step after which all ticks forever belong to a single clock. First passage of $0.95$ can be reversed by a later fluctuation and does not by itself prove monopoly.

---

## 2. Where the power law can come from

Six candidates were tested:

1. Pure maximum entropy gives $p_\alpha=1/3$, not P5.
2. Entropy-regularized logarithmic payoff yields P5 exactly.
3. A variational principle gives P5 only after explicitly choosing that logarithmic payoff.
4. Preferential attachment assumes the power weight phenomenologically.
5. The field $n(x)\in S^2$ from `FOUR_STEPS.md` gives harmonic-map dynamics and does not derive the urn.
6. The $S^2$ geometry of time directions neither singles out three discrete axes nor fixes $\theta$.

Working mathematical sources of P5 are items 2 and 4. Neither is a derivation from $(3,3)$ geometry.

### 2.1. Exact variational derivation

On the simplex $\Delta_2$, consider the strictly concave functional

$$
\mathcal F(p\mid n)
=
\theta\sum_{\alpha=1}^3p_\alpha\ln n_\alpha
-\sum_{\alpha=1}^3p_\alpha\ln p_\alpha,
\qquad \sum_\alpha p_\alpha=1.
$$

The first term is the expected logarithmic score; the second is Shannon entropy. The Lagrange condition is

$$
\theta\ln n_\alpha-\ln p_\alpha-1+\lambda=0,
$$

hence

$$
\boxed{
p_\alpha=
\frac{n_\alpha^\theta}{\sum_\beta n_\beta^\theta}
}.
$$

The Hessian in $p$ is $\operatorname{diag}(-1/p_\alpha)$, so the maximizer is unique. The numerical KKT residual in the run is $8.9\cdot10^{-16}$.

This is a conditional derivation: the functional $\mathcal F$, the logarithmic score, and $\theta$ remain postulates. Rewriting P5 as an extremum does not make it a consequence of the 6D metric.

### 2.2. Scale-free Luce choice axiomatics

Assuming independence from irrelevant alternatives

$$
\frac{p_i}{p_j}=\frac{f(n_i)}{f(n_j)}
$$

together with scale invariance under $n\mapsto cn$, any continuous positive $f$ satisfies Cauchy’s multiplicative functional equation with solution

$$
f(n)=C n^\theta.
$$

Thus P5 is the canonical scale-free Luce choice rule; both axioms are still external to $(3,3)$ geometry.

---

## 3. Theorem: exact critical boundary $\theta_c=1$

Let

$$
\Pr(\alpha\text{ at next step}\mid n)
=
\frac{w(n_\alpha)}{\sum_\beta w(n_\beta)},
\qquad w(m)=m^\theta,
$$

with finite positive initial counts $n_\alpha(0)$.

**Strong reinforcement theorem (Davis / Rubin).**

$$
\sum_{m=1}^\infty\frac1{w(m)}<\infty
\quad\Longleftrightarrow\quad
\text{one color receives all ticks after a finite random step almost surely}.
$$

For $w(m)=m^\theta$:

$$
\sum_{m=1}^\infty m^{-\theta}<\infty
\quad\Longleftrightarrow\quad
\boxed{\theta>1}.
$$

### Proof via Rubin’s exponential embedding

For each clock $\alpha$ and each future count $m\ge n_\alpha(0)$, draw independent exponential waiting times

$$
E_{\alpha,m}\sim\operatorname{Exp}(w(m)).
$$

The explosion time of clock $\alpha$ is

$$
T_\alpha=\sum_{m=n_\alpha(0)}^\infty E_{\alpha,m}.
$$

If $\sum 1/w(m)<\infty$, every $T_\alpha<\infty$ almost surely. Because the $T_\alpha$ are independent and have continuous distributions, the minimum $T_{\alpha_*}$ is almost surely unique. Before $T_{\alpha_*}$ the winner accumulates infinitely many ticks while every loser accumulates only finitely many. Hence after the last foreign event, only $\alpha_*$ ticks.

If the series diverges, explosion times are infinite and every clock ticks infinitely often:

- $\theta<1$: shares converge to $1/3$;
- $\theta=1$: classical Pólya urn, shares converge to a random interior point of the simplex;
- $\theta>1$: strong monopoly almost surely.

Exact symmetry of initial counts is not an exception in the stochastic urn: it only makes the three winners equally likely, and the first random tick breaks symmetry.

---

## 4. Simplex dynamics

With $x_\alpha=n_\alpha/N$, $q_\alpha(x)=x_\alpha^\theta/\sum_\beta x_\beta^\theta$, and $s=\ln N$, the mean-field ODE is

$$
\boxed{
\frac{dx_\alpha}{ds}=q_\alpha(x)-x_\alpha
}.
$$

At the symmetric point $x_*=(1/3,1/3,1/3)$ the linearization on the tangent plane of the simplex has two equal eigenvalues

$$
\boxed{\lambda=\theta-1}.
$$

The symmetric point is stable for $\theta<1$, neutral for $\theta=1$, and unstable for $\theta>1$. For any pair of components,

$$
\frac{d}{ds}\ln\frac{x_i}{x_j}
=
\frac{x_i^{\theta-1}-x_j^{\theta-1}}
{\sum_\beta x_\beta^\theta},
$$

so for $\theta>1$ any strict advantage grows monotonically and vertices are stable attractors. The run from $x(0)=(0.34,0.33,0.33)$ gives $d_T\to 3$ at $\theta=0.8$ and $d_T\to 1$ at $\theta=1.2,2$.

---

## 5. Critical lock time

For two equal losers $x=(a,b,b)$ with $R=a/b$ and $y=\ln R$, the exact mean-field ODE is

$$
\frac{dy}{ds}
=
\frac{(e^y+2)(e^{(\theta-1)y}-1)}
{e^{\theta y}+2}.
$$

Threshold $q_{\max}=q$ corresponds to $y_q=\theta^{-1}\ln(2q/(1-q))$, giving the exact logarithmic time

$$
\boxed{
s_q=
\int_{y_0}^{y_q}
\frac{e^{\theta y}+2}
{(e^y+2)(e^{(\theta-1)y}-1)}
\,dy
}.
$$

As $\theta=1+\varepsilon$ with $\varepsilon\to 0^+$, $dy/ds=\varepsilon y+O(\varepsilon^2)$ and

$$
s_q=\frac1\varepsilon\ln\frac{y_q(1)}{y_0}+O(1),
\qquad
\boxed{
N_q\asymp N_0\left(\frac{y_q(1)}{y_0}\right)^{1/(\theta-1)}
}.
$$

Thus it is the **logarithm** of the lock count, not the count itself, that scales as $(\theta-1)^{-1}$:

$$
\boxed{
\ln\tau_{\rm lock}\sim\frac{C}{\theta-1}
}.
$$

For $x_0=(0.34,0.33,0.33)$, $q=0.95$, $N_0=100$: $C_{\rm theory}=4.8027915$, $C_{\rm fit}=4.8029515$, $R^2=0.9999999999$. Already at $\theta=1.05$, $\log_{10}N_q\approx 43.6$; at $\theta=1.02$, $\log_{10}N_q\approx 106.2$.

In the stochastic urn early fluctuations generate a random $y_0$ and heavy-tailed fixation times (for two colors the last-equality tail scales as $\Pr(T\ge t)=\Theta(t^{1/2-\theta})$ for $\theta>1$).

---

## 6. Robustness to perturbations

### 6.1. Initial conditions

By Rubin’s theorem any finite positive initial condition locks almost surely for $\theta>1$; only winner probabilities and passage times change. At $\theta=2$, starting from $(0.34,0.33,0.33)$ hits $0.95$ in $94.8\%$ of 96 runs within $15000$ steps (mean final $d_T=1.019$); starting from $(0.98,0.01,0.01)$ locks on axis 1 in $96/96$ runs ($d_T=1.000001$).

### 6.2. Bounded logit noise

For $\widetilde p_\alpha(k)\propto n_\alpha^\theta e^{\sigma\xi_\alpha(k)}$ with $\xi_\alpha\sim U[-1,1]$ at $\theta=2$, $n_0=25$, $30000$ steps:

| $\sigma$ | hit fraction ($0.95$) | censored median |
|---:|---:|---:|
| 0 | 0.948 | 1262 |
| 0.5 | 0.948 | 1965 |
| 1 | 0.906 | 2630 |
| 2 | 0.375 | not reached |

Bounded fast noise strongly delays threshold passage over finite horizons.

### 6.3. Persistent exploration noise destroys exact lock

For the admissible additive exploration rule

$$
\boxed{
\widetilde p_\alpha
=(1-\mu)p_\alpha+\frac{\mu}{3}
},
\qquad \mu>0,
$$

we have $\widetilde p_\alpha\ge \mu/3$. By the conditional Borel–Cantelli lemma every clock ticks infinitely often almost surely, so **exact monopoly is impossible for any $\mu>0$**.

In mean-field the symmetric tangent eigenvalue is $\lambda_\mu=(1-\mu)\theta-1$, giving the local stability boundary

$$
\boxed{\mu_c=1-\frac1\theta}.
$$

For $\theta=2$, $\mu_c=0.5$, while asymmetric fixed points satisfy $3a^2+(\mu-3)a+\mu=0$ and disappear at the saddle-node $\mu_{\rm sn}=9-6\sqrt{2}\approx 0.514719$, leaving a bistable coexistence window $\mu\in(0.5,0.514719)$.

---

## 7. Verdict

P5 holds rigorously in its pure form ($\theta>1\Rightarrow$ strong monopoly a.s.), with three limitations:

1. P5 does not follow from $(3,3)$; the variational form transfers the postulate to the choice of functional.
2. Critical slowing down near $\theta=1$ is essential-singular: $\log\tau_{\rm lock}\sim C/(\theta-1)$ in mean-field.
3. Exact monopoly is destroyed by any persistent exploration floor $\mu>0$.

### References

- Rubin exponential embedding and strong monopoly: [Gottfried, Grosskinsky, arXiv:2406.15006](https://arxiv.org/abs/2406.15006).
- Asymptotic regimes of nonlinear urns: [Gottfried, Grosskinsky, arXiv:2303.01210](https://arxiv.org/abs/2303.01210).
- Heavy-tailed competition duration: [Jiang et al., arXiv:1604.02097](https://arxiv.org/abs/1604.02097).
