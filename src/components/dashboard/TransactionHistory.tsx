
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Currency, Transaction } from '@/types';
import { formatCurrency, formatDateTime } from '@/utils/formatting';

interface TransactionHistoryProps {
  currency: Currency;
  type: 'deposit' | 'withdrawal';
}

export function TransactionHistory({ currency, type }: TransactionHistoryProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Simulate API call to get transactions
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be a fetch request to your API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Generate mock transaction data
        const mockTransactions: Transaction[] = Array.from({ length: 10 }, (_, i) => ({
          id: `tx-${Math.random().toString(36).substring(2, 10)}`,
          userId: 'user-123',
          amount: Math.random() * 5000 + 100,
          type,
          status: ['completed', 'completed', 'completed', 'pending', 'rejected'][Math.floor(Math.random() * 5)] as any,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString(),
        }));
        
        // Sort by date (newest first)
        mockTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setTransactions(mockTransactions);
      } catch (error) {
        console.error(`Error fetching ${type} history:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [type]);

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <span className="text-green-600">Completed</span>;
      case 'pending':
        return <span className="text-amber-500">Pending</span>;
      case 'rejected':
        return <span className="text-red-600">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <Card className="smooth-transition hover-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          {type === 'deposit' ? (
            <ArrowDownLeft className="mr-2 h-5 w-5 text-green-600" />
          ) : (
            <ArrowUpRight className="mr-2 h-5 w-5 text-amber-500" />
          )}
          {type === 'deposit' ? 'Deposit' : 'Withdrawal'} History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-muted h-12 rounded"></div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No {type}s found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-md transition-colors hover:bg-secondary"
              >
                <div className="flex items-center">
                  {getStatusIcon(transaction.status)}
                  <div className="ml-3">
                    <p className="font-medium">
                      {formatCurrency(transaction.amount, currency)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(transaction.createdAt)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm">{getStatusText(transaction.status)}</p>
                  <p className="text-xs text-muted-foreground text-right">
                    ID: {transaction.id.slice(0, 8)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
