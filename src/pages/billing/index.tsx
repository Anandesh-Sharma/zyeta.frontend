import { CreditCard, Receipt, Wallet } from 'lucide-react';
import { BillingCard } from './billing-card';

export function BillingPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Billing</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <BillingCard
          title="Payment Methods"
          description="Manage your payment methods and billing details"
          icon={<CreditCard className="h-5 w-5 text-white" />}
        />
        <BillingCard
          title="Billing History"
          description="View and download your past invoices"
          icon={<Receipt className="h-5 w-5 text-white" />}
        />
        <BillingCard
          title="Usage & Limits"
          description="Monitor your usage and manage spending limits"
          icon={<Wallet className="h-5 w-5 text-white" />}
        />
      </div>
    </div>
  );
}