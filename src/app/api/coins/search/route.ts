import { NextResponse } from 'next/server';
import { fetcher } from '@/lib/CoinGecko.action';
import type { CoinSearchResult } from '@/lib/market-data';

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q')?.trim() ?? '';
  if (query.length < 2) return NextResponse.json({ coins: [] });

  const result = await fetcher<{ coins: CoinSearchResult[] }>('search', { query }, 300);
  return NextResponse.json({ coins: result.coins.slice(0, 8) });
}
