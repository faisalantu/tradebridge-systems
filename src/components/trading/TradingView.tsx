
import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, ChevronDown, Star, Clock, BarChart2, Percent } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Currency, MarketData, ChartTimeframe } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/formatting';
import { fetchMarketData, fetchChartData, availableTimeframes } from '@/utils/api';

interface TradingViewProps {
  currency: Currency;
}

const markets = [
  { name: 'Ethereum', symbol: 'ETHUSDT' },
  { name: 'Bitcoin', symbol: 'BTCUSDT' },
  { name: 'Solana', symbol: 'SOLUSDT' },
  { name: 'Cardano', symbol: 'ADAUSDT' },
  { name: 'Binance Coin', symbol: 'BNBUSDT' },
  { name: 'Apple', symbol: 'AAPL' },
  { name: 'Microsoft', symbol: 'MSFT' },
  { name: 'Amazon', symbol: 'AMZN' },
  { name: 'Tesla', symbol: 'TSLA' },
  { name: 'Google', symbol: 'GOOGL' },
];

export function TradingView({ currency }: TradingViewProps) {
  const [selectedMarket, setSelectedMarket] = useState(markets[0]);
  const [timeframe, setTimeframe] = useState<ChartTimeframe['value']>('24h');
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoadingMarket, setIsLoadingMarket] = useState(true);
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [activeTab, setActiveTab] = useState('chart');

  useEffect(() => {
    const loadMarketData = async () => {
      setIsLoadingMarket(true);
      try {
        const data = await fetchMarketData(selectedMarket.symbol);
        setMarketData(data);
      } catch (error) {
        console.error('Error loading market data:', error);
      } finally {
        setIsLoadingMarket(false);
      }
    };

    loadMarketData();
    
    // Set up interval to refresh data
    const intervalId = setInterval(loadMarketData, 15000);
    
    return () => clearInterval(intervalId);
  }, [selectedMarket]);

  useEffect(() => {
    const loadChartData = async () => {
      setIsLoadingChart(true);
      try {
        const data = await fetchChartData(selectedMarket.symbol, timeframe);
        
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
        setIsLoadingChart(false);
      }
    };

    loadChartData();
  }, [selectedMarket, timeframe]);

  const handleMarketChange = (value: string) => {
    const market = markets.find(m => m.symbol === value);
    if (market) {
      setSelectedMarket(market);
    }
  };

  const handleTimeframeChange = (value: string) => {
    if (value) setTimeframe(value as ChartTimeframe['value']);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border border-border rounded shadow-lg">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-primary">
            {formatCurrency(payload[0].value, 'USD')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Left sidebar */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardContent className="p-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Markets</h3>
                <Select value={selectedMarket.symbol} onValueChange={handleMarketChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a market" />
                  </SelectTrigger>
                  <SelectContent>
                    {markets.map((market) => (
                      <SelectItem key={market.symbol} value={market.symbol}>
                        {market.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Popular Markets</h3>
                {markets.slice(0, 5).map((market) => (
                  <div 
                    key={market.symbol}
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-secondary transition-colors ${
                      selectedMarket.symbol === market.symbol ? 'bg-secondary' : ''
                    }`}
                    onClick={() => handleMarketChange(market.symbol)}
                  >
                    <div className="flex items-center">
                      <Star className={`h-4 w-4 mr-2 ${selectedMarket.symbol === market.symbol ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`} />
                      <div>
                        <p className="font-medium text-sm">{market.name}</p>
                        <p className="text-xs text-muted-foreground">{market.symbol}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main content */}
      <div className="lg:col-span-3 space-y-4">
        {/* Market header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-background rounded-lg border">
          <div>
            <div className="flex items-center">
              <h2 className="text-2xl font-semibold">{selectedMarket.name}</h2>
              <span className="ml-2 text-sm text-muted-foreground">{selectedMarket.symbol}</span>
            </div>
            
            {isLoadingMarket ? (
              <div className="h-6 w-32 bg-muted animate-pulse rounded mt-1"></div>
            ) : marketData ? (
              <div className="flex items-center mt-1">
                <span className="text-xl font-semibold">
                  {formatCurrency(marketData.price, 'USD')}
                </span>
                <span className={`ml-2 text-sm flex items-center ${marketData.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {marketData.changePercent >= 0 ? (
                    <ArrowUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 mr-1" />
                  )}
                  {formatPercentage(marketData.changePercent)}
                </span>
              </div>
            ) : null}
          </div>
          
          <div className="flex-shrink-0">
            <ToggleGroup type="single" value={timeframe} onValueChange={handleTimeframeChange} size="sm">
              {availableTimeframes.map((tf) => (
                <ToggleGroupItem key={tf.value} value={tf.value}>
                  {tf.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
        
        {/* Chart and data */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="chart" className="flex-1">
              <BarChart2 className="h-4 w-4 mr-2" />
              Chart
            </TabsTrigger>
            <TabsTrigger value="orderbook" className="flex-1">
              <Clock className="h-4 w-4 mr-2" />
              Order Book
            </TabsTrigger>
            <TabsTrigger value="trades" className="flex-1">
              <Percent className="h-4 w-4 mr-2" />
              Recent Trades
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart" className="bg-background rounded-lg border p-0 overflow-hidden">
            <div className="h-[500px] w-full">
              {isLoadingChart ? (
                <div className="h-full w-full flex items-center justify-center">
                  <div className="h-full w-full bg-muted/30 animate-pulse rounded"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                    <XAxis 
                      dataKey="timestamp" 
                      tick={{ fontSize: 12 }} 
                      tickMargin={10}
                      minTickGap={30}
                    />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value, 'USD')}
                      width={80}
                      tick={{ fontSize: 12 }}
                      tickMargin={10}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
            
            {/* Mock trading interface */}
            <div className="p-4 border-t">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-green-600">Buy {selectedMarket.symbol.replace('USDT', '')}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="w-full" disabled>
                      Market
                    </Button>
                    <Button variant="outline" className="w-full" disabled>
                      Limit
                    </Button>
                  </div>
                  <div className="opacity-50">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Amount</span>
                      <span>USD</span>
                    </div>
                    <input
                      type="text"
                      className="w-full p-2 border border-input rounded"
                      placeholder="0.00"
                      disabled
                    />
                    <div className="flex justify-between text-sm mt-3 mb-1">
                      <span>Total</span>
                      <span>USD</span>
                    </div>
                    <input
                      type="text"
                      className="w-full p-2 border border-input rounded"
                      placeholder="0.00"
                      disabled
                    />
                    <Button className="w-full mt-3 bg-green-600 hover:bg-green-700" disabled>
                      Buy {selectedMarket.symbol.replace('USDT', '')}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-red-600">Sell {selectedMarket.symbol.replace('USDT', '')}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="w-full" disabled>
                      Market
                    </Button>
                    <Button variant="outline" className="w-full" disabled>
                      Limit
                    </Button>
                  </div>
                  <div className="opacity-50">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Amount</span>
                      <span>USD</span>
                    </div>
                    <input
                      type="text"
                      className="w-full p-2 border border-input rounded"
                      placeholder="0.00"
                      disabled
                    />
                    <div className="flex justify-between text-sm mt-3 mb-1">
                      <span>Total</span>
                      <span>USD</span>
                    </div>
                    <input
                      type="text"
                      className="w-full p-2 border border-input rounded"
                      placeholder="0.00"
                      disabled
                    />
                    <Button className="w-full mt-3 bg-red-600 hover:bg-red-700" disabled>
                      Sell {selectedMarket.symbol.replace('USDT', '')}
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-muted rounded">
                <p className="text-sm text-center font-medium">
                  This is a read-only trading view. Actual trading features are not available.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="orderbook">
            <Card>
              <CardContent className="p-4">
                <div className="min-h-[400px] flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Order book functionality is not available in the view-only mode.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trades">
            <Card>
              <CardContent className="p-4">
                <div className="min-h-[400px] flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Recent trades functionality is not available in the view-only mode.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Market info */}
        {marketData && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">24h High</p>
                <p className="text-lg font-semibold">{formatCurrency(marketData.high, 'USD')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">24h Low</p>
                <p className="text-lg font-semibold">{formatCurrency(marketData.low, 'USD')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">24h Volume</p>
                <p className="text-lg font-semibold">{marketData.volume.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">24h Change</p>
                <p className={`text-lg font-semibold flex items-center ${marketData.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {marketData.changePercent >= 0 ? (
                    <ArrowUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 mr-1" />
                  )}
                  {formatPercentage(marketData.changePercent)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
