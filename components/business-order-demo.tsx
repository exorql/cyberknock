"use client"
import { useState } from "react"
import { checkDemoOrder, demoMaster, demoOrders } from "@/lib/business-order-demo"

const labels = ["通常の注文", "単価が異なる注文", "未登録の商品"]
const money = (value: number) => value.toLocaleString("ja-JP") + "円"

export function BusinessOrderDemo() {
  const [index, setIndex] = useState(0)
  const [checked, setChecked] = useState(false)
  const [registered, setRegistered] = useState<string[]>([])
  const [notice, setNotice] = useState("")
  const order = demoOrders[index]
  const result = checkDemoOrder(order, registered)
  function register() {
    if (!checked || !result.ok) return
    setRegistered(previous => checkDemoOrder(order, previous).ok ? [...previous, order.id] : previous)
    setChecked(false)
    setNotice(order.id + " をデモ台帳に登録しました。")
  }
  function select(next: number) {
    setIndex(next); setChecked(false); setNotice("")
  }
  return <div className="order-demo">
    <p className="business-kicker">操作できる実演 / 架空データ</p>
    <p>注文書から抽出したと仮定する固定値で、商品台帳との照合・保留・登録を試せます。実際のOCR・AI解析・外部システム連携は行いません。入力やアップロードは不要で、記録はブラウザ内の一時的な表示だけです。</p>
    <fieldset className="order-demo-choice"><legend>1. 注文例を選ぶ</legend>
      {labels.map((label, i) => <label key={label}><input type="radio" name="demo-order-example" checked={index === i} onChange={() => select(i)} /> {label}</label>)}
    </fieldset>
    <div className="order-demo-data">
      <div><h3>注文の候補値</h3><dl><div><dt>注文番号</dt><dd>{order.id}</dd></div><div><dt>品番</dt><dd>{order.sku}</dd></div><div><dt>数量</dt><dd>{order.quantity}個</dd></div><div><dt>単価（税別）</dt><dd>{money(order.unitPrice)}</dd></div></dl></div>
      <div><h3>商品台帳</h3><dl><div><dt>登録品番</dt><dd>{demoMaster[0].sku}</dd></div><div><dt>商品名</dt><dd>{demoMaster[0].name}</dd></div><div><dt>単価（税別）</dt><dd>{money(demoMaster[0].unitPrice)}</dd></div></dl></div>
    </div>
    <div className="business-actions"><button type="button" className="button button-primary" onClick={() => { setChecked(true); setNotice("") }}>2. 照合する</button><button type="button" className="button" disabled={!checked || !result.ok} onClick={register}>3. 確認して登録する</button></div>
    <div className="order-demo-status" aria-live="polite">
      {notice ? <p><strong>{notice}</strong></p> : checked ? <><p><strong>{result.ok ? "確認可能" : "登録保留"}</strong>：{result.reason}</p>{result.ok && <p>登録予定額（税別）：{money(result.amount)}</p>}</> : <p>「照合する」を押して、確認結果をご覧ください。</p>}
    </div>
    <div className="order-demo-ledger"><h3>デモ台帳</h3>{registered.length ? <ul>{registered.map(id => <li key={id}>{id} / 登録済み</li>)}</ul> : <p>未登録</p>}</div>
    <button type="button" className="text-link" onClick={() => { setRegistered([]); select(0) }}>初期状態に戻す</button>
  </div>
}
