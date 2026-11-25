'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

const currencyOptions = [
  { code: 'usd', label: 'USD — US Dollar' },
  { code: 'eur', label: 'EUR — Euro' },
  { code: 'gbp', label: 'GBP — British Pound' },
  { code: 'inr', label: 'INR — Indian Rupee' },
  { code: 'jpy', label: 'JPY — Japanese Yen' },
] as const;

type PriceConverterProps = {
  coinName: string;
  symbol: string;
  prices: Record<string, number>;
  image?: string;
};

function PriceConverter({ coinName, symbol, prices, image }: PriceConverterProps) {
  const availableCurrencies = currencyOptions.filter(({ code }) => prices[code] !== undefined);
  const [amount, setAmount] = useState('1');
  const [currency, setCurrency] = useState(availableCurrencies[0]?.code ?? 'usd');
  const convertedAmount = Number(amount) * (prices[currency] ?? 0);
  const formatter = useMemo(
    () =>
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
        maximumFractionDigits: 4,
      }),
    [currency],
  );

  return (
    <section className="dashboard-card p-5 sm:p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Converter
        </p>
        <h2 className="mt-1 text-lg font-semibold">Convert {coinName}</h2>
      </div>
      <div className="mt-5 space-y-3">
        <label className="block rounded-lg border border-border bg-background/70 p-3">
          <span className="block text-xs text-muted-foreground">You pay</span>
          <span className="mt-2 flex items-center gap-3">
            {image && (
              <Image
                src={image}
                alt=""
                width={28}
                height={28}
                unoptimized
                className="size-7 rounded-full object-contain"
              />
            )}
            <input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              aria-label={`Amount in ${symbol.toUpperCase()}`}
              className="min-w-0 flex-1 bg-transparent text-lg font-semibold outline-none"
            />
            <span className="text-sm font-medium text-muted-foreground">
              {symbol.toUpperCase()}
            </span>
          </span>
        </label>
        <div className="flex justify-center text-muted-foreground" aria-hidden="true">
          <span className="flex size-7 items-center justify-center rounded-full border border-border bg-card text-sm">
            <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden="true">
              <path
                d="M8 2.5v10m0 0 3.5-3.5M8 12.5 4.5 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        <div className="rounded-lg border border-border bg-background/70 p-3">
          <span className="block text-xs text-muted-foreground">You receive</span>
          <span className="mt-2 flex items-center gap-3">
            <output className="min-w-0 flex-1 truncate text-lg font-semibold">
              {formatter.format(Number.isFinite(convertedAmount) ? convertedAmount : 0)}
            </output>
            <label className="sr-only" htmlFor="converter-currency">
              Fiat currency
            </label>
            <select
              id="converter-currency"
              value={currency}
              onChange={(event) => {
                const selectedCurrency = currencyOptions.find(
                  ({ code }) => code === event.target.value,
                );
                if (selectedCurrency) setCurrency(selectedCurrency.code);
              }}
              className="max-w-28 rounded-md border border-border bg-card px-2 py-1.5 text-xs font-medium"
            >
              {availableCurrencies.map(({ code }) => (
                <option key={code} value={code}>
                  {code.toUpperCase()}
                </option>
              ))}
            </select>
          </span>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Conversion uses the latest available market snapshot.
      </p>
    </section>
  );
}

export default PriceConverter;
