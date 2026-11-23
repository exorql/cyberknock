export const SPORT_CATEGORIES = [
  { value: "baseball", label: "野球・少年野球・打撃／投球指導" },
  { value: "soccer", label: "サッカー・フットサル" },
  { value: "gymnastics", label: "体操・運動基礎・体幹" },
  { value: "dance", label: "ダンス・チアリーディング" },
  { value: "basketball", label: "バスケットボール" },
  { value: "swimming", label: "スイミング・水泳" },
  { value: "martial_arts", label: "空手・柔道・武道" },
  { value: "multi_sport", label: "複合スポーツ・マルチ競技" },
  { value: "other", label: "その他のスポーツスクール" },
] as const

export const INQUIRY_TYPES = [
  { value: "free_site_audit", label: "現サイトの無料CVR・SEO診断を希望" },
  { value: "pilot_partner", label: "先着3社・初期検証パートナー枠の相談" },
  { value: "demo_walkthrough", label: "デモ解説・料金や運用フローの質問" },
  { value: "other", label: "その他のお問い合わせ" },
] as const

export const STUDENT_BANDS = [
  { value: "launching", label: "開校準備中" },
  { value: "under_30", label: "30名未満" },
  { value: "30_to_80", label: "30〜80名" },
  { value: "80_to_150", label: "80〜150名" },
  { value: "over_150", label: "150名以上" },
] as const

export const CHILD_GRADES = [
  { value: "preschool_senior", label: "年長（5〜6歳）" },
  { value: "grade_1_2", label: "小学1〜2年生" },
  { value: "grade_3_4", label: "小学3〜4年生" },
  { value: "grade_5_6", label: "小学5〜6年生" },
] as const

export const PREFERRED_TIMINGS = [
  { value: "this_week", label: "今週中（直近の開催日）" },
  { value: "next_week", label: "来週の開催日" },
  { value: "this_month", label: "今月中で都合のよい日" },
  { value: "flexible", label: "まずは日程を相談したい" },
] as const

export const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "はじめて（運動・サッカー未経験）" },
  { value: "some_experience", label: "公園や遊びで少し経験あり" },
  { value: "club_member", label: "他のクラブ・チーム経験あり" },
] as const

export interface ServiceInquiryFormValues {
  organizationName: string
  contactName: string
  email: string
  phone: string
  sportCategory: string
  currentWebsiteUrl: string
  inquiryType: string
  monthlyStudentsBand: string
  message: string
  privacyAccepted: boolean
  websiteHp: string
}

export interface TrialBookingFormValues {
  guardianName: string
  email: string
  phone: string
  childGrade: string
  selectedClassId: string
  preferredTiming: string
  experienceLevel: string
  notes: string
  demoAcknowledged: boolean
  websiteHp: string
}

export interface GrowthWebPublicReceipt {
  receiptId: string
  mode: "local_dry_run" | "live"
  externalDeliveryExecuted: boolean
  recordedAt: string
  persistedLocally: boolean
  deduplicated?: boolean
  preview?: {
    emailSubject: string
    emailRecipientMasked: string
    emailBodyPreview: string
    webhookHeadline: string
    webhookFieldCount: number
  }
}

export function sanitizeSingleLine(value: string): string {
  return value.replace(/[\r\n\t\x00-\x1f\x7f]+/g, " ").trim()
}

export function sanitizeMultiline(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "")
    .trim()
}

export function normalizeEmail(value: string): string {
  return sanitizeSingleLine(value)
    .normalize("NFKC")
    .replace(/@(.+)$/, (_, domain: string) => `@${domain.toLowerCase()}`)
}

function isValidOptionalPhone(value: string): boolean {
  if (value === "") return true
  if (value.length > 25) return false
  if (!/^[0-9+\-()\s]+$/.test(value)) return false
  const digits = value.replace(/\D/g, "")
  return digits.length >= 9 && digits.length <= 15
}

function isValidOptionalUrl(value: string): boolean {
  if (value === "") return true
  if (value.length > 250) return false
  try {
    const parsed = new URL(value)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

export function validateServiceInquiryClient(
  raw: ServiceInquiryFormValues
): { data?: ServiceInquiryFormValues; fieldErrors?: Record<string, string> } {
  const fieldErrors: Record<string, string> = {}
  const organizationName = sanitizeSingleLine(raw.organizationName)
  const contactName = sanitizeSingleLine(raw.contactName)
  const email = normalizeEmail(raw.email)
  const phone = sanitizeSingleLine(raw.phone)
  const currentWebsiteUrl = sanitizeSingleLine(raw.currentWebsiteUrl)
  const message = sanitizeMultiline(raw.message)

  if (organizationName.length < 2) {
    fieldErrors.organizationName = "スクール名または法人名は2文字以上で入力してください。"
  } else if (organizationName.length > 80) {
    fieldErrors.organizationName = "スクール名または法人名は80文字以内で入力してください。"
  }

  if (contactName.length < 2) {
    fieldErrors.contactName = "ご担当者名は2文字以上で入力してください。"
  } else if (contactName.length > 50) {
    fieldErrors.contactName = "ご担当者名は50文字以内で入力してください。"
  }

  if (!email || email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "有効なメールアドレスを入力してください。"
  }

  if (!isValidOptionalPhone(phone)) {
    fieldErrors.phone = "電話番号は半角数字（9〜15桁）とハイフンで入力してください。"
  }

  if (!SPORT_CATEGORIES.some((c) => c.value === raw.sportCategory)) {
    fieldErrors.sportCategory = "主な種目を選択肢から選んでください。"
  }

  if (!STUDENT_BANDS.some((b) => b.value === raw.monthlyStudentsBand)) {
    fieldErrors.monthlyStudentsBand = "現在の生徒数規模を選択肢から選んでください。"
  }

  if (!INQUIRY_TYPES.some((t) => t.value === raw.inquiryType)) {
    fieldErrors.inquiryType = "ご相談内容を選択肢から選んでください。"
  }

  if (!isValidOptionalUrl(currentWebsiteUrl)) {
    fieldErrors.currentWebsiteUrl =
      "URLは https:// または http:// から始まる形式で入力してください。"
  }

  if (message.length > 1000) {
    fieldErrors.message = "ご相談内容は1000文字以内で入力してください。"
  }

  if (raw.privacyAccepted !== true) {
    fieldErrors.privacyAccepted = "プライバシーポリシーへの同意が必要です。"
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors }
  }

  return {
    data: {
      organizationName,
      contactName,
      email,
      phone,
      sportCategory: raw.sportCategory,
      currentWebsiteUrl,
      inquiryType: raw.inquiryType,
      monthlyStudentsBand: raw.monthlyStudentsBand,
      message,
      privacyAccepted: true,
      websiteHp: raw.websiteHp.slice(0, 100),
    },
  }
}

export function validateTrialBookingClient(
  raw: TrialBookingFormValues
): { data?: TrialBookingFormValues; fieldErrors?: Record<string, string> } {
  const fieldErrors: Record<string, string> = {}
  const guardianName = sanitizeSingleLine(raw.guardianName)
  const email = normalizeEmail(raw.email)
  const phone = sanitizeSingleLine(raw.phone)
  const selectedClassId = sanitizeSingleLine(raw.selectedClassId)
  const notes = sanitizeMultiline(raw.notes)

  if (guardianName.length < 1) {
    fieldErrors.guardianName = "保護者の方のお名前を入力してください。"
  } else if (guardianName.length > 50) {
    fieldErrors.guardianName = "保護者の方のお名前は50文字以内で入力してください。"
  }

  if (!email || email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email =
      "確認メールを受け取れる有効なメールアドレスを入力してください。"
  }

  if (!isValidOptionalPhone(phone)) {
    fieldErrors.phone = "電話番号は半角数字（9〜15桁）とハイフンで入力してください。"
  }

  if (!CHILD_GRADES.some((g) => g.value === raw.childGrade)) {
    fieldErrors.childGrade = "お子さまの学年を選択してください。"
  }

  if (!selectedClassId || selectedClassId.length > 60) {
    fieldErrors.selectedClassId = "希望クラスを選択してください。"
  }

  if (!PREFERRED_TIMINGS.some((t) => t.value === raw.preferredTiming)) {
    fieldErrors.preferredTiming = "ご希望時期を選択してください。"
  }

  if (!EXPERIENCE_LEVELS.some((e) => e.value === raw.experienceLevel)) {
    fieldErrors.experienceLevel = "ご経験を選択してください。"
  }

  if (notes.length > 500) {
    fieldErrors.notes = "メモは500文字以内で入力してください。"
  }

  if (raw.demoAcknowledged !== true) {
    fieldErrors.demoAcknowledged =
      "デモサイトの送信確認にチェックを入れてください。"
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors }
  }

  return {
    data: {
      guardianName,
      email,
      phone,
      childGrade: raw.childGrade,
      selectedClassId,
      preferredTiming: raw.preferredTiming,
      experienceLevel: raw.experienceLevel,
      notes,
      demoAcknowledged: true,
      websiteHp: raw.websiteHp.slice(0, 100),
    },
  }
}
