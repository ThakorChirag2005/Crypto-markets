import { fetcher } from '@/lib/CoinGecko.action';
import type { CoinChartDays } from '@/lib/chart-periods';

export type MarketCoin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  market_cap_rank: number | null;
  current_price: number;
  market_cap: number | null;
  total_volume: number | null;
  price_change_percentage_24h: number | null;
};

export type CoinDetails = {
  id: string;
  name: string;
  symbol: string;
  image: {
    large: string;
  };
  description: {
    en: string;
  };
  market_cap_rank: number | null;
  links?: {
    homepage?: string[];
    blockchain_site?: string[];
    subreddit_url?: string;
  };
  market_data: {
    current_price: Record<string, number>;
    market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    price_change_percentage_24h: number | null;
    high_24h: Record<string, number>;
    low_24h: Record<string, number>;
  };
};

export type GlobalMarketData = {
  data: {
    active_cryptocurrencies: number;
    markets: number;
    total_market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    market_cap_percentage: Record<string, number>;
    market_cap_change_percentage_24h_usd: number;
  };
};

export type OhlcCandle = [number, number, number, number, number];

export type MarketChartData = {
  total_volumes: [number, number][];
};

export type CoinSearchResult = {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
};

export type CoinCategory = {
  id: string;
  name: string;
  market_cap: number | null;
  market_cap_change_24h: number | null;
  volume_24h: number | null;
  top_3_coins: string[];
};

export async function fetchGlobalMarketData() {
  return fetcher<GlobalMarketData>('global');
}

export async function fetchCoinCategories() {
  return fetcher<CoinCategory[]>('coins/categories', {
    order: 'market_cap_desc',
  });
}

export async function fetchMarketCoins(
  vsCurrency = 'usd',
  perPage = 50,
  order = 'market_cap_desc',
) {
  return fetcher<MarketCoin[]>('coins/markets', {
    vs_currency: vsCurrency,
    order,
    per_page: perPage,
    page: 1,
    sparkline: false,
    price_change_percentage: '24h',
  });
}

export async function fetchCoinDetails(id: string) {
  return fetcher<CoinDetails>(`coins/${encodeURIComponent(id)}`, {
    localization: false,
    tickers: false,
    market_data: true,
    community_data: false,
    developer_data: false,
    sparkline: false,
  });
}

export async function fetchCoinOhlc(id: string, days: CoinChartDays = 7) {
  return fetcher<OhlcCandle[]>(`coins/${encodeURIComponent(id)}/ohlc`, {
    vs_currency: 'usd',
    days,
  });
}

export async function fetchCoinMarketChart(id: string, days: CoinChartDays = 7) {
  return fetcher<MarketChartData>(`coins/${encodeURIComponent(id)}/market_chart`, {
    vs_currency: 'usd',
    days,
  });
}
