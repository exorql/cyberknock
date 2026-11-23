import { ArrowUpRight, CheckCircle2, Smartphone } from "lucide-react"
import { TrackedCta } from "@/components/growth-web/lp/TrackedCta"
import { DEMO_CHECKPOINTS, GROWTH_WEB_ROUTES } from "@/lib/growth-web/service-lp"

export function DemoShowcaseBridge() {
  return (
    <section className="border-b border-[#dddad0] bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="gw-dark-surface overflow-hidden rounded-3xl border border-[#1d3a2f] bg-[#0e1b16] text-[#f6f5f0]">
          <div className="grid lg:grid-cols-12">
            <div className="p-6 sm:p-10 lg:col-span-7 lg:p-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#6ee7b7]/35 bg-[#0a5c42]/45 px-3 py-1 font-mono text-xs font-semibold text-[#a7f3d0]">
                <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
                INTERACTIVE LIVE DEMO
              </div>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
                口頭の説明ではなく、
                <span className="block text-[#6ee7b7]">
                  実際に動くスポーツスクールサイトでご確認ください。
                </span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#c6d4cd] sm:text-base">
                架空のモデルスクール「あおばフィールド スポーツアカデミー（ジュニアサッカー・運動基礎）」を想定し、
                保護者の検索流入から60秒体験申込・GA4イベント計測までをそのまま実装しています。
              </p>

              <ol className="mt-7 space-y-4">
                {DEMO_CHECKPOINTS.map((item) => (
                  <li
                    key={item.number}
                    className="flex items-start gap-3.5 rounded-xl border border-white/[0.12] bg-white/[0.04] p-4"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#6ee7b7] font-mono text-xs font-extrabold text-[#0e1b16]">
                      {item.number}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#c6d4cd]">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <TrackedCta
                  href={GROWTH_WEB_ROUTES.demo}
                  event="lp_demo_cta_click"
                  params={{
                    section: "demo_bridge",
                    cta_label: "demo_bridge",
                    location: "growth_web_demo_bridge",
                  }}
                  className="inline-flex min-h-[52px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#b8430f] px-6 text-base font-bold text-white shadow-lg transition-colors hover:bg-[#94340a]"
                >
                  スポーツスクール実働デモを開く
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </TrackedCta>
                <span className="text-xs text-[#c6d4cd]">
                  ※架空スクール・ダミーデータ。外部送信・保存は行われません。
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center border-t border-white/[0.12] bg-[#13251e] p-6 sm:p-10 lg:col-span-5 lg:border-l lg:border-t-0">
              <div className="w-full max-w-xs overflow-hidden rounded-[28px] border-4 border-[#27463a] bg-[#faf9f5] text-[#10211b] shadow-2xl">
                <div className="bg-[#10211b] px-4 py-2 text-center font-mono text-[10px] font-semibold text-[#6ee7b7]">
                  DEMO SITE — /services/growth-web/demo
                </div>
                <div className="p-5">
                  <span className="inline-block rounded-full bg-[#e6f4ee] px-2.5 py-0.5 text-[10px] font-bold text-[#0a5c42]">
                    年長〜小6・初心者歓迎
                  </span>
                  <p className="mt-2.5 text-base font-extrabold leading-snug text-[#10211b]">
                    あおばフィールド
                    <br />
                    スポーツアカデミー
                  </p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-[#41524b]">
                    学年・拠点から10秒でクラス検索。月謝以外の費用も全公開し、スマホから60秒で無料体験申込。
                  </p>
                  <div className="mt-4 space-y-2 rounded-xl border border-[#dddad0] bg-white p-3 text-[11px]">
                    <div className="flex items-center justify-between font-bold">
                      <span>キッズ運動基礎（火曜）</span>
                      <span className="text-[#0a5c42]">受付中</span>
                    </div>
                    <p className="text-[#41524b]">年長〜小2｜15:45–16:45</p>
                    <div className="rounded-lg bg-[#b8430f] py-2 text-center font-bold text-white">
                      このクラスで無料体験（60秒）
                    </div>
                  </div>
                  <div className="mt-4 space-y-1.5 text-[11px] text-[#2c3632]">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2
                        className="h-3.5 w-3.5 text-[#0a5c42]"
                        aria-hidden="true"
                      />
                      <span>親当番なし・雨天振替あり</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2
                        className="h-3.5 w-3.5 text-[#0a5c42]"
                        aria-hidden="true"
                      />
                      <span>GA4計測インスペクター搭載</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
