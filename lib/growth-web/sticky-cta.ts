/** Visibility rule for the LP's mobile sticky CTA (components/growth-web/lp/MobileStickyCta.tsx). */
export const STICKY_MAX_WIDTH_QUERY = "(max-width: 1023px)"
/** The bar hides once the visual viewport shrinks below this ratio (software keyboard). */
export const STICKY_KEYBOARD_RATIO = 0.75

export interface StickyVisibilityState {
  isMobile: boolean
  heroCtaVisible: boolean
  formVisible: boolean
  fieldFocused: boolean
  keyboardOpen: boolean
}

export function shouldShowSticky(s: StickyVisibilityState): boolean {
  return s.isMobile && !s.heroCtaVisible && !s.formVisible && !s.fieldFocused && !s.keyboardOpen
}

export function isKeyboardOpen(visualHeight: number, baseHeight: number): boolean {
  return visualHeight < baseHeight * STICKY_KEYBOARD_RATIO
}
