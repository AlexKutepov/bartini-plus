# 多世界时间分岔与分岔点的时间二象性 (B1–B5)

可复现验证脚本：`node bartini_plus/branching_time.mjs` $\to$ `results/branching_time.json`（**5/5** 项检验全部为 `true`）。

---

## 问题提出

定理 `T3` 与 `No-Go T10` 证明，三个时间维 $(t_1, t_2, t_3)$ **不能在连续 6D 体空间内同时保持动力学活性**。然而，结合埃弗雷特（Everett, 1957）多世界诠释与贝尔纳普（Belnap, 1992）分岔时空理论，一个关键数学问题是：
> **如果每条分支内部的时间演化严格是一维的（$\hat{\mathbf{n}}(\tau) = \text{const}$，$d_T = 1$），而时间二象性（$d_T = 2$）仅在离散的决策/分岔时刻 $\tau = \tau_*$ 激活，使 4D 时空片在 $\mathbb{R}^3_{\text{time}}$ 中分裂为独立的时间线，几何与动力学是否自洽？**

以下定理 **B1–B5** 证明：这种“分段弗罗贝尼乌斯（Piecewise-Frobenius）”结构不仅**在每条分支内部完全避开了 `T3`、`T8`、`T10` 与 `M5` 禁令**，而且通过托姆横截性定理给出了**为什么无碰撞分岔时间树至少需要 $q_{\min} = 3$ 个时间维（即巴尔蒂尼的 $3+3$ 号差）**。

---

## 定理 B1–B5 概览

| 定理 | 数学内容 | 数值判定 (`branching_time.json`) |
|---|---|---|
| **B1 (分段弗罗贝尼乌斯)** | 当 $\hat{\mathbf{n}}(\tau)$ 分段常值且仅在 3D 分岔超曲面 $\Sigma_* = \mathbb{R}^3_{\text{space}}\times\{\mathbf{t}_*\}$ 上跳变时，新生成的两个 4D 时空片 $\mathcal{M}_1^+(\hat{\mathbf{n}}_1)$ 与 $\mathcal{M}_2^+(\hat{\mathbf{n}}_2)$ 在 $\tau > 0$ 时完全不相交（$\mathcal{M}_1^+\cap\mathcal{M}_2^+ = \emptyset$）。分支内部 $\partial_\mu\hat{\mathbf{n}}_a \equiv 0 \implies$ 幽灵动能为 $0$，$c_{\text{gw}} = c$，$\alpha_1 = \alpha_2 = 0$ | $\tau > 0$ 时 $\mathcal{M}_1^+\cap\mathcal{M}_2^+ = \emptyset$；$E_{\text{ghost}} = 0$；$c_{\text{gw}}/c = 1$ |
| **B2 (托姆横截性, $q_{\min}=3$)** | 两条 1D 分支时间线 $\gamma_a(\tau) \subset \mathbb{R}^q_{\text{time}}$ 在一般位置不相交当且仅当 $\dim\gamma_a + \dim\gamma_b < q \iff 1 + 1 < q \iff q \ge 3$。在 2D 时间（$3+2$）中次级分支必然相撞；在 3D 时间（巴尔蒂尼 $3+3$）中异面射线永不相交 | 2D 时间分支碰撞率：**$94.5\%$**；3D 时间碰撞率：**$0.0\%$**（200 棵树） |
| **B3 (波利亚–克拉默斯二象鞍点)** | 在单形棱边鞍点 $n_1 = n_2 \gg n_3$ 上，决策时刻局部时间维数为 $d_T(\tau_*) = 2$（双时间二象性）。横向分水岭特征值 $\lambda_\perp = \theta - 1 > 0$：微涨落将系综 $50/50$ 分裂为两条锁定分支（$d_T^{\text{single}} \to 1$），而双世界系综保持 $d_T^{\text{ens}} = 2$ | $d_T(\tau_*) = 2.0001 \to \langle d_T^{\text{single}}\rangle = 1.0264$；双世界系综 $d_T^{\text{ens}} = 2.0000$ |
| **B4 (切换瞬子与几何退相干)** | 在决策体积 $V_{\text{dec}}$ 内经时间 $\ell_t$ 旋转 $\vartheta_{12}$ 的极小作用量为 $S^2$ 大圆测地线 $I_{\text{switch}} = \frac{\kappa V_{\text{dec}}}{2\ell_t}\vartheta_{12}^2$。分岔后波包交叠按 $\mathcal{D}_{12}(\tau) = \exp(-\tau^2\sin^2(\vartheta_{12}/2)/\ell_t^2)$ 衰减 | $\tau_{\text{decoh}}/\ell_t = \sqrt{2} \approx 1.4142$；$\tau = 6\ell_t$ 时交叠为 $1.52\cdot 10^{-8}$ |
| **B5 (分岔树幺正性)** | 波包按权重 $w_a = n_a^\theta/\sum_\beta n_\beta^\theta$ 在 $\Sigma_*$ 处分裂时，总范数 $\sum_a \lVert\Psi_a(\tau)\rVert_{L^2}^2 = 1$ 严格守恒，且各分支内部具有严格正能量 $H_a > 0$ | 总范数守恒误差 $2.22\cdot 10^{-16}$；$H_1, H_2 > 0$ |
