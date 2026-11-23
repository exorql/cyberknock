import { SAFETY_STANDARDS } from "@/lib/growth-web/demo-school"

export function SafetyStandards() {
  return (
    <section
      id="safety"
      className="scroll-mt-24 border-b border-[#dddad0] bg-white py-14 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#0d5e43]">
            PARENT-FIRST STANDARDS
          </p>
          <h2 className="mt-2.5 text-2xl font-extrabold tracking-tight text-[#10211b] sm:text-3xl">
            保護者の方が体験前に安心できる6つの約束
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#41524b] sm:text-base">
            「送り迎えや当番が大変そう」「初心者でも馴染めるか心配」といった不安を、運営ルールとして明確に解消しています。
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SAFETY_STANDARDS.map((item) => (
            <article
              key={item.code}
              className="rounded-2xl border border-[#dddad0] bg-[#faf9f5] p-5 sm:p-6"
            >
              <span className="font-mono text-xs font-bold tracking-[0.14em] text-[#0d5e43]">
                PROMISE {item.code}
              </span>
              <h3 className="mt-2.5 text-base font-bold leading-snug text-[#10211b]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#41524b]">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
