import test from "node:test"
import assert from "node:assert/strict"
import { checkDemoOrder, demoOrders } from "../lib/business-order-demo.ts"
test("synthetic normal order calculates its amount, then duplicate is held", () => {
  const normal = checkDemoOrder(demoOrders[0], [])
  assert.equal(normal.ok, true)
  assert.equal(normal.amount, 12000)
  assert.equal(checkDemoOrder(demoOrders[0], [demoOrders[0].id]).ok, false)
})
test("price mismatch, unknown sku and invalid quantity cannot register", () => {
  for (const order of [demoOrders[1], demoOrders[2], {...demoOrders[0],quantity:0},{...demoOrders[0],quantity:1.5},{...demoOrders[0],quantity:Number.MAX_SAFE_INTEGER}]) assert.equal(checkDemoOrder(order, []).ok, false)
})
