const SITE_URL = "https://cyberknock.jp"

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")
}

export function buildGrowthWebLpJsonLd(
  faqs: ReadonlyArray<{ readonly question: string; readonly answer: string }>
) {
  const lpUrl = `${SITE_URL}/services/growth-web`
  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Cyber Knock", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Cyber Knock Growth Web", item: lpUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Cyber Knock Growth Web（民間スポーツスクール特化 ホームページ制作・集客改善）",
      url: lpUrl,
      provider: {
        "@type": "Organization",
        name: "Cyber Knock",
        url: SITE_URL,
      },
      areaServed: "JP",
      audience: {
        "@type": "BusinessAudience",
        audienceType: "民間スポーツスクール・ジュニアスポーツ教室運営者",
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "JPY",
        price: "29800",
        description:
          "初期構築49,800円（税抜）＋月額集客改善・運用29,800円（税抜）。先着3社・初期検証パートナー向け条件。",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ]
}

export function buildGrowthWebDemoJsonLd() {
  const lpUrl = `${SITE_URL}/services/growth-web`
  const demoUrl = `${SITE_URL}/services/growth-web/demo`
  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Cyber Knock", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Cyber Knock Growth Web", item: lpUrl },
        {
          "@type": "ListItem",
          position: 3,
          name: "スポーツスクール向け集客デモサイト",
          item: demoUrl,
        },
      ],
    },
  ]
}
