"use client"

import { ArrowRight, Clock, MapPin, Users } from "lucide-react"
import { useMemo, useState } from "react"
import {
  type CampusFilterId,
  DEMO_CAMPUSES,
  DEMO_CLASSES,
  DEMO_GRADE_FILTERS,
  type DemoClassSlot,
  type GradeFilterId,
} from "@/lib/growth-web/demo-school"
import { trackGrowthWebEvent } from "@/lib/growth-web/telemetry"

interface ScheduleFinderProps {
  selectedClassId: string
  onSelectClassForTrial: (slot: DemoClassSlot) => void
}

export function ScheduleFinder({
  selectedClassId,
  onSelectClassForTrial,
}: ScheduleFinderProps) {
  const [gradeFilter, setGradeFilter] = useState<GradeFilterId>("all")
  const [campusFilter, setCampusFilter] = useState<CampusFilterId>("all")

  const filteredClasses = useMemo(() => {
    return DEMO_CLASSES.filter((slot) => {
      const gradeMatch =
        gradeFilter === "all" || slot.grades.includes(gradeFilter)
      const campusMatch =
        campusFilter === "all" || slot.campusId === campusFilter
      return gradeMatch && campusMatch
    })
  }, [gradeFilter, campusFilter])

  const handleGradeChange = (nextGrade: GradeFilterId) => {
    setGradeFilter(nextGrade)
    const count = DEMO_CLASSES.filter((slot) => {
      const g = nextGrade === "all" || slot.grades.includes(nextGrade)
      const c = campusFilter === "all" || slot.campusId === campusFilter
      return g && c
    }).length
    trackGrowthWebEvent("demo_schedule_filter", {
      grade_filter: nextGrade,
      campus_filter: campusFilter,
      result_count: count,
      is_demo: true,
    })
  }

  const handleCampusChange = (nextCampus: CampusFilterId) => {
    setCampusFilter(nextCampus)
    const count = DEMO_CLASSES.filter((slot) => {
      const g = gradeFilter === "all" || slot.grades.includes(gradeFilter)
      const c = nextCampus === "all" || slot.campusId === nextCampus
      return g && c
    }).length
    trackGrowthWebEvent("demo_schedule_filter", {
      grade_filter: gradeFilter,
      campus_filter: nextCampus,
      result_count: count,
      is_demo: true,
    })
  }

  return (
    <section
      id="schedule"
      className="scroll-mt-24 border-b border-[#dddad0] bg-[#faf9f5] py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#0d5e43]">
            CLASSES &amp; SCHEDULE FINDER
          </p>
          <h2 className="mt-2.5 text-2xl font-extrabold tracking-tight text-[#10211b] sm:text-3xl">
            学年・拠点から通えるクラスを探す
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#41524b] sm:text-base">
            お子さまの学年とご希望の拠点を選ぶと、対象クラスだけが表示されます。気になるクラスをタップすると、選択状態を引き継いだまま無料体験フォームへ進めます。
          </p>
        </div>

        {/* Interactive Filter Controls */}
        <div className="mt-7 rounded-2xl border border-[#dddad0] bg-white p-4 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-12">
            <fieldset className="lg:col-span-6">
              <legend className="text-xs font-bold uppercase tracking-wider text-[#41524b]">
                1. お子さまの学年で絞り込む
              </legend>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {DEMO_GRADE_FILTERS.map((grade) => {
                  const active = gradeFilter === grade.id
                  return (
                    <button
                      key={grade.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => handleGradeChange(grade.id)}
                      className={`inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-bold transition-colors ${
                        active
                          ? "bg-[#0d5e43] text-white shadow-sm"
                          : "border border-[#c3bfb1] bg-[#faf9f5] text-[#10211b] hover:bg-[#e6f4ee]"
                      }`}
                    >
                      {grade.label}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <fieldset className="lg:col-span-6">
              <legend className="text-xs font-bold uppercase tracking-wider text-[#41524b]">
                2. 拠点で絞り込む（架空拠点）
              </legend>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {DEMO_CAMPUSES.map((campus) => {
                  const active = campusFilter === campus.id
                  return (
                    <button
                      key={campus.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => handleCampusChange(campus.id)}
                      className={`inline-flex min-h-11 items-center rounded-xl px-3.5 text-xs font-bold transition-colors sm:text-sm ${
                        active
                          ? "bg-[#10211b] text-white shadow-sm"
                          : "border border-[#c3bfb1] bg-[#faf9f5] text-[#10211b] hover:bg-[#eeece4]"
                      }`}
                    >
                      {campus.label}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          </div>

          <div
            aria-live="polite"
            className="mt-4 flex items-center justify-between border-t border-[#eeece4] pt-3.5 text-xs text-[#41524b]"
          >
            <span>
              該当クラス：
              <strong
                data-testid="schedule-result-count"
                className="ml-1 text-sm font-extrabold text-[#0d5e43] tabular-nums"
              >
                {filteredClasses.length}件
              </strong>
            </span>
            <span>※時間割・空き枠はデモ用ダミーデータです</span>
          </div>
        </div>

        {/* Class Cards */}
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.map((slot) => {
            const isSelected = selectedClassId === slot.id
            return (
              <article
                key={slot.id}
                data-testid={`class-card-${slot.id}`}
                className={`flex flex-col justify-between rounded-2xl border bg-white p-6 transition-shadow ${
                  isSelected
                    ? "border-[#0d5e43] ring-2 ring-[#0d5e43]/25"
                    : "border-[#dddad0] hover:shadow-md"
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-[#eeece4] px-2.5 py-1 text-xs font-bold text-[#10211b]">
                      {slot.gradeLabel}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        slot.trialStatus === "few_left"
                          ? "bg-[#fdf0e8] text-[#94340a]"
                          : "bg-[#e6f4ee] text-[#0d5e43]"
                      }`}
                    >
                      {slot.trialStatusLabel}
                    </span>
                  </div>

                  <h3 className="mt-3.5 text-lg font-extrabold leading-snug text-[#10211b]">
                    {slot.name}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-[#41524b]">
                    {slot.focusSummary}
                  </p>

                  <ul className="mt-4 space-y-2 border-t border-[#eeece4] pt-4 text-xs text-[#2a3b35]">
                    <li className="flex items-start gap-2">
                      <Clock
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#0d5e43]"
                        aria-hidden="true"
                      />
                      <span className="font-bold text-[#10211b]">
                        <span className="sr-only">曜日・時間：</span>
                        {slot.dayOfWeek} {slot.timeRange}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <MapPin
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#0d5e43]"
                        aria-hidden="true"
                      />
                      <span>
                        <span className="sr-only">拠点・アクセス：</span>
                        <span className="block font-semibold text-[#10211b]">
                          {slot.campusName}
                        </span>
                        <span className="text-[#41524b]">
                          {slot.campusAccess}
                        </span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Users
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#0d5e43]"
                        aria-hidden="true"
                      />
                      <span>
                        <span className="sr-only">定員・指導体制：</span>
                        定員{slot.capacity}名｜{slot.coachRatio}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mt-5 border-t border-[#eeece4] pt-4">
                  <div className="mb-3 flex items-baseline justify-between">
                    <span className="text-xs font-semibold text-[#41524b]">
                      月謝（税込・デモ料金）
                    </span>
                    <span className="text-xl font-extrabold text-[#10211b] tabular-nums">
                      ¥{slot.monthlyFeeJpy.toLocaleString("ja-JP")}
                      <span className="text-xs font-medium text-[#41524b]">
                        {" "}
                        / 月
                      </span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectClassForTrial(slot)}
                    data-testid={`select-class-${slot.id}`}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#b8430f] px-4 text-sm font-bold text-white transition-colors hover:bg-[#94340a]"
                  >
                    このクラスで無料体験（60秒）
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            )
          })}

          {/* Consultation helper card for undecided schedules */}
          <article className="flex flex-col justify-between rounded-2xl border border-dashed border-[#0d5e43]/45 bg-[#e6f4ee]/60 p-6">
            <div>
              <span className="inline-block rounded-full bg-[#0d5e43] px-2.5 py-1 font-mono text-[11px] font-bold text-white">
                CLASS CONSULTATION
              </span>
              <h3 className="mt-3.5 text-lg font-extrabold leading-snug text-[#10211b]">
                曜日・レベル選びで迷っている方へ
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[#2a3b35]">
                「兄弟で同じ曜日に通いたい」「未経験でもついていけるクラスを相談したい」といったご相談も、体験フォームのメモ欄からそのまま受け付けています。
              </p>
              <ul className="mt-4 space-y-2 border-t border-[#0d5e43]/15 pt-4 text-xs font-medium text-[#144333]">
                <li>・体験当日のレベル確認後にクラス変更可能</li>
                <li>・週2回受講（割引プラン）の組み合わせ相談可</li>
                <li>・雨天時は屋内アリーナ枠への振替案内あり</li>
              </ul>
            </div>
            <div className="mt-5 border-t border-[#0d5e43]/15 pt-4">
              <a
                href="#trial-form"
                onClick={() =>
                  trackGrowthWebEvent("demo_hero_cta_click", {
                    action: "schedule_consult_card",
                    destination: "#trial-form",
                    is_demo: true,
                  })
                }
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#0d5e43] bg-white px-4 text-sm font-bold text-[#0d5e43] transition-colors hover:bg-[#0d5e43] hover:text-white"
              >
                クラス選びを相談しながら予約
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
