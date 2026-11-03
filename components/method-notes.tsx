import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

const notes = [
  {
    number: "01",
    subject: "映像の条件",
    title: "見えないものを、無理に評価しない。",
    concern: "撮影角度や遮蔽によって、映像から確認できる情報は変わります。",
    decision: "分析できる条件を確かめ、根拠が足りない項目は断定しない設計にする。",
    artifact: "入力条件・評価範囲の設計",
  },
  {
    number: "02",
    subject: "AIの出力",
    title: "答えの量より、伝わる根拠を。",
    concern: "AIが多くを語っても、利用者が次にどう動けばよいか分からなければ使われません。",
    decision: "出力を構造化・検証し、観察した動作と改善の意味を結びつける。",
    artifact: "フィードバックUX・品質検証",
  },
  {
    number: "03",
    subject: "継続する運用",
    title: "公開後にしか、見えない課題がある。",
    concern: "結果の分かりやすさだけでなく、待ち時間や運用費用も体験に影響します。",
    decision: "品質・利用導線・処理時間・コストを一緒に見直し、改善の優先順位を決める。",
    artifact: "運用判断・次の改善計画",
  },
]

export function MethodNotes() {
  return <div className="method-notes">
    <div className="method-notes-head">
      <span className="mono">FIELD NOTES / THREE DECISIONS</span>
      <span className="method-live"><span aria-hidden="true" /> 開発・運用の視点から</span>
    </div>
    {notes.map((note, index) => <details key={note.number} className="method-note" open={index === 0}>
      <summary>
        <span className="mono method-note-number">{note.number} / {note.subject}</span>
        <span className="method-note-title">{note.title}</span>
        <span className="method-note-toggle" aria-hidden="true">＋</span>
      </summary>
      <div className="method-note-body">
        <p>{note.concern}</p>
        <div className="method-note-response">
          <span className="mono">OUR APPROACH</span>
          <p>{note.decision}</p>
        </div>
        <p className="method-note-output"><span>設計に残すもの</span>{note.artifact}</p>
      </div>
    </details>)}
    <div className="method-notes-end">
      <p>自社プロダクトの改善経験を、依頼される開発にも。</p>
      <Link href="/cases/ai-sports-trainer" className="text-link" data-track="case_study_click" data-location="method">開発・運用事例を見る <ArrowUpRight size={18} aria-hidden="true" /></Link>
    </div>
  </div>
}
