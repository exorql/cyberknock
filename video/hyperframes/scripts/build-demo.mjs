// Rebuild the editable composition. No network calls; input bytes are only copied.
import {mkdirSync,readFileSync,writeFileSync,copyFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
const pkg='output/material-handoff/cyberknock-b2b-ai-demo-va_78f6aa6f-20261116';
for(const dir of ['compositions','assets/verified','output/delivery','output/qa/logs']) mkdirSync(dir,{recursive:true});
if(!existsSync('output/qa/index.before.html')) copyFileSync('index.html','output/qa/index.before.html');
const copies=[['assets/analyzed-source/pitching.mp4','pitching.mp4'],['assets/app-output/pose.mp4','pose.mp4'],['assets/app-output/images/result-radar-clean-full.png','radar.png'],['assets/app-output/images/result-summary-feedback-full.png','feedback.png']];
const manifest=JSON.parse(readFileSync(`${pkg}/manifest.json`));
const ledger=copies.map(([src,name])=>{const bytes=readFileSync(`${pkg}/${src}`);const hash=createHash('sha256').update(bytes).digest('hex');if(hash!==manifest.assets.find(a=>a.path===src).sha256)throw Error(`Hash mismatch: ${src}`);copyFileSync(`${pkg}/${src}`,`assets/verified/${name}`);return {source:`${pkg}/${src}`,destination:`assets/verified/${name}`,sha256:hash};});
writeFileSync('output/qa/used-input-hashes.json',JSON.stringify(ledger,null,2));
const variables=[['headline-1','動画から、\n人の動きを\n解析。'],['headline-2','動きを捉え、\n情報として\n構造化。'],['headline-3','解析結果を、\n分かりやすい\nフィードバックへ。'],['headline-4','AI解析から\nアプリまで、\n一貫して実装。'],['cta','AI開発を相談する'],['destination','cyberknock.jp/ai-development#contact']].map(([id,value])=>({id,type:'string',label:id,default:value}));
variables.push({id:'paper',type:'color',label:'Background',default:'#f5f3ed'},{id:'teal',type:'color',label:'Brand accent',default:'#006d65'});
const common=`
@font-face{font-family:'CK JP';src:url('assets/fonts/CK-JP-Regular.ttc');font-weight:400;font-style:normal}
@font-face{font-family:'CK JP';src:url('assets/fonts/CK-JP-Bold.ttc');font-weight:700;font-style:normal}
*{box-sizing:border-box;margin:0;padding:0}
:root{--paper:#f5f3ed;--ink:#192b2b;--teal:#006d65;--muted:#526662;--line:#cbd2c9;--mint:#dfe9e1}
html,body{width:1920px;height:1080px;overflow:hidden;background:var(--paper)}
body{font-family:'CK JP',sans-serif;color:var(--ink)}
.clip{position:absolute;inset:0;width:100%;height:100%}
.ground{position:absolute;inset:0;background:var(--paper)}
.right-field{position:absolute;left:995px;top:0;width:925px;height:1080px;background:var(--mint)}
.copy{position:absolute;left:192px;top:224px;width:800px}
.eyebrow{color:var(--teal);font-size:30px;font-weight:700;letter-spacing:.035em;line-height:1.5;margin-bottom:34px}
.headline{font-size:90px;font-weight:700;line-height:1.3;letter-spacing:-.055em;white-space:pre-line}
.support{font-size:34px;line-height:1.65;color:var(--muted);margin-top:35px}
.fine{position:absolute;left:192px;bottom:122px;font-size:30px;line-height:1.45;color:var(--muted)}
.media-label{position:absolute;font-size:29px;line-height:1.5;font-weight:700;color:var(--ink);text-align:center}
.phone{position:absolute;background:#192b2b;border:8px solid #192b2b;border-radius:28px;box-shadow:0 16px 30px #192b2b19}
.phone img{width:100%;height:100%;object-fit:contain;border-radius:18px}
.flow{position:absolute;left:192px;right:192px;bottom:66px;height:4px;background:#cbd2c9}
.flow-fill{height:100%;width:100%;background:var(--teal);transform-origin:left center}
.quote{margin-top:32px;padding-left:24px;border-left:4px solid var(--teal);font-size:32px;line-height:1.6;color:var(--teal)}
`;
writeFileSync('styles.css',common);
const motion=(id,duration,extra='')=>`<script>
const tl=gsap.timeline({paused:true});
tl.fromTo('#${id}-headline',{y:18},{y:0,duration:0.48,ease:'power3.out'},0);
tl.fromTo('#${id}-bar',{scaleX:0},{scaleX:1,duration:${duration-0.05},ease:'none'},0);
${extra}
window.__timelines=window.__timelines||{};
window.__timelines['${id}']=tl;
</script>`;
const frame=(id,duration,body,extra='')=>`<template><style>#root{position:absolute;inset:0}</style><div id="root" data-composition-id="${id}" data-width="1920" data-height="1080" data-duration="${duration}"><div class="ground"></div><div class="right-field"></div>${body}<div class="flow" data-layout-ignore><div class="flow-fill" id="${id}-bar"></div></div></div>${motion(id,duration,extra)}</template>`;
const title=(id,n,eyebrow,headline,support='')=>`<div class="copy"><p class="eyebrow">${eyebrow}</p><h1 id="${id}-headline" class="headline" data-var-text="headline-${n}">${headline}</h1>${support?`<p class="support">${support}</p>`:''}</div>`;
writeFileSync('compositions/input.html',frame('input',4,title('input',1,'動画解析・生成AIの実装事例','動画から、\n人の動きを\n解析。','AIスポーツトレーナー')+`<div class="phone" style="left:1172px;top:134px;width:466px;height:816px"></div><p class="media-label" style="left:1172px;top:87px;width:466px">解析元の投球映像</p><p class="fine">Pexels素材を用いた技術デモ</p>`));
writeFileSync('compositions/pose.html',frame('pose',5,title('pose',2,'映像から、姿勢・動作の情報へ','動きを捉え、\n情報として\n構造化。','同じ投球映像と、実アプリの解析出力')+`<div class="phone" style="left:1030px;top:257px;width:352px;height:612px"></div><div class="phone" style="left:1428px;top:257px;width:352px;height:612px"></div><p class="media-label" style="left:1030px;top:193px;width:352px">元動画</p><p class="media-label" style="left:1428px;top:193px;width:352px">アプリの解析出力</p><p class="fine">2026年10月5日の実分析例</p>`));
writeFileSync('compositions/feedback.html',frame('feedback',6,title('feedback',3,'実アプリの分析レポート','解析結果を、\n分かりやすい\nフィードバックへ。')+`<p class="fine">表示される評価は、この投球の解析結果です。</p><div id="feedback-radar" class="clip" data-start="0" data-duration="3" data-track-index="1"><div class="phone" style="left:1306px;top:116px;width:370px;height:803px"><img id="radar-full" src="assets/verified/radar.png" alt="実アプリの完全な結果画面。B評価とレーダーチャート" /></div><p class="media-label" style="left:1190px;top:940px;width:590px">評価と、動きの特徴を可視化</p></div><div id="feedback-summary" class="clip" data-start="3" data-duration="3" data-track-index="2"><div class="phone" style="left:1306px;top:116px;width:370px;height:803px"><img id="feedback-full" src="assets/verified/feedback.png" alt="実アプリの完全な全体評価と改善ポイント画面" /></div><p class="media-label" style="left:1190px;top:940px;width:590px">改善ポイントを、言葉で提示</p></div>`));
writeFileSync('compositions/product.html',frame('product',5,title('product',4,'実プロダクト：AIスポーツトレーナー','AI解析から\nアプリまで、\n一貫して実装。','解析・フィードバック・次のアクション')+`<div class="phone" id="product-report" style="left:1038px;top:188px;width:328px;height:710px"><img id="product-feedback" src="assets/pitching-feedback.webp" alt="法人サイトの実アプリ画面：AIフィードバック" /></div><div class="phone" id="product-training" style="left:1426px;top:188px;width:328px;height:710px"><img id="product-drills" src="assets/03-training.png" alt="法人サイトの実アプリ画面：AIドリル提案" /></div><p class="media-label" style="left:1038px;top:127px;width:328px">フィードバック</p><p class="media-label" style="left:1426px;top:127px;width:328px">練習メニュー</p><p class="fine">アプリ体験の紹介（前の分析例とは別画面）</p>`,"tl.fromTo('#product-training',{y:24},{y:0,duration:0.6,ease:'power3.out'},0.18);"));
writeFileSync('compositions/contact.html',`<template><style>#root{position:absolute;inset:0}.end-brand{position:absolute;left:192px;top:144px;display:flex;align-items:center;gap:22px;font-size:64px;font-weight:700;letter-spacing:-.035em}.end-brand img{width:88px;height:88px}.end-title{position:absolute;left:192px;top:300px;font-size:82px;font-weight:700;letter-spacing:-.05em;line-height:1.35}.end-services{position:absolute;left:192px;top:562px;font-size:34px;color:var(--muted)}.end-cta{position:absolute;left:192px;top:670px;background:var(--teal);color:#fffefa;padding:20px 44px;font-size:50px;font-weight:700;line-height:1.4;border-radius:4px}.end-url{position:absolute;left:192px;top:800px;font-size:40px;letter-spacing:.005em;color:var(--teal)}</style><div id="root" data-composition-id="contact" data-width="1920" data-height="1080" data-duration="5"><div class="ground"></div><div class="end-brand"><img id="corporate-mark" src="assets/corporate-icon.svg" alt="Cyber Knockの正式なマーク"/><span>Cyber Knock</span></div><h1 id="contact-headline" class="end-title">動画解析・生成AIを、<br>現場で使われるプロダクトへ。</h1><p class="end-services">AI開発 / PoC / Web・モバイルアプリ開発</p><p class="end-cta" data-var-text="cta">AI開発を相談する</p><p class="end-url" data-var-text="destination">cyberknock.jp/ai-development#contact</p><div class="flow" data-layout-ignore><div class="flow-fill" id="contact-bar"></div></div></div>${motion('contact',5)}</template>`);
const sceneList=[['input',0,4],['pose',4,5],['feedback',9,6],['product',15,5],['contact',20,5]];
writeFileSync('index.html',`<!doctype html><html lang="ja" data-composition-variables='${JSON.stringify(variables)}'><head><meta charset="UTF-8"><meta name="viewport" content="width=1920,height=1080"><title>Cyber Knock | 動画解析・生成AIの実装事例</title><link rel="stylesheet" href="styles.css"><script src="assets/vendor/gsap.min.js"></script></head><body><div id="root" data-composition-id="main" data-start="0" data-duration="25" data-width="1920" data-height="1080" data-fps="30">${sceneList.map(([id,start,dur])=>`<div id="${id}" class="clip" data-composition-id="${id}" data-composition-src="compositions/${id}.html" data-start="${start}" data-duration="${dur}" data-width="1920" data-height="1080" data-track-index="1" data-track-kind="graphics" style="z-index:1"></div>`).join('\n')}
<video id="input-video" class="clip" src="assets/verified/pitching.mp4" data-start="0" data-duration="4" data-media-start="0.7" data-track-index="2" muted playsinline preload="auto" style="inset:auto;left:1180px;top:142px;width:450px;height:800px;object-fit:contain;border-radius:20px;z-index:2"></video>
<video id="original-compare" class="clip" src="assets/verified/pitching.mp4" data-start="4" data-duration="5" data-media-start="0.7" data-track-index="2" muted playsinline preload="auto" style="inset:auto;left:1038px;top:265px;width:336px;height:596px;object-fit:contain;border-radius:20px;z-index:2"></video>
<video id="genuine-pose" class="clip" src="assets/verified/pose.mp4" data-start="4" data-duration="5" data-media-start="0.7" data-track-index="3" muted playsinline preload="auto" style="inset:auto;left:1436px;top:265px;width:336px;height:596px;object-fit:contain;border-radius:20px;z-index:2"></video>
</div><script>window.__timelines=window.__timelines||{};const main=gsap.timeline({paused:true});main.to({}, {duration:25});window.__timelines['main']=main;</script></body></html>`);
writeFileSync('output/delivery/cyberknock-b2b-ai-demo-25s.ja.vtt',`WEBVTT\n\n00:00.000 --> 00:04.000\n動画から、人の動きを解析。\n\n00:04.000 --> 00:09.000\n動きを捉え、情報として構造化。\n\n00:09.000 --> 00:15.000\n解析結果を、分かりやすいフィードバックへ。\n\n00:15.000 --> 00:20.000\nAI解析からアプリまで、一貫して実装。\n\n00:20.000 --> 00:25.000\nCyber Knock — AI開発を相談する\ncyberknock.jp/ai-development#contact\n`);
console.log('Editable five-scene source and VTT written; verified inputs copied byte-for-byte.');

await import('./refine-motion.mjs');
