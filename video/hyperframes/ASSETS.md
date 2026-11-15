# Cyber Knock B2B HyperFrames — asset provenance

This is an **editable, unfinished** HyperFrames project. No completed or publication-approved MP4 has been produced.

The canonical app images already live in the **same Cyber Knock repository**. To avoid duplicate Git objects, do not commit video-local image copies. Instead, run `npm run assets:sync` (automatically runs before `npm run dev`, `npm run check`, `npm run render`) and check with `npm run assets:check`.

| Generated local file (Git-ignored) | Canonical source in this repository |
|---|---|
| `assets/01-analysis.jpg` | `public/images/cases/01-analysis.jpg` |
| `assets/03-training.png` | `public/images/cases/03-training.png` |
| `assets/pitching-feedback.webp` | `public/images/product/pitching-feedback.webp` |
| `assets/corporate-icon.svg` | `app/icon.svg` |

The sync script copies sources for the local HyperFrames renderer and checks SHA-256 equality. Source assets must not be modified.

The videos' real-world rights, relationship between pitching footage and analysis results, and any external publication rights are **not yet verified**. Screenshot source provenance does not prove those facts. Use only confirmed footage and matching analysis; no invented scores, pose trajectories, or customer claims.

Do not commit browser page snapshots, registry cache, render outputs, private footage, local project caches, or dependencies. Render/review artifacts belong in the Git-ignored `output/` directory. After explicit publication approval, copy only final approved web assets into the appropriate `public/` location and separately update the LP player.
