'use client';

import { useEffect } from 'react';

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

function AppError({ error, reset }: AppErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const isRateLimited = error.message.includes('429');

  return (
    <main className="main-container flex flex-1 items-center justify-center py-16">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm font-medium text-red-500">MARKET DATA UNAVAILABLE</p>
        <h1 className="mt-2 text-2xl font-semibold">
          {isRateLimited ? 'CoinGecko rate limit reached' : 'Could not load market data'}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {isRateLimited
            ? 'The public API is temporarily limiting requests. Wait a little before retrying, or configure an optional CoinGecko Demo API key locally.'
            : 'The market data request failed. Check your connection and try again.'}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Retry
        </button>
      </section>
    </main>
  );
}

export default AppError;
