/** An iterative path from an idea to a working product, not measured motion data. */
export function Trajectory({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 600 600" fill="none" aria-hidden="true" focusable="false">
    <g stroke="currentColor" strokeWidth="1"><path d="M40 420C85 130 500 40 535 265S180 595 145 365 425 160 470 245"/><path d="M60 440C105 150 520 60 555 285S200 615 165 385 445 180 490 265"/><path d="M20 400C65 110 480 20 515 245S160 575 125 345 405 140 450 225"/></g>
    <path d="M40 420C85 130 500 40 535 265S180 595 145 365" stroke="currentColor" strokeWidth="2.6" pathLength="1" className="trajectory-highlight"/>
    <g fill="currentColor"><circle cx="40" cy="420" r="6"/><circle cx="535" cy="265" r="6"/><circle cx="145" cy="365" r="6"/></g>
    <g stroke="currentColor" opacity=".45"><path d="M25 70H65M45 50V90M505 500H545M525 480V520"/></g>
  </svg>
}
