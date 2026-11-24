/**
 * Visibility rule for the demo's mobile sticky "book a trial" bar.
 * Shown only between the end of the hero and the trial form:
 * hidden over the hero, once the form has come into view (and after it),
 * and while the visitor is typing in any text field or select.
 */
export interface DemoStickyState {
  heroBottom: number
  formTop: number
  viewportHeight: number
  fieldFocused: boolean
}

export function shouldShowDemoSticky({ heroBottom, formTop, viewportHeight, fieldFocused }: DemoStickyState): boolean {
  if (fieldFocused) return false
  const heroPassed = heroBottom <= 0
  const formReachedOrPassed = formTop <= viewportHeight
  return heroPassed && !formReachedOrPassed
}

/** Text-entry controls that open the on-screen keyboard. */
export function isTextEntry(el: Element | null): boolean {
  if (!el) return false
  const tag = el.tagName
  if (tag === "TEXTAREA" || tag === "SELECT") return true
  if (tag !== "INPUT") return false
  const type = (el.getAttribute("type") || "text").toLowerCase()
  return ["text", "email", "tel", "search", "url", "number", "password"].includes(type)
}
