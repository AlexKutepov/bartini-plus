# Бартини+ / Bartini+ / 巴尔蒂尼+

**Гипотезу формулировал и проверял Александр Кутепов ([@AlexKutepov](https://github.com/AlexKutepov)) совместно с языковыми моделями (LLM).**

Открытое исследование шестимерной конструкции Р. О. ди Бартини (\(3+3\)) и стохастической надстройки: случайный выбор тикающего часа, запирание на одном времени, численная проверка L0–L3.

**Для исследователей / For researchers / 给研究者** — что сделано, что доказано, чего нет, как воспроизвести, что не цитировать:

- [Русский](docs/ru/FOR_RESEARCHERS.md)
- [English](docs/en/FOR_RESEARCHERS.md)
- [中文](docs/zh/FOR_RESEARCHERS.md)

Полные доказательства и вся цепочка рассуждений:

| Язык | Бартини / Бартини+ | Четыре шага | Дыры |
|---|---|---|---|
| Русский | [docs/ru/PROOF.md](docs/ru/PROOF.md) | [docs/ru/FOUR_STEPS.md](docs/ru/FOUR_STEPS.md) | [docs/ru/CLOSE_GAPS.md](docs/ru/CLOSE_GAPS.md) |
| English | [docs/en/PROOF.md](docs/en/PROOF.md) | [docs/en/FOUR_STEPS.md](docs/en/FOUR_STEPS.md) | [docs/en/CLOSE_GAPS.md](docs/en/CLOSE_GAPS.md) |
| 中文 | [docs/zh/PROOF.md](docs/zh/PROOF.md) | [docs/zh/FOUR_STEPS.md](docs/zh/FOUR_STEPS.md) | [docs/zh/CLOSE_GAPS.md](docs/zh/CLOSE_GAPS.md) |

Стресс-тест аксиомы P5: [теорема о монополии, критическое время и шум](docs/ru/P5_STRESS.md).

Авторы: [AUTHORS.md](AUTHORS.md). Лицензия: [MIT](LICENSE).

---

## Что доказано, что нет

**Доказано (условно, внутри модели).**

1. При функции Бартини \(m(n)=\Gamma(\frac{n+1}{2})/(2\pi^{(n+1)/2})\) непрерывный минимум \(n_*\approx 6.2569\); среди целых локальный минимум — \(n=6\).
2. Метрика сигнатуры \((3,3)\) математически допустима; \(3+1\) есть её срез, не автоматическое следствие.
3. Нелинейная урна \(p_\alpha\propto n_\alpha^\theta\) при \(\theta>1\) запирает одно наблюдаемое время (\(d_T:3\to 1\)).
4. Когерентное затухание \(\Gamma\approx\frac12\mathrm{Var}(c)\,k^2\Delta t\) (ошибка относительно точной формулы: \(2.9\%\)).
5. В клеточном автомате устойчивые структуры живут после запирания и только при «жизненном» правиле-победителе.

6. Мера Бартини тождественна \(1/\mathrm{Area}(S^n)\); \(e^{-\pi x^2}\) — фурье-самодуальный гауссиан (\(L^2\)-ошибка \(2\cdot10^{-15}\)). При \(n=6\) сигнатура \((3,3)\) максимизирует объём светового конуса (\(16\pi^2\) против \(4\pi^3\) у \(2+4\)).
7. Поле \(n:M\to S^2\) запирает случайные данные без урны (2D: \(12/12\)). Проекция \(n\cdot\partial_t\) делает волновой оператор гиперболическим и снимает тахионный знак.

**Не доказано.**

Вселенная физически шестимерна. Принцип меры — закон природы. Масса частиц из скрытых времён (T3: запрещено). Отличимый от ОТО и ещё живой числовой прогноз.

Доказана редукция: Фробениус съедает голдстоуны; \(g_{\mathrm{phys}}\) имеет ранг 4 и сигнатуру \((3,1)\); \(\partial_\perp\) — калибровка; духи лишнего времени снимаются. Цена — неотличимость среза от 4D ОТО.

---

## What is proven, what is not

**Proven (conditionally, inside the model).** The Bartini integral has a local integer minimum at \(n=6\). A \((3,3)\) metric exists; \(3+1\) is a slice, not an automatic consequence. A nonlinear urn with \(\theta>1\) locks onto one observed time. Coherent decay matches \(\Gamma\approx\frac12\mathrm{Var}(c)\,k^2\Delta t\) to \(2.9\%\). Life-like structures survive after lock-in only under a life-supporting winning rule.

**Not proven.** That the Universe is physically six-dimensional. That Bartini derived the constants. That one of \(t_1,t_2,t_3\) is randomly chosen at every instant of the locked world.

Full English text: [docs/en/PROOF.md](docs/en/PROOF.md).

---

## 已证明与未证明

**已证明（在模型内部、有条件）。** 巴尔蒂尼积分的整数局部极小在 \(n=6\)。\((3,3)\) 度量存在；\(3+1\) 是切片，不是自动推论。\(\theta>1\) 的非线性瓮会锁到单一可观测时间。相干衰减与 \(\Gamma\approx\frac12\mathrm{Var}(c)\,k^2\Delta t\) 相对误差 \(2.9\%\)。类生命结构仅在锁定之后、且赢家规则支持生命时稳定。

**未证明。** 宇宙在物理上是六维的。巴尔蒂尼推出了基本常数。已锁定世界的每一个瞬间都在 \(t_1,t_2,t_3\) 中随机选一个。

全文：[docs/zh/PROOF.md](docs/zh/PROOF.md)。

---

## Запуск / Run / 运行

```bash
node bartini_plus/experiments.mjs
node bartini_plus/four_steps.mjs
node bartini_plus/close_gaps.mjs
node bartini_plus/p5_stress.mjs
```

Результаты: `results/bartini_plus.json`, `results/four_steps.json`, `results/close_gaps.json`, `results/p5_stress.json`. Python-модули в `bartini_plus/` — параллельная запись урны и Life; рабочий прогон — JavaScript (Node).

---

## Цитирование

А. Кутепов и языковые модели. *Бартини+: стохастический выбор времени в геометрии \(3+3\)*. 2026. https://github.com/AlexKutepov/bartini-plus
