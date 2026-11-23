export const SERVICE_INITIAL_FEE_JPY = 49_800
export const SERVICE_MONTHLY_FEE_JPY = 29_800

export interface RoiSimulationInput {
  monthlyTuitionJpy: number
  initialEnrollmentFeeJpy: number
  averageRetentionMonths: number
  grossMarginPercent: number
  trialToJoinRatePercent: number
  additionalTrialsPerMonth: number
  additionalMonthlyAcquisitionCostJpy: number
}

export interface MonthlyCashflowPoint {
  month: number
  activeIncrementalMembers: number
  cumulativeRevenueJpy: number
  cumulativeGrossProfitJpy: number
  cumulativeServiceCostJpy: number
  cumulativeTotalCostJpy: number
  cumulativeNetGrossProfitJpy: number
}

export type RoiViabilityStatus = "favorable" | "caution" | "unviable"

export interface RoiSimulationResult {
  studentRevenueLtvJpy: number
  studentGrossProfitLtvJpy: number
  expectedNewMembersPerMonth: number
  monthlyAcquisitionCostTotalJpy: number
  steadyCacJpy: number
  year1BlendedCacJpy: number
  grossProfitLtvToCacRatio: number
  grossProfitBreakEvenMonth: number | null
  revenueBreakEvenMonth: number | null
  month6MonthlyGrossProfitJpy: number
  year1CumulativeRevenueJpy: number
  year1CumulativeGrossProfitJpy: number
  year1CumulativeServiceCostJpy: number
  year1CumulativeTotalCostJpy: number
  year1CumulativeNetGrossProfitJpy: number
  viabilityStatus: RoiViabilityStatus
  timeline: MonthlyCashflowPoint[]
}

export const DEFAULT_ROI_INPUT: RoiSimulationInput = {
  monthlyTuitionJpy: 8_000,
  initialEnrollmentFeeJpy: 10_000,
  averageRetentionMonths: 18,
  grossMarginPercent: 65,
  trialToJoinRatePercent: 50,
  additionalTrialsPerMonth: 3,
  additionalMonthlyAcquisitionCostJpy: 10_000,
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.min(max, Math.max(min, value))
}

export function calculateRoiSimulation(
  rawInput: RoiSimulationInput
): RoiSimulationResult {
  const monthlyTuitionJpy = clamp(
    Math.round(rawInput.monthlyTuitionJpy),
    3_000,
    30_000
  )
  const initialEnrollmentFeeJpy = clamp(
    Math.round(rawInput.initialEnrollmentFeeJpy),
    0,
    50_000
  )
  const averageRetentionMonths = clamp(
    Math.round(rawInput.averageRetentionMonths),
    3,
    60
  )
  const grossMarginPercent = clamp(
    Math.round(rawInput.grossMarginPercent),
    20,
    95
  )
  const trialToJoinRatePercent = clamp(
    Math.round(rawInput.trialToJoinRatePercent),
    10,
    90
  )
  const additionalTrialsPerMonth = clamp(
    Math.round(rawInput.additionalTrialsPerMonth),
    1,
    20
  )
  const additionalMonthlyAcquisitionCostJpy = clamp(
    Math.round(rawInput.additionalMonthlyAcquisitionCostJpy),
    0,
    100_000
  )

  const grossMarginRatio = grossMarginPercent / 100
  const studentRevenueLtvJpy =
    monthlyTuitionJpy * averageRetentionMonths + initialEnrollmentFeeJpy
  const studentGrossProfitLtvJpy = Math.round(
    studentRevenueLtvJpy * grossMarginRatio
  )

  const expectedNewMembersPerMonth = Number(
    ((additionalTrialsPerMonth * trialToJoinRatePercent) / 100).toFixed(2)
  )

  const monthlyAcquisitionCostTotalJpy =
    SERVICE_MONTHLY_FEE_JPY + additionalMonthlyAcquisitionCostJpy
  const steadyCacJpy = Math.round(
    monthlyAcquisitionCostTotalJpy / Math.max(expectedNewMembersPerMonth, 0.01)
  )

  const timeline: MonthlyCashflowPoint[] = []
  let cumulativeRevenue = 0
  let cumulativeGrossProfit = 0
  let grossProfitBreakEvenMonth: number | null = null
  let revenueBreakEvenMonth: number | null = null

  for (let month = 1; month <= 12; month++) {
    const activeCohorts = Math.min(month, averageRetentionMonths)
    const activeIncrementalMembers = Number(
      (activeCohorts * expectedNewMembersPerMonth).toFixed(2)
    )
    const monthRevenue =
      activeIncrementalMembers * monthlyTuitionJpy +
      expectedNewMembersPerMonth * initialEnrollmentFeeJpy
    const monthGrossProfit = monthRevenue * grossMarginRatio

    cumulativeRevenue += monthRevenue
    cumulativeGrossProfit += monthGrossProfit

    const cumulativeServiceCost =
      SERVICE_INITIAL_FEE_JPY + month * SERVICE_MONTHLY_FEE_JPY
    const cumulativeTotalCost =
      SERVICE_INITIAL_FEE_JPY + month * monthlyAcquisitionCostTotalJpy

    const cumulativeNetGrossProfit = Math.round(
      cumulativeGrossProfit - cumulativeTotalCost
    )

    if (
      grossProfitBreakEvenMonth === null &&
      cumulativeNetGrossProfit >= 0
    ) {
      grossProfitBreakEvenMonth = month
    }

    if (
      revenueBreakEvenMonth === null &&
      Math.round(cumulativeRevenue - cumulativeTotalCost) >= 0
    ) {
      revenueBreakEvenMonth = month
    }

    timeline.push({
      month,
      activeIncrementalMembers,
      cumulativeRevenueJpy: Math.round(cumulativeRevenue),
      cumulativeGrossProfitJpy: Math.round(cumulativeGrossProfit),
      cumulativeServiceCostJpy: cumulativeServiceCost,
      cumulativeTotalCostJpy: cumulativeTotalCost,
      cumulativeNetGrossProfitJpy: cumulativeNetGrossProfit,
    })
  }

  const month6 = timeline[5]
  const month12 = timeline[11]

  const year1TotalNewMembers = Math.max(expectedNewMembersPerMonth * 12, 0.01)
  const year1BlendedCacJpy = Math.round(
    month12.cumulativeTotalCostJpy / year1TotalNewMembers
  )
  const grossProfitLtvToCacRatio = Number(
    (studentGrossProfitLtvJpy / Math.max(year1BlendedCacJpy, 1)).toFixed(2)
  )

  let viabilityStatus: RoiViabilityStatus
  if (grossProfitBreakEvenMonth === null || grossProfitLtvToCacRatio < 1.5) {
    viabilityStatus = "unviable"
  } else if (
    grossProfitBreakEvenMonth >= 10 ||
    grossProfitLtvToCacRatio < 2.5
  ) {
    viabilityStatus = "caution"
  } else {
    viabilityStatus = "favorable"
  }

  return {
    studentRevenueLtvJpy,
    studentGrossProfitLtvJpy,
    expectedNewMembersPerMonth,
    monthlyAcquisitionCostTotalJpy,
    steadyCacJpy,
    year1BlendedCacJpy,
    grossProfitLtvToCacRatio,
    grossProfitBreakEvenMonth,
    revenueBreakEvenMonth,
    month6MonthlyGrossProfitJpy: Math.round(
      month6.activeIncrementalMembers * monthlyTuitionJpy * grossMarginRatio
    ),
    year1CumulativeRevenueJpy: month12.cumulativeRevenueJpy,
    year1CumulativeGrossProfitJpy: month12.cumulativeGrossProfitJpy,
    year1CumulativeServiceCostJpy: month12.cumulativeServiceCostJpy,
    year1CumulativeTotalCostJpy: month12.cumulativeTotalCostJpy,
    year1CumulativeNetGrossProfitJpy: month12.cumulativeNetGrossProfitJpy,
    viabilityStatus,
    timeline,
  }
}
