# P5 压力测试：垄断定理、临界锁定时间与噪声鲁棒性

**代码：** `node bartini_plus/p5_stress.mjs`  
**数据：** `results/p5_stress.json`  
**地位：** P5 的数学命题已证；P5 的物理起源未得到。

---

## 1. 结论总览

| 问题 | 结果 |
|---|---|
| $p_\alpha\propto n_\alpha^\theta$ 是否由 $(3,3)$ 度量推出？ | 否 |
| P5 是否有精确变分形式？ | 是，作为熵正则化选择 |
| 强垄断的精确临界界在哪里？ | $\theta_c=1$ |
| $\theta>1$ 时随机瓮是否锁定？ | 对任意有限正初值，几乎必然锁定 |
| 对称初值是否例外？ | 仅在确定性平均场中例外；随机瓮中不例外 |
| $\tau_{\rm lock}\sim(\theta-1)^{-1}$ 是否成立？ | 否 |
| 什么按 $(\theta-1)^{-1}$ 发散？ | 对称点附近的平均场 $\log\tau_{\rm lock}$ |
| 精确锁定对任意持续噪声是否稳定？ | 否 |
| 这是否给出自然定律？ | 否 |

关键区分：代码中的阈值

$$
\max_\alpha p_\alpha\ge 0.95
$$

只是**首次越过阈值**。精确锁定（强垄断）是指存在有限随机步，其后全部滴答永远属于同一只钟。首次达到 $0.95$ 可被后续涨落推翻，本身不证明垄断。

---

## 2. 幂律从何而来

检验了六个候选：

1. 纯最大熵给出 $p_\alpha=1/3$，不是 P5。
2. 熵正则化对数收益精确给出 P5。
3. 变分原理仅在显式假定该对数收益后给出 P5。
4. 优先连接（preferential attachment）把幂权重当作唯象规则。
5. `FOUR_STEPS.md` 中的场 $n(x)\in S^2$ 给出调和映照动力学，不推出瓮。
6. 时间方向的 $S^2$ 几何既不挑出三条离散轴，也不确定 $\theta$。

### 2.1. 精确变分推导

在单纯形 $\Delta_2$ 上考虑严格凹泛函

$$
\mathcal F(p\mid n)
=
\theta\sum_{\alpha=1}^3p_\alpha\ln n_\alpha
-\sum_{\alpha=1}^3p_\alpha\ln p_\alpha,
\qquad \sum_\alpha p_\alpha=1.
$$

拉格朗日条件 $\theta\ln n_\alpha-\ln p_\alpha-1+\lambda=0$ 给出唯一极大

$$
\boxed{
p_\alpha=
\frac{n_\alpha^\theta}{\sum_\beta n_\beta^\theta}
}.
$$

运行中的数值 KKT 残差为 $8.9\cdot10^{-16}$。这是有条件推导：泛函 $\mathcal F$、对数收益与 $\theta$ 仍是公设。

### 2.2. 无标度 Luce 选择公理

若要求无关备选项独立性 $p_i/p_j=f(n_i)/f(n_j)$ 与标度不变性 $n\mapsto cn$，正连续函数 $f$ 满足柯西乘性方程，解为 $f(n)=Cn^\theta$。这两条公理同样外在于 $(3,3)$ 几何。

---

## 3. 定理：精确临界界 $\theta_c=1$

设权重 $w(m)=m^\theta$，初值 $n_\alpha(0)$ 有限且为正。

**强强化定理（Davis / Rubin）。**

$$
\sum_{m=1}^\infty\frac1{w(m)}<\infty
\quad\Longleftrightarrow\quad
\text{有限步之后单一颜色几乎必然获得全部滴答}.
$$

对 $w(m)=m^\theta$：

$$
\sum_{m=1}^\infty m^{-\theta}<\infty
\quad\Longleftrightarrow\quad
\boxed{\theta>1}.
$$

### Rubin 指数嵌入证明

对每只钟 $\alpha$ 及未来计数 $m\ge n_\alpha(0)$，取独立指数等待时间 $E_{\alpha,m}\sim\operatorname{Exp}(w(m))$，爆炸时间

$$
T_\alpha=\sum_{m=n_\alpha(0)}^\infty E_{\alpha,m}.
$$

当 $\sum 1/w(m)<\infty$ 时，所有 $T_\alpha<\infty$ 几乎必然成立，且连续独立分布的极小值 $T_{\alpha_*}$ 几乎必然唯一。在 $T_{\alpha_*}$ 之前赢家发生无穷次滴答，而每个输家仅发生有限次。故最后一次外来事件之后只有 $\alpha_*$ 走字。

- $\theta<1$：份额趋于 $1/3$；
- $\theta=1$：经典波利亚瓮，份额收敛到单纯形内部随机点；
- $\theta>1$：几乎必然强垄断。

---

## 4. 单纯形平均场动力学

令 $x_\alpha=n_\alpha/N$，$q_\alpha(x)=x_\alpha^\theta/\sum_\beta x_\beta^\theta$，$s=\ln N$，平均场方程为

$$
\boxed{
\frac{dx_\alpha}{ds}=q_\alpha(x)-x_\alpha
}.
$$

在对称点 $x_*=(1/3,1/3,1/3)$ 切平面上的两个特征值均为

$$
\boxed{\lambda=\theta-1}.
$$

任意两分量之比满足

$$
\frac{d}{ds}\ln\frac{x_i}{x_j}
=
\frac{x_i^{\theta-1}-x_j^{\theta-1}}
{\sum_\beta x_\beta^\theta}.
$$

---

## 5. 临界锁定时间

对两个对称输家 $x=(a,b,b)$，$y=\ln(a/b)$，平均场精确方程给出阈值 $q_{\max}=q$（$y_q=\theta^{-1}\ln(2q/(1-q))$）的对数时间：

$$
\boxed{
s_q=
\int_{y_0}^{y_q}
\frac{e^{\theta y}+2}
{(e^y+2)(e^{(\theta-1)y}-1)}
\,dy
}.
$$

当 $\theta=1+\varepsilon$（$\varepsilon\to 0^+$）时，

$$
s_q=\frac1\varepsilon\ln\frac{y_q(1)}{y_0}+O(1),
\qquad
\boxed{
\ln\tau_{\rm lock}\sim\frac{C}{\theta-1}
}.
$$

按 $(\theta-1)^{-1}$ 发散的是锁定时间的**对数**（本性奇点）。对 $x_0=(0.34,0.33,0.33)$，$q=0.95$，$N_0=100$：$C_{\rm theory}=4.8027915$，$C_{\rm fit}=4.8029515$，$R^2=0.9999999999$。在 $\theta=1.05$ 时 $\log_{10}N_q\approx 43.6$；在 $\theta=1.02$ 时 $\log_{10}N_q\approx 106.2$。

---

## 6. 扰动与噪声鲁棒性

### 6.1. 初值与有界 logit 噪声

有限正初值不改变 $\theta>1$ 的几乎必然垄断。有界快噪声 $\widetilde p_\alpha(k)\propto n_\alpha^\theta e^{\sigma\xi_\alpha(k)}$（$\xi_\alpha\sim U[-1,1]$）显著推迟有限步内的阈值命中（$\sigma=0\to 2$ 时命中率从 $0.948$ 降至 $0.375$）。

### 6.2. 持续探索噪声摧毁精确锁定

对容许的加性探索噪声

$$
\boxed{
\widetilde p_\alpha
=(1-\mu)p_\alpha+\frac{\mu}{3}
},
\qquad \mu>0,
$$

有 $\widetilde p_\alpha\ge \mu/3$。由条件 Borel–Cantelli 引理，每只钟几乎必然走字无穷次，因此**任何 $\mu>0$ 下精确垄断都不可能**。

平均场对称点的局部稳定界为

$$
\boxed{\mu_c=1-\frac1\theta}.
$$

当 $\theta=2$ 时，$\mu_c=0.5$，而非对称不动点满足 $3a^2+(\mu-3)a+\mu=0$，在鞍结分岔点 $\mu_{\rm sn}=9-6\sqrt{2}\approx 0.514719$ 消失，在 $(0.5,0.514719)$ 内形成双稳共存区。

---

## 7. 判定

P5 在纯模型下成立（$\theta>1\Rightarrow$ 几乎必然强垄断），但受三条限制：

1. P5 不由 $(3,3)$ 推出；
2. 临界慢化为 $\log\tau_{\rm lock}\sim C/(\theta-1)$；
3. 任何非零探索底噪 $\mu>0$ 都会消灭精确垄断。

### 文献

- Rubin 指数嵌入与强垄断判据：[Gottfried, Grosskinsky, arXiv:2406.15006](https://arxiv.org/abs/2406.15006)。
- 非线性瓮的渐近制度：[Gottfried, Grosskinsky, arXiv:2303.01210](https://arxiv.org/abs/2303.01210)。
- 竞争持续时间的重尾分布：[Jiang et al., arXiv:1604.02097](https://arxiv.org/abs/1604.02097)。
