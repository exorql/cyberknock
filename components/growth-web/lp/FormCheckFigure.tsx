import { FORM_CHECK_NOTES } from "@/lib/growth-web/lp-content"

/**
 * Hero figure: a fictional baseball school's phone site annotated with the
 * four points Growth Web measures and improves. Static (no animation).
 * Marker positions (.gwl-mk.m1–m4) and note offsets (.gwl-notes li.c1–c4) in
 * growth-web.css (LP section) are measured against this exact phone content.
 */
export function FormCheckFigure() {
  return (
    <figure className="gwl-fc" aria-labelledby="gwl-fc-cap">
      <figcaption className="gwl-fc-cap" id="gwl-fc-cap">
        <span>改善ポイントの例</span>
        <span className="gwl-tag">サンプル画面</span>
      </figcaption>
      <div className="gwl-phone-wrap">
        <div
          className="gwl-phone"
          role="img"
          aria-label="架空の少年野球スクールのスマホサイト。検索からの着地、学年と曜日の絞り込み、費用の表示、体験申込ボタンの4か所に改善ポイントの番号が付いている"
        >
          <div className="gwl-screen">
            <div className="gwl-s-top">
              <span>みどり台ジュニアベースボール</span>
              <i />
            </div>
            <div className="gwl-s-body">
              <p className="gwl-s-h">
                小学生の野球スクール
                <br />
                初心者・未経験から
              </p>
              <p className="gwl-s-sub">みどり台駅 徒歩8分／専用グラウンド</p>
              <div className="gwl-chips">
                <span className="gwl-chip is-on">小3</span>
                <span className="gwl-chip is-on">火曜</span>
                <span className="gwl-chip">初心者OK</span>
              </div>
              <div className="gwl-cls">
                <p className="gwl-cls-t">火曜 17:00–18:30</p>
                <p className="gwl-cls-d">
                  <span>小3・小4／定員12名</span>
                  <span className="gwl-seat">空きあり</span>
                </p>
              </div>
              <div className="gwl-fee">
                <span className="gwl-ring" />
                <dl>
                  <dt>月謝</dt>
                  <dd>7,700円</dd>
                  <dt>入会金</dt>
                  <dd>5,500円</dd>
                  <dt>用具</dt>
                  <dd>無料貸出あり</dd>
                </dl>
              </div>
              <div className="gwl-faqrow">
                <span>振替・送迎・雨天時の対応</span>
                <span aria-hidden="true">＋</span>
              </div>
              <p className="gwl-flow-h">体験の流れ</p>
              <ol className="gwl-flow">
                <li><b>1</b>申込</li>
                <li><b>2</b>日程連絡</li>
                <li><b>3</b>体験</li>
              </ol>
            </div>
            <p className="gwl-s-note">※スクール名・金額は架空です</p>
            <div className="gwl-s-cta">このクラスで無料体験を申し込む</div>
          </div>
        </div>
        <span className="gwl-mk m1" aria-hidden="true">1</span>
        <span className="gwl-mk m2" aria-hidden="true">2</span>
        <span className="gwl-mk m3" aria-hidden="true">3</span>
        <span className="gwl-mk m4" aria-hidden="true">4</span>
      </div>
      <ol className="gwl-notes">
        {FORM_CHECK_NOTES.map((note, i) => (
          <li key={note.id} className={`is-${note.side} ${note.id}${note.hot ? " is-hot" : ""}`}>
            <span className="gwl-n" aria-hidden="true">{i + 1}</span>
            <b>{note.title}</b>
            <p>{note.body}</p>
            <span className="gwl-m">{note.metric}</span>
          </li>
        ))}
      </ol>
    </figure>
  )
}
