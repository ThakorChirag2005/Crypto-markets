import { Suspense } from 'react';
import CoinMarketTable from '@/components/markets/CoinMarketTable';
import { TrendingCoinsFallback } from '@/components/Home/fallback';
import { fetchMarketCoins } from '@/lib/market-data';

async function AllMarketCoins() {
  const coins = await fetchMarketCoins('usd', 50, 'market_cap_desc');
  return <CoinMarketTable coins={coins} />;
}

export default function CoinsPage() {
  return (
    <main className="main-container flex-1 space-y-5 py-7">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Market directory
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">All cryptocurrencies</h1>
        <p className="text-sm text-muted-foreground">
          Search and sort the top 50 assets by price, market cap, volume, and daily change.
        </p>
      </header>
      <section className="dashboard-card min-w-0 overflow-hidden p-4 sm:p-5">
        <Suspense fallback={<TrendingCoinsFallback />}>
          <AllMarketCoins />
        </Suspense>
      </section>
    </main>
  );
}
