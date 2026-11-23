import { Backpack, CheckCircle2 } from "lucide-react"
import { DemoCoachArtwork } from "@/components/growth-web/EditorialVisuals"
import {
  DEMO_COACHES,
  TRIAL_BELONGINGS,
  TRIAL_TIMELINE,
} from "@/lib/growth-web/demo-school"

export function TrialFlowAndCoaches() {
  return (
    <>
      {/* First-Day Trial Timeline & Belongings */}
      <section
        id="trial-flow"
        className="scroll-mt-24 border-b border-[#dddad0] bg-[#faf9f5] py-14 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#0d5e43]">
                FIRST TRIAL TIMELINE
              </p>
              <h2 className="mt-2.5 text-2xl font-extrabold tracking-tight text-[#10211b] sm:text-3xl">
                初めての無料体験レッスン（60分）の流れ
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#41524b]">
                「最初の一歩で緊張して泣いてしまったら…」という保護者の方もご安心ください。遊びの要素から段階的に溶け込める流れを組んでいます。
              </p>

              <ol className="mt-6 space-y-3.5">
                {TRIAL_TIMELINE.map((step) => (
                  <li
                    key={step.minute}
                    className="flex items-start gap-4 rounded-2xl border border-[#dddad0] bg-white p-4 sm:p-5"
                  >
                    <span className="shrink-0 rounded-lg bg-[#e6f4ee] px-2.5 py-1 font-mono text-xs font-bold text-[#0d5e43] tabular-nums">
                      {step.minute}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#10211b] sm:text-base">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#41524b] sm:text-sm">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-[#0d5e43]/25 bg-white p-6 sm:p-8 lg:sticky lg:top-20">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#e6f4ee] px-3 py-1 text-xs font-bold text-[#0d5e43]">
                  <Backpack className="h-4 w-4" aria-hidden="true" />
                  体験当日の持ち物リスト
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-[#10211b]">
                  専用道具を買わずにそのまま参加できます
                </h3>
                <ul className="mt-5 space-y-3">
                  {TRIAL_BELONGINGS.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-[#2a3b35]"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#0d5e43]"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-xl bg-[#faf9f5] p-4 text-xs leading-relaxed text-[#41524b]">
                  <strong className="text-[#10211b]">送迎・見学について：</strong>
                  コート脇に見学ベンチをご用意しています。兄弟・姉妹をお連れでの見学も可能です。
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coaches Section (Explicit fictional profiles, zero fake reviews) */}
      <section
        id="coaches"
        className="scroll-mt-24 border-b border-[#dddad0] bg-white py-14 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#0d5e43]">
              COACHING PHILOSOPHY（架空モデルプロフィール）
            </p>
            <h2 className="mt-2.5 text-2xl font-extrabold tracking-tight text-[#10211b] sm:text-3xl">
              指導方針と担当コーチ紹介
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#41524b] sm:text-base">
              ※以下はデモ用の架空プロフィールです。実際の導入サイトでは、貴校のコーチご本人の写真・保有資格・指導メッセージを掲載し、保護者の安心感を高めます（架空の保護者口コミは掲載していません）。
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {DEMO_COACHES.map((coach) => (
              <article
                key={coach.id}
                className="flex flex-col justify-between rounded-2xl border border-[#dddad0] bg-[#faf9f5] p-6"
              >
                <div>
                  <DemoCoachArtwork
                    tone={coach.accentTone}
                    caption={`${coach.name} の指導シーンイメージ`}
                    initials={coach.id === "coach-takahashi" ? "KT" : "AS"}
                    specialty={
                      coach.id === "coach-takahashi"
                        ? "HEAD COACH / BALL CONTROL"
                        : "KIDS MOVEMENT & AGILITY"
                    }
                  />
                  <div className="mt-5">
                    <span className="font-mono text-xs font-semibold text-[#0d5e43]">
                      {coach.role}
                    </span>
                    <h3 className="mt-1 text-xl font-extrabold text-[#10211b]">
                      {coach.name}
                    </h3>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {coach.credentials.map((cred) => (
                        <span
                          key={cred}
                          className="rounded-full border border-[#c3bfb1] bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#2a3b35]"
                        >
                          {cred}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-[#2a3b35]">
                      {coach.philosophy}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
