# M1–M3: tightening, not costume

**Authors:** Alexander Kutepov and LLMs.  
**Run:** `node bartini_plus/math_tighten.mjs` → `results/math_tighten.json`.

Three holes that still changed formal status: the measure principle, the action-to-aether embedding, spectral dimension. Theorems and no-gos below. Nature is still not proved.

---

## M1. Maxent + unitary Fourier $\Rightarrow a=\pi$; self-duality alone does not give $n=6$

**Given.** Among densities on $\mathbb R$ with fixed $\int f=1$ and $\int x^2 f=\sigma^2$, entropy $-\int f\log f$ is maximised by $f\propto e^{-x^2/(2\sigma^2)}$. Classical, not ours.

**Unitary Fourier** $\hat f(\xi)=\int f(x)e^{-2\pi i x\xi}\,dx$. The fixed point in that family is $\sigma^2=1/(2\pi)$, hence $a=1/(2\sigma^2)=\pi$.

Then the old calculus: the integer $\mathrm{argmin}$ of $m(n)$ is 6 iff $2.761<a<3.259$. $\pi$ sits inside. Outside, the min on $\{5,6,7\}$ moves to 5 or 7.

**No-go.** Self-duality without maxent does not pin $n=6$. Hermite functions satisfy $\mathcal F[\psi_n]=(-i)^n\psi_n$; eigenvalue $+1$ whenever $n\equiv 0\pmod 4$. The mix $e^{-\pi x^2}(1+\varepsilon H_4(\sqrt{2\pi}\,x))$ at $\varepsilon=0.02$ stays positive, is Fourier-self-dual ($L^2$ error $10^{-15}$), and moves $n_*$: $6.25\to 2.30$, integer min $6\to 2$. Variance changes; at equal variance the mix has lower entropy than the Gaussian. So $n=6$ needs maxent (or an equivalent ban on $4k$ modes), not “any self-dual weight”.

**Status.** The measure principle is no longer a taste for $\pi$. It is the pair maxent + unitarity of $\mathcal F$. Why nature maximises entropy of a dimensional weight remains a postulate.

---

## M2. Dirichlet on the slice is $c_1$ and only $c_1$

Embed $n=(\varepsilon_1,\varepsilon_2,\sqrt{1-\varepsilon^2})\in S^2$ in the hidden-time plane as $u=(\varepsilon_1,\varepsilon_2,0,\sqrt{1-\varepsilon^2})$ on the slice, $\eta=\mathrm{diag}(1,1,1,-1)$. The third aether d.o.f. ($u^z$ tilt) is absent: $n\in S^2$ has two, not three.

Dirichlet energy $L_D=g^{\mu\nu}\partial_\mu n\cdot\partial_\nu n$. Aether monomials $C_1,C_2,C_3,C_4$ as in Jacobson–Mattingly.

**Identity (run, $8^4$, 12 random fields).** $L_D/C_1=1.007$, $c_1$-only residual $0.007$. Longitudinal wave: $C_2/L_D\approx 1$, still $L_D=C_1$. Transverse: $C_2=0$, $L_D=C_1$. $C_2$ exists as a tensor and **does not enter** Dirichlet.


$$
(c_1,c_2,c_3,c_4)=(\kappa,0,0,0),\qquad c_{13}=c_1\neq 0.
$$



The sliver $c_{13}=0$ that keeps generic aether alive at $\varepsilon=O(1)$ is not produced by 6D Dirichlet. T8 stands: $E_{\mathrm{lock}}\lesssim 10^{11}$ GeV or $f=0$.

**Status.** The T8 map is no longer a heuristic. The lemma is quadratic, on a lattice, with $|\varepsilon|<0.45$. A full nonlinear reduction of $R_6+\kappa|Dn|^2$ is not proved.

---

## M3. Physical $d_s=4$; “UV six” is not a prediction of the slice

$P(s)=\mathrm{Tr}\,e^{-s\omega^2}$, $d_s(s)=-2\,d\log P/d\log s$.

| operator | $d_s$ | where |
|---|---|---|
| Euclidean $\Delta_6$ | $6$ exactly | unreduced volume |
| Euclidean $\Delta_4$, projected $\Delta_{3,1}$ | $4$ exactly | after T4–T5 |
| $\lvert\square_{3,3}\rvert$ | $6$ at every $s$ | degree-2 homogeneity on $\mathbb R^6$ |

Any degree-2 symbol on $\mathbb R^d$ has $d_s=d$. So $|\square_{3,3}|$ does not flow from 6 to 4. After projection the operator is four-dimensional, $d_s=4$.

Tension with CDT ($d_s^{\mathrm{UV}}\approx 2$) compares that calculation to the **unreduced** operator, which the rest of the chain forbids to quantise. The reduced theory has $d_s=4$, as GR. The T7 candidate is empty.

---

## Summary

| item | status |
|---|---|
| $\pi$ from maxent+$\mathcal F$ | derived (M1) |
| self-duality $\Rightarrow n=6$ | **forbidden** (Hermite $4k$) |
| Dirichlet $\mapsto(c_1,0,0,0)$ | quadratic lemma (M2) |
| $c_{13}=0$ from 6D | **not obtained** |
| physical $d_s$ | $4$, not $6$ (M3) |
| the Universe is six-dimensional | **not proved** |

The chain is stricter and more honest: the measure principle is named; T8 is a lemma; UV-six is not a live prediction. No positive laboratory effect.
