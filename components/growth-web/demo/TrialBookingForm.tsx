"use client"

import { CalendarCheck, CheckCircle2, Info, MailCheck } from "lucide-react"
import { type FormEvent, useRef, useState } from "react"
import { DEMO_CLASSES } from "@/lib/growth-web/demo-school"
import {
  CHILD_GRADES,
  EXPERIENCE_LEVELS,
  PREFERRED_TIMINGS,
  type GrowthWebPublicReceipt,
  validateTrialBookingClient,
} from "@/lib/growth-web/form-options"
import { trackGrowthWebEvent } from "@/lib/growth-web/telemetry"

interface TrialBookingFormProps {
  selectedClassId: string
  selectedGrade: string
  onClassChanged: (classId: string) => void
  onGradeChanged: (grade: string) => void
}

interface TrialFormState {
  guardianName: string
  email: string
  phone: string
  preferredTiming: string
  experienceLevel: string
  notes: string
  demoAcknowledged: boolean
  websiteHp: string
}

function createDemoIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `demo_${crypto.randomUUID().replace(/-/g, "")}`
  }
  return `demo_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`
}

export function TrialBookingForm({
  selectedClassId,
  selectedGrade,
  onClassChanged,
  onGradeChanged,
}: TrialBookingFormProps) {
  const [form, setForm] = useState<TrialFormState>({
    guardianName: "",
    email: "",
    phone: "",
    preferredTiming: "next_week",
    experienceLevel: "beginner",
    notes: "",
    demoAcknowledged: false,
    websiteHp: "",
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [receipt, setReceipt] = useState<{
    receipt: GrowthWebPublicReceipt
    selectedClass: {
      name: string
      campusName: string
      dayOfWeek: string
      timeRange: string
    }
  } | null>(null)

  const startedRef = useRef(false)
  const submittingRef = useRef(false)
  const idempotencyKeyRef = useRef<string>(createDemoIdempotencyKey())

  const activeClass =
    DEMO_CLASSES.find((c) => c.id === selectedClassId) ?? DEMO_CLASSES[0]

  const markStarted = () => {
    if (!startedRef.current) {
      startedRef.current = true
      trackGrowthWebEvent("trial_form_start", {
        form_id: "growth_web_demo_trial",
        preselected_class: selectedClassId,
        is_demo: true,
      })
    }
  }

  const clearFieldError = (key: string) => {
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const updateField = <K extends keyof TrialFormState>(
    key: K,
    value: TrialFormState[K]
  ) => {
    markStarted()
    setForm((prev) => ({ ...prev, [key]: value }))
    idempotencyKeyRef.current = createDemoIdempotencyKey()
    clearFieldError(key)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submittingRef.current) return
    setSubmitError(null)

    const validated = validateTrialBookingClient({
      ...form,
      selectedClassId,
      childGrade: selectedGrade,
    })

    if (!validated.data) {
      setFieldErrors(validated.fieldErrors ?? {})
      setSubmitError("未入力または形式に誤りのある項目をご確認ください。")
      trackGrowthWebEvent("trial_form_error", {
        form_id: "growth_web_demo_trial",
        error_type: "validation",
        is_demo: true,
      })
      return
    }

    submittingRef.current = true
    setSubmitting(true)
    try {
      const res = await fetch("/api/growth-web/demo-trial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKeyRef.current,
        },
        body: JSON.stringify(validated.data),
      })
      const data = await res.json().catch(() => ({ ok: false }))

      if (!res.ok || !data.ok) {
        if (data.fieldErrors) {
          const mapped: Record<string, string> = {}
          for (const [k, v] of Object.entries(
            data.fieldErrors as Record<string, string[]>
          )) {
            if (v?.[0]) mapped[k] = v[0]
          }
          setFieldErrors(mapped)
        }
        setSubmitError(
          data.error ||
            "送信処理に失敗しました。入力をご確認のうえ再試行してください。"
        )
        const errorType =
          res.status === 429
            ? "rate_limit"
            : res.status === 400
              ? "validation"
              : "server"
        trackGrowthWebEvent("trial_form_error", {
          form_id: "growth_web_demo_trial",
          error_type: errorType,
          is_demo: true,
        })
        return
      }

      setReceipt({
        receipt: data.receipt as GrowthWebPublicReceipt,
        selectedClass: data.selectedClass,
      })
      trackGrowthWebEvent("trial_form_submit", {
        form_id: "growth_web_demo_trial",
        class_id: validated.data.selectedClassId,
        grade: validated.data.childGrade,
        is_demo: true,
      })
    } catch {
      setSubmitError("通信エラーが発生しました。再度お試しください。")
      trackGrowthWebEvent("trial_form_error", {
        form_id: "growth_web_demo_trial",
        error_type: "network",
        is_demo: true,
      })
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  return (
    <section
      id="trial-form"
      className="scroll-mt-24 bg-white pb-24 pt-14 sm:py-20"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-left sm:text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#fdf0e8] px-3.5 py-1 text-xs font-bold text-[#94340a]">
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            スマホで60秒・持ち物は動きやすい服と水筒だけ
          </div>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#10211b] sm:text-3xl">
            無料体験レッスンお申し込み（デモフォーム）
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-[#41524b]">
            ※架空モデルスクールの動作確認フォームです。送信しても実在スクールへの予約・外部メール送信・サーバー永続保存は一切発生しません。
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-[#dddad0] bg-[#faf9f5] p-6 shadow-sm sm:p-8">
          {/* Active class summary pill */}
          <div
            data-testid="selected-class-banner"
            className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#0d5e43]/30 bg-[#e6f4ee] px-4 py-3 text-xs sm:text-sm"
          >
            <div>
              <span className="font-mono text-[11px] font-bold text-[#0d5e43]">
                選択中の希望クラス：
              </span>
              <strong className="ml-1 font-extrabold text-[#10211b]">
                {activeClass.name}
              </strong>
              <span className="ml-2 text-[#2a3b35]">
                （{activeClass.dayOfWeek} {activeClass.timeRange}）
              </span>
            </div>
            <span className="font-bold text-[#0d5e43]">初回体験 ¥0</span>
          </div>

          {receipt ? (
            <div
              role="status"
              aria-live="polite"
              data-testid="trial-booking-receipt"
              className="space-y-5"
            >
              <div className="flex items-start gap-3 rounded-xl border border-[#0d5e43]/35 bg-white p-5">
                <MailCheck
                  className="mt-0.5 h-6 w-6 shrink-0 text-[#0d5e43]"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-lg font-extrabold text-[#10211b]">
                    無料体験のデモ申込を受け付けました
                  </h3>
                  <p className="mt-1 text-sm text-[#2a3b35]">
                    受付ID：
                    <code className="ml-1 rounded bg-[#e6f4ee] px-2 py-0.5 font-mono text-xs font-bold text-[#0d5e43]">
                      {receipt.receipt.receiptId}
                    </code>
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[#41524b]">
                    選択クラス：{receipt.selectedClass.name}（
                    {receipt.selectedClass.dayOfWeek}{" "}
                    {receipt.selectedClass.timeRange}／
                    {receipt.selectedClass.campusName}）
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#0d5e43]">
                    安全動作モード：{receipt.receipt.mode}
                    （外部メール未送信・サーバー永続保存なし・GA4イベント発火済み）
                  </p>
                </div>
              </div>

              {receipt.receipt.preview && (
                <div className="rounded-xl border border-[#dddad0] bg-white p-4">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#41524b]">
                    SCHOOL STAFF NOTIFICATION PREVIEW（実導入時にコーチへ届く通知内容）
                  </p>
                  <p className="mt-2 text-xs font-bold text-[#10211b]">
                    件名：{receipt.receipt.preview.emailSubject}
                  </p>
                  <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg border border-[#eeece4] bg-[#faf9f5] p-3 font-mono text-xs leading-relaxed text-[#2a3b35]">
                    {receipt.receipt.preview.emailBodyPreview}
                  </pre>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setReceipt(null)
                  startedRef.current = false
                  idempotencyKeyRef.current = createDemoIdempotencyKey()
                }}
                className="inline-flex min-h-11 items-center rounded-lg border border-[#10211b] bg-white px-4 text-sm font-semibold text-[#10211b] hover:bg-[#eeece4]"
              >
                別の条件でデモ送信を試す
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {submitError && (
                <div
                  role="alert"
                  className="rounded-xl border border-[#b8430f]/45 bg-[#fdf0e8] px-4 py-3 text-sm font-medium text-[#7c2d0b]"
                >
                  {submitError}
                </div>
              )}

              {/* Honeypot */}
              <div
                className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
                aria-hidden="true"
              >
                <label htmlFor="demo-website-hp">Leave blank</label>
                <input
                  id="demo-website-hp"
                  name="websiteHp"
                  type="text"
                  tabIndex={-1}
                  autoComplete="new-password"
                  value={form.websiteHp}
                  onChange={(e) => updateField("websiteHp", e.target.value)}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="trial-class"
                    className="block text-sm font-bold text-[#10211b]"
                  >
                    希望クラス
                    <span className="ml-1.5 text-xs font-bold text-[#b8430f]">
                      必須
                    </span>
                  </label>
                  <select
                    id="trial-class"
                    name="selectedClassId"
                    value={selectedClassId}
                    onChange={(e) => {
                      markStarted()
                      onClassChanged(e.target.value)
                      idempotencyKeyRef.current = createDemoIdempotencyKey()
                      clearFieldError("selectedClassId")
                    }}
                    className="mt-1.5 min-h-12 w-full rounded-xl border border-[#c3bfb1] bg-white px-3.5 text-sm text-[#10211b]"
                  >
                    {DEMO_CLASSES.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.name}（{slot.shortLabel}）
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="trial-grade"
                    className="block text-sm font-bold text-[#10211b]"
                  >
                    お子さまの学年
                    <span className="ml-1.5 text-xs font-bold text-[#b8430f]">
                      必須
                    </span>
                  </label>
                  <select
                    id="trial-grade"
                    name="childGrade"
                    value={selectedGrade}
                    onChange={(e) => {
                      markStarted()
                      onGradeChanged(e.target.value)
                      idempotencyKeyRef.current = createDemoIdempotencyKey()
                      clearFieldError("childGrade")
                    }}
                    className="mt-1.5 min-h-12 w-full rounded-xl border border-[#c3bfb1] bg-white px-3.5 text-sm text-[#10211b]"
                  >
                    {CHILD_GRADES.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="trial-timing"
                    className="block text-sm font-bold text-[#10211b]"
                  >
                    体験のご希望時期
                  </label>
                  <select
                    id="trial-timing"
                    name="preferredTiming"
                    value={form.preferredTiming}
                    onChange={(e) =>
                      updateField("preferredTiming", e.target.value)
                    }
                    className="mt-1.5 min-h-12 w-full rounded-xl border border-[#c3bfb1] bg-white px-3.5 text-sm text-[#10211b]"
                  >
                    {PREFERRED_TIMINGS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="trial-experience"
                    className="block text-sm font-bold text-[#10211b]"
                  >
                    運動・サッカーのご経験
                  </label>
                  <select
                    id="trial-experience"
                    name="experienceLevel"
                    value={form.experienceLevel}
                    onChange={(e) =>
                      updateField("experienceLevel", e.target.value)
                    }
                    className="mt-1.5 min-h-12 w-full rounded-xl border border-[#c3bfb1] bg-white px-3.5 text-sm text-[#10211b]"
                  >
                    {EXPERIENCE_LEVELS.map((exp) => (
                      <option key={exp.value} value={exp.value}>
                        {exp.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="guardian-name"
                    className="block text-sm font-bold text-[#10211b]"
                  >
                    保護者の方のお名前
                    <span className="ml-1.5 text-xs font-bold text-[#b8430f]">
                      必須
                    </span>
                  </label>
                  <input
                    id="guardian-name"
                    name="guardianName"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="例：鈴木 花子"
                    value={form.guardianName}
                    onChange={(e) =>
                      updateField("guardianName", e.target.value)
                    }
                    aria-invalid={Boolean(fieldErrors.guardianName)}
                    aria-describedby={
                      fieldErrors.guardianName ? "guardian-name-err" : undefined
                    }
                    className="mt-1.5 min-h-12 w-full rounded-xl border border-[#c3bfb1] bg-white px-3.5 text-sm text-[#10211b] placeholder:text-[#66736d]"
                  />
                  {fieldErrors.guardianName && (
                    <p
                      id="guardian-name-err"
                      className="mt-1 text-xs font-medium text-[#b8430f]"
                    >
                      {fieldErrors.guardianName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="guardian-email"
                    className="block text-sm font-bold text-[#10211b]"
                  >
                    メールアドレス（デモ入力）
                    <span className="ml-1.5 text-xs font-bold text-[#b8430f]">
                      必須
                    </span>
                  </label>
                  <input
                    id="guardian-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="demo-parent@example.jp"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={
                      fieldErrors.email ? "guardian-email-err" : undefined
                    }
                    className="mt-1.5 min-h-12 w-full rounded-xl border border-[#c3bfb1] bg-white px-3.5 text-sm text-[#10211b] placeholder:text-[#66736d]"
                  />
                  {fieldErrors.email && (
                    <p
                      id="guardian-email-err"
                      className="mt-1 text-xs font-medium text-[#b8430f]"
                    >
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="guardian-phone"
                  className="block text-sm font-bold text-[#10211b]"
                >
                  雨天中止時の当日連絡先
                  <span className="ml-1.5 text-xs font-normal text-[#41524b]">
                    任意
                  </span>
                </label>
                <input
                  id="guardian-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="090-0000-0000"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  aria-describedby={
                    fieldErrors.phone ? "guardian-phone-err" : undefined
                  }
                  className="mt-1.5 min-h-12 w-full rounded-xl border border-[#c3bfb1] bg-white px-3.5 text-sm text-[#10211b] placeholder:text-[#66736d]"
                />
                {fieldErrors.phone && (
                  <p
                    id="guardian-phone-err"
                    className="mt-1 text-xs font-medium text-[#b8430f]"
                  >
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="trial-notes"
                  className="block text-sm font-bold text-[#10211b]"
                >
                  お子さまの性格やご不安な点
                  <span className="ml-1.5 text-xs font-normal text-[#41524b]">
                    任意
                  </span>
                </label>
                <textarea
                  id="trial-notes"
                  name="notes"
                  rows={2}
                  placeholder="例：人見知りなので最初は親の近くから見学させたい、兄弟2人で体験したい等"
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  aria-invalid={Boolean(fieldErrors.notes)}
                  aria-describedby={
                    fieldErrors.notes ? "trial-notes-err" : undefined
                  }
                  className="mt-1.5 w-full rounded-xl border border-[#c3bfb1] bg-white p-3.5 text-sm text-[#10211b] placeholder:text-[#66736d]"
                />
                {fieldErrors.notes && (
                  <p
                    id="trial-notes-err"
                    className="mt-1 text-xs font-medium text-[#b8430f]"
                  >
                    {fieldErrors.notes}
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-[#0d5e43]/25 bg-white p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    id="demo-acknowledged"
                    name="demoAcknowledged"
                    type="checkbox"
                    checked={form.demoAcknowledged}
                    onChange={(e) =>
                      updateField("demoAcknowledged", e.target.checked)
                    }
                    aria-invalid={Boolean(fieldErrors.demoAcknowledged)}
                    aria-describedby={
                      fieldErrors.demoAcknowledged
                        ? "demo-acknowledged-err"
                        : undefined
                    }
                    className="mt-0.5 h-5 w-5 rounded border-[#c3bfb1] accent-[#0d5e43]"
                  />
                  <span className="text-xs leading-relaxed text-[#2a3b35]">
                    本ページが架空モデルスクールのデモ送信であり、実在スクールへの予約・外部送信・サーバー永続保存は行われないことを確認しました。
                  </span>
                </label>
                {fieldErrors.demoAcknowledged && (
                  <p
                    id="demo-acknowledged-err"
                    className="mt-1.5 text-xs font-medium text-[#b8430f]"
                  >
                    {fieldErrors.demoAcknowledged}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#b8430f] px-6 text-base font-bold text-white shadow-md transition-colors hover:bg-[#94340a] disabled:opacity-60"
              >
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                {submitting
                  ? "デモ送信を処理中..."
                  : "無料体験のデモ申込を送信する（60秒）"}
              </button>

              <p className="flex items-center justify-center gap-1.5 text-center text-xs text-[#41524b]">
                <Info
                  className="h-3.5 w-3.5 shrink-0 text-[#0d5e43]"
                  aria-hidden="true"
                />
                <span>
                  送信後、上部の「GA4ログ」で発火したCVイベントを確認できます。
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
