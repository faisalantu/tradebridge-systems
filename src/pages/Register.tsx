
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RegisterForm } from '@/components/auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
            <p className="text-muted-foreground mt-2">
              Fill in your details to register for a TradeBridge account
            </p>
          </div>
          
          <div className="bg-background rounded-lg border shadow-sm p-8">
            <div className="p-4 mb-6 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
              <p className="font-medium">Important Note:</p>
              <p>
                After registration, your account will need to be activated by our team.
                Please contact us after submitting your registration to complete the process.
              </p>
            </div>
            
            <RegisterForm />
            
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              By registering, you agree to our{' '}
              <Link to="/terms" className="hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
