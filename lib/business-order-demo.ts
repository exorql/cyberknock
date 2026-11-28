// Fixed synthetic samples; no live orders or external network calls.
export type DemoOrder = { id: string; sku: string; quantity: number; unitPrice: number }
export const demoMaster = [{ sku: "P-101", name: "梱包資材A（架空）", unitPrice: 1200 }] as const
export const demoOrders = [
  { id: "DEMO-001", sku: "P-101", quantity: 10, unitPrice: 1200 },
  { id: "DEMO-002", sku: "P-101", quantity: 10, unitPrice: 1100 },
  { id: "DEMO-003", sku: "P-999", quantity: 2, unitPrice: 1200 },
] as const satisfies readonly DemoOrder[]
export function checkDemoOrder(order: DemoOrder, registeredIds: readonly string[]) {
  const item = demoMaster.find(row => row.sku === order.sku)
  if (registeredIds.includes(order.id)) return { ok: false, reason: "登録済みの注文番号です。二重登録を防止しました。" } as const
  if (!item) return { ok: false, reason: "商品台帳にない品番です。担当者の確認が必要です。" } as const
  if (order.unitPrice !== item.unitPrice) return { ok: false, reason: "注文書と商品台帳の単価が一致しません。登録を保留します。" } as const
  if (!Number.isSafeInteger(order.quantity) || order.quantity <= 0 || !Number.isSafeInteger(item.unitPrice * order.quantity)) return { ok: false, reason: "数量を確認してください。" } as const
  return { ok: true, reason: "品番・数量・単価を確認しました。登録案を確認できます。", amount: item.unitPrice * order.quantity } as const
}
