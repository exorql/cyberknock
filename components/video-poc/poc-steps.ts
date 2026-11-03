export const pocSteps = [
  { label: "01 / SCOPE", title: "対象と正解を決める", description: "撮影条件、何を検出したいか、成功と失敗の基準を共有します。" },
  { label: "02 / EXPERIMENT", title: "実映像で試す", description: "代表的な映像を使い、推論結果だけでなく例外・欠測も確認します。" },
  { label: "03 / REVIEW", title: "人の評価と照合する", description: "対象の取り違え、判定の揺れ、確認工数を見える形にします。" },
  { label: "04 / DECIDE", title: "次の開発を判断する", description: "得られたこと・未達部分・追加開発案と概算を整理します。" },
] as const
