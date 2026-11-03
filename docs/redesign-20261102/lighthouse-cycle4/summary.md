## Cyber Knock — Lighthouse mobile lab audit

Lighthouse 12.8.2; Node v22.23.4; one navigation per page. See artifact summary.json for exact Chrome/emulation settings.

| Stage | Page | Performance | Accessibility | Best Practices | SEO | LCP (s, lab) | CLS (lab) | Audit errors | Lab targets |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| before | / | 93 | 93 | 100 | 100 | 3.12 | 0.000 | 0 | Below target |
| after | / | 99 | 100 | 100 | 100 | 2.12 | 0.000 | 0 | Pass |
| before | /sports-dx | 95 | 96 | 100 | 100 | 2.92 | 0.000 | 0 | Below target |
| after | /sports-dx | 99 | 100 | 100 | 100 | 1.81 | 0.000 | 0 | Pass |
| before | /cases/ai-sports-trainer | 95 | 96 | 100 | 100 | 2.90 | 0.000 | 0 | Below target |
| after | /cases/ai-sports-trainer | 99 | 100 | 100 | 100 | 2.17 | 0.000 | 0 | Pass |
| before | /security | 95 | 95 | 100 | 100 | 2.91 | 0.000 | 0 | Below target |
| after | /security | 99 | 100 | 100 | 100 | 1.79 | 0.000 | 0 | Pass |
| before | /privacy-policy | 100 | 90 | 96 | 82 | 1.01 | 0.000 | 0 | Below target |
| after | /privacy-policy | 99 | 100 | 100 | 100 | 1.78 | 0.000 | 0 | Pass |

**Measurement limits:** Before is the public Cloudflare site; after is the local production export. Same runner/tool/emulation, different delivery and caching. These are single-run lab results, not field Core Web Vitals or proof of conversion improvement. INP and field 75th percentiles are unmeasured. Automated accessibility scores do not establish WCAG conformance.
After uses gzip for compressible text. Preview runs use the recorded Cloudflare deployment origin; preview SEO is reported but not gated because noindex is expected for preview deployments. Any individual audit errors are listed in summary.json; a numeric category score does not mean every audit completed.

No form submission is performed. Contact delivery and analytics endpoints are blocked; no GA API is called. The local server uses an injected failure response and never delivers to Slack.

