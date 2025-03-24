
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TransactionHistory } from '@/components/dashboard/TransactionHistory';
import { Currency } from '@/types';

const Withdrawals = () => {
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
            <h1 className="text-3xl font-semibold tracking-tight">Withdrawal History</h1>
            <p className="text-muted-foreground">
              View the history of all withdrawals from your account.
            </p>
          </div>
          
          <TransactionHistory currency={currency} type="withdrawal" />
          
          <div className="mt-8 p-6 bg-background rounded-lg border shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Withdrawal Information</h2>
            <div className="space-y-4 text-sm">
              <p>
                Here are some important points about withdrawals:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Withdrawal requests are processed within 3-5 business days.</li>
                <li>For security reasons, withdrawals can only be made to bank accounts registered in your name.</li>
                <li>There may be a minimum withdrawal amount depending on your account type.</li>
                <li>Large withdrawals may require additional verification for security purposes.</li>
                <li>If a withdrawal is marked as 'Pending', it means we are processing your request.</li>
                <li>If a withdrawal is marked as 'Rejected', please contact our support team for assistance.</li>
              </ul>
              <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded">
                <p className="font-medium text-primary mb-1">Need to make a withdrawal?</p>
                <p>
                  Please contact our customer support team to initiate a withdrawal request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Withdrawals;
