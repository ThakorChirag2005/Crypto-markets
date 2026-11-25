import Image from 'next/image';
import { fetchCoinCategories } from '@/lib/market-data';

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 2,
});

async function TopCategories() {
  const categories = (await fetchCoinCategories()).slice(0, 5);

  return (
    <section className="dashboard-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Explore the market
          </p>
          <h2 className="mt-1 text-lg font-semibold">Top categories</h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-background/50 text-xs text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium sm:px-6">Category</th>
              <th className="px-4 py-3 font-medium">Top assets</th>
              <th className="px-4 py-3 text-right font-medium">Market cap</th>
              <th className="px-4 py-3 pr-5 text-right font-medium sm:pr-6">24h change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((category, index) => {
              const change = category.market_cap_change_24h;
              return (
                <tr key={category.id} className="transition hover:bg-accent/30">
                  <td className="px-5 py-4 sm:px-6">
                    <span className="mr-3 text-xs text-muted-foreground">{index + 1}</span>
                    <span className="font-medium">{category.name}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="flex -space-x-2">
                      {(category.top_3_coins ?? []).slice(0, 3).map((image, imageIndex) => (
                        <span
                          key={`${category.id}-${imageIndex}`}
                          className="flex size-7 items-center justify-center overflow-hidden rounded-full border-2 border-card bg-background"
                        >
                          <Image
                            src={image}
                            alt=""
                            width={24}
                            height={24}
                            unoptimized
                            className="size-6 object-contain"
                          />
                        </span>
                      ))}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right font-medium">
                    {category.market_cap === null
                      ? '—'
                      : compactCurrencyFormatter.format(category.market_cap)}
                  </td>
                  <td
                    className={`px-4 py-4 pr-5 text-right font-medium sm:pr-6 ${change === null ? 'text-muted-foreground' : change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                  >
                    {change === null ? '—' : `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TopCategories;
