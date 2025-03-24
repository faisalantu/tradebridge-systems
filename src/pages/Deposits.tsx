
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TransactionHistory } from '@/components/dashboard/TransactionHistory';
import { Currency } from '@/types';

const Deposits = () => {
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
        <div className="container mx-auto max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">Deposit History</h1>
            <p className="text-muted-foreground">
              View the history of all deposits made to your account.
            </p>
          </div>
          
          <TransactionHistory currency={currency} type="deposit" />
          
          <div className="mt-8 p-6 bg-background rounded-lg border shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Deposit Information</h2>
            <div className="space-y-4 text-sm">
              <p>
                Here are some important points about deposits:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Deposits are usually processed within 1-3 business days.</li>
                <li>If a deposit is marked as 'Pending', it means we are in the process of verifying the transaction.</li>
                <li>If a deposit is marked as 'Rejected', there may have been an issue with the transaction. Please contact our support team for assistance.</li>
                <li>For questions about specific deposits, please include the transaction ID when contacting support.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Deposits;
