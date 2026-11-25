export type TrendingCoin = {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  large: string;
  market_cap_rank: number;
  current_price: number;
  price_change_percentage_24h: number;
};

const localCoinImage = '/favicon.ico';

export const dummyTrendingCoins: TrendingCoin[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'btc',
    thumb: localCoinImage,
    large: localCoinImage,
    market_cap_rank: 1,
    current_price: 67432.18,
    price_change_percentage_24h: 2.84,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'eth',
    thumb: localCoinImage,
    large: localCoinImage,
    market_cap_rank: 2,
    current_price: 3521.64,
    price_change_percentage_24h: 1.27,
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'sol',
    thumb: localCoinImage,
    large: localCoinImage,
    market_cap_rank: 5,
    current_price: 148.92,
    price_change_percentage_24h: -0.63,
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ada',
    thumb: localCoinImage,
    large: localCoinImage,
    market_cap_rank: 10,
    current_price: 0.46,
    price_change_percentage_24h: -1.14,
  },
];
