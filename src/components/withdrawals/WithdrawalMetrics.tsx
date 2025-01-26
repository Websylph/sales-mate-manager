import { ArrowDownCircle, Wallet, ArrowUpCircle } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";

interface WithdrawalMetricsProps {
  totalWithdrawn: number;
  totalRevenue: number;
}

export function WithdrawalMetrics({ totalWithdrawn, totalRevenue }: WithdrawalMetricsProps) {
  const remainingBalance = totalRevenue - totalWithdrawn;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <MetricCard
        title="Total Revenue"
        value={`₹${totalRevenue.toFixed(2)}`}
        icon={<ArrowUpCircle className="h-4 w-4 text-green-500" />}
      />
      <MetricCard
        title="Total Withdrawn"
        value={`₹${totalWithdrawn.toFixed(2)}`}
        icon={<ArrowDownCircle className="h-4 w-4 text-red-500" />}
      />
      <MetricCard
        title="Remaining Balance"
        value={`₹${remainingBalance.toFixed(2)}`}
        icon={<Wallet className="h-4 w-4 text-blue-500" />}
      />
    </div>
  );
}