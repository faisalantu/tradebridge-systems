
import { useState, useEffect } from 'react';
import { Check, X, Edit, Trash2, UserCheck, UserX, Wallet } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { User, Currency, BankDetails } from '@/types';
import { formatCurrency, formatDate, getBankDetailsLabels } from '@/utils/formatting';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const formSchema = z.object({
  balance: z.number().min(0, { message: 'Balance must be a positive number' }),
  status: z.enum(['pending', 'active', 'suspended']),
});

const bankDetailsSchema = z.object({
  accountName: z.string().min(1, { message: 'Account name is required' }),
  accountNumber: z.string().min(1, { message: 'Account number is required' }),
  sortCode: z.string().optional(),
  bsb: z.string().optional(),
  institutionNumber: z.string().optional(),
  branchTransitNumber: z.string().optional(),
  bic: z.string().optional(),
  bankAddress: z.string().optional(),
  routingNumber: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type BankDetailsFormValues = z.infer<typeof bankDetailsSchema>;

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBankDetailsDialogOpen, setIsBankDetailsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      balance: 0,
      status: 'pending',
    },
  });

  const bankDetailsForm = useForm<BankDetailsFormValues>({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      accountName: '',
      accountNumber: '',
    },
  });

  useEffect(() => {
    // Simulate API call to get users
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be a fetch request to your API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Generate mock user data
        const mockUsers: User[] = Array.from({ length: 20 }, (_, i) => {
          const currencies: Currency[] = ['GBP', 'AUD', 'USD', 'CAD'];
          const statuses: User['status'][] = ['pending', 'active', 'suspended'];
          
          return {
            id: `user-${i + 1}`,
            email: `user${i + 1}@example.com`,
            fullName: `User ${i + 1}`,
            dateOfBirth: new Date(Date.now() - (20 + i) * 365 * 24 * 60 * 60 * 1000).toISOString(),
            phoneNumber: `+${Math.floor(Math.random() * 100)} ${Math.floor(Math.random() * 1000000000)}`,
            currency: currencies[Math.floor(Math.random() * currencies.length)],
            address: `${Math.floor(Math.random() * 100)} Example Street, City, Country`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            balance: Math.random() * 10000,
            createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
          };
        });
        
        setUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: 'Error',
          description: 'Failed to load users.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    form.reset({
      balance: user.balance,
      status: user.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleSetBankDetails = (user: User) => {
    setSelectedUser(user);
    bankDetailsForm.reset();
    setIsBankDetailsDialogOpen(true);
  };

  const onEditSubmit = (data: FormValues) => {
    if (!selectedUser) return;
    
    // In a real app, this would be an API call
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id ? { ...user, ...data } : user
    );
    setUsers(updatedUsers);
    
    toast({
      title: 'User Updated',
      description: `${selectedUser.fullName}'s details have been updated.`,
    });
    
    setIsEditDialogOpen(false);
  };

  const onDeleteConfirm = () => {
    if (!selectedUser) return;
    
    // In a real app, this would be an API call
    const updatedUsers = users.filter(user => user.id !== selectedUser.id);
    setUsers(updatedUsers);
    
    toast({
      title: 'User Deleted',
      description: `${selectedUser.fullName}'s account has been deleted.`,
    });
    
    setIsDeleteDialogOpen(false);
  };

  const onBankDetailsSubmit = (data: BankDetailsFormValues) => {
    if (!selectedUser) return;
    
    // In a real app, this would be an API call to update the user's bank details
    toast({
      title: 'Bank Details Updated',
      description: `Bank details for ${selectedUser.fullName} have been updated.`,
    });
    
    setIsBankDetailsDialogOpen(false);
  };

  const handleActivateUser = (user: User) => {
    // In a real app, this would be an API call
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, status: 'active' } : u
    );
    setUsers(updatedUsers);
    
    toast({
      title: 'User Activated',
      description: `${user.fullName}'s account has been activated.`,
    });
  };

  const handleSuspendUser = (user: User) => {
    // In a real app, this would be an API call
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, status: 'suspended' } : u
    );
    setUsers(updatedUsers);
    
    toast({
      title: 'User Suspended',
      description: `${user.fullName}'s account has been suspended.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <Input
            placeholder="Search users..."
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
                  <th className="py-3 px-4 text-left font-medium">Name</th>
                  <th className="py-3 px-4 text-left font-medium">Email</th>
                  <th className="py-3 px-4 text-left font-medium">Currency</th>
                  <th className="py-3 px-4 text-left font-medium">Status</th>
                  <th className="py-3 px-4 text-left font-medium">Balance</th>
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
                        <div className="h-5 w-40 bg-muted animate-pulse rounded"></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-5 w-12 bg-muted animate-pulse rounded"></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-5 w-20 bg-muted animate-pulse rounded"></div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-5 w-28 bg-muted animate-pulse rounded"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr className="border-t">
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="py-3 px-4 flex items-center">
                        <span className="font-medium">{user.fullName}</span>
                      </td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">{user.currency}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : user.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {formatCurrency(user.balance, user.currency)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDeleteUser(user)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleSetBankDetails(user)}>
                            <Wallet className="h-4 w-4" />
                          </Button>
                          {user.status === 'pending' && (
                            <Button variant="outline" size="icon" onClick={() => handleActivateUser(user)} className="text-green-600">
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          )}
                          {user.status === 'active' && (
                            <Button variant="outline" size="icon" onClick={() => handleSuspendUser(user)} className="text-red-600">
                              <UserX className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details for {selectedUser?.fullName}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Balance ({selectedUser?.currency})</FormLabel>
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.fullName}'s account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={onDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bank Details Dialog */}
      <Dialog open={isBankDetailsDialogOpen} onOpenChange={setIsBankDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Bank Details</DialogTitle>
            <DialogDescription>
              Update bank details for {selectedUser?.fullName} ({selectedUser?.currency})
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <Form {...bankDetailsForm}>
              <form onSubmit={bankDetailsForm.handleSubmit(onBankDetailsSubmit)} className="space-y-4">
                <FormField
                  control={bankDetailsForm.control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {selectedUser.currency === 'GBP' && (
                  <>
                    <FormField
                      control={bankDetailsForm.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={bankDetailsForm.control}
                      name="sortCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sort Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                {selectedUser.currency === 'AUD' && (
                  <>
                    <FormField
                      control={bankDetailsForm.control}
                      name="bsb"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>BSB</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={bankDetailsForm.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                {selectedUser.currency === 'CAD' && (
                  <>
                    <FormField
                      control={bankDetailsForm.control}
                      name="institutionNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Institution Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={bankDetailsForm.control}
                      name="branchTransitNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch Transit Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={bankDetailsForm.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={bankDetailsForm.control}
                      name="bic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>BIC</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                {selectedUser.currency === 'USD' && (
                  <>
                    <FormField
                      control={bankDetailsForm.control}
                      name="bankAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={bankDetailsForm.control}
                      name="accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={bankDetailsForm.control}
                      name="routingNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Routing Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsBankDetailsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Bank Details</Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
