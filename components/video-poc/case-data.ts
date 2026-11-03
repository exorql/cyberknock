export type VideoPocKind = "soccer" | "kyudo"

export type VideoPocCase = {
  kind: VideoPocKind
  slug: string
  label: string
  overline: string
  headline: string
  introduction: string
  tested: string[]
  notVerified: string[]
  workflow: { title: string; description: string }[]
  firstInputs: string[]
  decision: string
}

export const videoPocCases: Record<VideoPocKind, VideoPocCase> = {
  soccer: {
    kind: "soccer",
    slug: "soccer-player-tracking",
    label: "サッカー / 選手追跡・プレー候補抽出",
    overline: "TECHNICAL STUDY / 01",
    headline: "指定した選手のプレーを、映像から探せるか。",
    introduction: "試合映像から対象選手を指定し、追跡・ボールとの位置関係・候補区間を確認する技術検証。レビュー・区間編集・動画書き出しまでの操作経路を構築しました。",
    tested: [
      "対象選手を指定し、追跡候補と時刻をレビューする画面",
      "候補の採用・除外・区間修正を人が行う操作経路",
      "確認済み区間をMP4で書き出す技術的な流れ",
    ],
    notVerified: [
      "特定選手を試合の最後まで取り違えずに追跡する精度",
      "接触・パス・シュート等を自動で正しく判別する精度",
      "任意のスマホ撮影・長時間の試合での完全自動抽出",
    ],
    workflow: [
      { title: "選ぶ", description: "対象選手を画面上で指定し、何をプレーとして扱うか決める。" },
      { title: "追う", description: "遮蔽・交差・画角外での本人性を確認しながら候補を生成する。" },
      { title: "確かめる", description: "候補時刻と根拠を人がレビューし、必要なら除外・編集する。" },
      { title: "切り出す", description: "承認した範囲を動画として書き出し、再現性を評価する。" },
    ],
    firstInputs: ["元の撮影方式と動画の長さ", "対象選手をどう指定したいか", "欲しいプレーの定義と確認方法", "正解例を用意できるか"],
    decision: "本人性の維持と自動抽出精度には未達部分があります。したがって、現段階の検証を商用品質や全自動化の実績とは説明していません。まず素材条件と評価指標を決めるPoCが適しています。",
  },
  kyudo: {
    kind: "kyudo",
    slug: "kyudo-motion-analysis",
    label: "弓道 / 動作と姿勢・軌跡の可視化",
    overline: "TECHNICAL STUDY / 02",
    headline: "一射の動きを、指導で確認できる情報へ。",
    introduction: "撮影済みの一射に対し、動作候補時刻、肩・腕・体幹の推定線、手首などの推定軌跡を見返せる技術検証。指導者が候補を確認・修正する前提で設計しました。",
    tested: [
      "射の動作候補時刻への移動と、区間の人手修正",
      "正面映像への姿勢推定線・点の重ね合わせ",
      "手首などの軌跡と、比較可能な一部の2D参考角度の確認",
    ],
    notVerified: [
      "射法八節の正式な開始時刻と「会」の公式な長さ",
      "拳・肘の正確な関節中心、身体重心、実寸や3D角度",
      "別の射・他視点・他の撮影条件での計測精度",
    ],
    workflow: [
      { title: "撮る", description: "測りたい動きが見える方向・画角で一射を撮影する。" },
      { title: "示す", description: "姿勢推定と手首などの推定点を映像に重ねて可視化する。" },
      { title: "合わせる", description: "動作の境界・会の開始と終了を指導者が確認・修正する。" },
      { title: "比べる", description: "同じ条件の映像で軌跡や2D参考値の妥当性を評価する。" },
    ],
    firstInputs: ["指導に使いたい動作と計測項目", "撮影位置・解像度・フレームレート", "指導者が判定した参照時刻・位置", "撮影・共有に必要な同意と利用範囲"],
    decision: "姿勢推定や追跡の数値は、関節中心や重心の正解を保証しません。欠測点の補間による誤認を避けつつ、複数の射と指導者の参照値で比較する有償PoCを想定しています。",
  },
}

export const pocSteps = [
  { label: "01 / SCOPE", title: "対象と正解を決める", description: "撮影条件、何を検出したいか、成功と失敗の基準を共有します。" },
  { label: "02 / EXPERIMENT", title: "実映像で試す", description: "代表的な映像を使い、推論結果だけでなく例外・欠測も確認します。" },
  { label: "03 / REVIEW", title: "人の評価と照合する", description: "対象の取り違え、判定の揺れ、確認工数を見える形にします。" },
  { label: "04 / DECIDE", title: "次の開発を判断する", description: "得られたこと・未達部分・追加開発案と概算を整理します。" },
] as const
