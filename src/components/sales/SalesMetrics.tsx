import { BarChart3, TrendingUp, Percent } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";

interface SalesMetricsProps {
  totalSales: number;
  averagePrice: number;
  margin: number;
}

export const SalesMetrics = ({ totalSales, averagePrice, margin }: SalesMetricsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
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
        title="Margin"
        value={`${margin}%`}
        icon={<Percent className="h-4 w-4 text-purple-500" />}
      />
    </div>
  );
};