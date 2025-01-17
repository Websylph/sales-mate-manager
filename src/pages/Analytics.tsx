import { useEffect, useState } from "react";
import { BarChart, LineChart, PieChart, Download } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { calculateMonthlyData, calculateInventoryStats } from "@/utils/analytics";
import { ExpensesChart } from "@/components/analytics/ExpensesChart";
import { SalesChart } from "@/components/analytics/SalesChart";
import { InventoryChart } from "@/components/analytics/InventoryChart";
import { PerformanceChart } from "@/components/analytics/PerformanceChart";
import { ProductSalesTable } from "@/components/analytics/ProductSalesTable";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [period, setPeriod] = useState("monthly");
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalyticsData,
  });

  const expensesData = calculateMonthlyData(analyticsData?.expenses || [], "expenses", period);
  const salesAndProfitData = calculateMonthlyData(analyticsData?.sales || [], "sales", period);
  const inventoryStats = calculateInventoryStats(analyticsData?.inventory || [], analyticsData?.sales || []);

  // Calculate metrics
  const totalRevenue = analyticsData?.sales?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0;
  const totalProfit = analyticsData?.sales?.reduce((sum, sale) => sum + (sale.profit || 0), 0) || 0;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const handleDownloadReport = () => {
    // Create financial data CSV content
    const financialData = [
      ["Financial Metrics"],
      ["Month", "Revenue", "Profit", "Expenses"],
      ...salesAndProfitData.map((data, index) => [
        data.name,
        data.sales.toFixed(2),
        data.profit.toFixed(2),
        expensesData[index]?.value.toFixed(2) || "0.00"
      ]),
      [], // Empty row for separation
      ["Inventory Metrics"],
      ["Product", "In Stock", "Total Purchased", "Total Sold", "Performance (Revenue)"],
      ...inventoryStats.map(stat => [
        stat.name,
        stat.inStock.toString(),
        stat.purchased.toString(),
        stat.sold.toString(),
        stat.performance.toFixed(2)
      ])
    ].map(row => row.join(",")).join("\n");

    // Create and trigger download
    const blob = new Blob([financialData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics_report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleDownloadReport} className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>
      
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

      <ProductSalesTable />

      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="sales">Sales & Profit</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="expenses">
          <ExpensesChart expensesData={expensesData} />
        </TabsContent>
        <TabsContent value="sales">
          <SalesChart salesData={salesAndProfitData} />
        </TabsContent>
        <TabsContent value="inventory">
          <InventoryChart inventoryStats={inventoryStats} />
        </TabsContent>
        <TabsContent value="performance">
          <PerformanceChart inventoryStats={inventoryStats} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
