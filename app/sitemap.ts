export const dynamic = "force-static"

import type { MetadataRoute } from "next"
import { insights } from "@/lib/b2b-insights"

/**
 * Dates of material changes to each public page (content, canonical, structured
 * data, or links), verified against Git history on 2026-11-17.
 * Keep these dates stable across builds. Update the relevant entry only when
 * the published page materially changes, not merely when deploying.
 */
const lastSignificantUpdate = {
  home: "2026-11-23", // Growth Web entry point added to services
  sportsDx: "2026-11-12", // canonical domain and linked content updated
  aiDevelopment: "2026-11-28", // standard assessment and monthly review offers
  aiQualityEvaluation: "2026-11-28", // quality review service
  growthWeb: "2026-11-23", // Cyber Knock Growth Web service LP launched
  caseStudy: "2026-11-28", // release evaluation and failure analysis
  security: "2026-11-12", // canonical domain updated
  privacy: "2026-11-23", // Growth Web LP and demo data handling disclosure added
} as const

// Material CTA and decision-guide revisions, not the date of a routine deploy.
const insightLastSignificantUpdate: Record<string, string> = {
  "ai-development-outsourcing-guide": "2026-11-28",
  "ai-poc-process-evaluation": "2026-11-28",
  "ai-video-analysis-poc-cost": "2026-11-28",
  "ai-video-analysis-development-request": "2026-11-28",
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cyberknock.jp"
  return [
    {
      url: baseUrl,
      lastModified: new Date(lastSignificantUpdate.home),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/sports-dx`,
      lastModified: new Date(lastSignificantUpdate.sportsDx),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ai-development`,
      lastModified: new Date(lastSignificantUpdate.aiDevelopment),
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/ai-development/ai-quality-evaluation`,
      lastModified: new Date(lastSignificantUpdate.aiQualityEvaluation),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/growth-web`,
      lastModified: new Date(lastSignificantUpdate.growthWeb),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/insights`,
      lastModified: new Date("2026-11-17"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...insights.map(({ slug }) => ({
      url: `${baseUrl}/insights/${slug}`,
      lastModified: insightLastSignificantUpdate[slug] ? new Date(insightLastSignificantUpdate[slug]) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.68,
    })),
    {
      url: `${baseUrl}/demos/ai-sports-trainer`,
      lastModified: new Date("2026-11-12"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cases/ai-sports-trainer`,
      lastModified: new Date(lastSignificantUpdate.caseStudy),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/security`,
      lastModified: new Date(lastSignificantUpdate.security),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(lastSignificantUpdate.privacy),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]
}
