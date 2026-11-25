export const COIN_CHART_PERIODS = ['1D', '1W', '1M', '3M', '6M', '1Y', 'Max'] as const;

export type CoinChartPeriod = (typeof COIN_CHART_PERIODS)[number];
export type CoinChartDays = number | 'max';

export const COIN_CHART_DAYS: Record<CoinChartPeriod, CoinChartDays> = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '6M': 180,
  '1Y': 365,
  Max: 'max',
};

export function isCoinChartPeriod(value: string | null): value is CoinChartPeriod {
  return value !== null && COIN_CHART_PERIODS.some((period) => period === value);
}
