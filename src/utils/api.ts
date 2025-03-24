
import { MarketData, ChartData, ChartTimeframe } from '@/types';

// Mock API for market data
export const fetchMarketData = async (symbol: string): Promise<MarketData> => {
  // For demonstration - in a real app, this would call an actual API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        symbol,
        price: Math.random() * 1000 + 100,
        change: Math.random() * 10 - 5,
        changePercent: Math.random() * 5 - 2.5,
        high: Math.random() * 1000 + 200,
        low: Math.random() * 1000,
        volume: Math.random() * 10000000,
      });
    }, 500);
  });
};

// Mock API for chart data
export const fetchChartData = async (
  symbol: string,
  timeframe: ChartTimeframe['value']
): Promise<ChartData[]> => {
  // For demonstration - in a real app, this would call an actual API
  return new Promise((resolve) => {
    const now = Date.now();
    const data: ChartData[] = [];
    
    let interval: number;
    let points: number;
    
    switch (timeframe) {
      case '1h':
        interval = 60 * 1000; // 1 minute
        points = 60;
        break;
      case '24h':
        interval = 15 * 60 * 1000; // 15 minutes
        points = 96;
        break;
      case '7d':
        interval = 60 * 60 * 1000; // 1 hour
        points = 168;
        break;
      case '30d':
        interval = 6 * 60 * 60 * 1000; // 6 hours
        points = 120;
        break;
      case '90d':
        interval = 24 * 60 * 60 * 1000; // 1 day
        points = 90;
        break;
      case '1y':
        interval = 7 * 24 * 60 * 60 * 1000; // 1 week
        points = 52;
        break;
      case 'all':
        interval = 30 * 24 * 60 * 60 * 1000; // 1 month
        points = 36;
        break;
      default:
        interval = 60 * 60 * 1000; // 1 hour
        points = 24;
    }
    
    let lastValue = Math.random() * 500 + 500;
    
    for (let i = points; i > 0; i--) {
      const timestamp = now - i * interval;
      // Generate somewhat realistic price movements
      const change = (Math.random() - 0.48) * 20;
      lastValue = Math.max(10, lastValue + change);
      
      data.push({
        timestamp,
        value: lastValue,
      });
    }
    
    setTimeout(() => {
      resolve(data);
    }, 500);
  });
};

// Available timeframes for charts
export const availableTimeframes: ChartTimeframe[] = [
  { label: '1H', value: '1h' },
  { label: '24H', value: '24h' },
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
  { label: '1Y', value: '1y' },
  { label: 'All', value: 'all' },
];
