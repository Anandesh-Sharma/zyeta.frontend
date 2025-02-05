import { CreditCard, Receipt, Clock, ArrowUpDown, CreditCardIcon, Settings, Grid, Package, Store } from 'lucide-react';

export const BILLING_NAV = [
  { name: 'Overview', href: '/billing', icon: CreditCard },
  { name: 'Payment Methods', href: '/billing/payment-methods', icon: CreditCardIcon },
  { name: 'Transaction History', href: '/billing/transactions', icon: Clock },
  { name: 'Invoices', href: '/billing/invoices', icon: Receipt },
  { name: 'Usage & Limits', href: '/billing/usage', icon: ArrowUpDown },
  { name: 'Billing Settings', href: '/billing/settings', icon: Settings },
];

export const AGENT_STORE_NAV = [
  { name: 'Discover', href: '/agent-store', icon: Grid },
  { name: 'My Agents', href: '/agent-store/my-agents', icon: Package },
  { name: 'Published', href: '/agent-store/published', icon: Store },
];