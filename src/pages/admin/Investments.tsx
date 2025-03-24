
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { InvestmentManager } from '@/components/admin/InvestmentManager';

const AdminInvestments = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is admin
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">Investment Management</h1>
            <p className="text-muted-foreground">
              Create and manage investments for your clients.
            </p>
          </div>
          
          <InvestmentManager />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminInvestments;
