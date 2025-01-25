import { BarChart3, TrendingUp, Percent, Wallet, CreditCard } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";

interface SalesMetricsProps {
  totalSales: number;
  averagePrice: number;
  margin: number;
  cashTotal: number;
  upiTotal: number;
}

export const SalesMetrics = ({ totalSales, averagePrice, margin, cashTotal, upiTotal }: SalesMetricsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-5">
      <MetricCard
        title="Total Sales"
        value={`₹${totalSales.toFixed(2)}`}
        icon={<BarChart3 className="h-4 w-4 text-primary" />}
      />
      <MetricCard
        title="Average Price"
        value={`₹${averagePrice.toFixed(2)}`}
        icon={<TrendingUp className="h-4 w-4 text-green-500" />}
      />
      <MetricCard
        title="Profit Margin"
        value={`${margin.toFixed(1)}%`}
        icon={<Percent className="h-4 w-4 text-purple-500" />}
      />
      <MetricCard
        title="Cash on Hand"
        value={`₹${cashTotal.toFixed(2)}`}
        icon={<Wallet className="h-4 w-4 text-orange-500" />}
      />
      <MetricCard
        title="UPI Total"
        value={`₹${upiTotal.toFixed(2)}`}
        icon={<CreditCard className="h-4 w-4 text-blue-500" />}
      />
    </div>
  );
};