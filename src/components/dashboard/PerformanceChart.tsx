
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Currency } from '@/types';
import { formatCurrency } from '@/utils/formatting';
import { fetchChartData, availableTimeframes } from '@/utils/api';

interface PerformanceChartProps {
  currency: Currency;
}

export function PerformanceChart({ currency }: PerformanceChartProps) {
  const [timeframe, setTimeframe] = useState<string>('24h');
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChartData = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch data for the specific user's portfolio
        const data = await fetchChartData('PORTFOLIO', timeframe as any);
        
        // Format the data for the chart
        const formattedData = data.map(item => ({
          timestamp: new Date(item.timestamp).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: timeframe === '24h' || timeframe === '1h' ? 'numeric' : undefined,
            minute: timeframe === '1h' ? 'numeric' : undefined,
            hour12: true,
          }),
          value: item.value,
        }));
        
        setChartData(formattedData);
      } catch (error) {
        console.error('Error loading chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChartData();
  }, [timeframe]);

  const handleTimeframeChange = (value: string) => {
    if (value) setTimeframe(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border border-border rounded shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-primary">
            {formatCurrency(payload[0].value, currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="smooth-transition hover-card">
      <CardHeader className="pb-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Portfolio Performance</CardTitle>
          <ToggleGroup type="single" value={timeframe} onValueChange={handleTimeframeChange} size="sm">
            {availableTimeframes.map((tf) => (
              <ToggleGroupItem key={tf.value} value={tf.value}>
                {tf.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          {isLoading ? (
            <div className="h-full w-full flex items-center justify-center">
              <div className="h-full w-full bg-muted/30 animate-pulse rounded"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis 
                  dataKey="timestamp" 
                  tick={{ fontSize: 12 }} 
                  tickMargin={10}
                  minTickGap={20}
                />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value, currency)}
                  width={70}
                  tick={{ fontSize: 12 }}
                  tickMargin={10}
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
