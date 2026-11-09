# 深度研究 R1–R4：$H^{3,2}$ 纤维丛分解、对称性保护的 $c_{13}=0$、P5$\leftrightarrow$P4 随机流与巴尔蒂尼（1965）原始文献审计

可复现验证脚本：`node bartini_plus/deep_research.mjs` $\to$ `results/deep_research.json`（**15/15** 项检验全部为 `true`）。

---

## 核心结果概览

| 模块 | 主题 | 核心数学结果 | 数值判定 |
|---|---|---|---|
| **R1 (`M4` / `T10`)** | 伪球面 $H^{3,2}$ 在 $(3,1)$ 切片上的纤维丛分解及 `M2` 修正 | 精确非线性恒等式 $\eta^{\mu\nu}\eta_{AB}\partial_\mu U^A \partial_\nu U^B = C_1[u] - (1+\lvert\mathbf{u}\rvert^2)\eta^{\mu\nu}\delta_{\alpha\beta}\partial_\mu\hat{n}^\alpha\partial_\nu\hat{n}^\beta$。内部球面 $\hat{n}\in S^2\subset\mathbb{R}^3_{\text{time}}$ 与自旋-2 解耦（$c_{\text{gw}}=c$）；时空助推 $u^i$ 与内部旋转 $\hat{n}^\alpha$ 具有**相反**的动能符号（**No-Go T10**） | 逐点恒等式相对误差 $1.69\cdot 10^{-16}$；3D 助推 $L_D/C_1 = 1.000000000000000$ |
| **R2 (`M5`)** | 6D 曲率约化、麦克斯韦以太与对称性保护的 $c_{13}=0$ | 线性化梯度规范对称性 $U_A \mapsto U_A + \partial_A\varphi$ 唯一选出 $F_{AB}F^{AB}=2(C_1-C_3)$，给出 $c_3=-c_1 \implies c_{13}=0$ 及恒等 $s_2^2=s_1^2=1$。但脉冲星约束 $\lvert\alpha_2\rvert \approx \varepsilon/2 < 1.6\cdot 10^{-9}$ 仍排除普朗克与大统一（GUT）能标 | $\varepsilon_{\max}(c_{13}=0) = 6.61\cdot 10^{-8}$，$E_{\text{lock}} \le 6.26\cdot 10^{14}\text{ GeV} \ll M_{\text{GUT}}$ |
| **R3 (`P5+`)** | 快速有界 logit 噪声与耦合晶格波利亚罐（`P5` $\leftrightarrow$ `P4`） | 单形中心精确特征值：$\lambda_{\text{eff}}(\theta,\sigma) = \theta\chi(\sigma)-1$，其中 $\chi(\sigma)=1-\frac{9}{2}\mathrm{Var}(\pi_1)=1-\sigma^2/9+O(\sigma^4)$。在 $\sigma=2$ 时锁定时间幂指数 $1/\lambda_{\text{eff}}$ 拉伸 $2.29$ 倍；当 $\sigma>\sigma_c(2)\approx 3.553$ 时出现克拉默斯（Kramers）势垒 $a_{\text{sep}} \approx 1-2(\sigma/\sinh\sigma)^2$。在 2D 晶格上，耦合 $J>0$ 将畴混沌（$d_T^{\text{global}}=2.91$）转化为全局时间轴锁定（$d_T^{\text{global}}=1.14$，共识率 $100\%$） | $1/\lambda_{\text{eff}}(2,2.0)=2.291$；$a_{\text{sep}}(4.0)=0.9318$；晶格共识率 $J=0.35$ 时为 $1.000$，$J=0$ 时为 $0.400$ |
| **R4 (`H1`)** | 巴尔蒂尼 1965 年《苏联科学院院报》原始文献审计 | 巴尔蒂尼表 2 精确复现至 **10 位有效数字**：$+S_{\max}=+33.1611944850$（$n_+ = +6.2569464$）及镜像负分支 $k=3$（$n_{-3} = -5.9912841 \approx -6$）上的 $-S_{\min}=-0.1209542108$，比值 $\bar{E}=274.1632083$。向 $E=274.074996$ 的偏移系针对 1965 年实验值 $\alpha^{-1}_{1965}\approx 137.0375$ 的人工拟合，被 CODATA-2022 排除达 **$>71\,000\,\sigma$**。揭示 $B=2885.3453$ 中 $V_6 \to \sqrt{6}$ 的 OCR 识别错误 | 与表 2 吻合至 $1.5\cdot 10^{-11}$；CODATA-2022 偏差 $71\,373\,\sigma$；网格中位间距 $1.10\cdot 10^{-4}$ |

---

## R1（`M4` / `T10`）. $H^{3,2}$ 在 $(3,1)$ 切片上的精确纤维丛分解及对 `M2` 的修正

### 1.1. 揭示 `M2`（`math_tighten.mjs`）中的几何缺陷

在 `M2` 模块（`bartini_plus/math_tighten.mjs` 第 270–281 行）中，球面真空 $S^2 \subset \mathbb{R}^3_{\text{time}}$ 的戈德斯通（Goldstone）模式曾被嵌入为 4-矢量：
$$u_{\text{old}}^\mu = \bigl(\varepsilon_1,\; \varepsilon_2,\; 0,\; \sqrt{1 - \varepsilon_1^2 - \varepsilon_2^2}\bigr).$$
这一嵌入存在三处数学缺陷：
1. **破坏洛伦兹单位模约束：** 在度规 $\eta_{\mu\nu} = \mathrm{diag}(+1,+1,+1,-1)$ 下，$u_{\text{old}}^\mu$ 的模方为
   $$\eta_{\mu\nu} u_{\text{old}}^\mu u_{\text{old}}^\nu = \varepsilon_1^2 + \varepsilon_2^2 - (1 - \varepsilon_1^2 - \varepsilon_2^2) = -1 + 2(\varepsilon_1^2 + \varepsilon_2^2) \neq -1.$$
   在测试振幅 $a=0.30, b=0.25$ 时，模方误差高达 $+2(a^2+b^2) = 0.3050$，导致 `M2` 中 $L_D/C_1 = 1.00707 \neq 1$。
2. **人为破坏 $\mathrm{SO}(3)_{\text{space}}$ 各向同性：** 第三个空间分量被硬编码为零（$u^z = 0$）。
3. **混淆两个不同的纤维丛：** 将内部时间旋转球面 $S^2 \subset \mathbb{R}^3_{\text{time}}$ 与 4D 以太四速度的空间助推分量 $u^i \in \mathbb{R}^3_{\text{space}}$ 混为一谈。

### 1.2. $H^{3,2}$ 精确分解定理（`M4`）

$\mathbb{R}^{3,3}$（度规 $\eta_{AB} = \mathrm{diag}(+1,+1,+1,-1,-1,-1)$）中单位类时 6-矢量的完整真空流形是 5 维伪球面
$$H^{3,2} = \bigl\{U^A \in \mathbb{R}^{3,3} \;\big|\; \delta_{ij}U^i U^j - \delta_{\alpha\beta}U^\alpha U^\beta = -1\bigr\} \cong \mathbb{R}^3_{\text{boost}} \times S^2_{\text{time}}.$$
$(3,1)$ 时空切片上的任意光滑截面 $U^A(x)$ 唯一地由以下两组场参数化：
- 三个空间助推分量 $\mathbf{u}(x) = (u^1, u^2, u^3) \in \mathbb{R}^3_{\text{space}}$，定义严格归一化的 4D 类时以太矢量
  $$u^\mu(x) = \bigl(u^1, u^2, u^3, \gamma\bigr), \qquad \gamma = \sqrt{1 + \lvert\mathbf{u}\rvert^2}, \qquad \eta_{\mu\nu}u^\mu u^\nu = -1\text{（严格成立）};$$
- 内部时间方向的单位 3-矢量 $\hat{\mathbf{n}}(x) \in S^2 \subset \mathbb{R}^3_{\text{time}}$（$\delta_{\alpha\beta}\hat{n}^\alpha\hat{n}^\beta = 1$）：
  $$U^A(x) = \bigl(u^1(x),\; u^2(x),\; u^3(x);\; \gamma(x)\hat{n}^1(x),\; \gamma(x)\hat{n}^2(x),\; \gamma(x)\hat{n}^3(x)\bigr).$$

由于 $\hat{n}_\alpha \partial_\mu \hat{n}^\alpha = 0$，$\partial_\mu \gamma$ 与 $\partial_\mu \hat{n}^\alpha$ 之间的交叉项恒等于零：
$$\delta_{\alpha\beta}\partial_\mu(\gamma\hat{n}^\alpha)\partial_\nu(\gamma\hat{n}^\beta) = (\partial_\mu\gamma)(\partial_\nu\gamma) + \gamma^2\delta_{\alpha\beta}\partial_\mu\hat{n}^\alpha\partial_\nu\hat{n}^\beta.$$
代入 6D 狄利克雷（Dirichlet）能量密度，即得任意振幅下均成立的**精确非线性恒等式**：
$$\boxed{\eta^{\mu\nu}\eta_{AB}\partial_\mu U^A \partial_\nu U^B = C_1[u] - \bigl(1 + \lvert\mathbf{u}\rvert^2\bigr)\,\eta^{\mu\nu}\delta_{\alpha\beta}\partial_\mu\hat{n}^\alpha\partial_\nu\hat{n}^\beta, \qquad C_1[u] \equiv \eta^{\mu\nu}\eta_{\rho\sigma}\partial_\mu u^\rho \partial_\nu u^\sigma.}$$

在 $\lvert\mathbf{u}\rvert \sim 1$ 的 200 组随机场配置和 $8^4$ 周期晶格上，恒等式相对误差为 $1.69\cdot 10^{-16}$，且 3D 助推扇区的 $L_D/C_1 = 1.000000000000000$。

### 1.3. 物理推论与相反动能符号定理（`No-Go T10`）

1. **纯内部 $S^2$ 扇区（$\mathbf{u}=0$）：** 当 $u^i = 0$ 时，4D 以太矢量恒定为 $u^\mu = (0,0,0,1)$，因此 $C_1[u]=C_2[u]=C_3[u]=C_4[u]=0$。两个戈德斯通模式 $\hat{\mathbf{n}}(x) \in S^2$ 按 $\mathrm{SO}(3)_{\text{space}}\times\mathrm{SO}(3)_{\text{time}}$ 的 $(\mathbf{1},\mathbf{3})$ 表示变换，在 4D 切片上是洛伦兹标量三重态。故 $c_{\text{gw}} = c$ 恒成立，**GW170817 不限制纯内部 $S^2$ 真空的锁定能标 $E_{\text{lock}}$**。
2. **纯助推扇区（$\hat{\mathbf{n}} = \text{const}$，弗罗贝尼乌斯叶状结构）：** 三个模式 $u^i(x) \in \mathbb{R}^3$ 生成完整的 $\mathrm{SO}(3)$ 不变爱因斯坦–以太泛函 $C_1[u]$。
3. **相反动能符号定理（`No-Go T10`）：** 在拉格朗日量 $L = -\frac{\kappa}{2}\eta^{\mu\nu}\eta_{AB}\partial_\mu U^A \partial_\nu U^B$ 中，时间导数项（$\mu=\nu=t$，$\eta^{tt}=-1$）为
   $$L_{\text{kin}} = +\frac{\kappa}{2}\biggl(\sum_{i=1}^3 (\dot{u}^i)^2 - (\dot{\gamma})^2\biggr) - \frac{\kappa}{2}\bigl(1+\lvert\mathbf{u}\rvert^2\bigr)\sum_{\alpha=1}^3 (\dot{\hat{n}}^\alpha)^2.$$
   当 $\kappa > 0$ 时，助推 $u^i$ 动能为正，而内部旋转 $\hat{n}^\alpha$ 动能为负（幽灵态）；当 $\kappa < 0$ 时符号互换。因此在 $(3,3)$ 号差下，单一 6D 狄利克雷项**无法同时传播无幽灵的助推模式 $u^i$ 与内部角度 $\hat{n}^\alpha$**，必有一个扇区被规范冻结。

---

## R2（`M5`）. 6D 曲率约化、对称性保护的 $c_{13}=0$ 与脉冲星界限

### 2.1. 里奇恒等式与麦克斯韦不变量

将 $U^A$ 与 6D 曲率耦合会引入里奇（Ricci）投影恒等式：
$$R_{AB} U^A U^B = \nabla_A\bigl(U^B\nabla_B U^A - U^A\nabla_B U^B\bigr) + (\nabla_A U^A)^2 - (\nabla_A U_B)(\nabla^B U^A) = \text{div} + C_2 - C_3.$$
反对称涡度张量 $F_{AB} = \nabla_A U_B - \nabla_B U_A$（衡量弗罗贝尼乌斯不可积性）满足
$$F_{AB}F^{AB} = 2\bigl(\nabla_A U_B \nabla^A U^B - \nabla_A U_B \nabla^B U^A\bigr) = 2(C_1 - C_3),$$
在 $8^4$ 周期晶格上验证的相对误差为 $1.95\cdot 10^{-13}$。

### 2.2. $c_{13}=0$ 的对称性保护为何仍无法挽救普朗克能标

在线性阶下，**梯度移动规范对称性** $U_A \mapsto U_A + \partial_A\varphi$ 将横向动能项限制为麦克斯韦项 $-\frac{\kappa}{4}F_{AB}F^{AB}$（加上规范固定项 $-\frac{c_2}{2}(\nabla\cdot U)^2$），从而无需微调即给出
$$c_1 = \varepsilon, \qquad c_3 = -\varepsilon, \qquad c_4 = 0 \implies c_{13} = c_1 + c_3 = 0 \quad \text{（恒成立）},$$
使自旋-2 与自旋-1 速度在任意 $\varepsilon$ 下恒等于光速：$s_2^2 \equiv 1$，$s_1^2 \equiv 1$。

然而，在 $c_1 = -c_3 = \varepsilon, c_4 = 0$ 时，PPN 优选参考系参数 $\alpha_1, \alpha_2$ **不为零**：
$$\alpha_1 = -4\varepsilon, \qquad \alpha_2 = -\frac{\varepsilon}{2} + O\Bigl(\frac{\varepsilon^2}{c_2}\Bigr).$$
要同时消去 $\alpha_1$ 和 $\alpha_2$ 必须取 $c_4 = -\varepsilon$，但四次自加速项 $c_4(U^A\nabla_A U_B)^2$ 显式破坏梯度移动对称性。因此脉冲星界限 $\lvert\alpha_2\rvert \le 1.6\cdot 10^{-9}$（配合 $s_0^2 \ge 1$）给出上限：
$$\varepsilon_{\max}\bigl(c_{13}=0\bigr) = 6.61\cdot 10^{-8} \iff E_{\text{lock}} = \sqrt{\varepsilon_{\max}}\,M_{\text{Pl}} \le 6.26\cdot 10^{14}\text{ GeV},$$
依然**排除了普朗克能标（$2.435\cdot 10^{18}$ GeV）与大统一能标（$10^{16}$ GeV）**。

---

## R3（`P5+`）. 快速有界 logit 噪声的精确理论与耦合晶格波利亚罐

### 3.1. 快速 logit 噪声下的精确切向特征值

由 Pemantle 随机逼近定理，份额 $x_\alpha = n_\alpha/N$ 的演化由噪声平均漂移 $\bar{q}_\alpha(x) = \mathbb{E}_\xi[\pi_\alpha(x,\xi)]$ 控制。在对称点 $x_* = (1/3,1/3,1/3)$ 处，置换对称性给出 $\mathbb{E}[\pi_1] = 1/3$，从而单形切平面上的线性化特征值具有精确闭合形式：
$$\boxed{\lambda_{\text{eff}}(\theta,\sigma) = \theta\,\chi(\sigma) - 1, \qquad \chi(\sigma) = \frac{9}{2}\,\mathbb{E}\bigl[\pi_1(1-\pi_1)\bigr] = 1 - \frac{9}{2}\,\mathrm{Var}\bigl(\pi_1(\sigma)\bigr) = 1 - \frac{\sigma^2}{9} + O(\sigma^4).}$$

对于 $\theta = 2$，这给出了两个截然不同的动力学区域：
1. **幂律时间拉伸区（$0 < \sigma < \sigma_c \approx 3.553$）：** 当 $\sigma = 2.0$ 时，$\chi(2.0) = 0.7182$，$\lambda_{\text{eff}}(2, 2.0) = 0.4364$，**锁定时间幂指数 $1/\lambda_{\text{eff}}$ 从 $1.000$ 增大至 $2.291$**，定量解释了 `P5_STRESS` 中 $30\,000$ 步内锁定比例从 $100\%$ 降至 $37.5\%$ 的现象。
2. **亚临界分岔与克拉默斯势垒（$\sigma > \sigma_c \approx 3.553$）：** 当 $\chi(\sigma) < 1/\theta$（如 $\sigma = 4.0$ 时 $\lambda_{\text{eff}} = -0.081 < 0$）时，对称点 $x_*$ 在平均场中变为**局部稳定吸引子**，而顶点附近（$a = 1 - 2\delta$）渐近漂移仍为正：
   $$\bar{q}_1(1-2\delta) - (1-2\delta) \simeq 2\delta\biggl[1 - \delta^{\theta-1}\Bigl(\frac{\sinh\sigma}{\sigma}\Bigr)^2\biggr] > 0,$$
   在对称中心与吸收顶点之间形成克拉默斯分界线 $a_{\text{sep}}(\sigma) \approx 1 - 2(\sigma/\sinh\sigma)^2$（$\sigma=4.0$ 时数值解为 $0.9318$）。

### 3.2. 连接 `P5` $\leftrightarrow$ `P4`：耦合晶格波利亚罐与全局叶状结构

在 $6\times 6$ 空间晶格上，所有格点从对称相 $n_x(0) = (1,1,1)$ 出发：
- **无空间耦合（$J = 0$）：** 各格点独立锁定（$\langle d_T^{\text{local}}\rangle = 1.017$），但全晶格分裂为因果不相容的畴（$\langle d_T^{\text{global}}\rangle = 2.907 \approx 3$，共识率 $0.400$）。
- **有空间耦合（$J = 0.35$，近邻增强 + 离散拉普拉斯算子 $\Delta_{\text{lat}} n_\alpha$）：** 非零空间模式 $k \neq 0$ 按 $-J(2 - \cos k_x - \cos k_y) < 0$ 指数衰减，均匀零模 $k = 0$ 被波利亚不稳定性放大，**100% 的运行**在整个晶格上锁定同一直线时间轴（$\text{consensus} = 1.000$，$\langle d_T^{\text{global}}\rangle = \langle d_T^{\text{local}}\rangle = 1.137 \to 1$）。

---

## R4（`H1`）. 巴尔蒂尼 1965 年原始文献审计

我们对 R. O. di Bartini 1965 年发表于《苏联科学院院报》（*Доклады АН СССР*, 1965, т. 163, № 4, с. 861–864，由庞蒂科夫院士推荐）的原文进行了直接核查：
1. **表 2 极值的 10 位有效数字精确复现：** 单位球面积函数 $S_{n+1}(z) = 2\pi^z/\Gamma(z)$（$z=(n+1)/2$）的极值满足 $\psi(z)=\ln\pi$：
   - 正全局极大值（$z_+ = 3.6284732021$，$n_+ = +6.2569464042 \approx +6$）：$S_{n+1}(z_+) = +33.1611944850$（原文表 2：$+33.161194485$）；
   - 负分支极值包络 $\lvert S_{n+1}(z_{-k})\rvert$ 的全局极小值位于第 $k=3$ 支（$z_{-3} = -2.4956420472$，$n_{-3} = -5.9912840945 \approx -6$，恰为 $n_+ \approx +6$ 的镜像分支）：$S_{n+1}(z_{-3}) = -0.120954210785$（原文表 2：$-0.1209542108$）；
   - 极值比 $\bar{E} = S_{\max}/\lvert S_{\min}\rvert = 274.16320829$（原文表 2：$274.163208$）。
2. **向 1965 年 $\alpha^{-1}$ 的人工拟合与 CODATA-2022 检验：** 纯解析极值比的一半 $\bar{E}/2 = 137.0816041$ 偏离精细结构常数达 $3.33\cdot 10^{-4}$。巴尔蒂尼人为引入偏移常数 $E = 274.074996 \approx \frac{1}{4}e^{6.9996968}$（$E/2 = 137.037498$）以匹配 1965 年实验值 $\alpha^{-1}_{1965} \approx 137.0375$；该值与现代 CODATA-2022（$137.035999177(21)$）相差 $+10.9\text{ ppm}$（**$71\,373\,\sigma$**）。
3. **揭示二次文献中的 OCR 错误（$B = 2885.3453$）：** 诸多网络转载将 $B = 2885.3453$ 的公式误写为 $\sqrt{6}\cdot E/\pi$（$= 213.688$）。直接验算证明，这是将 6 维环面体积符号 $V_6 = \frac{16\pi^3}{15} \approx 33.07336$ 误识别为根号 $\sqrt{6}$ 所致；真实公式为 $B = V_6 E/\pi = \frac{16\pi^2}{15}E = 2885.3459$。
4. **Look-elsewhere 统计检验：** 巴尔蒂尼乘性基 $2^a 3^b 5^e \pi^{c/2} E^d$ 在区间 $[100, 2000]$ 内含 **$7\,761$ 个格点**，随机目标落入最近格点的中位相对误差仅为 **$1.10\cdot 10^{-4}$**（落入 $\le 3.33\cdot 10^{-4}$ 的概率达 **$76.0\%$**）。
