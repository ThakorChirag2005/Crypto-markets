'use client';

import { useEffect, useRef, useState } from 'react';
import CandlestickChart from '@/components/coins/CandlestickChart';
import { COIN_CHART_PERIODS, type CoinChartPeriod } from '@/lib/chart-periods';
import type { OhlcCandle } from '@/lib/market-data';

type CoinChartData = {
  candles: OhlcCandle[];
  volumes: [number, number][];
};

type CoinPriceChartProps = {
  coinId: string;
  coinName: string;
  initialData: CoinChartData;
};

type ChartApiResponse = {
  error?: string;
  candles?: unknown;
  volumes?: unknown;
};

function isOhlcCandle(value: unknown): value is OhlcCandle {
  return (
    Array.isArray(value) &&
    value.length === 5 &&
    value.every((part) => typeof part === 'number' && Number.isFinite(part))
  );
}

function isVolumePoint(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((part) => typeof part === 'number' && Number.isFinite(part))
  );
}

function CoinPriceChart({ coinId, coinName, initialData }: CoinPriceChartProps) {
  const [period, setPeriod] = useState<CoinChartPeriod>('1W');
  const [data, setData] = useState<CoinChartData | null>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const activeRequest = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      const request = activeRequest.current;
      activeRequest.current = null;
      request?.abort();
    };
  }, [coinId]);

  async function loadPeriod(nextPeriod: CoinChartPeriod, retry = false) {
    if (nextPeriod === '1W') {
      activeRequest.current?.abort();
      activeRequest.current = null;
      setPeriod(nextPeriod);
      setData(initialData);
      setIsLoading(false);
      setErrorMessage('');
      return;
    }

    if (nextPeriod === period && data && !retry) return;
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setPeriod(nextPeriod);
    setData(null);
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(
        `/api/coins/${encodeURIComponent(coinId)}/chart?period=${encodeURIComponent(nextPeriod)}`,
        { signal: controller.signal },
      );
      const result = (await response.json()) as ChartApiResponse;

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(
            'CoinGecko rate limit reached. Wait a little before retrying, or configure a Demo API key in .env.local.',
          );
        }
        if (response.status === 401 || response.status === 403) {
          throw new Error(
            'CoinGecko denied this history range. Configure a valid Demo API key in .env.local or try a shorter period.',
          );
        }
        throw new Error(result.error || `Chart history request failed (${response.status}).`);
      }

      if (!Array.isArray(result.candles) || !Array.isArray(result.volumes)) {
        throw new Error('Chart history response was incomplete.');
      }

      const chartData: CoinChartData = {
        candles: result.candles.filter(isOhlcCandle),
        volumes: result.volumes.filter(isVolumePoint),
      };
      setData(chartData);
    } catch (error) {
      if (controller.signal.aborted) return;
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load chart history.');
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setIsLoading(false);
      }
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Price chart
          </p>
          <h3 className="mt-1 text-base font-semibold">{coinName} / USD</h3>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
          <div
            aria-label="Chart period"
            className="flex max-w-full items-center gap-0.5 overflow-x-auto rounded-lg border border-border bg-background/70 p-1"
            role="group"
          >
            {COIN_CHART_PERIODS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={period === option}
                aria-label={`Show ${option} price history`}
                disabled={isLoading}
                onClick={() => void loadPeriod(option)}
                className={`shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                  period === option
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {option}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">OHLCV · REST</span>
        </div>
      </div>

      <div className="relative min-h-[380px]" aria-busy={isLoading}>
        {data && data.candles.length > 0 && (
          <CandlestickChart candles={data.candles} volumes={data.volumes} period={period} />
        )}
        {isLoading && (
          <div
            className="absolute inset-0 flex items-center justify-center rounded-lg bg-card/80 text-sm text-muted-foreground"
            role="status"
          >
            Loading {period} chart history…
          </div>
        )}
        {!isLoading && errorMessage && (
          <div className="flex min-h-[380px] flex-col items-center justify-center gap-3 text-center">
            <p className="max-w-md text-sm text-muted-foreground" role="alert">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={() => void loadPeriod(period, true)}
              className="rounded-md border border-border px-3 py-1.5 text-xs font-medium transition hover:border-primary/50 hover:text-primary"
            >
              Retry
            </button>
          </div>
        )}
        {!isLoading && !errorMessage && data?.candles.length === 0 && (
          <p className="flex min-h-[380px] items-center justify-center text-sm text-muted-foreground">
            OHLC history is not available for this period.
          </p>
        )}
      </div>
    </div>
  );
}

export default CoinPriceChart;
