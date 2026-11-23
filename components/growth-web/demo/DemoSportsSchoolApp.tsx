"use client"

import Link from "next/link"
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react"
import { DemoBanner } from "@/components/growth-web/demo/DemoBanner"
import { DemoFaq } from "@/components/growth-web/demo/DemoFaq"
import { DemoHero } from "@/components/growth-web/demo/DemoHero"
import { DemoInspectorDrawer } from "@/components/growth-web/demo/DemoInspectorDrawer"
import { MobileStickyBar } from "@/components/growth-web/demo/MobileStickyBar"
import { PricingSection } from "@/components/growth-web/demo/PricingSection"
import { SafetyStandards } from "@/components/growth-web/demo/SafetyStandards"
import { ScheduleFinder } from "@/components/growth-web/demo/ScheduleFinder"
import { TrialBookingForm } from "@/components/growth-web/demo/TrialBookingForm"
import { TrialFlowAndCoaches } from "@/components/growth-web/demo/TrialFlowAndCoaches"
import {
  DEMO_CLASSES,
  DEMO_SCHOOL_INFO,
  type DemoClassSlot,
} from "@/lib/growth-web/demo-school"
import {
  getRecentGrowthWebEvents,
  getServerGrowthWebEventsSnapshot,
  subscribeGrowthWebEvents,
  trackGrowthWebEvent,
} from "@/lib/growth-web/telemetry"

export function DemoSportsSchoolApp() {
  const [selectedClassId, setSelectedClassId] = useState<string>(
    DEMO_CLASSES[0].id
  )
  const [selectedGrade, setSelectedGrade] = useState<string>(
    DEMO_CLASSES[0].defaultGradeValue
  )
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const viewedRef = useRef(false)

  const events = useSyncExternalStore(
    subscribeGrowthWebEvents,
    getRecentGrowthWebEvents,
    getServerGrowthWebEventsSnapshot
  )

  useEffect(() => {
    if (viewedRef.current) return
    viewedRef.current = true
    trackGrowthWebEvent("demo_view", {
      school_type: "junior_soccer_and_movement",
      is_demo: true,
    })
  }, [])

  const scrollToForm = useCallback(() => {
    const el = document.getElementById("trial-form")
    el?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  const handleSelectClassForTrial = useCallback(
    (slot: DemoClassSlot) => {
      setSelectedClassId(slot.id)
      setSelectedGrade(slot.defaultGradeValue)
      trackGrowthWebEvent("demo_class_select", {
        class_id: slot.id,
        campus_filter: slot.campusId,
        is_demo: true,
      })
      scrollToForm()
    },
    [scrollToForm]
  )

  const handleToggleInspector = () => {
    setInspectorOpen((prev) => {
      const next = !prev
      trackGrowthWebEvent("demo_inspector_toggle", { open: next, is_demo: true })
      return next
    })
  }

  return (
    <div className="gw-scope min-h-screen bg-[#faf9f5] text-[#10211b]">
      <a href="#main-content" className="skip-link">
        本文へ移動する
      </a>

      <DemoBanner
        eventCount={events.length}
        inspectorOpen={inspectorOpen}
        onToggleInspector={handleToggleInspector}
      />

      <DemoInspectorDrawer
        open={inspectorOpen}
        events={events}
        onClose={() => setInspectorOpen(false)}
      />

      <DemoHero onJumpToBooking={scrollToForm} />

      <main id="main-content">
        <SafetyStandards />
        <ScheduleFinder
          selectedClassId={selectedClassId}
          onSelectClassForTrial={handleSelectClassForTrial}
        />
        <PricingSection />
        <TrialFlowAndCoaches />
        <DemoFaq />
        <TrialBookingForm
          selectedClassId={selectedClassId}
          selectedGrade={selectedGrade}
          onClassChanged={setSelectedClassId}
          onGradeChanged={setSelectedGrade}
        />
      </main>

      <footer className="gw-dark-surface border-t border-[#1f3d32] bg-[#0e1b16] pb-24 pt-12 text-[#c6d4cd] lg:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-base font-extrabold text-white">
                {DEMO_SCHOOL_INFO.name}
              </p>
              <p className="mt-1 text-xs text-[#a7f3d0]">
                {DEMO_SCHOOL_INFO.demoBadge}｜{DEMO_SCHOOL_INFO.areaLabel}
              </p>
              <p className="mt-2 max-w-xl text-xs leading-relaxed text-[#c6d4cd]">
                本サイトはCyber Knockによる民間スポーツスクール向け集客改善サービスのデモモデルです。
                登場する拠点名・時間割・料金・コーチプロフィールはすべて架空のダミーデータです。
              </p>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs font-semibold">
              <Link
                href="/services/growth-web"
                className="inline-flex min-h-11 items-center text-[#6ee7b7] hover:underline"
              >
                Growth Web サービスLPへ戻る
              </Link>
              <Link
                href="/"
                className="inline-flex min-h-11 items-center text-[#e3eee8] hover:underline"
              >
                Cyber Knock トップ
              </Link>
              <Link
                href="/privacy-policy"
                className="inline-flex min-h-11 items-center text-[#e3eee8] hover:underline"
              >
                プライバシーポリシー
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <MobileStickyBar onJumpToBooking={scrollToForm} />
    </div>
  )
}
