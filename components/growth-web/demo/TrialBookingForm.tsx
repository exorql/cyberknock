"use client"

import { type FormEvent, useRef, useState } from "react"
import { DEMO_CLASS_VISUALS, DEMO_DISPLAY_TEXT, DEMO_IMAGE_BASE, splitTimeRange } from "@/lib/growth-web/demo-content"
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

  const formRef = useRef<HTMLFormElement>(null)
  const activeClass = DEMO_CLASSES.find((c) => c.id === selectedClassId)
  const activeVisual = activeClass ? DEMO_CLASS_VISUALS[activeClass.id] : undefined

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
      const firstKey = Object.keys(validated.fieldErrors ?? {})[0]
      const target = firstKey ? formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`) : null
      if (target) {
        if (target.closest("details")) (target.closest("details") as HTMLDetailsElement).open = true
        target.focus()
      }
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
      requestAnimationFrame(() => document.getElementById("trial-form")?.focus())
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


  const fieldProps = (key: string) => ({
    "aria-invalid": Boolean(fieldErrors[key]),
    "aria-describedby": fieldErrors[key] ? `${key}-err` : undefined,
  })
  const fieldError = (key: string) =>
    fieldErrors[key] ? (
      <p id={`${key}-err`} className="gwd-err">
        {fieldErrors[key]}
      </p>
    ) : null

  return (
    <section className="gwd-sec gwd-trial gwd-dark" id="trial" aria-labelledby="trial-title">
      <div className="gwd-wrap gwd-tr-grid">
        <div>
          <p className="gwd-eyebrow">FREE TRIAL</p>
          <h2 className="gwd-h2" id="trial-title">
            <span>{DEMO_DISPLAY_TEXT.trialLine1}</span>
            <span>{DEMO_DISPLAY_TEXT.trialLine2}</span>
          </h2>
          <dl className="gwd-times">
            <div>
              <dt>フォームの入力</dt>
              <dd>
                必須4項目＋確認1つ
                <small>希望クラス・学年・お名前・メール。ほかの項目は任意です。</small>
              </dd>
            </div>
            <div>
              <dt>体験レッスン当日</dt>
              <dd>
                60〜80分
                <small>えらんだクラスの通常の練習時間（クラスにより異なります）</small>
              </dd>
            </div>
          </dl>
          <ol className="gwd-flow">
            <li>
              <b>このフォームで申し込む</b>
              <span>日程は、スクールからの折り返しの連絡で決めます。</span>
            </li>
            <li>
              <b>スクールから確認の連絡</b>
              <span>持ち物と集合場所をお知らせします（このデモでは連絡は届きません）。</span>
            </li>
            <li>
              <b>体験レッスンに参加</b>
              <span>動きやすい服・運動靴・水筒だけでOK。保護者の方は見学できます。</span>
            </li>
            <li>
              <b>入会はおうちで決める</b>
              <span>当日の勧誘はありません。WebかLINEで、いつでもお返事ください。</span>
            </li>
          </ol>
        </div>

        <div className="gwd-form" id="trial-form" data-gwd-pin="6" tabIndex={-1}>
          {receipt ? (
            <div className="gwd-receipt" role="status" aria-live="polite" data-testid="trial-booking-receipt">
              <h3>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#15603B" strokeWidth="2.2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M7.5 12.5l3 3 6-6.5" />
                </svg>
                {DEMO_DISPLAY_TEXT.receiptTitle}
              </h3>
              <p className="meta">
                デモのため、予約は成立していません。スクールへの通知やメールも送られていません。
              </p>
              <dl>
                <div>
                  <dt>受付ID（デモ）</dt>
                  <dd>
                    <code>{receipt.receipt.receiptId}</code>
                  </dd>
                </div>
                <div>
                  <dt>希望クラス</dt>
                  <dd>
                    {receipt.selectedClass.name}（{receipt.selectedClass.dayOfWeek} {receipt.selectedClass.timeRange}／
                    {receipt.selectedClass.campusName}）
                  </dd>
                </div>
                <div>
                  <dt>送信の扱い</dt>
                  <dd>外部へのメール・通知なし／入力内容はサーバーに保存されません</dd>
                </div>
              </dl>
              {receipt.receipt.preview && (
                <div className="gwd-preview">
                  <p>実際に導入した場合、スクールに届く通知の見本</p>
                  <pre tabIndex={0} aria-label="通知の見本（スクロールできます）">
                    件名：{receipt.receipt.preview.emailSubject}
                    {"\n\n"}
                    {receipt.receipt.preview.emailBodyPreview}
                  </pre>
                </div>
              )}
              <button
                type="button"
                className="gwd-btn gwd-btn-line"
                onClick={() => {
                  setReceipt(null)
                  startedRef.current = false
                  idempotencyKeyRef.current = createDemoIdempotencyKey()
                }}
              >
                別の条件でデモ送信を試す
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} noValidate aria-labelledby="trial-form-title">
              <h3 id="trial-form-title">{DEMO_DISPLAY_TEXT.formTitle}</h3>
              <p className="meta">架空のスクールのデモフォームです。送信しても予約やメールは発生しません。</p>

              {submitError && (
                <p role="alert" className="gwd-alert">
                  {submitError}
                </p>
              )}

              <div className="gwd-hp" aria-hidden="true">
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

              {activeClass && activeVisual && (
                <div className="gwd-sel" data-testid="selected-class-banner">
                  <img
                    src={`${DEMO_IMAGE_BASE}/${activeVisual.image}-320.webp`}
                    alt=""
                    width={72}
                    height={54}
                    loading="lazy"
                  />
                  <div>
                    <b>{activeClass.name}</b>
                    <span>
                      {activeClass.dayOfWeek} {splitTimeRange(activeClass.timeRange).time}（
                      {splitTimeRange(activeClass.timeRange).minutes}）・{activeVisual.campusShort}
                    </span>
                  </div>
                </div>
              )}

              <div className="gwd-row2">
                <div className="gwd-fld">
                  <label htmlFor="trial-class">
                    希望クラス <span className="gwd-req">必須</span>
                  </label>
                  <select
                    id="trial-class"
                    name="selectedClassId"
                    value={selectedClassId}
                    required
                    onChange={(e) => {
                      markStarted()
                      onClassChanged(e.target.value)
                      idempotencyKeyRef.current = createDemoIdempotencyKey()
                      clearFieldError("selectedClassId")
                    }}
                    {...fieldProps("selectedClassId")}
                  >
                    <option value="">えらんでください</option>
                    {DEMO_CLASSES.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.shortLabel}　{slot.name}
                      </option>
                    ))}
                  </select>
                  {fieldError("selectedClassId")}
                </div>
                <div className="gwd-fld">
                  <label htmlFor="trial-grade">
                    お子さまの学年 <span className="gwd-req">必須</span>
                  </label>
                  <select
                    id="trial-grade"
                    name="childGrade"
                    value={selectedGrade}
                    required
                    onChange={(e) => {
                      markStarted()
                      onGradeChanged(e.target.value)
                      idempotencyKeyRef.current = createDemoIdempotencyKey()
                      clearFieldError("childGrade")
                    }}
                    {...fieldProps("childGrade")}
                  >
                    <option value="">えらんでください</option>
                    {CHILD_GRADES.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                  {fieldError("childGrade")}
                </div>
              </div>

              <div className="gwd-fld">
                <label htmlFor="guardian-name">
                  保護者の方のお名前 <span className="gwd-req">必須</span>
                </label>
                <input
                  id="guardian-name"
                  name="guardianName"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="例：青葉 花子"
                  value={form.guardianName}
                  onChange={(e) => updateField("guardianName", e.target.value)}
                  {...fieldProps("guardianName")}
                />
                {fieldError("guardianName")}
              </div>

              <div className="gwd-fld">
                <label htmlFor="guardian-email">
                  メールアドレス <span className="gwd-req">必須</span>
                </label>
                <input
                  id="guardian-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  required
                  autoComplete="email"
                  placeholder="例：hanako@example.com"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  {...fieldProps("email")}
                />
                {fieldError("email")}
              </div>

              <details className="gwd-more">
                <summary>任意の項目（希望時期・経験・当日の連絡先・気になること）</summary>
                <div className="gwd-row2">
                  <div className="gwd-fld">
                    <label htmlFor="trial-timing">体験の希望時期</label>
                    <select
                      id="trial-timing"
                      name="preferredTiming"
                      value={form.preferredTiming}
                      onChange={(e) => updateField("preferredTiming", e.target.value)}
                      {...fieldProps("preferredTiming")}
                    >
                      {PREFERRED_TIMINGS.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    {fieldError("preferredTiming")}
                  </div>
                  <div className="gwd-fld">
                    <label htmlFor="trial-experience">運動・サッカーの経験</label>
                    <select
                      id="trial-experience"
                      name="experienceLevel"
                      value={form.experienceLevel}
                      onChange={(e) => updateField("experienceLevel", e.target.value)}
                      {...fieldProps("experienceLevel")}
                    >
                      {EXPERIENCE_LEVELS.map((exp) => (
                        <option key={exp.value} value={exp.value}>
                          {exp.label}
                        </option>
                      ))}
                    </select>
                    {fieldError("experienceLevel")}
                  </div>
                </div>
                <div className="gwd-fld">
                  <label htmlFor="guardian-phone">雨天中止時の当日連絡先（電話）</label>
                  <input
                    id="guardian-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="例：090-0000-0000"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    {...fieldProps("phone")}
                  />
                  {fieldError("phone")}
                </div>
                <div className="gwd-fld">
                  <label htmlFor="trial-notes">お子さまの性格や、気になること</label>
                  <textarea
                    id="trial-notes"
                    name="notes"
                    rows={3}
                    placeholder="例：人見知りなので、最初は見学からはじめたい"
                    value={form.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    {...fieldProps("notes")}
                  />
                  {fieldError("notes")}
                </div>
              </details>

              <label className="gwd-ack" htmlFor="demo-acknowledged">
                <input
                  id="demo-acknowledged"
                  name="demoAcknowledged"
                  type="checkbox"
                  checked={form.demoAcknowledged}
                  onChange={(e) => updateField("demoAcknowledged", e.target.checked)}
                  {...fieldProps("demoAcknowledged")}
                />
                <span>
                  <strong>確認（必須）：</strong>
                  これは架空のスクールのデモです。送信しても予約は成立せず、メールや通知も送られないこと、入力内容がサーバーに保存されないことを確認しました。
                </span>
              </label>
              {fieldError("demoAcknowledged")}

              <button type="submit" className="gwd-btn gwd-btn-sun gwd-submit" disabled={submitting}>
                {submitting ? "送信中…" : "デモ申込を送信する"}
              </button>
              <p className="after">
                送信すると、この画面に受付内容と、実際に導入した場合にスクールへ届く通知の見本が表示されます。計測（GA4）に送るのはクラスや学年などの選択内容だけで、お名前やメールアドレスは送りません。
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
