// Evidence-grounded motion polish: called only after generating the base project.
import {readFileSync,writeFileSync} from "node:fs";
const origin="output/material-handoff/cyberknock-b2b-ai-demo-va_78f6aa6f-20261116/analysis-result.json";
const analysis=JSON.parse(readFileSync(origin,"utf8"));
if(analysis.request_id!=="va_78f6aa6f"||analysis.training_id!=="jJswFzGSGlwQqXh1gcvS")throw Error("Unexpected request/training binding");
const {overall,rank}=analysis.score_v2.scores;
if(overall!=="73"||rank!=="B")throw Error("Analysis score changed; revalidate");
const once=(path,find,replacement)=>{
 const text=readFileSync(path,"utf8");
 if(!text.includes(find))throw Error("Expected source fragment missing: "+path+" "+find.slice(0,80));
 writeFileSync(path,text.replace(find,replacement),"utf8");
};
const feedback="compositions/feedback.html";
const card='<div id="feedback-score-card" class="score-card"><span class="score-card-result">\u7dcf\u5408'+overall+'\u70b9</span><span class="score-card-grade">\u8a55\u4fa1 '+rank+'</span></div>';
once(feedback,'<div class="flow" data-layout-ignore>',card+'<div class="flow" data-layout-ignore>');
once(feedback,"window.__timelines=window.__timelines||{};",
"tl.fromTo('#feedback-score-card',{opacity:0,y:22},{opacity:1,y:0,duration:0.52,ease:'power3.out'},0.65);\n"+
"tl.fromTo('#feedback-radar .phone img',{scale:1,y:0},{scale:1.085,y:-24,duration:2.9,ease:'none'},0.08);\n"+
"tl.fromTo('#feedback-summary .phone img',{scale:1.075,y:14},{scale:1.015,y:-20,duration:2.9,ease:'none'},3.05);\n"+
"window.__timelines=window.__timelines||{};");
const product="compositions/product.html";
once(product,'<div class="flow" data-layout-ignore>', '<div id="product-arrow" class="product-arrow" aria-hidden="true">&#8594;</div><div class="flow" data-layout-ignore>');
once(product,"tl.fromTo('#product-training',{y:24},{y:0,duration:0.6,ease:'power3.out'},0.18);",
"tl.fromTo('#product-report',{scale:1,y:0},{scale:1.045,y:-12,duration:2.4,ease:'power1.inOut'},0.1);\n"+
"tl.to('#product-report',{scale:1,y:0,duration:1.9,ease:'power1.inOut'},2.5);\n"+
"tl.fromTo('#product-training',{y:22,scale:0.97},{y:0,scale:1.045,duration:1.0,ease:'power3.out'},1.9);\n"+
"tl.to('#product-training',{scale:1,y:-9,duration:2.05,ease:'power1.inOut'},2.95);\n"+
"tl.fromTo('#product-arrow',{opacity:0,x:-15},{opacity:1,x:0,duration:0.42,ease:'power2.out'},1.82);");
const stylesheet="styles.css";
let style=readFileSync(stylesheet,"utf8");
style+="\n/* Verified analysis callout and purposeful app-to-training transition */\n"+
".phone{overflow:hidden}\n"+
".score-card{position:absolute;left:192px;top:750px;display:flex;align-items:center;gap:28px;padding:18px 28px;background:#fffefa;border-left:6px solid var(--teal);border-radius:8px;box-shadow:0 9px 24px #192b2b12;max-width:750px}\n"+
".score-card-result{font-size:58px;line-height:1.25;font-weight:700;color:var(--ink)}\n"+
".score-card-grade{font-size:45px;line-height:1.25;font-weight:700;color:var(--teal)}\n"+
".product-arrow{position:absolute;left:1365px;top:489px;font-size:68px;line-height:1.3;color:var(--teal);font-weight:700}\n";
writeFileSync(stylesheet,style,"utf8");
console.log("Verified-score polish applied: "+overall+" / "+rank);

// contact CTA pacing: allow the viewer five seconds to read the copy and URL.
once('compositions/contact.html',
 'window.__timelines=window.__timelines||{};',
 "tl.fromTo('.end-cta',{opacity:0.7,y:18},{opacity:1,y:0,duration:0.78,ease:'power3.out'},1.18);\n"+
 "tl.fromTo('.end-url',{opacity:0.45},{opacity:1,duration:1.65,ease:'power2.out'},2.1);\n"+
 'window.__timelines=window.__timelines||{};');
