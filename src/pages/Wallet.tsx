
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WalletDetails } from '@/components/dashboard/WalletDetails';
import { Currency } from '@/types';

const Wallet = () => {
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
            <h1 className="text-3xl font-semibold tracking-tight">Wallet Details</h1>
            <p className="text-muted-foreground">
              Follow these instructions to deposit funds into your account.
            </p>
          </div>
          
          <WalletDetails currency={currency} />
          
          <div className="mt-8 p-6 bg-background rounded-lg border shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Deposit Instructions</h2>
            <div className="space-y-4 text-sm">
              <p>
                To ensure prompt crediting of your deposit, please follow these steps:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Transfer funds to the bank account details provided above.</li>
                <li>Always include your personal reference code in the payment reference field.</li>
                <li>After making the transfer, allow 1-3 business days for the funds to be credited to your account.</li>
                <li>For large deposits (over $10,000), please contact our support team for special instructions.</li>
              </ol>
              <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded">
                <p className="font-medium text-primary mb-1">Important Note:</p>
                <p>
                  For security reasons, we only accept deposits from bank accounts registered in your name. 
                  Deposits from third-party accounts may be rejected or delayed.
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

export default Wallet;
