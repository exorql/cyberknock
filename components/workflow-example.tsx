import { ClipboardList, FileInput, ListChecks } from "lucide-react"

const examples = {
  order: {
    title: "受注書から販売台帳へ",
    rows: [["受け取る", "注文メール・PDF", "品番と数量を取り込む"], ["照合する", "商品台帳と比較", "不明な品番は担当者へ"], ["登録する", "確認済みの受注明細", "承認した行を販売管理へ"]],
  },
  ledger: {
    title: "一つの案件を部署で共有",
    rows: [["営業", "案件と見積を登録", "入力は案件ごとに一度"], ["責任者", "見積を確認・承認", "差し戻しの理由を記録"], ["業務担当", "受注・出荷を更新", "同じ台帳から月報を出力"]],
  },
} as const
const icons = [FileInput, ListChecks, ClipboardList]

export function WorkflowExample({ kind }: { kind: keyof typeof examples }) {
  const example = examples[kind]
  return <figure className="workflow-paper">
    <figcaption><span>業務の改善例</span><strong>{example.title}</strong></figcaption>
    <ol>{example.rows.map(([label, title, detail], index) => {
      const Icon = icons[index]
      return <li key={label}><span className="workflow-icon"><Icon size={24} aria-hidden="true" /></span>
        <div><span className="workflow-label">{label}</span><strong>{title}</strong><p>{detail}</p></div></li>
    })}</ol>
  </figure>
}
