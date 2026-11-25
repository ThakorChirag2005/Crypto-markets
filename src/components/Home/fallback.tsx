import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TRENDING_COINS_LIMIT } from '@/components/Home/TrendingCoins';

function SkeletonBlock({ className }: { className: string }) {
  return <span aria-hidden="true" className={`fallback-block ${className}`} />;
}

export function CoinOverviewFallback({ showChart = false }: { showChart?: boolean }) {
  return (
    <div className="existing-overview-fallback" role="status" aria-label="Loading Bitcoin overview">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <SkeletonBlock className="h-5 w-28" />
          <SkeletonBlock className="h-3 w-24" />
        </div>
        <div className="space-y-2 text-right">
          <SkeletonBlock className="ml-auto h-5 w-24" />
          <SkeletonBlock className="ml-auto h-4 w-16" />
        </div>
      </div>
      {showChart && <SkeletonBlock className="mt-8 h-[380px] rounded-xl" />}
    </div>
  );
}

export function GlobalMarketStatsFallback() {
  return (
    <section
      aria-label="Loading global market statistics"
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="dashboard-card p-3.5 sm:p-4">
          <SkeletonBlock className="h-4 w-28" />
          <SkeletonBlock className="mt-3 h-6 w-32" />
          <SkeletonBlock className="mt-3 h-3 w-24" />
        </div>
      ))}
    </section>
  );
}

export function TrendingCoinsFallback() {
  return (
    <div id="trending-coins-fallback" role="status" aria-label="Loading trending coins">
      <Table className="custom-scrollbar min-w-[560px]">
        <TableHeader>
          <TableRow className="hover:bg-transparent!">
            <TableHead className="bg-background/60 py-4 pl-5 text-muted-foreground">Rank</TableHead>
            <TableHead className="bg-background/60 py-4 text-muted-foreground">Coin</TableHead>
            <TableHead className="bg-background/60 py-4 text-right text-muted-foreground">
              Price
            </TableHead>
            <TableHead className="bg-background/60 py-4 text-right text-muted-foreground">
              24h
            </TableHead>
            <TableHead className="bg-background/60 py-4 text-right text-muted-foreground">
              Market cap
            </TableHead>
            <TableHead className="bg-background/60 py-4 pr-5 text-right text-muted-foreground">
              24h volume
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: TRENDING_COINS_LIMIT }, (_, index) => (
            <TableRow
              key={index}
              className="relative overflow-hidden rounded-lg border-b border-border hover:bg-accent/30!"
            >
              <TableCell className="py-4 pl-5">
                <SkeletonBlock className="h-4 w-6" />
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <SkeletonBlock className="size-8 rounded-full" />
                  <div className="space-y-2">
                    <SkeletonBlock className="h-4 w-24" />
                    <SkeletonBlock className="h-3 w-10" />
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4 text-right">
                <SkeletonBlock className="ml-auto h-4 w-20" />
              </TableCell>
              <TableCell className="py-4 text-right">
                <SkeletonBlock className="ml-auto h-4 w-14" />
              </TableCell>
              <TableCell className="py-4 text-right">
                <SkeletonBlock className="ml-auto h-4 w-20" />
              </TableCell>
              <TableCell className="py-4 pr-5">
                <SkeletonBlock className="ml-auto h-4 w-20" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function TrendingListFallback() {
  return (
    <div role="status" aria-label="Loading trending coins">
      {Array.from({ length: TRENDING_COINS_LIMIT }, (_, index) => (
        <div key={index} className="flex items-center justify-between border-b border-border py-4">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="size-4" />
            <SkeletonBlock className="size-8 rounded-full" />
            <div className="space-y-2">
              <SkeletonBlock className="h-4 w-24" />
              <SkeletonBlock className="h-3 w-10" />
            </div>
          </div>
          <div className="space-y-2">
            <SkeletonBlock className="ml-auto h-4 w-20" />
            <SkeletonBlock className="ml-auto h-3 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TopCategoriesFallback() {
  return (
    <section className="dashboard-card overflow-hidden p-5 sm:p-6" role="status">
      <SkeletonBlock className="h-3 w-32" />
      <SkeletonBlock className="mt-2 h-5 w-36" />
      <div className="mt-6 space-y-4">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="flex items-center justify-between border-t border-border pt-4"
          >
            <SkeletonBlock className="h-4 w-36" />
            <SkeletonBlock className="h-4 w-20" />
          </div>
        ))}
      </div>
    </section>
  );
}
