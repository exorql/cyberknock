# Cyber Knock B2B AI Video Demo — EXECUTE

You are making a 20–25 second, premium, evidence-based B2B technical demo for https://cyberknock.jp/ai-development. Complete a locally rendered MP4, poster, captions VTT, editable HyperFrames project, and QA report in this execution, not just a plan. The aim is qualified inbound leads, not consumer app installs.

## Locations / hard boundaries
- Work only in this new HyperFrames project: D:\develop\cyberknock\cyber-knock\video\hyperframes
- Final deliverables and QA in: D:\develop\cyberknock\cyber-knock\video\hyperframes\output
- This project now belongs to the Cyber Knock repository. Do not change other website application files, deploy, push or send email/DM. Do not modify company-os or any unrelated uncommitted work.
- Older reusable source may be in C:\Users\haruto\develop\company-os\rendering\app-intro-motion-v2, C:\Users\haruto\Videos, Downloads, D:\nagi-studio, or D:\archive. Search efficiently (specific filenames and directories, not unbounded recursion); read-only to other projects.
- Use a Codex model supported by the current account; gpt-6-astra/high was verified working, while gpt-6.1-sol was rejected for ChatGPT account authentication.
- CLI latest 0.9.55 currently fails npm ETARGET. Use pinned `npx --yes hyperframes@0.9.54` everywhere, including lint/check/snapshot/preview/render.
- Six HyperFrames skills have been installed at ~\.agents\skills. Read hyperframes, hyperframes-cli, hyperframes-registry, media-use and applicable launch/story/review/format refs before composing. Use CLI project structure.

The first-party app screenshots are sourced from this repository and are only materialized into the ignored local `assets/` folder by `npm run assets:sync`. Do not commit duplicated images. Use `npm run assets:check` to verify those materialized files.

## Actual claims and narrative
The real product is AIスポーツトレーナー, an iOS/Android video analysis app. You must NOT imply that we have verified results for unrelated industrial sectors, that actual user videos continuously train models, or that scores are AI precision measurements.

Creative direction, Japanese on-screen copy:
0-4s: real baseball pitching frame/video, “動画から、人の動きを解析。”
4-9s: genuine pose/motion analysis visualization, “動きを捉え、情報として構造化。”
9-15s: genuine AI feedback screen, “解析結果を、分かりやすいフィードバックへ。”
15-20s: real app experience, “AI解析からアプリまで、一貫して実装。”
20-25s: company mark + “動画解析・生成AIを、現場で使われるプロダクトへ。” + “AI開発 / PoC / Web・モバイルアプリ開発”, CTA cyberknock.jp/ai-development.

Keep visual design aligned with the live corporate site, minimal animation, no misleading simulated AI output, cropped unreadable text, generic cyber visuals, fake metrics, B2C app-download CTA. Sound optional; MUST be understandable muted. Allow caption VTT even if captions burned in.
16:9 1920x1080 at 30fps, H.264 MP4, 20–25sec. No autoplay design.

## Asset truth & publication gates
First inventory old HyperFrames work, app screenshots (public first-party website / local assets), and real footage/analysis pair. Preserve provenance, source paths, checksums and publication-rights evidence.
Do NOT upload any customer video or private assets to a cloud service. Do NOT use unverified footage as a real user analysis or match unrelated motion overlay to it. No synthetic score/feedback.
If rights or genuine footage pairing are not confirmed, produce a compelling 20-25 sec animated technical walkthrough using only verified public app screenshots and clearly labelled explanatory graphics; mark NOT READY FOR PUBLICATION of purported real motion footage. Do not falsely claim video proof.
Read only publicly accessible pages; asset use must be permissible. Never replace existing assets outside this project.

## Quality and deliverables
Make SPEC.md and editable index.html / compositions / assets, then pinned-cli lint, check --json, snapshots (sample 20 frames, review actual images), preview; render full MP4 in delivery folder if possible. Actual play / ffprobe or equivalent checks for duration/fps/resolution, first/mid/last frames, black-frame check, captions, mobile 390px downscale, poster. Quality target 93/100 overall, each dimension >=90, 0 critical; do not invent a pass.
Deliver final `delivery/*.mp4`, `delivery/*.webp` or PNG, `delivery/*.vtt`, `QA.md`, `ASSETS.md`, `HANDOFF.md` with exact paths, source provenance, license/publishing status, and how Opus configures verifiedCorporateDemoVideo from null after approval. If technical blocker, record exact command/log and best achieved artifact; never claim done when not.
Proceed without additional confirmation for local private build. NO publication, deployment, commits or cloud account actions.
