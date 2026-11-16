export type DemoMilestone = "start" | "50" | "complete"
export type DemoMediaEvent = "play" | "progress" | "ended"

/**
 * Returns the milestones that should be sent now, in funnel order, each at most once.
 * Nothing is reported before a real play, so scrubbing a paused video never counts.
 * Completion means 90% of the duration or the ended event (start ⊇ 50% ⊇ complete).
 */
export function dueDemoMilestones(
  sent: ReadonlySet<DemoMilestone>,
  input: { event: DemoMediaEvent; currentTime: number; duration: number; fallbackDuration: number },
): DemoMilestone[] {
  const due: DemoMilestone[] = []
  const has = (milestone: DemoMilestone) => sent.has(milestone) || due.includes(milestone)
  if (input.event === "play" && !has("start")) due.push("start")
  if (!has("start")) return due
  const duration = Number.isFinite(input.duration) && input.duration > 0 ? input.duration : input.fallbackDuration
  const ratio = duration > 0 && Number.isFinite(input.currentTime) ? input.currentTime / duration : 0
  const ended = input.event === "ended"
  if ((ended || ratio >= 0.5) && !has("50")) due.push("50")
  if ((ended || ratio >= 0.9) && !has("complete")) due.push("complete")
  return due
}
