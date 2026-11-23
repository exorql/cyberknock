"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import {
  trackGrowthWebEvent,
  type GrowthWebEventName,
} from "@/lib/growth-web/telemetry"

interface TrackedCtaProps {
  href: string
  event: GrowthWebEventName
  params: Record<string, string | number | boolean>
  className: string
  children: ReactNode
}

export function TrackedCta({
  href,
  event,
  params,
  className,
  children,
}: TrackedCtaProps) {
  const handleClick = () => {
    trackGrowthWebEvent(event, params)
  }

  if (href.startsWith("#")) {
    return (
      <a href={href} onClick={handleClick} className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  )
}
