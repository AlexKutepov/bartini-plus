# Бартини+ / Bartini+ / 巴尔蒂尼+

**Гипотезу формулировал и проверял Александр Кутепов ([@AlexKutepov](https://github.com/AlexKutepov)) совместно с языковыми моделями (LLM).**

Открытое исследование шестимерной конструкции Р. О. ди Бартини ($3+3$) и стохастической надстройки: случайный выбор тикающего часа, запирание на одном времени, численная проверка L0–L3, редукция на срез $(3,1)$, ограничения Эйнштейна–эфира, многомировое ветвление времени в точках бифуркации и аудит первоисточника 1965 года.

Читать с формулами: открыть [`site/index.html`](site/index.html) (KaTeX). Пересборка: `node tools/docs_build.mjs`. В исходниках формулы в `$...$` / `$$...$$` — так их понимает GitHub.

**Для исследователей / For researchers / 给研究者** — что сделано, что доказано, реестр ошибок в статье Бартини (1965) и вторичных перепечатках, как воспроизвести:

- [Русский](docs/ru/FOR_RESEARCHERS.md)
- [English](docs/en/FOR_RESEARCHERS.md)
- [中文](docs/zh/FOR_RESEARCHERS.md)

Полные доказательства и вся цепочка рассуждений:

| Язык | Бартини / Бартини+ | Стресс-тест P5 | Четыре шага | Дыры | Ужесточение | Углублённое R1–R4 | Ветвление B1–B5 |
|---|---|---|---|---|---|---|---|
| Русский | [PROOF](docs/ru/PROOF.md) | [P5_STRESS](docs/ru/P5_STRESS.md) | [FOUR_STEPS](docs/ru/FOUR_STEPS.md) | [CLOSE_GAPS](docs/ru/CLOSE_GAPS.md) | [MATH_TIGHTEN](docs/ru/MATH_TIGHTEN.md) | [DEEP_RESEARCH](docs/ru/DEEP_RESEARCH.md) | [BRANCHING_TIME](docs/ru/BRANCHING_TIME.md) |
| English | [PROOF](docs/en/PROOF.md) | [P5_STRESS](docs/en/P5_STRESS.md) | [FOUR_STEPS](docs/en/FOUR_STEPS.md) | [CLOSE_GAPS](docs/en/CLOSE_GAPS.md) | [MATH_TIGHTEN](docs/en/MATH_TIGHTEN.md) | [DEEP_RESEARCH](docs/en/DEEP_RESEARCH.md) | [BRANCHING_TIME](docs/en/BRANCHING_TIME.md) |
| 中文 | [PROOF](docs/zh/PROOF.md) | [P5_STRESS](docs/zh/P5_STRESS.md) | [FOUR_STEPS](docs/zh/FOUR_STEPS.md) | [CLOSE_GAPS](docs/zh/CLOSE_GAPS.md) | [MATH_TIGHTEN](docs/zh/MATH_TIGHTEN.md) | [DEEP_RESEARCH](docs/zh/DEEP_RESEARCH.md) | [BRANCHING_TIME](docs/zh/BRANCHING_TIME.md) |

Авторы: [AUTHORS.md](AUTHORS.md). Лицензия: [MIT](LICENSE).

---

## Вскрытые ошибки в статье Бартини (1965) и вторичных источниках (`H1`, `T3`, `T10`)

1. **Ручная подгонка константы $E$ под $\alpha^{-1}$ 1965 года ($71\,373\,\sigma$ расхождения с CODATA-2022):** аналитическое отношение экстремумов сферы $S_{n+1}(z)=2\pi^z/\Gamma(z)$ между $n_+ = +6.2569464$ ($+33.161194485$) и зеркальной ветвью $k=3$ при $n_{-3} = -5.9912841 \approx -6$ ($-0.1209542108$) равно $\bar{E} = 274.1632083$ ($\bar{E}/2 = 137.081604$). Чтобы совпасть с экспериментальным значением середины 1960-х ($\alpha^{-1}_{1965}\approx 137.0375$), Бартини вручную заменил $\bar{E}$ на $E = 274.074996 \approx \frac{1}{4}e^{6.9996968}$ ($E/2 = 137.037498$). Современное значение CODATA-2022 ($137.035999177(21)$) отвергает эту константу на **$71\,373\,\sigma$**.
2. **Эффект look-elsewhere в таблице констант:** решётка $2^a 3^b 5^e \pi^{c/2} E^d$ даёт $7\,761$ узел на $[100, 2000]$ с медианным шагом $1.10\cdot 10^{-4}$ (случайное число попадает в допуск $\le 3.33\cdot 10^{-4}$ с вероятностью $76\%$).
3. **OCR-порча во вторичных перепечатках ($B = 2885.3453$):** популярная запись $\sqrt{6}\cdot E/\pi$ ($= 213.69$) — ошибка распознавания текста; истинная формула Бартини содержит объём 6-тора $V_6 = \frac{16\pi^3}{15}$: $B = V_6 E/\pi = \frac{16\pi^2}{15}E = 2885.3459$.
4. **Запрет одновременной непрерывной динамики трёх времён в объёме (`T3`, `T10`):** в открытом 6D объёме скрытые времена дают тахионный знак $m^2 < 0$ (`T3`), а бусты $u^i$ и внутренние углы $\hat{n}^\alpha\in S^2$ имеют противоположные знаки кинетики (`No-Go T10`). Непротиворечивы либо калибровочно запертый срез $(3,1)$, либо **кусочно-фробениусово ветвление времени в дискретных точках бифуркации (`B1–B5`)**.

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
9. **Многомировое ветвление и дуальность времён в точке выбора (`B1–B5`):** если $\hat{\mathbf{n}}(\tau)$ кусочно-постоянно и меняется только на 3D гиперповерхности бифуркации $\Sigma_*$, внутри каждой ветви нет духов и выполнено $c_{\mathrm{gw}}=c$ (`B1`). По теореме трансверсальности Тома (`B2`) минимальная размерность времени для дерева ветвящихся мировых линий без взаимных столкновений равна $q_{\min}=3$ ($94.5\%$ столкновений в 2D времени против $0\%$ в 3D времени). В самой точке выбора на седле $n_1=n_2$ реализуется дуальность времён $d_T=2$, распадающаяся с $\lambda_\perp=\theta-1>0$ на две запертые ветви $d_T\to 1$ (`B3`) с гауссовой декогеренцией за время $\tau_{\mathrm{decoh}}=\ell_t/\sin(\vartheta_{12}/2)$ (`B4`) и точным сохранением нормы (`B5`).

**Не доказано.**

Вселенная физически шестимерна. Принцип меры — закон природы. Масса частиц из скрытых времён (T3: запрещено). Отличимый от ОТО и ещё живой числовой прогноз внутри одной ветви.

**Проверяемость (T8–T9, M2–M5).** При ненулевой непрерывной жёсткости оси времени бустовый сектор отображается в Эйнштейн–эфир с $c_1=(E_{\mathrm{lock}}/M_{\mathrm{Pl}})^2$. GW170817 даёт $E_{\mathrm{lock}}\le9.7\cdot10^{10}$ ГэВ; даже при симметрийной защите $c_{13}=0$ через максвелловский член $F_{AB}F^{AB}=2(C_1-C_3)$ пульсарный предел на $\alpha_2$ ограничивает $E_{\mathrm{lock}}\le6.26\cdot10^{14}$ ГэВ (`M5`), исключая $M_{\mathrm{Pl}}$ и $M_{\mathrm{GUT}}$. M3: физический $d_s=4$, не 6.

---

## What is proven, what is not

**Proven (conditionally, inside the model).** The Bartini integral has a local integer minimum at $n=6$. A $(3,3)$ metric exists; $3+1$ is a slice, not an automatic consequence. A nonlinear urn with $\theta>1$ locks onto one observed time (`P5_STRESS`, `P5+`). M1: $a=\pi$ follows from maxent + unitary Fourier. M4/T10: exact bundle decomposition of $H^{3,2}$ shows opposite kinetic signs between spacetime boosts $u^i$ and internal rotations $\hat{n}^\alpha$. H1: Bartini's 1965 Table 2 is reproduced to 10 digits on the mirror branch $k=3$ ($n_{-3}\approx -6$), while the shifted $E=274.074996$ is excluded by CODATA-2022 at $71\,373\,\sigma$, and the $V_6\to\sqrt{6}$ OCR corruption in secondary sources is exposed. B1–B5: piecewise-Frobenius branching at discrete 3D decision surfaces $\Sigma_*$ is ghost-free on every branch, realizes $d_T=2\to 1$ saddle duality at the bifurcation point, decoheres in $\tau_{\mathrm{decoh}}=\ell_t/\sin(\vartheta_{12}/2)$, and requires $q_{\min}=3$ time dimensions by Thom transversality to avoid branch collisions.

Full English text: [docs/en/FOR_RESEARCHERS.md](docs/en/FOR_RESEARCHERS.md), [docs/en/DEEP_RESEARCH.md](docs/en/DEEP_RESEARCH.md), [docs/en/BRANCHING_TIME.md](docs/en/BRANCHING_TIME.md).

---

## 已证明与未证明

全文与巴尔蒂尼（1965）错误核查清单见：[docs/zh/FOR_RESEARCHERS.md](docs/zh/FOR_RESEARCHERS.md)、[docs/zh/DEEP_RESEARCH.md](docs/zh/DEEP_RESEARCH.md) 与 [docs/zh/BRANCHING_TIME.md](docs/zh/BRANCHING_TIME.md)。

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
node bartini_plus/branching_time.mjs
```

Результаты: `results/bartini_plus.json`, `results/four_steps.json`, `results/close_gaps.json`, `results/p5_stress.json`, `results/aether_bounds.json`, `results/n_times.json`, `results/math_tighten.json`, `results/deep_research.json`, `results/branching_time.json`.

---

## Цитирование

А. Кутепов и языковые модели. *Бартини+: стохастический выбор времени в геометрии $3+3$*. 2026. https://github.com/AlexKutepov/bartini-plus
