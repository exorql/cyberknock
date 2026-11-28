/** Fixed consultation contexts, not user identity or acquisition attribution. */
export const guideConsultations = {
  "ai-development-outsourcing-guide": {
    source: "ai_development", path: "/ai-development",
    label: "AI開発会社の選び方と費用",
    service: "advisory",
    cta: "開発範囲・概算費用を相談する（無料）",
    heading: "外注する範囲を、一緒に整理しませんか。",
    lead: "解決したい業務課題、必要な機能、希望時期から、最初に検証することと実装範囲を整理します。予算や仕様は未定でも構いません。",
  },
  "ai-poc-process-evaluation": {
    source: "ai_development", path: "/ai-development",
    label: "AI PoCの進め方と評価基準",
    service: "advisory",
    cta: "PoCの必要性・評価基準を相談する（無料）",
    heading: "検証で、何を判断できればよいですか。",
    lead: "実現したいこと、使えるデータ、判断に必要な品質や費用をお聞かせください。PoCを省いて実装から進める場合も含めて整理します。",
  },
  "ai-video-analysis-poc-cost": {
    source: "ai_development", path: "/ai-development",
    label: "AI動画解析の開発費用とPoCの見積ポイント",
    service: "sports-ai",
    cta: "動画解析の検証範囲・見積を相談する（無料）",
    heading: "見積もりの前に、検証条件を整理。",
    lead: "対象の映像、取り出したい情報、品質や処理時間の条件を、分かる範囲でお聞かせください。機密動画の添付は不要です。",
  },
  "ai-video-analysis-development-request": {
    source: "ai_development", path: "/ai-development",
    label: "AI動画解析システム開発の依頼ガイド",
    service: "sports-ai",
    cta: "動画解析システムの開発を相談する（無料）",
    heading: "映像から必要な情報を取り出す仕組みへ。",
    lead: "撮影条件、期待する出力、使う人、既存システムとの連携を整理して、技術検証から本番実装までの範囲を相談できます。",
  },
  "excel-systemization-cost": {"label":"Excel業務のシステム化にかかる費用","source":"business_systems","path":"/services/business-systems","service":"business-systems","cta":"Excel台帳の移行・費用を相談する（無料）","heading":"今のExcelで、どの作業が止まりますか。","lead":"使っている台帳、更新する人、引き継ぎや集計の負担から、残すものと移すものを整理します。"},
  "business-automation-cost": {"label":"業務自動化の外注費用","source":"business_automation","path":"/services/business-automation","service":"business-automation","cta":"自動化の範囲・費用を相談する（無料）","heading":"時間がかかる仕事を、一つ教えてください。","lead":"現在の手順と道具から、既存機能で済むか、連携や独自開発が必要かを整理します。"},
  "order-entry-automation": {"label":"受発注業務の自動化","source":"business_automation","path":"/services/business-automation","service":"business-automation","cta":"受注入力の自動化を相談する（無料）","heading":"受注の入力から確認・登録まで。","lead":"受信形式、件数、販売管理、困っている例外を文章でお聞かせください。実際の注文書の添付は不要です。"},
  "ai-adoption-cost": {"label":"中小企業のAI導入費用","source":"business_automation","path":"/services/business-automation","service":"business-automation","cta":"社内のAI導入・定着を相談する（無料）","heading":"何にAIを使うか、そこから相談できます。","lead":"対象部署、繰り返し行う仕事、現在使っているツールを教えてください。AIを使わない解決方法も比較します。"},
} as const

export type B2BGuide = keyof typeof guideConsultations
type ConsultationService = "advisory" | "sports-ai" | "ai-improvement" | "business-automation" | "business-systems"

export function isB2BGuide(value: unknown): value is B2BGuide {
  return typeof value === "string" && Object.hasOwn(guideConsultations, value)
}

export function isGuideForSource(value: unknown, source: string): value is B2BGuide {
  return isB2BGuide(value) && guideConsultations[value].source === source
}

export function guideFromContactSearch(rawSearch: string, source: string): B2BGuide | undefined {
  if (rawSearch.length > 512) return undefined
  const values = new URLSearchParams(rawSearch).getAll("guide")
  return values.length === 1 && isGuideForSource(values[0], source) ? values[0] : undefined
}

export function guideContactHref(guide: B2BGuide, service: ConsultationService): string {
  const config = guideConsultations[guide]
  const selected = config.source === "ai_development" ? service : config.service
  return config.path + "?" + new URLSearchParams({ service: selected, guide }).toString() + "#contact"
}

export function consultationForGuide(slug: string) {
  if (!isB2BGuide(slug)) {
    return {
      guide: undefined, service: undefined, path: "/ai-development", source: "ai_development", href: "/ai-development#contact",
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
