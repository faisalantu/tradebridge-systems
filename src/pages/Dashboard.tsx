
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PortfolioSummary } from '@/components/dashboard/PortfolioSummary';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { Currency } from '@/types';

const Dashboard = () => {
  const [currency, setCurrency] = useState<Currency>('USD');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (!isAuthenticated) {
      navigate('/login');
    } else if (isAdmin) {
      navigate('/admin');
    }
    
    // In a real app, fetch user data including currency
    // For now, we'll mock it
    setCurrency('USD');
  }, [navigate]);

  // Mock active investments data
  const activeInvestments = [
    { id: 1, name: 'Bitcoin', symbol: 'BTC', amount: 0.35, value: 15230.40, gain: 12.5 },
    { id: 2, name: 'Apple Inc.', symbol: 'AAPL', amount: 10, value: 1875.20, gain: 5.3 },
    { id: 3, name: 'Tesla Inc.', symbol: 'TSLA', amount: 5, value: 4320.75, gain: -2.1 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back. Here's an overview of your portfolio.
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Portfolio Summary Cards */}
            <PortfolioSummary currency={currency} />
            
            {/* Performance Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <PerformanceChart currency={currency} />
              </div>
              
              {/* Active Investments */}
              <div>
                <div className="bg-background rounded-lg border shadow-sm overflow-hidden h-full">
                  <div className="p-6 border-b">
                    <h2 className="font-semibold text-lg">Active Investments</h2>
                  </div>
                  <div className="divide-y">
                    {activeInvestments.map((investment) => (
                      <div key={investment.id} className="p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{investment.name}</p>
                            <p className="text-sm text-muted-foreground">{investment.symbol}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: currency,
                              }).format(investment.value)}
                            </p>
                            <p className={`text-sm ${investment.gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {investment.gain >= 0 ? '+' : ''}
                              {investment.gain.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t">
                    <Button variant="ghost" className="w-full" asChild>
                      <Link to="/trading">
                        View Trading Platform <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background rounded-lg border shadow-sm p-6 hover-card">
                <h3 className="font-semibold mb-2">Manage Your Account</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  View your profile and deposit information.
                </p>
                <Button asChild>
                  <Link to="/wallet">Go to Wallet</Link>
                </Button>
              </div>
              
              <div className="bg-background rounded-lg border shadow-sm p-6 hover-card">
                <h3 className="font-semibold mb-2">View Deposit History</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Check your past deposit transactions.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/deposits">View Deposits</Link>
                </Button>
              </div>
              
              <div className="bg-background rounded-lg border shadow-sm p-6 hover-card">
                <h3 className="font-semibold mb-2">View Withdrawal History</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Check your past withdrawal transactions.
                </p>
                <Button variant="outline" asChild>
                  <Link to="/withdrawals">View Withdrawals</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
