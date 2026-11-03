import Link from "next/link"

type Item = { href: string; label: string; service?: string }

export function ChapterNav({ chapters, note, location }: { chapters: Item[]; note: string; location: "sports_dx" | "case" }) {
  return <nav className="chapter-nav" aria-label="このページの見どころ">
    <div className="wrap chapter-nav-inner">
      <div className="chapter-nav-top"><span className="mono chapter-nav-caption">{note}</span><span className="chapter-swipe-hint">横にスクロール <span aria-hidden="true">↔</span></span></div>
      <div className="chapter-nav-links">
        {chapters.map((item, i) => <Link key={item.href} href={item.href} prefetch={false} data-track={item.service ? "cta_click" : undefined} data-location={item.service ? location : undefined} data-service={item.service}>
          <span className="mono" aria-hidden="true">0{i+1}</span>{item.label}
        </Link>)}
      </div>
    </div>
  </nav>
}
