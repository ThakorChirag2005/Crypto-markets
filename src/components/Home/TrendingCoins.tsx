import Image from 'next/image';
import Link from 'next/link';
import { fetchMarketCoins } from '@/lib/market-data';

export const TRENDING_COINS_LIMIT = 4;

async function TrendingCoins() {
  const coins = await fetchMarketCoins('usd', TRENDING_COINS_LIMIT, 'volume_desc');

  return (
    <ul className="divide-y divide-border">
      {coins.map((coin, index) => {
        const change = coin.price_change_percentage_24h;
        return (
          <li key={coin.id}>
            <Link
              href={`/coins/${coin.id}`}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 py-4 transition hover:bg-accent/30"
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="w-5 shrink-0 text-xs text-muted-foreground">{index + 1}</span>
                <Image
                  src={coin.image}
                  alt=""
                  width={32}
                  height={32}
                  unoptimized
                  className="size-8 shrink-0 rounded-full bg-background object-contain"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {coin.name}
                  </span>
                  <span className="block text-xs uppercase text-muted-foreground">
                    {coin.symbol}
                  </span>
                </span>
              </span>
              <span className="text-right">
                <span className="block text-sm font-medium">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumSignificantDigits: 6,
                  }).format(coin.current_price)}
                </span>
                <span
                  className={`block text-xs ${change === null ? 'text-muted-foreground' : change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                >
                  {change === null ? '—' : `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default TrendingCoins;
