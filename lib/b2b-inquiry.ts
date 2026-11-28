/** Fixed consultation contexts, not user identity or acquisition attribution. */
export const guideConsultations = {
  "ai-development-outsourcing-guide": {
    label: "AI開発会社の選び方と費用",
    service: "advisory",
    cta: "開発範囲・概算費用を相談する（無料）",
    heading: "外注する範囲を、一緒に整理しませんか。",
    lead: "解決したい業務課題、必要な機能、希望時期から、最初に検証することと実装範囲を整理します。予算や仕様は未定でも構いません。",
  },
  "ai-poc-process-evaluation": {
    label: "AI PoCの進め方と評価基準",
    service: "advisory",
    cta: "PoCの必要性・評価基準を相談する（無料）",
    heading: "検証で、何を判断できればよいですか。",
    lead: "実現したいこと、使えるデータ、判断に必要な品質や費用をお聞かせください。PoCを省いて実装から進める場合も含めて整理します。",
  },
  "ai-video-analysis-poc-cost": {
    label: "AI動画解析の開発費用とPoCの見積ポイント",
    service: "sports-ai",
    cta: "動画解析の検証範囲・見積を相談する（無料）",
    heading: "見積もりの前に、検証条件を整理。",
    lead: "対象の映像、取り出したい情報、品質や処理時間の条件を、分かる範囲でお聞かせください。機密動画の添付は不要です。",
  },
  "ai-video-analysis-development-request": {
    label: "AI動画解析システム開発の依頼ガイド",
    service: "sports-ai",
    cta: "動画解析システムの開発を相談する（無料）",
    heading: "映像から必要な情報を取り出す仕組みへ。",
    lead: "撮影条件、期待する出力、使う人、既存システムとの連携を整理して、技術検証から本番実装までの範囲を相談できます。",
  },
} as const

export type B2BGuide = keyof typeof guideConsultations
type ConsultationService = "advisory" | "sports-ai" | "ai-improvement"

export function isB2BGuide(value: unknown): value is B2BGuide {
  return typeof value === "string" && Object.hasOwn(guideConsultations, value)
}

export function guideFromContactSearch(rawSearch: string, source: string): B2BGuide | undefined {
  if (source !== "ai_development" || rawSearch.length > 512) return undefined
  const values = new URLSearchParams(rawSearch).getAll("guide")
  return values.length === 1 && isB2BGuide(values[0]) ? values[0] : undefined
}

export function guideContactHref(guide: B2BGuide, service: ConsultationService): string {
  return "/ai-development?" + new URLSearchParams({ service, guide }).toString() + "#contact"
}

export function consultationForGuide(slug: string) {
  if (!isB2BGuide(slug)) {
    return {
      guide: undefined, service: undefined, href: "/ai-development#contact",
      cta: "開発について相談する（無料）",
      heading: "最初は、可能性の確認から。",
      lead: "実現したい業務・機能、現在の仕組み、判断したいことを教えてください。仕様が未定でも相談できます。",
    }
  }
  const config = guideConsultations[slug]
  return { ...config, guide: slug, href: guideContactHref(slug, config.service) }
}

export function inquiryMessageHint(source: string, service: string): string {
  const fallback = "実現したいこと、困っていること、希望時期など、分かる範囲でお聞かせください。"
  if (service === "business-automation") return "例：メールで受けた注文を販売管理に入力し直しています。今の手順、使っている道具、特に時間のかかる作業をお聞かせください。"
  if (service === "business-systems") return "例：営業所ごとのExcel台帳を月末に集めています。誰が更新し、どこで二重入力や確認待ちが起きるかをお聞かせください。"
  if (source === "home" && !service) return "例：見積を作るたびに単価を探す、日報をExcelへ転記するなど。困っている仕事を一つお聞かせください。"
  if (source !== "ai_development") return fallback
  switch (service) {
    case "sports-ai":
      return "対象の動画・画像、撮影条件、取り出したい情報、判断したい品質・希望時期を分かる範囲で。動画や機密資料は添付・記載しなくて構いません。"
    case "ai-improvement":
      return "現在使っているAI機能、困っている誤答・処理時間・原価、改善前後で比較したい指標を分かる範囲で。ログ原文や機密データは不要です。"
    case "product":
      return "対象ユーザー、解決したい課題、最初に必要な機能、Web・モバイルの希望、公開したい時期を分かる範囲で。"
    case "advisory":
      return "相談したい技術・事業上の判断、現在の開発段階、検証したい条件、希望時期を分かる範囲で。仕様や予算は未定で構いません。"
    default:
      return fallback + " 機密資料や動画の共有は、必要になった段階で方法を合意します。"
  }
}
