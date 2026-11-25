'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import DataTable from '@/components/DataTable';
import type { MarketCoin } from '@/lib/market-data';

type SortKey =
  | 'market_cap_rank'
  | 'current_price'
  | 'market_cap'
  | 'total_volume'
  | 'price_change_percentage_24h';

type CoinMarketTableProps = {
  coins: MarketCoin[];
  showControls?: boolean;
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumSignificantDigits: 6,
});

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
});

const columns = [
  {
    header: 'Rank',
    headClassName: 'w-20',
    cell: (coin: MarketCoin) => coin.market_cap_rank ?? '-',
  },
  {
    header: 'Asset',
    cell: (coin: MarketCoin) => (
      <Link
        href={`/coins/${encodeURIComponent(coin.id)}`}
        className="flex items-center gap-3 hover:text-primary"
      >
        <Image
          src={coin.image}
          alt=""
          width={32}
          height={32}
          unoptimized
          className="size-8 shrink-0 rounded-full border border-border bg-background object-contain p-0.5"
        />
        <span>
          <span className="block font-medium text-foreground">{coin.name}</span>
          <span className="block text-xs uppercase text-muted-foreground">{coin.symbol}</span>
        </span>
      </Link>
    ),
  },
  {
    header: 'Price',
    headClassName: 'text-right',
    cellClassName: 'text-right font-medium',
    cell: (coin: MarketCoin) => currencyFormatter.format(coin.current_price),
  },
  {
    header: '24h',
    headClassName: 'text-right',
    cellClassName: 'text-right',
    cell: (coin: MarketCoin) => {
      const change = coin.price_change_percentage_24h;
      if (change === null) return '-';

      return (
        <span className={change >= 0 ? 'text-emerald-400' : 'text-red-400'}>
          {change >= 0 ? '+' : ''}
          {change.toFixed(2)}%
        </span>
      );
    },
  },
  {
    header: 'Market cap',
    headClassName: 'text-right',
    cellClassName: 'text-right',
    cell: (coin: MarketCoin) =>
      coin.market_cap === null ? '-' : compactCurrencyFormatter.format(coin.market_cap),
  },
  {
    header: '24h volume',
    headClassName: 'text-right',
    cellClassName: 'text-right',
    cell: (coin: MarketCoin) =>
      coin.total_volume === null ? '-' : compactCurrencyFormatter.format(coin.total_volume),
  },
];

function CoinMarketTable({ coins, showControls = true }: CoinMarketTableProps) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('market_cap_rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const visibleCoins = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return coins
      .filter(
        (coin) =>
          !normalizedQuery ||
          coin.name.toLowerCase().includes(normalizedQuery) ||
          coin.symbol.toLowerCase().includes(normalizedQuery),
      )
      .sort((a, b) => {
        const left = a[sortKey] ?? (sortDirection === 'asc' ? Number.POSITIVE_INFINITY : -1);
        const right = b[sortKey] ?? (sortDirection === 'asc' ? Number.POSITIVE_INFINITY : -1);
        return (Number(left) - Number(right)) * (sortDirection === 'asc' ? 1 : -1);
      });
  }, [coins, query, sortDirection, sortKey]);

  return (
    <div className="space-y-4">
      {showControls && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex-1">
            <span className="sr-only">Filter coins by name or symbol</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter by coin or symbol"
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-primary"
            />
          </label>
          <select
            aria-label="Sort coins"
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value as SortKey)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
          >
            <option value="market_cap_rank">Market cap rank</option>
            <option value="current_price">Price</option>
            <option value="price_change_percentage_24h">24h change</option>
            <option value="market_cap">Market cap</option>
            <option value="total_volume">24h volume</option>
          </select>
          <button
            type="button"
            onClick={() => setSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'))}
            className="h-10 rounded-lg border border-border px-3 text-sm hover:bg-muted"
            aria-label={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
          >
            {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>
      )}

      {visibleCoins.length > 0 ? (
        <DataTable
          columns={columns}
          data={visibleCoins}
          rowKey={(coin) => coin.id}
          tableClassName="min-w-[760px]"
          headerCellClassName="text-xs uppercase tracking-wide text-muted-foreground"
        />
      ) : (
        <p className="rounded-xl border border-border p-8 text-center text-sm text-muted-foreground">
          No coins match that search.
        </p>
      )}
    </div>
  );
}

export default CoinMarketTable;
