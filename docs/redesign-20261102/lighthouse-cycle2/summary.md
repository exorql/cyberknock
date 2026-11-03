## Cyber Knock — Lighthouse mobile lab audit

Lighthouse 12.8.2; Node v22.23.4; one navigation per page. See artifact summary.json for exact Chrome/emulation settings.

| Stage | Page | Performance | Accessibility | Best Practices | SEO | LCP (s, lab) | CLS (lab) | Lab targets |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| before | / | 93 | 93 | 100 | 100 | 3.13 | 0.000 | Below target |
| after | / | 83 | 100 | 100 | 100 | 4.48 | 0.000 | Below target |
| before | /sports-dx | 95 | 96 | 100 | 100 | 2.93 | 0.000 | Below target |
| after | /sports-dx | 95 | 100 | 100 | 100 | 2.86 | 0.000 | Below target |
| before | /cases/ai-sports-trainer | 95 | 96 | 100 | 100 | 2.94 | 0.000 | Below target |
| after | /cases/ai-sports-trainer | 85 | 100 | 100 | 100 | 4.33 | 0.000 | Below target |
| before | /security | 96 | 95 | 100 | 100 | 2.75 | 0.000 | Below target |
| after | /security | 96 | 100 | 100 | 100 | 2.71 | 0.000 | Below target |
| before | /privacy-policy | 100 | 90 | 96 | 82 | 0.93 | 0.000 | Below target |
| after | /privacy-policy | 95 | 100 | 100 | 100 | 2.86 | 0.000 | Below target |

**Measurement limits:** Before is the public Cloudflare site; after is the local production export. Same runner/tool/emulation, different delivery and caching. These are single-run lab results, not field Core Web Vitals or proof of conversion improvement. INP and field 75th percentiles are unmeasured. Automated accessibility scores do not establish WCAG conformance.

No form submission is performed. Contact delivery and analytics endpoints are blocked; no GA API is called. The local server uses an injected failure response and never delivers to Slack.

