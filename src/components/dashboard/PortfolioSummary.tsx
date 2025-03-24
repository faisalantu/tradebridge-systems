
import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, BarChart3, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Currency } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/formatting';

interface PortfolioSummaryProps {
  currency: Currency;
}

export function PortfolioSummary({ currency }: PortfolioSummaryProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    totalDeposits: 0,
    currentBalance: 0,
    totalGainPercentage: 0,
    dailyGainPercentage: 0,
  });

  useEffect(() => {
    // Simulate API call to get portfolio data
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be a fetch request to your API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        setData({
          totalDeposits: 25000,
          currentBalance: 27582.43,
          totalGainPercentage: 10.33,
          dailyGainPercentage: 1.2,
        });
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="overflow-hidden smooth-transition hover-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <Wallet className="mr-2 h-4 w-4" />
            Total Deposits
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-6 w-24 bg-muted animate-pulse rounded"></div>
          ) : (
            <p className="text-2xl font-semibold">
              {formatCurrency(data.totalDeposits, currency)}
            </p>
          )}
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden smooth-transition hover-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Portfolio Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-6 w-24 bg-muted animate-pulse rounded"></div>
          ) : (
            <p className="text-2xl font-semibold">
              {formatCurrency(data.currentBalance, currency)}
            </p>
          )}
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden smooth-transition hover-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <ArrowUp className="mr-2 h-4 w-4" />
            Total Gain
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-6 w-24 bg-muted animate-pulse rounded"></div>
          ) : (
            <p className={`text-2xl font-semibold ${data.totalGainPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(data.totalGainPercentage)}
              <span className="ml-1 text-xs">
                {data.totalGainPercentage >= 0 ? (
                  <ArrowUp className="inline h-3 w-3" />
                ) : (
                  <ArrowDown className="inline h-3 w-3" />
                )}
              </span>
            </p>
          )}
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden smooth-transition hover-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <ArrowUp className="mr-2 h-4 w-4" />
            24h Change
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-6 w-24 bg-muted animate-pulse rounded"></div>
          ) : (
            <p className={`text-2xl font-semibold ${data.dailyGainPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(data.dailyGainPercentage)}
              <span className="ml-1 text-xs">
                {data.dailyGainPercentage >= 0 ? (
                  <ArrowUp className="inline h-3 w-3" />
                ) : (
                  <ArrowDown className="inline h-3 w-3" />
                )}
              </span>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
