
import { useState, useEffect } from 'react';
import { Copy, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Currency, BankDetails } from '@/types';
import { getBankDetailsLabels } from '@/utils/formatting';

interface WalletDetailsProps {
  currency: Currency;
}

export function WalletDetails({ currency }: WalletDetailsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call to get bank details
    const fetchBankDetails = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be a fetch request to your API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Mocked bank details based on currency
        let details: BankDetails = {
          currency,
          accountName: 'TradeBridge Systems Ltd',
          reference: `TB-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        };
        
        switch (currency) {
          case 'GBP':
            details = {
              ...details,
              accountNumber: '12345678',
              sortCode: '12-34-56',
            };
            break;
          case 'AUD':
            details = {
              ...details,
              bsb: '062-000',
              accountNumber: '12345678',
            };
            break;
          case 'CAD':
            details = {
              ...details,
              institutionNumber: '001',
              branchTransitNumber: '12345',
              accountNumber: '1234567',
              bic: 'BOFMCAM2',
            };
            break;
          case 'USD':
            details = {
              ...details,
              accountNumber: '12345678901',
              bankAddress: '123 Wall Street, New York, NY 10001',
              routingNumber: '021000021',
            };
            break;
        }
        
        setBankDetails(details);
      } catch (error) {
        console.error('Error fetching bank details:', error);
        toast({
          title: 'Error',
          description: 'Unable to load bank details. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBankDetails();
  }, [currency, toast]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast({
      title: 'Copied to clipboard',
      description: `${fieldName} has been copied to your clipboard.`,
    });
    
    setTimeout(() => {
      setCopiedField(null);
    }, 3000);
  };

  if (isLoading || !bankDetails) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="animate-pulse bg-muted h-6 w-48 rounded"></CardTitle>
          <CardDescription className="animate-pulse bg-muted h-4 w-72 rounded mt-2"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-muted h-12 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const labels = getBankDetailsLabels(currency);

  return (
    <Card className="smooth-transition hover-card">
      <CardHeader>
        <CardTitle>Deposit Instructions</CardTitle>
        <CardDescription>
          To fund your account, please send a bank transfer to the account details below.
          Make sure to include your reference code in the payment reference field.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Account Name</p>
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                <p className="font-medium">{bankDetails.accountName}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(bankDetails.accountName, 'Account Name')}
                >
                  {copiedField === 'Account Name' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            {currency === 'GBP' && (
              <>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{labels.sortCode}</p>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                    <p className="font-medium">{bankDetails.sortCode}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(bankDetails.sortCode!, labels.sortCode!)}
                    >
                      {copiedField === labels.sortCode ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{labels.accountNumber}</p>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                    <p className="font-medium">{bankDetails.accountNumber}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(bankDetails.accountNumber!, labels.accountNumber!)}
                    >
                      {copiedField === labels.accountNumber ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
            
            {currency === 'AUD' && (
              <>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{labels.bsb}</p>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                    <p className="font-medium">{bankDetails.bsb}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(bankDetails.bsb!, labels.bsb!)}
                    >
                      {copiedField === labels.bsb ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{labels.accountNumber}</p>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                    <p className="font-medium">{bankDetails.accountNumber}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(bankDetails.accountNumber!, labels.accountNumber!)}
                    >
                      {copiedField === labels.accountNumber ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
            
            {currency === 'CAD' && (
              <>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{labels.institutionNumber}</p>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                    <p className="font-medium">{bankDetails.institutionNumber}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(bankDetails.institutionNumber!, labels.institutionNumber!)}
                    >
                      {copiedField === labels.institutionNumber ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{labels.branchTransitNumber}</p>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                    <p className="font-medium">{bankDetails.branchTransitNumber}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(bankDetails.branchTransitNumber!, labels.branchTransitNumber!)}
                    >
                      {copiedField === labels.branchTransitNumber ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{labels.accountNumber}</p>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                    <p className="font-medium">{bankDetails.accountNumber}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(bankDetails.accountNumber!, labels.accountNumber!)}
                    >
                      {copiedField === labels.accountNumber ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{labels.bic}</p>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                    <p className="font-medium">{bankDetails.bic}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(bankDetails.bic!, labels.bic!)}
                    >
                      {copiedField === labels.bic ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
            
            {currency === 'USD' && (
              <>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{labels.bankAddress}</p>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                    <p className="font-medium">{bankDetails.bankAddress}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(bankDetails.bankAddress!, labels.bankAddress!)}
                    >
                      {copiedField === labels.bankAddress ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{labels.accountNumber}</p>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                    <p className="font-medium">{bankDetails.accountNumber}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(bankDetails.accountNumber!, labels.accountNumber!)}
                    >
                      {copiedField === labels.accountNumber ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{labels.routingNumber}</p>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                    <p className="font-medium">{bankDetails.routingNumber}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(bankDetails.routingNumber!, labels.routingNumber!)}
                    >
                      {copiedField === labels.routingNumber ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-md">
            <h3 className="text-sm font-medium mb-2">Important: Your Personal Reference Code</h3>
            <div className="flex items-center justify-between p-3 bg-background rounded-md">
              <p className="font-bold text-primary">{bankDetails.reference}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(bankDetails.reference, 'Reference Code')}
                className="ml-4"
              >
                {copiedField === 'Reference Code' ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Always include this reference code when making a deposit so we can correctly allocate funds to your account.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
