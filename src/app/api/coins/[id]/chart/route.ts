import { NextResponse } from 'next/server';
import { COIN_CHART_DAYS, isCoinChartPeriod } from '@/lib/chart-periods';
import { fetchCoinMarketChart, fetchCoinOhlc } from '@/lib/market-data';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-zA-Z0-9-]+$/.test(id)) {
    return NextResponse.json({ error: 'Invalid coin ID.' }, { status: 400 });
  }

  const period = new URL(request.url).searchParams.get('period');
  if (!isCoinChartPeriod(period)) {
    return NextResponse.json({ error: 'Invalid chart period.' }, { status: 400 });
  }

  try {
    const days = COIN_CHART_DAYS[period];
    const [candles, marketChart] = await Promise.all([
      fetchCoinOhlc(id, days),
      fetchCoinMarketChart(id, days),
    ]);

    return NextResponse.json({
      candles,
      volumes: marketChart.total_volumes,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load chart history.';
    const statusMatch = message.match(/^API Error: (\d{3}):/);
    const apiStatus = statusMatch ? Number(statusMatch[1]) : 502;
    const status = apiStatus >= 400 && apiStatus <= 599 ? apiStatus : 502;

    return NextResponse.json({ error: message }, { status });
  }
}
