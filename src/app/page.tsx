import { Suspense } from 'react';
import Link from 'next/link';
import CoinOverview from '@/components/Home/CoinOverview';
import CoinSearch from '@/components/Home/CoinSearch';
import GlobalMarketStats from '@/components/Home/GlobalMarketStats';
import TopCategories from '@/components/Home/TopCategories';
import TrendingCoins from '@/components/Home/TrendingCoins';
import {
  CoinOverviewFallback,
  GlobalMarketStatsFallback,
  TopCategoriesFallback,
  TrendingListFallback,
} from '@/components/Home/fallback';

export default function Page() {
  return (
    <main className="main-container flex-1 space-y-5 py-7">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Market overview
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Crypto markets</h1>
        </div>
        <CoinSearch />
      </section>

      <section className="grid items-start gap-5 md:grid-cols-[minmax(0,1.9fr)_minmax(310px,0.86fr)]">
        <Suspense fallback={<CoinOverviewFallback showChart />}>
          <CoinOverview coinId="bitcoin" showChart />
        </Suspense>

        <section className="dashboard-card min-w-0 overflow-hidden p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Market activity
              </p>
              <h2 className="mt-1 text-lg font-semibold">Trending coins</h2>
            </div>
            <Link href="/coins" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>

          <Suspense fallback={<TrendingListFallback />}>
            <TrendingCoins />
          </Suspense>
        </section>
      </section>

      <Suspense fallback={<GlobalMarketStatsFallback />}>
        <GlobalMarketStats />
      </Suspense>

      <Suspense fallback={<TopCategoriesFallback />}>
        <TopCategories />
      </Suspense>
    </main>
  );
}
