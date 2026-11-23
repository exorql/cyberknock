/** Visibility rule for the LP's mobile sticky CTA (components/growth-web/lp/MobileStickyCta.tsx). */
export const STICKY_MAX_WIDTH_QUERY = "(max-width: 1023px)"
/** The bar hides once the visual viewport shrinks below this ratio (software keyboard). */
export const STICKY_KEYBOARD_RATIO = 0.75

export interface StickyVisibilityState {
  isMobile: boolean
  heroCtaVisible: boolean
  formVisible: boolean // Includes the form being above the viewport after scrolling past it.
  fieldFocused: boolean
  keyboardOpen: boolean
}

export function shouldShowSticky(s: StickyVisibilityState): boolean {
  return s.isMobile && !s.heroCtaVisible && !s.formVisible && !s.fieldFocused && !s.keyboardOpen
}

/** Hide the CTA once the form reaches the viewport, and keep it hidden below the form. */
export function isFormVisibleOrPassed(isIntersecting: boolean, formBottom: number): boolean {
  return isIntersecting || formBottom <= 0
}

export function isKeyboardOpen(visualHeight: number, baseHeight: number): boolean {
  return visualHeight < baseHeight * STICKY_KEYBOARD_RATIO
}
