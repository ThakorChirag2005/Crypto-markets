'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { CoinSearchResult } from '@/lib/market-data';

type SearchResponse = {
  coins: CoinSearchResult[];
};

function CoinSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CoinSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (normalizedQuery.length < 2) return;

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const response = await fetch(`/api/coins/search?q=${encodeURIComponent(normalizedQuery)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Search failed (${response.status})`);
        const data = (await response.json()) as SearchResponse;
        setResults(data.coins);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        setErrorMessage(error instanceof Error ? error.message : 'Unable to search coins.');
        setResults([]);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return (
    <div className="relative w-full max-w-xl">
      <label htmlFor="coin-search" className="sr-only">
        Search coins
      </label>
      <input
        id="coin-search"
        value={query}
        onChange={(event) => {
          const value = event.target.value;
          setQuery(value);
          if (value.trim().length < 2) {
            setResults([]);
            setErrorMessage('');
            setIsLoading(false);
          }
        }}
        placeholder="Search coins by name or symbol"
        autoComplete="off"
        className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition focus:border-primary"
      />
      {query.trim().length >= 2 && (
        <div
          className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
          role="status"
          aria-live="polite"
        >
          {isLoading ? (
            <p className="p-4 text-sm text-muted-foreground">Searching coins…</p>
          ) : errorMessage ? (
            <p className="p-4 text-sm text-red-500">{errorMessage}</p>
          ) : results.length ? (
            <ul>
              {results.map((coin) => (
                <li key={coin.id}>
                  <Link
                    href={`/coins/${encodeURIComponent(coin.id)}`}
                    onClick={() => setQuery('')}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-muted"
                  >
                    <Image
                      src={coin.thumb}
                      alt=""
                      width={28}
                      height={28}
                      unoptimized
                      className="size-7 rounded-full"
                    />
                    <span className="min-w-0 flex-1 truncate font-medium">{coin.name}</span>
                    <span className="text-xs uppercase text-muted-foreground">{coin.symbol}</span>
                    {coin.market_cap_rank && (
                      <span className="text-xs text-muted-foreground">#{coin.market_cap_rank}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-sm text-muted-foreground">No matching coins found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CoinSearch;
