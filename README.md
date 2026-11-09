# Бартини+ / Bartini+ / 巴尔蒂尼+

**Гипотезу формулировал и проверял Александр Кутепов ([@AlexKutepov](https://github.com/AlexKutepov)) совместно с языковыми моделями (LLM).**

Открытое исследование шестимерной конструкции Р. О. ди Бартини ($3+3$) и стохастической надстройки: случайный выбор тикающего часа, запирание на одном времени, численная проверка L0–L3, редукция на срез $(3,1)$, ограничения Эйнштейна–эфира и аудит первоисточника 1965 года.

Читать с формулами: открыть [`site/index.html`](site/index.html) (KaTeX). Пересборка: `node tools/docs_build.mjs`. В исходниках формулы в `$...$` / `$$...$$` — так их понимает GitHub.

**Для исследователей / For researchers / 给研究者** — что сделано, что доказано, чего нет, как воспроизвести, что не цитировать:

- [Русский](docs/ru/FOR_RESEARCHERS.md)
- [English](docs/en/FOR_RESEARCHERS.md)
- [中文](docs/zh/FOR_RESEARCHERS.md)

Полные доказательства и вся цепочка рассуждений:

| Язык | Бартини / Бартини+ | Стресс-тест P5 | Четыре шага | Дыры | Ужесточение | Углублённое R1–R4 |
|---|---|---|---|---|---|---|
| Русский | [docs/ru/PROOF.md](docs/ru/PROOF.md) | [docs/ru/P5_STRESS.md](docs/ru/P5_STRESS.md) | [docs/ru/FOUR_STEPS.md](docs/ru/FOUR_STEPS.md) | [docs/ru/CLOSE_GAPS.md](docs/ru/CLOSE_GAPS.md) | [docs/ru/MATH_TIGHTEN.md](docs/ru/MATH_TIGHTEN.md) | [docs/ru/DEEP_RESEARCH.md](docs/ru/DEEP_RESEARCH.md) |
| English | [docs/en/PROOF.md](docs/en/PROOF.md) | [docs/en/P5_STRESS.md](docs/en/P5_STRESS.md) | [docs/en/FOUR_STEPS.md](docs/en/FOUR_STEPS.md) | [docs/en/CLOSE_GAPS.md](docs/en/CLOSE_GAPS.md) | [docs/en/MATH_TIGHTEN.md](docs/en/MATH_TIGHTEN.md) | [docs/en/DEEP_RESEARCH.md](docs/en/DEEP_RESEARCH.md) |
| 中文 | [docs/zh/PROOF.md](docs/zh/PROOF.md) | [docs/zh/P5_STRESS.md](docs/zh/P5_STRESS.md) | [docs/zh/FOUR_STEPS.md](docs/zh/FOUR_STEPS.md) | [docs/zh/CLOSE_GAPS.md](docs/zh/CLOSE_GAPS.md) | [docs/zh/MATH_TIGHTEN.md](docs/zh/MATH_TIGHTEN.md) | [docs/zh/DEEP_RESEARCH.md](docs/zh/DEEP_RESEARCH.md) |

Авторы: [AUTHORS.md](AUTHORS.md). Лицензия: [MIT](LICENSE).

---

## Что доказано, что нет

**Доказано (условно, внутри модели).**

1. При функции Бартини $m(n)=\Gamma(\frac{n+1}{2})/(2\pi^{(n+1)/2})$ непрерывный минимум $n_*\approx 6.2569$; среди целых локальный минимум — $n=6$.
2. Метрика сигнатуры $(3,3)$ математически допустима; $3+1$ есть её срез, не автоматическое следствие.
3. Нелинейная урна $p_\alpha\propto n_\alpha^\theta$ при $\theta>1$ запирает одно наблюдаемое время ($d_T:3\to 1$, точная сильная монополия по критерию Рубина при $\theta_c=1$, $\ln\tau_{\rm lock}\sim C/(\theta-1)$ в mean-field, разрушение точного lock при постоянном exploration-шуме $\mu>0$). При быстром ограниченном logit-шуме $\sigma$ эффективное собственное значение равно $\lambda_{\rm eff}(\theta,\sigma)=\theta\chi(\sigma)-1$, где $\chi(\sigma)=1-\frac{9}{2}\mathrm{Var}(\pi_1)=1-\sigma^2/9+O(\sigma^4)$; на 2D решётке связь соседних урн ($J>0$) переводит доменный хаос ($d_T^{\rm global}\approx 2.91$) в единую глобальную ось времени ($d_T^{\rm global}\to 1$, консенсус $100\%$, `P5+`).
4. Когерентное затухание $\Gamma\approx\frac12\mathrm{Var}(c)\,k^2\Delta t$ (ошибка относительно точной формулы: $2.9\%$).
5. В клеточном автомате устойчивые структуры живут после запирания и только при «жизненном» правиле-победителе.
6. Мера Бартини тождественна $1/\mathrm{Area}(S^n)$; $e^{-\pi x^2}$ — фурье-самодуальный гауссиан ($L^2$-ошибка $2\cdot10^{-15}$). При $n=6$ сигнатура $(3,3)$ максимизирует объём светового конуса ($16\pi^2$ против $4\pi^3$ у $2+4$). M1: $a=\pi$ из maxent + унитарного Фурье; самодуальность без maxent $n=6$ не даёт (Эрмит $4k$ сдвигает $n_*$).
7. Поле $n:M\to S^2$ запирает случайные данные без урны (2D: $12/12$). Проекция $n\cdot\partial_t$ делает волновой оператор гиперболическим и снимает тахионный знак.
8. Расслоение псевдосферы $H^{3,2}\cong\mathbb{R}^3_{\rm boost}\times S^2_{\rm time}$ даёт точное тождество $\eta^{\mu\nu}\eta_{AB}\partial_\mu U^A\partial_\nu U^B = C_1[u] - (1+\lvert\mathbf{u}\rvert^2)\eta^{\mu\nu}\delta_{\alpha\beta}\partial_\mu\hat{n}^\alpha\partial_\nu\hat{n}^\beta$ (исправлен дефект нормы в `M2`); бусты $u^i$ и внутренние углы $\hat{n}^\alpha$ имеют противоположные знаки кинетики (**No-Go T10**, `M4`).
9. Аудит первоисточника Бартини (ДАН СССР, 1965, т. 163, № 4, с. 861–864, блок `H1`): Таблица 2 воспроизведена до 10 цифр ($+33.161194485$ при $n_+=+6.2569464$ и $-0.1209542108$ на зеркальной ветви $k=3$ при $n_{-3}=-5.9912841\approx -6$, отношение $\bar{E}=274.1632083$). Переход к $E=274.074996$ подогнан под $\alpha^{-1}_{1965}\approx 137.0375$ и расходится с CODATA-2022 на $71\,373\,\sigma$; вскрыта OCR-порча $V_6\to\sqrt{6}$ в формуле $B=2885.3453$.

**Не доказано.**

Вселенная физически шестимерна. Принцип меры — закон природы. Масса частиц из скрытых времён (T3: запрещено). Отличимый от ОТО и ещё живой числовой прогноз.

Доказана редукция: Фробениус съедает голдстоуны; $g_{\mathrm{phys}}$ имеет ранг 4 и сигнатуру $(3,1)$; $\partial_\perp$ — калибровка; духи лишнего времени снимаются. Цена — неотличимость среза от 4D ОТО.

**Проверяемость (T8–T9, M2–M5).** При ненулевой жёсткости оси времени бустовый сектор отображается в Эйнштейн–эфир с $c_1=(E_{\mathrm{lock}}/M_{\mathrm{Pl}})^2$. GW170817 даёт $E_{\mathrm{lock}}\le9.7\cdot10^{10}$ ГэВ; даже при симметрийной защите $c_{13}=0$ через максвелловский член $F_{AB}F^{AB}=2(C_1-C_3)$ пульсарный предел на $\alpha_2$ ограничивает $E_{\mathrm{lock}}\le6.26\cdot10^{14}$ ГэВ (`M5`), исключая $M_{\mathrm{Pl}}$ и $M_{\mathrm{GUT}}$. M3: физический $d_s=4$, не 6.

---

## What is proven, what is not

**Proven (conditionally, inside the model).** The Bartini integral has a local integer minimum at $n=6$. A $(3,3)$ metric exists; $3+1$ is a slice, not an automatic consequence. A nonlinear urn with $\theta>1$ locks onto one observed time (exact strong monopoly by Rubin’s criterion at $\theta_c=1$, mean-field $\ln\tau_{\rm lock}\sim C/(\theta-1)$, exact monopoly destroyed by any persistent exploration floor $\mu>0$, fast logit noise attenuating the eigenvalue to $\lambda_{\rm eff}=\theta\chi(\sigma)-1$, and spatial coupling $J>0$ locking a global time axis across a 2D lattice, `P5+`). Coherent decay matches $\Gamma\approx\frac12\mathrm{Var}(c)\,k^2\Delta t$ to $2.9\%$. Life-like structures survive after lock-in only under a life-supporting winning rule. M1: $a=\pi$ follows from maxent + unitary Fourier; self-duality alone does not fix $n=6$ (Hermite $4k$). M4/T10: exact bundle decomposition of $H^{3,2}$ shows opposite kinetic signs between spacetime boosts $u^i$ and internal rotations $\hat{n}^\alpha$. H1: Bartini's 1965 Table 2 is reproduced to 10 digits on the mirror branch $k=3$ ($n_{-3}\approx -6$), while the shifted $E=274.074996$ is excluded by CODATA-2022 at $71\,373\,\sigma$.

**Not proven.** That the Universe is physically six-dimensional. That Bartini derived the constants. That one of $t_1,t_2,t_3$ is randomly chosen at every instant of the locked world.

**Testability (T8–T9, M2–M5).** With nonzero time-axis stiffness the boost sector maps onto Einstein-aether with $c_1=(E_{\mathrm{lock}}/M_{\mathrm{Pl}})^2$; GW170817 bounds $E_{\mathrm{lock}}\le9.7\cdot10^{10}$ GeV, and even with symmetry-protected $c_{13}=0$ ($F_{AB}F^{AB}=2(C_1-C_3)$, `M5`), binary pulsars bound $E_{\mathrm{lock}}\le6.26\cdot10^{14}$ GeV, excluding the Planck and GUT scales. Physical spectral dimension on the slice is $d_s=4$, not 6 (M3).

Full English text: [docs/en/PROOF.md](docs/en/PROOF.md) and [docs/en/DEEP_RESEARCH.md](docs/en/DEEP_RESEARCH.md).

---

## 已证明与未证明

**已证明（在模型内部、有条件）。** 巴尔蒂尼积分的整数局部极小在 $n=6$。$(3,3)$ 度量存在；$3+1$ 是切片，不是自动推论。$\theta>1$ 的非线性瓮会锁到单一可观测时间（Rubin 判据给出精确临界值 $\theta_c=1$，平均场 $\ln\tau_{\rm lock}\sim C/(\theta-1)$，持续探索噪声 $\mu>0$ 破坏精确垄断，快速 logit 噪声给出 $\lambda_{\rm eff}=\theta\chi(\sigma)-1$，且空间耦合 $J>0$ 在 2D 晶格上锁定全局单一时间轴，`P5+`）。相干衰减与 $\Gamma\approx\frac12\mathrm{Var}(c)\,k^2\Delta t$ 相对误差 $2.9\%$。类生命结构仅在锁定之后、且赢家规则支持生命时稳定。M1：maxent + 幺正傅里叶给出 $a=\pi$；单靠自对偶不能固定 $n=6$（厄米 $4k$）。M4/T10：$H^{3,2}$ 纤维丛精确分解表明时空助推 $u^i$ 与内部旋转 $\hat{n}^\alpha$ 具有相反的动能符号。H1：巴尔蒂尼 1965 年表 2 在镜像分支 $k=3$（$n_{-3}\approx -6$）上精确复现至 10 位有效数字，而偏移常数 $E=274.074996$ 被 CODATA-2022 排除达 $71\,373\,\sigma$。

**未证明。** 宇宙在物理上是六维的。巴尔蒂尼推出了基本常数。已锁定世界的每一个瞬间都在 $t_1,t_2,t_3$ 中随机选一个。

**可检验性（T8–T9，M2–M5）。** 时间轴刚度非零时，助推扇区映射为 $c_1=(E_{\mathrm{lock}}/M_{\mathrm{Pl}})^2$ 的 Einstein-aether；GW170817 给出 $E_{\mathrm{lock}}\le9.7\cdot10^{10}$ GeV，即使通过麦克斯韦项 $F_{AB}F^{AB}=2(C_1-C_3)$ 保护 $c_{13}=0$（`M5`），脉冲星仍限制 $E_{\mathrm{lock}}\le6.26\cdot10^{14}$ GeV，排除普朗克与 GUT 尺度。切片上的物理谱维为 $d_s=4$，而非 6（M3）。

全文：[docs/zh/PROOF.md](docs/zh/PROOF.md) 与 [docs/zh/DEEP_RESEARCH.md](docs/zh/DEEP_RESEARCH.md)。

---

## Запуск / Run / 运行

```bash
node bartini_plus/experiments.mjs
node bartini_plus/four_steps.mjs
node bartini_plus/close_gaps.mjs
node bartini_plus/p5_stress.mjs
node bartini_plus/aether_bounds.mjs
node bartini_plus/n_times.mjs
node bartini_plus/math_tighten.mjs
node bartini_plus/deep_research.mjs
```

Результаты: `results/bartini_plus.json`, `results/four_steps.json`, `results/close_gaps.json`, `results/p5_stress.json`, `results/aether_bounds.json`, `results/n_times.json`, `results/math_tighten.json`, `results/deep_research.json`. Python-модули в `bartini_plus/` — параллельная запись урны и Life; рабочий прогон — JavaScript (Node).

---

## Цитирование

А. Кутепов и языковые модели. *Бартини+: стохастический выбор времени в геометрии $3+3$*. 2026. https://github.com/AlexKutepov/bartini-plus
