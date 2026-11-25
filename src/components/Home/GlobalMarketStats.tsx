import { fetchGlobalMarketData } from '@/lib/market-data';

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

async function GlobalMarketStats() {
  const { data } = await fetchGlobalMarketData();
  const cards = [
    {
      label: 'Total market cap',
      value: compactCurrencyFormatter.format(data.total_market_cap.usd),
      detail: `${data.market_cap_change_percentage_24h_usd >= 0 ? '+' : ''}${data.market_cap_change_percentage_24h_usd.toFixed(2)}% today`,
      positive: data.market_cap_change_percentage_24h_usd >= 0,
    },
    {
      label: '24h trading volume',
      value: compactCurrencyFormatter.format(data.total_volume.usd),
      detail: `${numberFormatter.format(data.markets)} tracked markets`,
    },
    {
      label: 'Bitcoin dominance',
      value: `${data.market_cap_percentage.btc.toFixed(1)}%`,
      detail: 'of total crypto market cap',
    },
    {
      label: 'Cryptocurrencies',
      value: numberFormatter.format(data.active_cryptocurrencies),
      detail: 'tracked assets worldwide',
    },
  ];

  return (
    <section
      aria-label="Global crypto market statistics"
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {cards.map((card) => (
        <article key={card.label} className="dashboard-card p-3.5 sm:p-4">
          <p className="text-xs text-muted-foreground">{card.label}</p>
          <p className="mt-1.5 text-lg font-semibold tracking-tight">{card.value}</p>
          <p
            className={`mt-1 text-[11px] ${card.positive === undefined ? 'text-muted-foreground' : card.positive ? 'text-emerald-400' : 'text-red-400'}`}
          >
            {card.detail}
          </p>
        </article>
      ))}
    </section>
  );
}

export default GlobalMarketStats;
