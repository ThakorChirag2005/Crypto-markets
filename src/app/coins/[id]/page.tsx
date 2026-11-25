import Link from 'next/link';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import CoinOverview from '@/components/Home/CoinOverview';
import { CoinOverviewFallback } from '@/components/Home/fallback';
import PriceConverter from '@/components/coins/PriceConverter';
import { fetchCoinDetails } from '@/lib/market-data';

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
});

async function CoinDetailContent({ id }: { id: string }) {
  const coinPromise = fetchCoinDetails(id).catch((error: unknown) => {
    if (error instanceof Error && error.message.startsWith('API Error: 404:')) notFound();
    throw error;
  });
  const coin = await coinPromise;
  const currencies = ['usd', 'eur', 'gbp', 'inr', 'jpy'];
  const availablePrices = Object.fromEntries(
    currencies.flatMap((currency) => {
      const price = coin.market_data.current_price[currency];
      return typeof price === 'number' ? [[currency, price]] : [];
    }),
  );
  const details = [
    {
      label: 'Market cap',
      value:
        coin.market_data.market_cap.usd === undefined
          ? '—'
          : compactCurrencyFormatter.format(coin.market_data.market_cap.usd),
    },
    {
      label: '24h volume',
      value:
        coin.market_data.total_volume.usd === undefined
          ? '—'
          : compactCurrencyFormatter.format(coin.market_data.total_volume.usd),
    },
    {
      label: 'Market cap rank',
      value: coin.market_cap_rank === null ? '—' : `#${coin.market_cap_rank}`,
    },
  ];
  const website = coin.links?.homepage?.find(Boolean);
  const explorer = coin.links?.blockchain_site?.find(Boolean);

  return (
    <main className="main-container flex-1 space-y-4 py-7">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/coins" className="transition hover:text-foreground">
          Markets
        </Link>
        <span aria-hidden="true">/</span>
        <span className="truncate text-foreground">{coin.name}</span>
      </div>

      <div className="grid items-start gap-5 md:grid-cols-[minmax(0,1.9fr)_minmax(320px,0.86fr)]">
        <div className="min-w-0">
          <Suspense fallback={<CoinOverviewFallback showChart />}>
            <CoinOverview coinId={id} showChart showMetrics />
          </Suspense>
        </div>

        <aside className="space-y-4">
          <PriceConverter
            coinName={coin.name}
            symbol={coin.symbol}
            prices={availablePrices}
            image={coin.image.large}
          />
          <section className="dashboard-card p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Asset information
            </p>
            <h2 className="mt-1 text-lg font-semibold">Coin details</h2>
            <dl className="mt-4 divide-y divide-border">
              {details.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-sm text-muted-foreground">{item.label}</dt>
                  <dd className="text-right text-sm font-medium">{item.value}</dd>
                </div>
              ))}
            </dl>
            {(website || explorer) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-border px-3 py-2 text-xs font-medium transition hover:border-primary/50 hover:text-primary"
                  >
                    Website
                  </a>
                )}
                {explorer && (
                  <a
                    href={explorer}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-border px-3 py-2 text-xs font-medium transition hover:border-primary/50 hover:text-primary"
                  >
                    Explorer
                  </a>
                )}
              </div>
            )}
          </section>
          <p className="px-1 text-xs leading-5 text-muted-foreground">
            Price data is served through CoinGecko REST snapshots. Live exchange order-book streams
            are not available in this data mode.
          </p>
        </aside>
      </div>
    </main>
  );
}

function CoinPageFallback() {
  return (
    <main className="main-container flex-1 space-y-4 py-7" aria-label="Loading coin details">
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="grid items-start gap-5 md:grid-cols-[minmax(0,1.9fr)_minmax(320px,0.86fr)]">
        <CoinOverviewFallback showChart />
        <div className="space-y-4">
          <div className="dashboard-card h-64 animate-pulse" />
          <div className="dashboard-card h-56 animate-pulse" />
        </div>
      </div>
    </main>
  );
}

export default async function CoinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[a-zA-Z0-9-]+$/.test(id)) notFound();

  return (
    <Suspense fallback={<CoinPageFallback />}>
      <CoinDetailContent id={id} />
    </Suspense>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    title: `${id} | CoinPulse`,
    description: `Market overview, price history, and converter for ${id}.`,
  };
}
