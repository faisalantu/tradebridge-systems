
export type Currency = 'GBP' | 'AUD' | 'USD' | 'CAD';

export type UserStatus = 'pending' | 'active' | 'suspended';

export interface User {
  id: string;
  email: string;
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  currency: Currency;
  address: string;
  status: UserStatus;
  balance: number;
  createdAt: string;
}

export interface BankDetails {
  currency: Currency;
  accountName: string;
  accountNumber?: string;
  sortCode?: string;          // GBP
  bsb?: string;               // AUD
  institutionNumber?: string; // CAD
  branchTransitNumber?: string; // CAD
  bic?: string;               // CAD
  bankAddress?: string;       // USD
  routingNumber?: string;     // USD
  reference: string;          // For all currencies
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Investment {
  id: string;
  userId: string;
  type: 'stock' | 'crypto' | 'forex' | 'commodity';
  name: string;
  symbol: string;
  amount: number;
  startDate: string;
  endDate: string;
  initialValue: number;
  currentValue: number;
  percentageGain: number;
  status: 'active' | 'closed';
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
}

export interface ChartData {
  timestamp: number;
  value: number;
}

export interface ChartTimeframe {
  label: string;
  value: '1h' | '24h' | '7d' | '30d' | '90d' | '1y' | 'all';
}
