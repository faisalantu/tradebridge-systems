
import { Currency } from '@/types';

export const formatCurrency = (amount: number, currency: Currency): string => {
  const formatter = new Intl.NumberFormat(getLocale(currency), {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(amount);
};

export const formatPercentage = (value: number): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'exceptZero',
  });
  
  return formatter.format(value / 100);
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getLocale = (currency: Currency): string => {
  switch (currency) {
    case 'GBP':
      return 'en-GB';
    case 'AUD':
      return 'en-AU';
    case 'USD':
      return 'en-US';
    case 'CAD':
      return 'en-CA';
    default:
      return 'en-US';
  }
};

export const getBankDetailsLabels = (currency: Currency) => {
  switch (currency) {
    case 'GBP':
      return {
        accountName: 'Account Name',
        accountNumber: 'Account Number',
        sortCode: 'Sort Code',
      };
    case 'AUD':
      return {
        accountName: 'Account Name',
        bsb: 'BSB',
        accountNumber: 'Account Number',
      };
    case 'CAD':
      return {
        accountName: 'Account Name',
        institutionNumber: 'Institution Number',
        branchTransitNumber: 'Branch Transit Number',
        accountNumber: 'Account Number',
        bic: 'BIC',
      };
    case 'USD':
      return {
        accountName: 'Account Name',
        bankAddress: 'Bank Address',
        accountNumber: 'Account Number',
        routingNumber: 'Routing Number',
      };
    default:
      return {};
  }
};
