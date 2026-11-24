"use client"

import Link from "next/link"
import { CheckCircle2, MailCheck, ShieldCheck } from "lucide-react"
import { type FormEvent, useRef, useState } from "react"
import {
  INQUIRY_TYPES,
  SPORT_CATEGORIES,
  STUDENT_BANDS,
  type GrowthWebPublicReceipt,
  type ServiceInquiryFormValues,
  validateServiceInquiryClient,
} from "@/lib/growth-web/form-options"
import { APPLY, LP_HERO, SERIF_TEXT } from "@/lib/growth-web/lp-content"
import { GROWTH_WEB_ROUTES } from "@/lib/growth-web/service-lp"
import { trackGrowthWebEvent } from "@/lib/growth-web/telemetry"

const INITIAL_STATE: ServiceInquiryFormValues = {
  organizationName: "",
  contactName: "",
  email: "",
  phone: "",
  sportCategory: "soccer",
  currentWebsiteUrl: "",
  inquiryType: "free_site_audit",
  monthlyStudentsBand: "30_to_80",
  message: "",
  privacyAccepted: false,
  websiteHp: "",
}

function createClientIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `inq_${crypto.randomUUID().replace(/-/g, "")}`
  }
  return `inq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`
}

export function ServiceInquiryForm() {
  const [form, setForm] = useState<ServiceInquiryFormValues>(INITIAL_STATE)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [receipt, setReceipt] = useState<GrowthWebPublicReceipt | null>(null)
  const startedRef = useRef(false)
  const submittingRef = useRef(false)
  const idempotencyKeyRef = useRef<string>(createClientIdempotencyKey())

  const markFormStarted = () => {
    if (!startedRef.current) {
      startedRef.current = true
      trackGrowthWebEvent("service_inquiry_start", {
        form_id: "growth_web_inquiry",
        source: "growth_web",
      })
    }
  }

  const updateField = <K extends keyof ServiceInquiryFormValues>(
    key: K,
    value: ServiceInquiryFormValues[K]
  ) => {
    markFormStarted()
    setForm((prev) => ({ ...prev, [key]: value }))
    idempotencyKeyRef.current = createClientIdempotencyKey()
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (submittingRef.current) return
    setSubmitError(null)

    const validated = validateServiceInquiryClient(form)
    if (!validated.data || validated.fieldErrors) {
      setFieldErrors(validated.fieldErrors || {})
      setSubmitError("未入力または形式に誤りのある項目をご確認ください。")
      trackGrowthWebEvent("service_inquiry_error", {
        form_id: "growth_web_inquiry",
        error_type: "validation",
        source: "growth_web",
      })
      return
    }

    submittingRef.current = true
    setSubmitting(true)
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 12_000)

    try {
      const response = await fetch("/api/growth-web/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKeyRef.current,
        },
        signal: controller.signal,
        body: JSON.stringify(validated.data),
      })
      const data = await response.json().catch(() => null)

      if (!response.ok || !data?.ok) {
        if (data?.fieldErrors) {
          const mapped: Record<string, string> = {}
          for (const [k, v] of Object.entries(
            data.fieldErrors as Record<string, string[]>
          )) {
            if (v?.[0]) mapped[k] = v[0]
          }
          setFieldErrors(mapped)
        }
        setSubmitError(
          data?.error ||
            "送信を完了できませんでした。入力内容は残っています。時間をおいて再度お試しください。"
        )
        trackGrowthWebEvent("service_inquiry_error", {
          form_id: "growth_web_inquiry",
          source: "growth_web",
          error_type:
            response.status === 400
              ? "validation"
              : response.status === 429
                ? "rate_limit"
                : response.status === 503
                  ? "configuration"
                  : "server",
        })
        return
      }

      const publicReceipt = data.receipt as GrowthWebPublicReceipt
      setReceipt(publicReceipt)
      trackGrowthWebEvent("service_inquiry_submit", {
        form_id: "growth_web_inquiry",
        source: "growth_web",
        inquiry_type: validated.data.inquiryType,
        delivery_mode: publicReceipt?.mode ?? "live",
      })
    } catch (reason) {
      const timedOut = reason instanceof Error && reason.name === "AbortError"
      setSubmitError(
        timedOut
          ? "通信に時間がかかっています。入力内容は残っています。少し時間をおいて再度お試しください。"
          : "通信エラーが発生しました。接続をご確認のうえ再送信してください。"
      )
      trackGrowthWebEvent("service_inquiry_error", {
        form_id: "growth_web_inquiry",
        source: "growth_web",
        error_type: timedOut ? "timeout" : "network",
      })
    } finally {
      window.clearTimeout(timeout)
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  return (
    <section
      id="contact"
      className="gwl-apply scroll-mt-24 bg-[#F1EFE9] py-14 sm:py-24"
      aria-labelledby="gwl-apply-h"
    >
      <div className="gwl-wrap">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="gwl-apply-h" className="gwl-serif gwl-apply-h2">
              {SERIF_TEXT.applyTitleLine1}
              <br />
              {SERIF_TEXT.applyTitleLine2}
            </h2>
            <p className="gwl-apply-lead mt-4">{APPLY.lead}</p>

            <div className="mt-7 space-y-4 rounded-2xl border border-[#D5D1C7] bg-white p-6">
              <h3 className="text-sm font-bold text-[#131614]">
                無料診断でお伝えする3つの観点
              </h3>
              <ul className="space-y-2.5 text-sm leading-relaxed text-[#2c3632]">
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#131614]"
                    aria-hidden="true"
                  />
                  <span>
                    スマホ表示での体験申込ステップ数・離脱ポイントの洗い出し
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#131614]"
                    aria-hidden="true"
                  />
                  <span>
                    「地域名＋種目」検索およびGoogleマップ連動の改善余地
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#131614]"
                    aria-hidden="true"
                  />
                  <span>
                    貴校の月謝単価・粗利構造を踏まえた現実的な採算見立て
                  </span>
                </li>
              </ul>
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#131614]/25 bg-white p-4 text-sm leading-relaxed text-[#131614]">
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0 text-[#131614]"
                aria-hidden="true"
              />
              <p>
                <strong>代表が直接確認・ご返信します：</strong>
                内容を確認のうえ、ご入力いただいたメールアドレス宛に順次ご連絡します。しつこい営業電話は一切行いません。
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#D5D1C7] bg-white p-6 shadow-sm sm:p-8">
              {receipt ? (
                <div
                  role="status"
                  aria-live="polite"
                  data-testid="inquiry-receipt"
                  className="space-y-6"
                >
                  <div className="flex items-start gap-3 rounded-xl border border-[#131614]/30 bg-[#F1EFE9] p-5">
                    <MailCheck
                      className="mt-0.5 h-6 w-6 shrink-0 text-[#131614]"
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="text-lg font-extrabold text-[#131614]">
                        {receipt.externalDeliveryExecuted
                          ? "ご相談内容を受け付けました"
                          : "ご相談フォームの動作検証が完了しました"}
                      </h3>
                      <p className="mt-1 text-sm text-[#2c3632]">
                        受付番号：
                        <code className="ml-1 rounded bg-white px-2 py-0.5 font-mono text-xs font-bold text-[#131614]">
                          {receipt.receiptId}
                        </code>
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-[#2c3632]">
                        {receipt.externalDeliveryExecuted ? (
                          <>
                            内容を確認のうえ、ご入力いただいたメールアドレスへ順次ご連絡します。
                          </>
                        ) : (
                          <>
                            動作モード：<code>{receipt.mode}</code>
                            （外部通知未送信・プレビュー動作確認）
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {receipt.preview && (
                    <div className="rounded-xl border border-[#D5D1C7] bg-[#F1EFE9] p-4">
                      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4B514C]">
                        NOTIFICATION PREVIEW（検証用・通知内容プレビュー）
                      </p>
                      <p className="mt-2 text-xs font-bold text-[#131614]">
                        件名：{receipt.preview.emailSubject}
                      </p>
                      <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg border border-[#D5D1C7] bg-white p-3 font-mono text-xs leading-relaxed text-[#2c3632]">
                        {receipt.preview.emailBodyPreview}
                      </pre>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setReceipt(null)
                      setForm(INITIAL_STATE)
                      startedRef.current = false
                      idempotencyKeyRef.current = createClientIdempotencyKey()
                    }}
                    className="inline-flex min-h-11 items-center rounded-lg border border-[#131614] px-4 text-sm font-semibold text-[#131614] hover:bg-[#E8E4DB]"
                  >
                    別の内容でフォームをやり直す
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="relative space-y-5"
                >
                  {submitError && (
                    <div
                      role="alert"
                      className="rounded-xl border border-[#C93D14]/45 bg-[#FBF1EC] px-4 py-3 text-sm font-medium text-[#A8320F]"
                    >
                      {submitError}
                    </div>
                  )}

                  {/* Honeypot field */}
                  <div
                    className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
                    aria-hidden="true"
                  >
                    <label htmlFor="lp-website-hp">Leave empty</label>
                    <input
                      id="lp-website-hp"
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
                        htmlFor="org-name"
                        className="block text-sm font-bold text-[#131614]"
                      >
                        スクール名・法人名
                        <span className="ml-1.5 text-xs font-bold text-[#C93D14]">
                          必須
                        </span>
                      </label>
                      <input
                        id="org-name"
                        name="organizationName"
                        type="text"
                        required
                        autoComplete="organization"
                        placeholder="例：〇〇ジュニアサッカースクール"
                        value={form.organizationName}
                        onChange={(e) =>
                          updateField("organizationName", e.target.value)
                        }
                        aria-invalid={Boolean(fieldErrors.organizationName)}
                        aria-describedby={
                          fieldErrors.organizationName
                            ? "org-name-error"
                            : undefined
                        }
                        className="mt-1.5 min-h-12 w-full rounded-xl border border-[#BDB8AD] bg-white px-3.5 text-base text-[#131614] placeholder:text-[#66736d]"
                      />
                      {fieldErrors.organizationName && (
                        <p
                          id="org-name-error"
                          className="mt-1 text-xs font-medium text-[#C93D14]"
                        >
                          {fieldErrors.organizationName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-sm font-bold text-[#131614]"
                      >
                        ご担当者名
                        <span className="ml-1.5 text-xs font-bold text-[#C93D14]">
                          必須
                        </span>
                      </label>
                      <input
                        id="contact-name"
                        name="contactName"
                        type="text"
                        required
                        autoComplete="name"
                        placeholder="例：山田 太郎"
                        value={form.contactName}
                        onChange={(e) =>
                          updateField("contactName", e.target.value)
                        }
                        aria-invalid={Boolean(fieldErrors.contactName)}
                        aria-describedby={
                          fieldErrors.contactName
                            ? "contact-name-error"
                            : undefined
                        }
                        className="mt-1.5 min-h-12 w-full rounded-xl border border-[#BDB8AD] bg-white px-3.5 text-base text-[#131614] placeholder:text-[#66736d]"
                      />
                      {fieldErrors.contactName && (
                        <p
                          id="contact-name-error"
                          className="mt-1 text-xs font-medium text-[#C93D14]"
                        >
                          {fieldErrors.contactName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-sm font-bold text-[#131614]"
                      >
                        メールアドレス
                        <span className="ml-1.5 text-xs font-bold text-[#C93D14]">
                          必須
                        </span>
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="name@example.jp"
                        value={form.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        aria-invalid={Boolean(fieldErrors.email)}
                        aria-describedby={
                          fieldErrors.email ? "contact-email-error" : undefined
                        }
                        className="mt-1.5 min-h-12 w-full rounded-xl border border-[#BDB8AD] bg-white px-3.5 text-base text-[#131614] placeholder:text-[#66736d]"
                      />
                      {fieldErrors.email && (
                        <p
                          id="contact-email-error"
                          className="mt-1 text-xs font-medium text-[#C93D14]"
                        >
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-sm font-bold text-[#131614]"
                      >
                        電話番号
                        <span className="ml-1.5 text-xs font-normal text-[#4B514C]">
                          任意
                        </span>
                      </label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="090-1234-5678"
                        value={form.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        aria-invalid={Boolean(fieldErrors.phone)}
                        aria-describedby={
                          fieldErrors.phone ? "contact-phone-error" : undefined
                        }
                        className="mt-1.5 min-h-12 w-full rounded-xl border border-[#BDB8AD] bg-white px-3.5 text-base text-[#131614] placeholder:text-[#66736d]"
                      />
                      {fieldErrors.phone && (
                        <p
                          id="contact-phone-error"
                          className="mt-1 text-xs font-medium text-[#C93D14]"
                        >
                          {fieldErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="sport-category"
                        className="block text-sm font-bold text-[#131614]"
                      >
                        主な種目
                      </label>
                      <select
                        id="sport-category"
                        name="sportCategory"
                        value={form.sportCategory}
                        onChange={(e) =>
                          updateField("sportCategory", e.target.value)
                        }
                        className="mt-1.5 min-h-12 w-full rounded-xl border border-[#BDB8AD] bg-white px-3.5 text-base text-[#131614]"
                      >
                        {SPORT_CATEGORIES.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="student-band"
                        className="block text-sm font-bold text-[#131614]"
                      >
                        現在の生徒数規模
                      </label>
                      <select
                        id="student-band"
                        name="monthlyStudentsBand"
                        value={form.monthlyStudentsBand}
                        onChange={(e) =>
                          updateField("monthlyStudentsBand", e.target.value)
                        }
                        className="mt-1.5 min-h-12 w-full rounded-xl border border-[#BDB8AD] bg-white px-3.5 text-base text-[#131614]"
                      >
                        {STUDENT_BANDS.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="inquiry-type"
                      className="block text-sm font-bold text-[#131614]"
                    >
                      ご相談内容
                    </label>
                    <select
                      id="inquiry-type"
                      name="inquiryType"
                      value={form.inquiryType}
                      onChange={(e) =>
                        updateField("inquiryType", e.target.value)
                      }
                      className="mt-1.5 min-h-12 w-full rounded-xl border border-[#BDB8AD] bg-white px-3.5 text-base text-[#131614]"
                    >
                      {INQUIRY_TYPES.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="current-website"
                      className="block text-sm font-bold text-[#131614]"
                    >
                      現在のホームページURL
                      <span className="ml-1.5 text-xs font-normal text-[#4B514C]">
                        任意（ある場合は無料診断に活用します）
                      </span>
                    </label>
                    <input
                      id="current-website"
                      name="currentWebsiteUrl"
                      type="url"
                      placeholder="https://example-school.jp"
                      value={form.currentWebsiteUrl}
                      onChange={(e) =>
                        updateField("currentWebsiteUrl", e.target.value)
                      }
                      aria-invalid={Boolean(fieldErrors.currentWebsiteUrl)}
                      aria-describedby={
                        fieldErrors.currentWebsiteUrl
                          ? "current-website-error"
                          : undefined
                      }
                      className="mt-1.5 min-h-12 w-full rounded-xl border border-[#BDB8AD] bg-white px-3.5 text-base text-[#131614] placeholder:text-[#66736d]"
                    />
                    {fieldErrors.currentWebsiteUrl && (
                      <p
                        id="current-website-error"
                        className="mt-1 text-xs font-medium text-[#C93D14]"
                      >
                        {fieldErrors.currentWebsiteUrl}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="inquiry-message"
                      className="block text-sm font-bold text-[#131614]"
                    >
                      現状の課題や強化したい学年枠
                      <span className="ml-1.5 text-xs font-normal text-[#4B514C]">
                        任意
                      </span>
                    </label>
                    <textarea
                      id="inquiry-message"
                      name="message"
                      rows={3}
                      placeholder="例：年長〜小2の平日クラスに空きがあり、Google検索とInstagramからの無料体験申込を増やしたい。"
                      value={form.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      aria-invalid={Boolean(fieldErrors.message)}
                      aria-describedby={
                        fieldErrors.message ? "inquiry-message-error" : undefined
                      }
                      className="mt-1.5 w-full rounded-xl border border-[#BDB8AD] bg-white p-3.5 text-base text-[#131614] placeholder:text-[#66736d]"
                    />
                    {fieldErrors.message && (
                      <p
                        id="inquiry-message-error"
                        className="mt-1 text-xs font-medium text-[#C93D14]"
                      >
                        {fieldErrors.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        id="privacy-accepted"
                        name="privacyAccepted"
                        type="checkbox"
                        checked={form.privacyAccepted}
                        onChange={(e) =>
                          updateField("privacyAccepted", e.target.checked)
                        }
                        aria-invalid={Boolean(fieldErrors.privacyAccepted)}
                        aria-describedby={
                          fieldErrors.privacyAccepted
                            ? "privacy-accepted-error"
                            : undefined
                        }
                        className="mt-0.5 h-[22px] w-[22px] shrink-0 rounded border-[#BDB8AD] accent-[#C93D14]"
                      />
                      <span className="text-sm leading-relaxed text-[#2c3632]">
                        <Link
                          href={GROWTH_WEB_ROUTES.privacy}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-8 items-center font-bold text-[#131614] underline underline-offset-2 hover:text-[#A8320F]"
                        >
                          プライバシーポリシー
                          <span className="sr-only">（新しいタブで開きます）</span>
                        </Link>
                        を確認のうえ、送信内容の取り扱いに同意します。
                      </span>
                    </label>
                    {fieldErrors.privacyAccepted && (
                      <p
                        id="privacy-accepted-error"
                        className="mt-1 text-xs font-medium text-[#C93D14]"
                      >
                        {fieldErrors.privacyAccepted}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex min-h-[52px] w-full items-center justify-center rounded-xl bg-[#C93D14] px-6 text-base font-bold text-white shadow-sm transition-colors hover:bg-[#A8320F] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "送信処理中..." : LP_HERO.ctaLabel}
                  </button>
                  <p className="text-sm leading-relaxed text-[#4B514C]">{APPLY.afterSubmit}</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
