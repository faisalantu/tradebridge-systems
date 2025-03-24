
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Shield, Wallet, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const Index = () => {
  // Add scroll animations
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        
        if (isVisible) {
          element.classList.add('animate-fade-in');
          element.classList.remove('opacity-0');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-4 bg-gradient-to-b from-background to-secondary/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight max-w-3xl mx-auto animate-fade-in">
              Professional Trading & Investment Management
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in delay-100">
              Experienced portfolio management with a focus on long-term growth and wealth preservation. Our expert team delivers personalized investment strategies for discerning clients.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in delay-200">
              <Button size="lg" asChild>
                <Link to="/register">
                  Start Investing <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">
                  Login to Account
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16 animate-on-scroll opacity-0">
            Why Choose TradeBridge
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-lg border shadow-sm hover-card animate-on-scroll opacity-0">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Expert Management</h3>
              <p className="text-muted-foreground">
                Our team of experienced traders and financial analysts work tirelessly to maximize your portfolio's performance.
              </p>
            </div>
            
            <div className="bg-background p-8 rounded-lg border shadow-sm hover-card animate-on-scroll opacity-0 delay-100">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Security Focused</h3>
              <p className="text-muted-foreground">
                Your investments are secured with institutional-grade protections and risk management strategies.
              </p>
            </div>
            
            <div className="bg-background p-8 rounded-lg border shadow-sm hover-card animate-on-scroll opacity-0 delay-200">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">Diverse Investments</h3>
              <p className="text-muted-foreground">
                Access a wide range of investment opportunities across stocks, cryptocurrency, forex, and commodities.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16 animate-on-scroll opacity-0">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative animate-on-scroll opacity-0">
              <div className="absolute top-0 left-6 bottom-0 border-l-2 border-dashed border-muted-foreground/30 md:block hidden"></div>
              <div className="flex">
                <div className="flex-shrink-0 z-10">
                  <div className="w-12 h-12 rounded-full bg-background border border-muted flex items-center justify-center text-lg font-semibold shadow-sm">
                    1
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-medium mb-3">Create an Account</h3>
                  <p className="text-muted-foreground mb-4">
                    Register for an account with your basic information and currency preference.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/register" className="flex items-center">
                      Register Now <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="relative animate-on-scroll opacity-0 delay-100">
              <div className="absolute top-0 left-6 bottom-0 border-l-2 border-dashed border-muted-foreground/30 md:block hidden"></div>
              <div className="flex">
                <div className="flex-shrink-0 z-10">
                  <div className="w-12 h-12 rounded-full bg-background border border-muted flex items-center justify-center text-lg font-semibold shadow-sm">
                    2
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-medium mb-3">Fund Your Account</h3>
                  <p className="text-muted-foreground mb-4">
                    Deposit funds using your preferred currency through our secure banking channels.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative animate-on-scroll opacity-0 delay-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-background border border-muted flex items-center justify-center text-lg font-semibold shadow-sm">
                    3
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-medium mb-3">Grow Your Wealth</h3>
                  <p className="text-muted-foreground mb-4">
                    Our team will manage your investments and you can track your portfolio performance in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 md:p-16 text-center animate-on-scroll opacity-0">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6">
              Ready to Start Investing?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Join thousands of clients who trust TradeBridge with their investment needs. Get started today and take control of your financial future.
            </p>
            <Button size="lg" asChild>
              <Link to="/register">
                Create Your Account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
