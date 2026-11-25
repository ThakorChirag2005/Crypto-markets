import Image from 'next/image';
import CoinPriceChart from '@/components/coins/CoinPriceChart';
import { fetchCoinDetails, fetchCoinMarketChart, fetchCoinOhlc } from '@/lib/market-data';

type CoinOverviewProps = {
  coinId: string;
  showChart?: boolean;
  showMetrics?: boolean;
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 4,
});

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
});

async function CoinOverview({ coinId, showChart = false, showMetrics = false }: CoinOverviewProps) {
  const [coin, chartData] = await Promise.all([
    fetchCoinDetails(coinId),
    showChart
      ? Promise.all([fetchCoinOhlc(coinId, 7), fetchCoinMarketChart(coinId, 7)])
      : Promise.resolve(null),
  ]);
  const priceChange = coin.market_data.price_change_percentage_24h;
  const candles = chartData?.[0] ?? [];
  const volumes = chartData?.[1].total_volumes ?? [];

  return (
    <section className="dashboard-card min-w-0 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <Image
            src={coin.image.large}
            alt={`${coin.name} logo`}
            width={48}
            height={48}
            unoptimized
            className="size-12 rounded-full border border-border bg-background object-contain p-1.5"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {coin.symbol.toUpperCase()}
              {coin.market_cap_rank !== null && ` · Rank #${coin.market_cap_rank}`}
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">{coin.name}</h2>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {currencyFormatter.format(coin.market_data.current_price.usd)}
          </p>
          {priceChange !== null && (
            <p
              className={`mt-1 text-sm font-medium ${priceChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
            >
              {priceChange >= 0 ? '+' : ''}
              {priceChange.toFixed(2)}% (24h)
            </p>
          )}
        </div>
      </div>

      {showChart && (
        <>
          {showMetrics && (
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <MarketMetric
                label="24h high"
                value={compactCurrencyFormatter.format(coin.market_data.high_24h.usd)}
              />
              <MarketMetric
                label="24h low"
                value={compactCurrencyFormatter.format(coin.market_data.low_24h.usd)}
              />
              <MarketMetric
                label="Market cap"
                value={compactCurrencyFormatter.format(coin.market_data.market_cap.usd)}
              />
            </div>
          )}

          <div className="mt-8 border-t border-border pt-6">
            <CoinPriceChart
              key={coinId}
              coinId={coinId}
              coinName={coin.name}
              initialData={{ candles, volumes }}
            />
          </div>
        </>
      )}
    </section>
  );
}

function MarketMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background/50 p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-2 font-semibold">{value}</p>
    </div>
  );
}

export default CoinOverview;
