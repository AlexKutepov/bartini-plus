# M1–M3：收紧，不是化妆

**作者：** 亚历山大·库捷波夫与 LLM。  
**运行：** `node bartini_plus/math_tighten.mjs` → `results/math_tighten.json`。

三处仍能改变形式地位的缺口：测度原理、作用量嵌入以太、谱维。以下是定理与禁令。自然本身仍未证明。

---

## M1. Maxent + 幺正傅里叶 $\Rightarrow a=\pi$；单靠自对偶得不到 $n=6$

**已知。** 在 $\mathbb R$ 上固定 $\int f=1$、$\int x^2 f=\sigma^2$ 的密度中，熵 $-\int f\log f$ 的极大是 $f\propto e^{-x^2/(2\sigma^2)}$。古典结果，不是我们的。

**幺正傅里叶** $\hat f(\xi)=\int f(x)e^{-2\pi i x\xi}\,dx$。该族中的不动点是 $\sigma^2=1/(2\pi)$，故 $a=1/(2\sigma^2)=\pi$。

其后仍是旧演算：$m(n)$ 的整数极小为 6 当且仅当 $2.761<a<3.259$。$\pi$ 在窗内。窗外，$\{5,6,7\}$ 上的极小落到 5 或 7。

**禁令。** 没有 maxent 的自对偶钉不住 $n=6$。厄米函数满足 $\mathcal F[\psi_n]=(-i)^n\psi_n$；$n\equiv 0\pmod 4$ 时特征值为 $+1$。混合 $e^{-\pi x^2}(1+\varepsilon H_4(\sqrt{2\pi}\,x))$ 在 $\varepsilon=0.02$ 仍为正、傅里叶自对偶（$L^2$ 误差 $10^{-15}$），并把 $n_*$ 从 $6.25$ 移到 $2.30$，整数极小 $6\to 2$。方差变了；在同一方差下混合的熵低于高斯。因此 $n=6$ 需要 maxent（或等价地禁止 $4k$ 模），不是「任意自对偶权重」。

**地位。** 测度原理不再是对 $\pi$ 的口味。它是一对：maxent + $\mathcal F$ 的幺正性。自然为何最大化维度权重的熵，仍是公设。

---

## M2. 切片上的 Dirichlet 就是 $c_1$，而且只有 $c_1$

嵌入：隐时间平面中的 $n=(\varepsilon_1,\varepsilon_2,\sqrt{1-\varepsilon^2})\in S^2$ $\mapsto$ 切片上 $u=(\varepsilon_1,\varepsilon_2,0,\sqrt{1-\varepsilon^2})$，$\eta=\mathrm{diag}(1,1,1,-1)$。以太的第三个自由度（$u^z$ 倾斜）不存在：$n\in S^2$ 有两个，不是三个。

Dirichlet 能量 $L_D=g^{\mu\nu}\partial_\mu n\cdot\partial_\nu n$。Einstein-aether 单项式 $C_1,C_2,C_3,C_4$。

**恒等式（运行，$8^4$，12 个随机场）。** $L_D/C_1=1.007$，仅 $c_1$ 残差 $0.007$。纵波：$C_2/L_D\approx 1$，仍然 $L_D=C_1$。横波：$C_2=0$，$L_D=C_1$。$C_2$ 作为张量存在，**不进入** Dirichlet。


$$
(c_1,c_2,c_3,c_4)=(\kappa,0,0,0),\qquad c_{13}=c_1\neq 0.
$$



一般以太在 $\varepsilon=O(1)$ 存活所需的缝 $c_{13}=0$ 不能由 6D Dirichlet 产生。T8 仍成立：$E_{\mathrm{lock}}\lesssim 10^{11}$ GeV 或 $f=0$。

**地位。** T8 的映射不再是启发式。引理是二次的、在格子上、带 $\lvert\varepsilon\rvert<0.45$。未证明 $R_6+\kappa|Dn|^2$ 的完整非线性约化。

---

## M3. 物理 $d_s=4$；「紫外六」不是切片的预言

$P(s)=\mathrm{Tr}\,e^{-s\omega^2}$，$d_s(s)=-2\,d\log P/d\log s$。

| 算子 | $d_s$ | 何处 |
|---|---|---|
| 欧氏 $\Delta_6$ | 恰为 $6$ | 未约化体积 |
| 欧氏 $\Delta_4$、投影 $\Delta_{3,1}$ | 恰为 $4$ | T4–T5 之后 |
| $\lvert\square_{3,3}\rvert$ | 一切 $s$ 上都是 $6$ | $\mathbb R^6$ 上 2 次齐次 |

$\mathbb R^d$ 上任何 2 次符号都有 $d_s=d$。因此 $|\square_{3,3}|$ 不会从 6 流到 4。投影之后算子是四维的，$d_s=4$。

与 CDT（$d_s^{\mathrm{UV}}\approx 2$）的张力，是把那项计算拿去和**未约化**算子比——而链条的其余部分禁止量子化它。约化理论的 $d_s=4$，与广义相对论相同。T7 候选是空的。

---

## 总结

| 项 | 地位 |
|---|---|
| 由 maxent+$\mathcal F$ 得到 $\pi$ | 已推出（M1） |
| 自对偶 $\Rightarrow n=6$ | **禁止**（厄米 $4k$） |
| Dirichlet $\mapsto(c_1,0,0,0)$ | 二次引理（M2） |
| 从 6D 得到 $c_{13}=0$ | **未得到** |
| 物理 $d_s$ | $4$，不是 $6$（M3） |
| 宇宙是六维的 | **未证明** |

链条更硬、更诚实：测度原理有了名字；T8 成为引理；紫外六不是活预言。没有正的实验室效应。
