# 给研究者的说明

**项目：** 巴尔蒂尼+ — 对 R. O. di Bartini 的 $3+3$ 纲领的复原、随机扩展、场约化，以及定理与禁令的显式清单。  
**作者：** 亚历山大·库捷波夫（[@AlexKutepov](https://github.com/AlexKutepov)）与 2026 年 Cursor 研究链中的大语言模型。假说由库捷波夫提出，发表责任归他；复原、证明与代码与 LLM 共同完成。  
**仓库：** https://github.com/AlexKutepov/bartini-plus  
**许可：** MIT  
**引用：** `CITATION.cff`

这是地图。证明在文末所列文件中。若要使用、反驳或续做，先读本文。

---

## 这是什么

一次公开、可复现的尝试，把常被混在一起的四层分开：

1. **历史上的巴尔蒂尼** — 量纲表 $L^a T^b$、1965 年风格的积分（极小在 $n=6$ 附近）、公设 $M_6=M_3^{\mathrm{space}}\times M_3^{\mathrm{time}}$。
2. **签名 $(3,3)$ 的几何** — 平坦度量、测地线、向单一时间的投影、超双曲波、柯西问题、质量符号。
3. **巴尔蒂尼+** — *新的*随机机制（非线性波利亚瓮），选择一只打勾的钟。巴尔蒂尼文本中没有这一层。
4. **无瓮约化** — 时间 3-平面中的 $n\in S^2$，再加 Frobenius 与秩 4 的退化物理度量。

*数学上*闭合的链条是：自对偶高斯 $\to n=6\to$ 光锥体积极大 $\to(3,3)\to n$ 场/chronon $\to$ 切片上的爱因斯坦。

在测度原理成为定律、并出现可区分且仍存活的预言之前，它**不**进入自然。我们不声称它已经进入。

---

## 我们做了什么（顺序）

1. 复原 $m(n)$，解 $\psi(\frac{n+1}{2})=\ln\pi$：$n_*=6.25694641$，整数局部极小 $n=6$。
2. 写出平坦 $(3,3)$。证明 $3+1$ 是切片而非推论。隐蔽时间给出超光速投影、$m_{\mathrm{eff}}^2\le 0$、超双曲柯西问题不适定。
3. 巴尔蒂尼+公理。$\theta>1$ 时锁定；$\Gamma\approx\frac12\mathrm{Var}(c)\,k^2\Delta t$（修正了原先的因子 2）。
4. 数值 **L0–L3**，十项预登记判定全部通过。切换 $c$ 时波的*能量*被泵浦；正确观测量是 $|\langle\psi\rangle|$。
5. 用傅里叶自对偶与 $m(n)=1/\mathrm{Area}(S^n)$ 替换任意的 $e^{-\pi x^2}$。$a\neq\pi$ 得不到 6。在 6 的分裂中 $(3,3)$ 唯一极大化实光锥体积。
6. 用 $n:M\to S^2$ 的 Dirichlet 能量替换瓮。拓扑允许时随机初值会锁定。
7. **T1–T7**：Frobenius 下戈德斯通为规范；隐蔽时间 KK 质量被禁止；$\partial_\perp=0$ 是规范；$g_{\mathrm{phys}}$ 谱为 $(1,1,1,-1,0,0)$；投影后 $H>0$。没有不同于广义相对论且仍存活的数字。
8. 可检验性 **T8–T9**（`aether_bounds.mjs`）：以刚度 $f=E_{\mathrm{lock}}$ 放松 Frobenius，巴尔蒂尼+ 映射为只有一个系数 $c_1=(E_{\mathrm{lock}}/M_{\mathrm{Pl}})^2$ 的 Einstein-aether。GW170817 给出 $E_{\mathrm{lock}}\le9.7\cdot10^{10}$ GeV；普朗克尺度锁定被排除。时间轴缺陷（T9）由 Planck 给出更弱的界 $\eta\lesssim10^{16}$ GeV。
9. 收紧 **M1–M3**（`math_tighten.mjs`）：maxent + 幺正傅里叶固定 $a=\pi$；单靠自对偶会移动 $n_*$（厄米 $4k$）。切片上 Dirichlet 只有 $c_1$。物理 $d_s=4$；紫外六是未约化算子，不是切片的预言。

---

## 我们证明了什么 / 没有证明什么

已证：上述积分与球面恒等式、$n=6$、$(3,3)$ 为光锥极大、$3+1$ 仅为切片、瓮的锁定与 $\Gamma$、Life 仅在 lock+生命规则下存活、T1–T6、T8 上界（$E_{\mathrm{lock}}\le9.7\cdot10^{10}$ GeV）、M1–M3（maxent+$\mathcal F$、$L_D=C_1$、物理 $d_s=4$）。

未证：宇宙在物理上是六维的；巴尔蒂尼推出了无量纲常数；已锁定世界的每一瞬间都在三只钟里抽签；maxent 是自然定律（M1 只命名了配对；无 maxent 的自对偶不能给出 $n=6$）；粒子质量来自额外时间（**T3 禁止**）；一个尚未被洛伦兹检验杀死的新实验室数字。

T2–T6 之后，切片就是普通 $3+1$ 广义相对论。这是自洽约化的代价。时间轴刚度非零时（T8），chronon 是物理的，且已被 GW170817 限制；得到的数字是否定的——上界，不是探测。

「巴尔蒂尼算出了全部常数」在拿出原始公式、输入与自由参数个数之前，应视为未核实。我们在所用材料中没有找到这样的推导。

---

## 如何复现

需要 Node.js。

```bash
node bartini_plus/experiments.mjs
node bartini_plus/four_steps.mjs
node bartini_plus/close_gaps.mjs
node bartini_plus/aether_bounds.mjs
node bartini_plus/math_tighten.mjs
```

种子写在脚本里。判定为布尔值，打印到 stdout。若改 $c_\alpha$、$\theta$ 或傅里叶约定，$n_*$ 与 $\Gamma$ **必须**移动。

不要靠把隐蔽时间的动能改成类空来「改进」质量。那就是 T3：它们就不再是时间。

仍能改变科学地位的开口只有：从已接受物理推出维度权重的 maxent；一个能活过 $\sim 10^{-15}$ 的预言；巴尔蒂尼一手文献。全文见 `docs/ru/MATH_TIGHTEN.md`。

俄文、英文全文见 `docs/ru/`、`docs/en/` 中的同名文件。
