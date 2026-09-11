# 填洞：定理与一条禁令

**作者：** 亚历山大·库捷波夫与 LLM。  
**运行：** `node bartini_plus/close_gaps.mjs` → `results/close_gaps.json`；T8–T9：`node bartini_plus/aether_bounds.mjs` → `results/aether_bounds.json`。

**T1.** 若 $n=6$ 来自方向测度极大，则同一泛函在 $p+q=6$ 上唯一选取 $(3,3)$，并在本链条内禁止 $(4,2)$。

**T2.** $T^3$ 中 Frobenius $n\wedge dn=0$ 给出 $n=d\tau/|d\tau|$。时间重参数化吃掉 $\tau$。物理戈德斯通：0。不需要 $m_n$。

**T3（不可能）。** 沿隐蔽*时间*的傅里叶模给出 $m^2<0$。正 $m^2$ 会把该方向改成空间。粒子质量不是 $3+3$ 的定理。质量从切片上的希格斯导入。

**T4.** 若 $\mathcal L=\mathcal L(n\cdot\partial_t\phi,\nabla\phi)$，则 $\phi\mapsto\phi+\varepsilon(q_\perp)$ 是对称。$\phi=\phi(x,T)$ 是规范固定。

**T5.** $g_{\mathrm{phys}}$ 特征值为 $(1,1,1,-1,0,0)$：秩 4，签名 $(3,1)$，核 2。核的紧致化不在 $g_{\mathrm{phys}}$ 中产生 CTC。

**T6.** 投影后 $H>0$。未投影的 Klein–Gordon 内积不定。约化后无额外时间鬼场。

**T7.** T2–T6 之后切片上是广义相对论（至多加一个 chronon）。没有存活的、不同于 GR 的数字。M3：物理 $d_s=4$；紫外六属于未约化算子，链条禁止量子化它。与 CDT 的张力不是切片的预言。

**T8（放松 T2 换取可检验性）。** 去掉 Frobenius，给时间轴一个刚度 $f^2=E_{\mathrm{lock}}^2$。切片上 $u^\mu$ 成为动力学单位类时矢量：Einstein-aether（Jacobson–Mattingly）。6D Dirichlet 能量在 $\partial_\perp=0$（T4）下只映射到 $c_1=(E_{\mathrm{lock}}/M_{\mathrm{Pl}})^2\equiv\varepsilon$，$c_2=c_3=c_4=0$，没有可供相消的自由系数。于是 $s_2^2=1/(1-\varepsilon)$，GW170817（$c_{\mathrm{gw}}/c-1<7\cdot10^{-16}$）给出


$$
\varepsilon\le1.6\cdot10^{-15}\iff E_{\mathrm{lock}}\le 9.7\cdot10^{10}\ \mathrm{GeV}.
$$



$E_{\mathrm{lock}}=M_{\mathrm{Pl}}$：$c_{13}=1$，自旋 2 动能变号——死。$10^{16}$ GeV：被 GW170817 与 $\alpha_2$ 杀死。$\le5\cdot10^{10}$ GeV：通过 GW170817、引力切伦科夫（所有 $s_i^2\ge1$）、脉冲星 $|\alpha_1|<4\cdot10^{-5}$、$|\alpha_2|<1.6\cdot10^{-9}$、BBN、无鬼条件。一般 Einstein-aether 在 $\varepsilon=O(1)$ 只在一条细缝上存活（$c_{13}=0$ 精确到 $7\cdot10^{-16}$，$c_{14}/c_1\approx3\cdot10^{-9}$，$c_2\sim10^{-4}$）；巴尔蒂尼+ 的映射到不了那里。80 个符号模式 $\{-1,0,1\}\varepsilon$ 中无一在 $\varepsilon\ge1$ 存活。对 T2 的修正：$f\ne0$ 时即使有 Frobenius，chronon 也是物理的（chronometric 引力，$\beta=c_{13}=\varepsilon$），同一 GW 界；T2 仅在 $f=0$ 精确。**结论：** 带 Dirichlet 刚度的巴尔蒂尼+ 可证伪且已被限制：$E_{\mathrm{lock}}\lesssim10^{11}$ GeV，否则 $f=0$ 而理论即 GR（T7）。普朗克尺度被排除。一个存活的数字，且是否定的。

**T9.** 若在空间中也去掉 $\partial_\perp=0$，$\pi_2(S^2)=\mathbb Z$ 给出 $n$ 的全局单极，立体角亏损 $8\pi G\eta^2$。Planck 缺陷界 $G\eta^2\lesssim10^{-6}$ 给 $\eta\lesssim1.2\cdot10^{16}$ GeV，比 T8 弱五个量级。Frobenius 扇区中没有刺猬解；T9 在 T8 之外不增加任何东西。

测度原理仍不是自然定律。巴尔蒂尼仍不是关于宇宙的事实。已证明的是：在时间为一道零刚度梯度时，$3+3\to 3+1$ 的自洽约化，无需瓮、无时间 KK 快子、无物理度量中的 CTC、无戈德斯通；刚度非零时，锁定尺度被 GW170817 从上方限制。
