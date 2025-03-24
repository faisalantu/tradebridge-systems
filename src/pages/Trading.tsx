
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TradingView } from '@/components/trading/TradingView';
import { Currency } from '@/types';

const Trading = () => {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">Trading Platform</h1>
            <p className="text-muted-foreground">
              View real-time market data and monitor your investments.
            </p>
          </div>
          
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
            <p className="font-medium">View-Only Mode</p>
            <p>
              This trading interface is for information purposes only. Actual trading is managed by our expert team.
            </p>
          </div>
          
          <TradingView currency={currency} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Trading;
