import { useEffect, useState } from "react";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

// Fetch analytics data from Supabase
const fetchAnalyticsData = async () => {
  const { data: sales, error: salesError } = await supabase
    .from("sales")
    .select("*");

  const { data: expenses, error: expensesError } = await supabase
    .from("expenses")
    .select("*");

  if (salesError || expensesError) {
    throw new Error("Failed to fetch analytics data");
  }

  return { sales, expenses };
};

// Calculate monthly data
const calculateMonthlyData = (data: any[], type: "sales" | "expenses") => {
  const monthlyData = new Array(6).fill(0).map((_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    return {
      name: date.toLocaleString("default", { month: "short" }),
      value: 0,
    };
  });

  data?.forEach((item) => {
    const itemDate = new Date(item.date);
    const monthIndex = monthlyData.findIndex(
      (d) => d.name === itemDate.toLocaleString("default", { month: "short" })
    );
    if (monthIndex !== -1) {
      monthlyData[monthIndex].value += type === "sales" ? item.total : item.amount;
    }
  });

  return monthlyData;
};

export default function Analytics() {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalyticsData,
  });

  const salesData = calculateMonthlyData(analyticsData?.sales || [], "sales");
  const expensesData = calculateMonthlyData(analyticsData?.expenses || [], "expenses");

  // Calculate metrics
  const totalRevenue = analyticsData?.sales?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0;
  const totalExpenses = analyticsData?.expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const totalProfit = totalRevenue - totalExpenses;
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

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-2 md:space-y-0">
            <h2 className="text-lg font-semibold">Revenue Trend</h2>
            <Select defaultValue="6months">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-[300px] w-full">
            <ChartContainer config={{}}>
              <RechartsBarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#3b82f6" />
              </RechartsBarChart>
            </ChartContainer>
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-2 md:space-y-0">
            <h2 className="text-lg font-semibold">Expense Distribution</h2>
            <Select defaultValue="6months">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-[300px] w-full">
            <ChartContainer config={{}}>
              <RechartsBarChart data={expensesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#8b5cf6" />
              </RechartsBarChart>
            </ChartContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}