import { ArrowDownCircle } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";

interface WithdrawalMetricsProps {
  totalWithdrawn: number;
}

export function WithdrawalMetrics({ totalWithdrawn }: WithdrawalMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-1">
      <MetricCard
        title="Total Withdrawn"
        value={`₹${totalWithdrawn.toFixed(2)}`}
        icon={<ArrowDownCircle className="h-4 w-4 text-red-500" />}
      />
    </div>
  );
}