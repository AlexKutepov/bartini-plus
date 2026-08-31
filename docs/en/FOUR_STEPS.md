# Four steps: measure, signature, field \(n\), Einstein / no-go

**Authors:** Alexander Kutepov and LLMs.  
**Run:** `node bartini_plus/four_steps.mjs` → `results/four_steps.json` (2026-08-31).

This is not a proof that the Universe is six-dimensional. It tests whether the four missing pieces follow from named principles, without inserting \(n=6\) by hand and without the urn as a foundation.

---

## Step 1. The measure

The unitary Fourier transform has a unique even positive \(L^2\) fixed point (up to phase): \(e^{-\pi x^2}\). Grid check: relative \(L^2\) error \(1.93\times 10^{-15}\).

\[
m(n)=\frac{\Gamma(\frac{n+1}{2})}{2\pi^{(n+1)/2}}=\frac{1}{\mathrm{Area}(S^n)}.
\]

Identity holds to \(10^{-15}\). Minimizing \(m\) is maximizing the area of \(S^n\).

\[
\psi\bigl(\tfrac{n+1}{2}\bigr)=\ln\pi\implies n_*=6.25694641164.
\]

Integer minimum of \(m\): \(n=6\). Other Gaussian widths: \(a=1/2,1,e,2\pi\) give \(n_*=0.87,1.92,5.41,12.55\). Six is tied to Fourier-self-dual \(\pi\).

**Status.** Derived from self-duality / maximal sphere area. The principle itself remains a postulate.

---

## Step 2. Why \(3+3\)

For \(p+q=6\), maximize the real null-cone measure \(\mathrm{Area}(S^{p-1})\mathrm{Area}(S^{q-1})\).

| split | volume |
|---|---|
| \(1+5\) | \(16\pi^2/3\approx 52.64\) |
| \(2+4\) | \(4\pi^3\approx 124.03\) |
| \(3+3\) | \(16\pi^2\approx 157.91\) |

\((3,3)\) is the unique maximum. \(\mathrm{Vol}_{3+3}/\mathrm{Vol}_{2+4}=4/\pi\).

Empirical path: the sky is \(S^2\) \(\Rightarrow\) 3 space; step 1 gave 6 \(\Rightarrow\) 3 time.

Algebra: \(\mathfrak{so}(3,3)\cong\mathfrak{sl}(4,\mathbb R)\); \(\mathfrak{so}(4,2)\cong\mathfrak{su}(2,2)\) (4D conformal). Different theories.

**Status.** Derived given \(n=6\) and the same “maximal direction measure” idea.

---

## Step 3. Field \(n\)

\[
S[n]=\frac\kappa2\int|dn|^2,\qquad dT=n_\alpha dt^\alpha.
\]

Heat flow on the lattice locks random data: \(T^2\) \(12/12\), \(S^1\) \(11/12\). Constant vacuum is stable. A stereographic texture on \(T^2\) unwinds (not a homotopy invariant there). \(\pi_2(S^2)=\mathbb Z\) still implies point hedgehogs in 3D space. Two Goldstone angles remain massless without a potential.

**Status.** The urn is no longer foundational. Goldstone gap and 3D defects are open.

---

## Step 4. Einstein, no-go, prediction

Product metric \(G=g_4\oplus\gamma_\perp\), \(n=\mathrm{const}\), \(\partial_\perp=0\): \(R_6=R_4\), \(S_{\mathrm{EH},6}=\mathrm{Vol}_\perp S_{\mathrm{EH},4}\). Einstein equations on the slice.

Matter kinetics \((n\cdot\partial_t\phi)^2-c^2|\nabla\phi|^2\): hyperbolic; \(0/12\) unstable modes vs a nonzero count without the projection. Tachyon sign removed. Positive mass not produced.

\(\Delta c/c\sim|\delta n|\sim E_{\mathrm{lock}}/M_{\mathrm{Pl}}\). After inflation at high \(E\): already killed by \(\sim 10^{-15}\) Lorentz tests. At the Planck scale plus inflation: diluted, indistinguishable from GR. No surviving distinctive number.

**Status.** Hyperbolicity and Einstein reduction: yes, under the projection. Mass and a live numerical prediction: no.

---

## Summary

The chain “self-dual Gaussian → 6 → maximal null cone → 3+3 → field \(n\) → Einstein on the slice” closes mathematically. It enters nature only if maximal direction measure is a law and Goldstones plus mass are closed. That is not a proven Bartini.
