import { useEffect, useState } from "react";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { calculateMonthlyData, calculateInventoryStats } from "@/utils/analytics";
import { ExpensesChart } from "@/components/analytics/ExpensesChart";
import { SalesChart } from "@/components/analytics/SalesChart";
import { InventoryChart } from "@/components/analytics/InventoryChart";
import { PerformanceChart } from "@/components/analytics/PerformanceChart";

// Fetch analytics data from Supabase
const fetchAnalyticsData = async () => {
  const { data: sales, error: salesError } = await supabase
    .from("sales")
    .select("*");

  const { data: expenses, error: expensesError } = await supabase
    .from("expenses")
    .select("*");

  const { data: inventory, error: inventoryError } = await supabase
    .from("inventory")
    .select("*");

  if (salesError || expensesError || inventoryError) {
    throw new Error("Failed to fetch analytics data");
  }

  return { sales, expenses, inventory };
};

export default function Analytics() {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalyticsData,
  });

  const expensesData = calculateMonthlyData(analyticsData?.expenses || [], "expenses");
  const salesAndProfitData = calculateMonthlyData(analyticsData?.sales || [], "sales");
  const inventoryStats = calculateInventoryStats(analyticsData?.inventory || [], analyticsData?.sales || []);

  // Calculate metrics
  const totalRevenue = analyticsData?.sales?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0;
  const totalProfit = analyticsData?.sales?.reduce((sum, sale) => sum + (sale.profit || 0), 0) || 0;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <MetricCard
          title="Total Revenue"
          value={`₹${totalRevenue.toFixed(2)}`}
          icon={<BarChart className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          title="Total Profit"
          value={`₹${totalProfit.toFixed(2)}`}
          icon={<LineChart className="h-4 w-4 text-green-500" />}
        />
        <MetricCard
          title="Profit Margin"
          value={`${profitMargin.toFixed(1)}%`}
          icon={<PieChart className="h-4 w-4 text-purple-500" />}
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <ExpensesChart expensesData={expensesData} />
        <SalesChart salesData={salesAndProfitData} />
        <InventoryChart inventoryStats={inventoryStats} />
        <PerformanceChart inventoryStats={inventoryStats} />
      </div>
    </div>
  );
}