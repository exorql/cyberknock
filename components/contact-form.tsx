"use client"

import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from "react"
import Link from "next/link"
import { ArrowUpRight, CheckCircle2 } from "lucide-react"
import { pageCategory, trackEvent } from "@/lib/analytics"

const services = [
  ["sports-ai", "スポーツAI・動画分析"], ["product", "Web・モバイルプロダクト開発"],
  ["ai-improvement", "AI機能開発・品質改善"], ["advisory", "開発顧問・技術支援"],
  ["sports-dx", "スポーツDX・AI実証"], ["other", "相談しながら整理したい"],
] as const
const budgets = [["undecided", "相談して決めたい"], ["under_50", "50万円未満"], ["50_100", "50〜100万円"], ["100_300", "100〜300万円"], ["300_500", "300〜500万円"], ["over_500", "500万円以上"]] as const
type FormValues = { name: string; email: string; company: string; budget: string; service: string; message: string; privacy: boolean; website: string }
type Field = keyof FormValues
type Errors = Partial<Record<Field, string>>
const normalizeEmail = (email: string) => email.trim().normalize("NFKC").replace(/@(.+)$/, (_, domain: string) => `@${domain.toLowerCase()}`)

function validate(values: FormValues): Errors {
  const errors: Errors = {}
  if (!values.name.trim()) errors.name = "お名前を入力してください。"
  else if (values.name.trim().length > 100 || /[\r\n\u0000-\u001f]/.test(values.name)) errors.name = "お名前は100文字以内で入力してください。"
  const email = normalizeEmail(values.email)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) errors.email = "有効なメールアドレスを入力してください。"
  if (values.company.trim().length > 200) errors.company = "会社名・組織名は200文字以内で入力してください。"
  if (!values.message.trim()) errors.message = "ご相談内容を入力してください。"
  else if (values.message.trim().length > 5000) errors.message = "ご相談内容は5,000文字以内で入力してください。"
  if (!values.privacy) errors.privacy = "プライバシーポリシーへの同意が必要です。"
  return errors
}

export function ContactForm({ source = "home", defaultService = "" }: { source?: string; defaultService?: string }) {
  const prefix = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const successRef = useRef<HTMLHeadingElement>(null)
  const started = useRef(false)
  const completed = useRef(false)
  const inFlight = useRef(false)
  const [form, setForm] = useState<FormValues>({ name: "", email: "", company: "", budget: "", service: services.some(([key]) => key === defaultService) ? defaultService : "", message: "", privacy: false, website: "" })
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")
  const normalizedSource = pageCategory(source)
  const id = (field: Field) => `${prefix}-${field}`

  useEffect(() => {
    function selectService(search: string) {
      const service = new URLSearchParams(search).get("service")
      if (service && services.some(([key]) => key === service)) setForm((previous) => ({ ...previous, service }))
    }
    function fromLocation() { selectService(window.location.search) }
    // Next.js may retain this component when only the query/hash changes.
    // Keep the visible service selection in sync without sending the raw URL anywhere.
    function fromLink(event: MouseEvent) {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null
      if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === "_blank") return
      const destination = new URL(link.href, window.location.origin)
      if (destination.origin === window.location.origin && destination.pathname === window.location.pathname && destination.hash === "#contact") selectService(destination.search)
    }
    fromLocation()
    window.addEventListener("popstate", fromLocation)
    document.addEventListener("click", fromLink)
    return () => { window.removeEventListener("popstate", fromLocation); document.removeEventListener("click", fromLink) }
  }, [])

  useEffect(() => {
    function abandon() { if (started.current && !completed.current) trackEvent("contact_form_abandon", { source: normalizedSource, service: form.service }) }
    window.addEventListener("pagehide", abandon)
    return () => window.removeEventListener("pagehide", abandon)
  }, [normalizedSource, form.service])
  useEffect(() => { if (done) successRef.current?.focus() }, [done])

  function start() {
    if (started.current) return
    started.current = true
    trackEvent("contact_form_start", { source: normalizedSource, service: form.service })
  }

  function change(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const field = event.target.name as Field
    const value = event.target instanceof HTMLInputElement && event.target.type === "checkbox" ? event.target.checked : event.target.value
    setForm((previous) => ({ ...previous, [field]: value }))
    if (errors[field]) setErrors((previous) => ({ ...previous, [field]: undefined }))
    if (error) setError("")
  }

  function focusError(next: Errors) {
    const first = (["name", "email", "company", "budget", "service", "message", "privacy"] as Field[]).find((field) => next[field])
    if (first) requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus())
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (inFlight.current) return
    start()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    setError("")
    if (Object.keys(nextErrors).length) {
      trackEvent("contact_form_error", { source: normalizedSource, error_type: "validation" })
      focusError(nextErrors)
      return
    }
    inFlight.current = true
    setSending(true)
    trackEvent("contact_form_submit", { source: normalizedSource, service: form.service })
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 12_000)
    try {
      const response = await fetch("/contact", {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: controller.signal,
        body: JSON.stringify({ ...form, name: form.name.trim(), email: normalizeEmail(form.email), company: form.company.trim(), message: form.message.trim(), source: normalizedSource }),
      })
      const result = await response.json().catch(() => null) as { ok?: boolean; errors?: Errors } | null
      if (response.status === 400 && result?.errors) {
        const serverErrors: Errors = {}
        for (const field of ["name", "email", "company", "budget", "service", "message", "privacy"] as Field[]) {
          if (typeof result.errors[field] === "string") serverErrors[field] = result.errors[field]
        }
        setErrors(serverErrors)
        focusError(serverErrors)
      }
      if (!response.ok || result?.ok !== true) {
        trackEvent("contact_form_error", { source: normalizedSource, error_type: response.status === 400 ? "validation" : response.status === 429 ? "rate_limit" : "server" })
        setError(response.status === 429 ? "しばらく時間をおいてから再度お試しください。入力内容は残っています。" : "送信を完了できませんでした。入力内容は残っています。時間をおいて再度お試しください。")
        return
      }
      completed.current = true
      setDone(true)
      trackEvent("contact_form_success", { source: normalizedSource, service: form.service })
    } catch (reason) {
      const timedOut = reason instanceof Error && reason.name === "AbortError"
      setError(timedOut ? "通信に時間がかかっています。入力内容は残っています。少し時間をおいて再度お試しください。" : "通信できませんでした。入力内容は残っています。接続を確認して再度お試しください。")
      trackEvent("contact_form_error", { source: normalizedSource, error_type: timedOut ? "timeout" : "network" })
    } finally {
      window.clearTimeout(timeout)
      inFlight.current = false
      setSending(false)
    }
  }

  function fieldError(field: Field) { return errors[field] ? <p id={`${id(field)}-error`} className="field-error">{errors[field]}</p> : null }
  function describedBy(field: Field, hint?: boolean) { return [hint ? `${id(field)}-hint` : "", errors[field] ? `${id(field)}-error` : ""].filter(Boolean).join(" ") || undefined }
  const errorCount = Object.values(errors).filter(Boolean).length

  if (done) return (
    <div className="form-success" role="status">
      <CheckCircle2 size={36} aria-hidden="true" />
      <h3 ref={successRef} tabIndex={-1}>ご相談を受け付けました。</h3>
      <p>内容を確認し、2営業日以内にご入力のメールアドレスへご連絡します。</p>
      <p className="form-meta">返信が届かない場合は、迷惑メールフォルダもご確認ください。</p>
      <Link href="/cases/ai-sports-trainer" className="text-link" data-track="case_study_click" data-location="contact">開発・運用事例を見る <ArrowUpRight size={18} aria-hidden="true" /></Link>
    </div>
  )

  return (
    <form ref={formRef} className="contact-form" onSubmit={submit} onFocus={start} noValidate aria-busy={sending}>
      <p className="form-meta">必須項目だけでもご相談いただけます。予算・仕様は未定で構いません。</p>
      {errorCount > 0 && <div className="form-alert" role="alert"><strong>入力内容を確認してください。</strong><p>{errorCount}件の項目に修正が必要です。</p></div>}
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor={id("name")}>お名前 <span className="required-label">必須</span></label>
          <input id={id("name")} name="name" value={form.name} onChange={change} autoComplete="name" required maxLength={100} disabled={sending} aria-invalid={!!errors.name} aria-describedby={describedBy("name")} />
          {fieldError("name")}
        </div>
        <div className="form-field">
          <label htmlFor={id("email")}>メールアドレス <span className="required-label">必須</span></label>
          <input id={id("email")} name="email" type="email" inputMode="email" value={form.email} onChange={change} autoComplete="email" autoCapitalize="none" spellCheck={false} required maxLength={254} disabled={sending} aria-invalid={!!errors.email} aria-describedby={describedBy("email")} />
          {fieldError("email")}
        </div>
      </div>
      <div className="form-field">
        <label htmlFor={id("company")}>会社名・組織名 <span className="optional-label">任意</span></label>
        <input id={id("company")} name="company" value={form.company} onChange={change} autoComplete="organization" maxLength={200} disabled={sending} aria-invalid={!!errors.company} aria-describedby={describedBy("company")} />
        {fieldError("company")}
      </div>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor={id("service")}>相談テーマ <span className="optional-label">任意</span></label>
          <select id={id("service")} name="service" value={form.service} onChange={change} disabled={sending} aria-invalid={!!errors.service} aria-describedby={describedBy("service")}><option value="">選択してください</option>{services.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
          {fieldError("service")}
        </div>
        <div className="form-field">
          <label htmlFor={id("budget")}>ご予算の目安 <span className="optional-label">任意</span></label>
          <select id={id("budget")} name="budget" value={form.budget} onChange={change} disabled={sending} aria-invalid={!!errors.budget} aria-describedby={describedBy("budget")}><option value="">未定・未選択</option>{budgets.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
          {fieldError("budget")}
        </div>
      </div>
      <div className="form-field">
        <label htmlFor={id("message")}>ご相談内容 <span className="required-label">必須</span></label>
        <p id={`${id("message")}-hint`} className="field-hint">実現したいこと、困っていること、希望時期など、分かる範囲でお聞かせください。</p>
        <textarea id={id("message")} name="message" value={form.message} onChange={change} rows={6} required maxLength={5000} disabled={sending} aria-invalid={!!errors.message} aria-describedby={describedBy("message", true)} />
        {fieldError("message")}
      </div>
      <div aria-hidden="true" className="form-honeypot" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }}><label htmlFor={id("website")}>この欄は空欄にしてください</label><input id={id("website")} name="website" value={form.website} onChange={change} autoComplete="off" tabIndex={-1} /></div>
      <div>
        <div className="consent"><input id={id("privacy")} name="privacy" type="checkbox" checked={form.privacy} onChange={change} required disabled={sending} aria-invalid={!!errors.privacy} aria-describedby={describedBy("privacy")} /><label htmlFor={id("privacy")}><Link href="/privacy-policy" target="_blank" rel="noopener noreferrer">プライバシーポリシー<span className="sr-only">（新しいタブで開きます）</span></Link>に同意する <span className="required-label">必須</span></label></div>
        {fieldError("privacy")}
      </div>
      {error && <div className="form-alert" role="alert">{error}</div>}
      <button type="submit" className="button button-primary" disabled={sending}>{sending ? "送信しています…" : "相談内容を送信する"}<ArrowUpRight size={20} aria-hidden="true" /></button>
      <p className="form-meta" aria-live="polite">{sending ? "このままお待ちください。" : "内容を確認し、2営業日以内にご連絡します。"}</p>
    </form>
  )
}
