# 给研究者的说明

**项目：** 巴尔蒂尼+ — 对 R. O. di Bartini 的 $3+3$ 纲领的复原、随机扩展、场约化、分岔点时间二象性，以及定理、禁令与原始/二次文献错误清单。  
**作者：** 亚历山大·库捷波夫（[@AlexKutepov](https://github.com/AlexKutepov)）与 2026 年 Cursor / Antigravity 研究链中的大语言模型。假说由库捷波夫提出，发表责任归他；复原、证明与代码与 LLM 共同完成。  
**仓库：** https://github.com/AlexKutepov/bartini-plus  
**许可：** MIT  
**引用：** `CITATION.cff`

这是地图。证明在文末所列文件中。若要使用、反驳或续做，先读本文。

---

## 巴尔蒂尼（1965）及二次文献中已核实的错误清单

为避免后续研究者重复历史谬误，特此记录四项经严格核实的结论（完整推导与代码见 [DEEP_RESEARCH.md](DEEP_RESEARCH.md) 与 `bartini_plus/deep_research.mjs`）：

1. **常数 $E$ 针对 1965 年 $\alpha^{-1}$ 的人工拟合（与 CODATA-2022 偏差达 $71\,373\,\sigma$）。**
   - 巴尔蒂尼 1965 年论文（*Доклады АН СССР*, 1965, т. 163, № 4, с. 861–864）表 2 给出了单位球面积函数 $S_{n+1}(z) = 2\pi^z/\Gamma(z)$ 在 $n_+ = +6.2569464$ 处的全局正极大值 $+S_{\max} = +33.161194485$ 与镜像负分支 $k=3$（$n_{-3} = -5.9912841 \approx -6$）处的极值 $-S_{\min} = -0.1209542108$。
   - 两者的**纯解析比值**为 $\bar{E} = S_{\max}/\lvert S_{\min}\rvert = 274.16320829$，给出 $\bar{E}/2 = 137.0816041$，偏离 $\alpha^{-1}$ 达 $+3.33\cdot 10^{-4}$。
   - 为凑出 1960 年代中期的实验值（$\alpha^{-1}_{1965} \approx 137.0375$），巴尔蒂尼人为将 $\bar{E}$ 替换为偏移常数 $E = 274.074996 \approx \frac{1}{4}e^{6.9996968}$（$E/2 = 137.037498$）。现代 CODATA-2022（$\alpha^{-1} = 137.035999177(21)$）**以 $71\,373\,\sigma$ 排除该值**。
2. **常数表中的 Look-elsewhere 统计假象。**
   - 乘性基 $2^a 3^b 5^e \pi^{c/2} E^d$ 在区间 $[100, 2000]$ 内产生 $7\,761$ 个格点，中位间距仅 **$1.10\cdot 10^{-4}$**，随机数落入 $\le 3.33\cdot 10^{-4}$ 的概率高达 **$76.0\%$**。
3. **二次转载中的严重 OCR 识别错误（$B = 2885.3453$）。**
   - 网络转载普遍将 $B = 2885.3453$ 的公式误写为 $\sqrt{6}\cdot E/\pi$（$= 213.69$）。实际上原文为 6 维环面体积 $V_6 = \frac{16\pi^3}{15} \approx 33.07336$：$B = V_6 E/\pi = \frac{16\pi^2}{15}E = 2885.3459$，斜体 $V_6$ 在 OCR 扫描中被误识别为根号 $\sqrt{6}$。
4. **三个时间维无法在连续 6D 体空间内同时保持动力学活性（`T3`, `T10`）。**
   - 连续体空间中的隐蔽时间动量给出快子质量平方 $m^2 < 0$（`T3`），且 $H^{3,2}$ 上的 6D 狄利克雷项使时空助推 $u^i$ 与内部时间旋转 $\hat{n}^\alpha \in S^2$ 具有**相反的动能符号**（`No-Go T10`）。自洽性要求要么规范冻结于单一 $(3,1)$ 切片，要么仅在**离散分岔超曲面 $\Sigma_*$ 上发生分段弗罗贝尼乌斯时间分岔（`B1–B5`）**。

---

## 如何复现

需要 Node.js。

```bash
node bartini_plus/experiments.mjs
node bartini_plus/four_steps.mjs
node bartini_plus/close_gaps.mjs
node bartini_plus/p5_stress.mjs
node bartini_plus/aether_bounds.mjs
node bartini_plus/n_times.mjs
node bartini_plus/math_tighten.mjs
node bartini_plus/deep_research.mjs
node bartini_plus/branching_time.mjs
```

---

## 文件地图

| 文件 | 内容 |
|---|---|
| [PROOF](PROOF.md) | 从巴尔蒂尼到巴尔蒂尼+与 L0–L3 的完整链条 |
| [P5_STRESS](P5_STRESS.md) | P5 垄断定理、临界锁定时间、噪声鲁棒性 |
| [FOUR_STEPS](FOUR_STEPS.md) | 测度、签名、场 $n$、爱因斯坦约化 |
| [CLOSE_GAPS](CLOSE_GAPS.md) | T1–T9 |
| [MATH_TIGHTEN](MATH_TIGHTEN.md) | M1–M3 |
| [DEEP_RESEARCH](DEEP_RESEARCH.md) | R1–R4：$H^{3,2}$ 纤维丛分解（`M4/T10`）、对称性 $c_{13}=0$（`M5`）、快速噪声与耦合晶格（`P5+`）、1965 年文献审计（`H1`） |
| [BRANCHING_TIME](BRANCHING_TIME.md) | B1–B5：多世界时间分岔、决策点时间二象性、托姆横截性（$q_{\min}=3$）、分支退相干 |
| `bartini_plus/*.mjs` | 数值运行脚本 |
| `results/*.json` | 原始数据 |

俄文、英文全文见 `docs/ru/`、`docs/en/` 中的同名文件。
