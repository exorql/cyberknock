# Lighthouse CI performance variability — 2026-11-03

## Scope

Cyber Knock website, `exorql/cyberknock` PR #2. This is a performance **measurement and CI-gating** improvement, not a new visual redesign or a claim of faster real-world rendering.

## Evidence from actual GitHub Actions

All three runs used Lighthouse 12.8.2, Chrome 156 on Ubuntu, the same page URL and mobile simulated throttling.

| Commit | Run | Home Performance | Home TBT | Home LCP | Other four pages |
| --- | --- | ---: | ---: | ---: | --- |
| c8777ae | [41556601876](https://github.com/exorql/cyberknock/actions/runs/41556601876) | 74 | 1204ms | 2.42s | 99–100 |
| c797362 | [41559927345](https://github.com/exorql/cyberknock/actions/runs/41559927345) | 98 | 71ms | 2.24s | 99 |
| 84fcebd | [41563731778](https://github.com/exorql/cyberknock/actions/runs/41563731778) | 84 | 560ms | 2.29s | 99 |

Downloaded full Lighthouse JSON artifacts for the passing and failing runs show the **same principal Next.js webpack and React chunk URLs and transfer sizes**. The failing run recorded 9 long tasks and 2.3s of main-thread work, versus 3 tasks and 1.1s on the passing run. This strongly suggests measurement / runner timing variation, not a confirmed code regression. It does **not** prove that the website has no JavaScript performance issues.

## New CI policy

- Keep all original thresholds: Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95, LCP <= 2500ms, CLS <= 0.1.
- For the **gated homepage**, run **three independent Lighthouse navigations** sequentially. Gate each numeric metric on its median.
- For other **gated pages**, run once if it passes, or three times if the initial run fails. The original failure remains recorded.
- For the **public baseline** (`before` stage), continue a single observation without applying an acceptance gate.
- Save every attempt's JSON, HTML and logs in the CI artifact: first run keeps `after/home.report.json`; repeats use `after/home-attempt-2.report.json`, `after/home-attempt-3.report.json`.
- `summary.json` includes each attempt's scores, TBT, status, failed thresholds and filenames, plus per-metric medians; the CI step summary displays all samples.
- If any navigation is unavailable or an audit has an error, **do not hide that failure** behind successful runs.
- Two poor scores among the three still produce a failing median. No target is lowered.

## Validation and constraints

The median/gating implementation has unit tests for passing and failing 3-run scenarios, missing observations, LCP / SEO thresholds, and preserved audit errors.

A single Chrome + Lighthouse run is still a synthetic laboratory test. Field Core Web Vitals, real-user INP, and actual lead conversion require production measurement. If the 3-run median is repeatedly below 90, investigate React/Next.js main-thread tasks instead of relaxing thresholds.
