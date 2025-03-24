
import { useState, useEffect } from 'react';
import { Pencil, ArrowUpRight, BarChart2, Calendar, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { User, Investment } from '@/types';
import { formatCurrency, formatDate, formatPercentage } from '@/utils/formatting';

const formSchema = z.object({
  userId: z.string().min(1, { message: 'User is required' }),
  type: z.enum(['stock', 'crypto', 'forex', 'commodity']),
  name: z.string().min(1, { message: 'Name is required' }),
  symbol: z.string().min(1, { message: 'Symbol is required' }),
  amount: z.number().min(1, { message: 'Amount must be greater than 0' }),
  startDate: z.string().min(1, { message: 'Start date is required' }),
  endDate: z.string().min(1, { message: 'End date is required' }),
  initialValue: z.number().min(1, { message: 'Initial value must be greater than 0' }),
  percentageGain: z.number().min(-100, { message: 'Percentage gain must be greater than -100%' }),
});

type FormValues = z.infer<typeof formSchema>;

export function InvestmentManager() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: '',
      type: 'stock',
      name: '',
      symbol: '',
      amount: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      initialValue: 0,
      percentageGain: 0,
    },
  });

  useEffect(() => {
    // Simulate API call to get users and investments
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be fetch requests to your API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Generate mock user data
        const mockUsers: User[] = Array.from({ length: 10 }, (_, i) => ({
          id: `user-${i + 1}`,
          email: `user${i + 1}@example.com`,
          fullName: `User ${i + 1}`,
          dateOfBirth: new Date().toISOString(),
          phoneNumber: `+${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 1000000000)}`,
          currency: ['GBP', 'AUD', 'USD', 'CAD'][Math.floor(Math.random() * 4)] as any,
          address: `${Math.floor(Math.random() * 100)} Example Street, City, Country`,
          status: ['pending', 'active', 'suspended'][Math.floor(Math.random() * 3)] as any,
          balance: Math.random() * 10000,
          createdAt: new Date().toISOString(),
        }));
        
        // Generate mock investment data
        const mockInvestments: Investment[] = Array.from({ length: 15 }, (_, i) => {
          const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
          const types = ['stock', 'crypto', 'forex', 'commodity'];
          const type = types[Math.floor(Math.random() * types.length)] as Investment['type'];
          
          let name, symbol;
          switch (type) {
            case 'stock':
              name = ['Apple Inc.', 'Microsoft Corp.', 'Amazon.com', 'Tesla Inc.', 'Google Inc.'][Math.floor(Math.random() * 5)];
              symbol = ['AAPL', 'MSFT', 'AMZN', 'TSLA', 'GOOGL'][Math.floor(Math.random() * 5)];
              break;
            case 'crypto':
              name = ['Bitcoin', 'Ethereum', 'Ripple', 'Cardano', 'Solana'][Math.floor(Math.random() * 5)];
              symbol = ['BTC', 'ETH', 'XRP', 'ADA', 'SOL'][Math.floor(Math.random() * 5)];
              break;
            case 'forex':
              name = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD'][Math.floor(Math.random() * 5)];
              symbol = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD'][Math.floor(Math.random() * 5)];
              break;
            case 'commodity':
              name = ['Gold', 'Silver', 'Oil', 'Natural Gas', 'Copper'][Math.floor(Math.random() * 5)];
              symbol = ['XAU', 'XAG', 'CL', 'NG', 'HG'][Math.floor(Math.random() * 5)];
              break;
            default:
              name = 'Unknown';
              symbol = 'UNK';
          }
          
          const initialValue = Math.random() * 5000 + 1000;
          const percentageGain = Math.random() * 30 - 5;
          
          return {
            id: `inv-${i + 1}`,
            userId: user.id,
            type,
            name,
            symbol,
            amount: Math.random() * 10 + 1,
            startDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            endDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
            initialValue,
            currentValue: initialValue * (1 + percentageGain / 100),
            percentageGain,
            status: Math.random() > 0.3 ? 'active' : 'closed',
          };
        });
        
        setUsers(mockUsers);
        setInvestments(mockInvestments);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load investment data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const filteredInvestments = investments.filter(investment => {
    const user = users.find(u => u.id === investment.userId);
    
    return (
      investment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user && user.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleAddInvestment = () => {
    form.reset({
      userId: '',
      type: 'stock',
      name: '',
      symbol: '',
      amount: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      initialValue: 0,
      percentageGain: 0,
    });
    setIsAddDialogOpen(true);
  };

  const handleEditInvestment = (investment: Investment) => {
    setSelectedInvestment(investment);
    form.reset({
      userId: investment.userId,
      type: investment.type,
      name: investment.name,
      symbol: investment.symbol,
      amount: investment.amount,
      startDate: new Date(investment.startDate).toISOString().split('T')[0],
      endDate: new Date(investment.endDate).toISOString().split('T')[0],
      initialValue: investment.initialValue,
      percentageGain: investment.percentageGain,
    });
    setIsEditDialogOpen(true);
  };

  const onAddSubmit = (data: FormValues) => {
    // In a real app, this would be an API call
    const newInvestment: Investment = {
      id: `inv-${Date.now()}`,
      userId: data.userId,
      type: data.type,
      name: data.name,
      symbol: data.symbol,
      amount: data.amount,
      startDate: data.startDate,
      endDate: data.endDate,
      initialValue: data.initialValue,
      currentValue: data.initialValue * (1 + data.percentageGain / 100),
      percentageGain: data.percentageGain,
      status: 'active',
    };
    
    setInvestments([...investments, newInvestment]);
    
    toast({
      title: 'Investment Added',
      description: 'The investment has been successfully added.',
    });
    
    setIsAddDialogOpen(false);
  };

  const onEditSubmit = (data: FormValues) => {
    if (!selectedInvestment) return;
    
    // In a real app, this would be an API call
    const updatedInvestments = investments.map(investment => 
      investment.id === selectedInvestment.id 
        ? { 
            ...investment, 
            ...data, 
            currentValue: data.initialValue * (1 + data.percentageGain / 100),
          } 
        : investment
    );
    
    setInvestments(updatedInvestments);
    
    toast({
      title: 'Investment Updated',
      description: 'The investment has been successfully updated.',
    });
    
    setIsEditDialogOpen(false);
  };

  const getUserName = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user ? user.fullName : 'Unknown User';
  };

  const getUserCurrency = (userId: string): string => {
    const user = users.find(u => u.id === userId);
    return user ? user.currency : 'USD';
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Investment Management</CardTitle>
        <Button onClick={handleAddInvestment} className="mt-4 sm:mt-0">
          Add Investment
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <Input
            placeholder="Search investments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="py-3 px-4 text-left font-medium">Client</th>
                  <th className="py-3 px-4 text-left font-medium">Type</th>
                  <th className="py-3 px-4 text-left font-medium">Name</th>
                  <th className="py-3 px-4 text-left font-medium">Symbol</th>
                  <th className="py-3 px-4 text-left font-medium">Amount</th>
                  <th className="py-3 px-4 text-left font-medium">Value</th>
                  <th className="py-3 px-4 text-left font-medium">Gain %</th>
                  <th className="py-3 px-4 text-left font-medium">Duration</th>
                  <th className="py-3 px-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t">
                      <td className="py-3 px-4">
                        <div className="h-5 w-32 bg-muted animate-pulse rounded"></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-5 w-20 bg-muted animate-pulse rounded"></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-5 w-32 bg-muted animate-pulse rounded"></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-5 w-24 bg-muted animate-pulse rounded"></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-5 w-32 bg-muted animate-pulse rounded"></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-5 w-8 bg-muted animate-pulse rounded"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredInvestments.length === 0 ? (
                  <tr className="border-t">
                    <td colSpan={9} className="py-8 text-center text-muted-foreground">
                      No investments found.
                    </td>
                  </tr>
                ) : (
                  filteredInvestments.map((investment) => (
                    <tr key={investment.id} className="border-t">
                      <td className="py-3 px-4 font-medium">{getUserName(investment.userId)}</td>
                      <td className="py-3 px-4 capitalize">{investment.type}</td>
                      <td className="py-3 px-4">{investment.name}</td>
                      <td className="py-3 px-4">{investment.symbol}</td>
                      <td className="py-3 px-4">{investment.amount.toFixed(4)}</td>
                      <td className="py-3 px-4">{formatCurrency(investment.currentValue, getUserCurrency(investment.userId))}</td>
                      <td className="py-3 px-4">
                        <span className={`${investment.percentageGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercentage(investment.percentageGain)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <div>{formatDate(investment.startDate)}</div>
                        <div>to</div>
                        <div>{formatDate(investment.endDate)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="icon" onClick={() => handleEditInvestment(investment)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
      
      {/* Add Investment Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Investment</DialogTitle>
            <DialogDescription>
              Allocate a new investment to a client's portfolio.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users
                          .filter(user => user.status === 'active')
                          .map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.fullName}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="stock">Stock</SelectItem>
                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        <SelectItem value="forex">Forex</SelectItem>
                        <SelectItem value="commodity">Commodity</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symbol</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.0001"
                        min="0"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="initialValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Value</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="percentageGain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gain Percentage</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="-100"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Investment</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Investment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Investment</DialogTitle>
            <DialogDescription>
              Update investment details for {getUserName(selectedInvestment?.userId || '')}.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="stock">Stock</SelectItem>
                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        <SelectItem value="forex">Forex</SelectItem>
                        <SelectItem value="commodity">Commodity</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symbol</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.0001"
                        min="0"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="initialValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Value</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="percentageGain"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gain Percentage</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="-100"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Investment</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
