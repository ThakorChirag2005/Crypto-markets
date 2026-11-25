'use client';

import {
  CandlestickSeries,
  ColorType,
  createChart,
  HistogramSeries,
  type UTCTimestamp,
} from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import type { CoinChartPeriod } from '@/lib/chart-periods';
import type { OhlcCandle } from '@/lib/market-data';

type CandlestickChartProps = {
  candles: OhlcCandle[];
  volumes: [number, number][];
  period: CoinChartPeriod;
};

function CandlestickChart({ candles, volumes, period }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      width: container.clientWidth,
      height: 380,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#97a4a4',
      },
      grid: {
        vertLines: { color: 'rgba(148, 164, 164, 0.08)' },
        horzLines: { color: 'rgba(148, 164, 164, 0.08)' },
      },
      rightPriceScale: { borderColor: 'rgba(148, 164, 164, 0.16)' },
      timeScale: {
        borderColor: 'rgba(148, 164, 164, 0.16)',
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        vertLine: { color: 'rgba(139, 215, 109, 0.4)' },
        horzLine: { color: 'rgba(139, 215, 109, 0.4)' },
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#8bd76d',
      downColor: '#f05b67',
      borderVisible: false,
      wickUpColor: '#8bd76d',
      wickDownColor: '#f05b67',
    });
    series.setData(
      candles.map(([time, open, high, low, close]) => ({
        time: Math.floor(time / 1000) as UTCTimestamp,
        open,
        high,
        low,
        close,
      })),
    );

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
      priceLineVisible: false,
      lastValueVisible: false,
    });
    chart.priceScale('volume').applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
      visible: false,
    });

    const volumePoints = volumes
      .map(([time, value]) => ({ time: Math.floor(time / 1000), value }))
      .sort((a, b) => a.time - b.time);
    let volumeIndex = 0;
    volumeSeries.setData(
      candles.map((candle) => {
        const [time, open, , , close] = candle;
        const candleTime = Math.floor(time / 1000);
        while (
          volumeIndex + 1 < volumePoints.length &&
          Math.abs(volumePoints[volumeIndex + 1].time - candleTime) <=
            Math.abs(volumePoints[volumeIndex].time - candleTime)
        ) {
          volumeIndex += 1;
        }

        return {
          time: candleTime as UTCTimestamp,
          value: volumePoints[volumeIndex]?.value ?? 0,
          color: close >= open ? 'rgba(139, 215, 109, 0.36)' : 'rgba(240, 91, 103, 0.36)',
        };
      }),
    );
    chart.timeScale().fitContent();

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (entry) chart.applyOptions({ width: Math.floor(entry.contentRect.width) });
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [candles, volumes]);

  return (
    <div
      ref={chartContainerRef}
      className="min-h-[380px] w-full"
      aria-label={`${period} OHLCV candlestick chart`}
    />
  );
}

export default CandlestickChart;
