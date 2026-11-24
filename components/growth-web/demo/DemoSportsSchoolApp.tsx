"use client"

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import { DemoApproach } from "@/components/growth-web/demo/DemoApproach"
import { DemoBanner } from "@/components/growth-web/demo/DemoBanner"
import { DemoFaq } from "@/components/growth-web/demo/DemoFaq"
import { DemoHeader, DemoHero, DemoLogo, DemoMobileFacts } from "@/components/growth-web/demo/DemoHero"
import { DemoInspectorDrawer } from "@/components/growth-web/demo/DemoInspectorDrawer"
import { MobileStickyBar } from "@/components/growth-web/demo/MobileStickyBar"
import { PricingSection } from "@/components/growth-web/demo/PricingSection"
import { SafetyStandards } from "@/components/growth-web/demo/SafetyStandards"
import { ClassFinder, ClassList } from "@/components/growth-web/demo/ScheduleFinder"
import { TrialBookingForm } from "@/components/growth-web/demo/TrialBookingForm"
import { DEMO_PHOTO_CREDITS, type DemoClassFilters, dayFilterParam, filterDemoClasses } from "@/lib/growth-web/demo-content"
import { DEMO_SCHOOL_INFO, type DemoClassSlot } from "@/lib/growth-web/demo-school"
import {
  getRecentGrowthWebEvents,
  getServerGrowthWebEventsSnapshot,
  subscribeGrowthWebEvents,
  trackGrowthWebEvent,
} from "@/lib/growth-web/telemetry"

const NO_FILTERS: DemoClassFilters = { grade: "all", days: [], campus: "all" }

export function DemoSportsSchoolApp() {
  const [filters, setFilters] = useState<DemoClassFilters>(NO_FILTERS)
  const [selectedClassId, setSelectedClassId] = useState<string>("")
  const [selectedGrade, setSelectedGrade] = useState<string>("")
  const [ownerMode, setOwnerMode] = useState(false)
  const viewedRef = useRef(false)

  const events = useSyncExternalStore(
    subscribeGrowthWebEvents,
    getRecentGrowthWebEvents,
    getServerGrowthWebEventsSnapshot
  )
  const classes = useMemo(() => filterDemoClasses(filters), [filters])

  useEffect(() => {
    if (viewedRef.current) return
    viewedRef.current = true
    trackGrowthWebEvent("demo_view", { school_type: "junior_soccer_and_movement", is_demo: true })
    if (new URLSearchParams(window.location.search).has("owner")) setOwnerMode(true)
  }, [])

  const scrollToForm = useCallback(() => {
    const el = document.getElementById("trial-form")
    if (!el) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" })
    el.focus({ preventScroll: true })
  }, [])

  const handleFilterChange = (next: DemoClassFilters, changed: "grade" | "day" | "campus" | "reset") => {
    setFilters(next)
    if (changed === "grade" && next.grade !== "all") setSelectedGrade(next.grade)
    trackGrowthWebEvent("demo_schedule_filter", {
      grade_filter: next.grade,
      campus_filter: next.campus,
      day_filter: dayFilterParam(next.days),
      result_count: filterDemoClasses(next).length,
      is_demo: true,
    })
  }

  const handleSelectClassForTrial = useCallback(
    (slot: DemoClassSlot) => {
      setSelectedClassId(slot.id)
      setSelectedGrade((current) =>
        filters.grade !== "all" && slot.grades.includes(filters.grade)
          ? filters.grade
          : current && slot.grades.includes(current as DemoClassSlot["grades"][number])
            ? current
            : slot.defaultGradeValue
      )
      trackGrowthWebEvent("demo_class_select", { class_id: slot.id, campus_filter: slot.campusId, is_demo: true })
      scrollToForm()
    },
    [filters.grade, scrollToForm]
  )

  const toggleOwnerMode = () => {
    setOwnerMode((prev) => {
      const next = !prev
      trackGrowthWebEvent("demo_inspector_toggle", { open: next, is_demo: true })
      return next
    })
  }

  return (
    <div className={`gwd${ownerMode ? " is-owner" : ""}`}>
      <a href="#main-content" className="gwd-skip">
        本文へ移動する
      </a>
      <DemoBanner ownerMode={ownerMode} onToggleOwnerMode={toggleOwnerMode} />
      <DemoInspectorDrawer open={ownerMode} events={events} onClose={() => setOwnerMode(false)} />

      <div className="gwd-page">
        <DemoHeader onJumpToBooking={scrollToForm} />
        <main id="main-content">
          <DemoHero onJumpToBooking={scrollToForm} />
          <DemoMobileFacts />
          <ClassFinder filters={filters} resultCount={classes.length} onChange={handleFilterChange} />
          <SafetyStandards />
          <ClassList
            filters={filters}
            classes={classes}
            selectedClassId={selectedClassId}
            onSelectClassForTrial={handleSelectClassForTrial}
            onReset={() => handleFilterChange(NO_FILTERS, "reset")}
          />
          <DemoApproach />
          <PricingSection />
          <TrialBookingForm
            selectedClassId={selectedClassId}
            selectedGrade={selectedGrade}
            onClassChanged={setSelectedClassId}
            onGradeChanged={setSelectedGrade}
          />
          <DemoFaq />
        </main>

        <footer className="gwd-foot">
          <div className="gwd-wrap gwd-foot-grid">
            <div>
              <a className="gwd-logo" href="#top">
                <DemoLogo />
              </a>
              <p>
                {DEMO_SCHOOL_INFO.areaLabel}
                <br />
                電話 {DEMO_SCHOOL_INFO.phoneDemo}
              </p>
            </div>
            <div>
              <h2>このサイトについて</h2>
              <p>
                Cyber Knock「Growth Web」の制作デモです。スクール名・クラス・料金・コーチ・空き状況はすべて架空の設定で、実在の団体とは関係ありません。体験の申し込みを送信しても、予約・メール・通知は発生しません。
              </p>
              <div className="gwd-foot-links">
                <a href="/services/growth-web">Growth Web サービス紹介へ戻る</a>
                <a href="/">Cyber Knock トップ</a>
                <a href="/privacy-policy">プライバシーポリシー</a>
              </div>
            </div>
            <div>
              <h2>写真クレジット（Unsplash License）</h2>
              <ul>
                {DEMO_PHOTO_CREDITS.map((c) => (
                  <li key={c.photoId}>
                    {c.use}：
                    <a href={`https://unsplash.com/photos/${c.photoId}`} rel="noopener noreferrer" target="_blank">
                      {c.photographer}
                    </a>
                  </li>
                ))}
              </ul>
              <p style={{ marginTop: 10 }}>
                写真はイメージです。写っている人物は、このスクールの生徒・指導者ではありません。
              </p>
            </div>
          </div>
        </footer>
      </div>

      <MobileStickyBar onJumpToBooking={scrollToForm} />
    </div>
  )
}
