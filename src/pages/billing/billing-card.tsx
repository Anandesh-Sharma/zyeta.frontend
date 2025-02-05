import { CreditCard } from 'lucide-react';

interface BillingCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function BillingCard({ title, description, icon }: BillingCardProps) {
  return (
    <div className="bg-card rounded-lg p-5 hover:bg-muted transition-colors duration-200 border border-border group">
      <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="text-[15px] font-medium text-card-foreground mb-1.5">{title}</h3>
      <p className="text-[13px] leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}