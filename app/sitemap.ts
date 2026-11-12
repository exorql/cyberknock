export const dynamic = "force-static"

import type { MetadataRoute } from "next"
import { insights } from "@/lib/b2b-insights"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://cyberknock.jp"
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/sports-dx`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ai-development`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/insights`,
      lastModified: new Date("2026-11-03"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...insights.map(({ slug }) => ({
      url: `${baseUrl}/insights/${slug}`,
      lastModified: new Date("2026-11-03"),
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
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/security`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]
}
