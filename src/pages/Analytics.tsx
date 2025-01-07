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
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Line,
  LineChart as RechartsLineChart,
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

  const { data: inventory, error: inventoryError } = await supabase
    .from("inventory")
    .select("*");

  if (salesError || expensesError || inventoryError) {
    throw new Error("Failed to fetch analytics data");
  }

  return { sales, expenses, inventory };
};

// Calculate monthly data
const calculateMonthlyData = (data: any[], type: string) => {
  const monthlyData = new Array(6).fill(0).map((_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    return {
      name: date.toLocaleString("default", { month: "short" }),
      value: 0,
      profit: 0,
      sales: 0,
    };
  });

  data?.forEach((item) => {
    const itemDate = new Date(item.date);
    const monthIndex = monthlyData.findIndex(
      (d) => d.name === itemDate.toLocaleString("default", { month: "short" })
    );
    if (monthIndex !== -1) {
      if (type === 'sales') {
        monthlyData[monthIndex].sales += item.total || 0;
        monthlyData[monthIndex].profit += item.profit || 0;
      } else if (type === 'expenses') {
        monthlyData[monthIndex].value += item.amount;
      }
    }
  });

  return monthlyData;
};

const calculateInventoryStats = (inventory: any[], sales: any[]) => {
  const stats = inventory.map(item => {
    const soldQuantity = sales
      .filter(sale => sale.product_name === item.product_name)
      .reduce((sum, sale) => sum + sale.quantity, 0);

    return {
      name: item.product_name,
      inStock: item.quantity,
      purchased: item.quantity + soldQuantity,
      sold: soldQuantity,
      performance: soldQuantity * item.price
    };
  });

  return stats;
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

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Monthly Expenses</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <RechartsBarChart data={expensesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#ef4444" name="Expenses" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Sales and Profit</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <RechartsBarChart data={salesAndProfitData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
                <Bar dataKey="profit" fill="#22c55e" name="Profit" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Inventory Statistics</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <RechartsBarChart data={inventoryStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="inStock" fill="#3b82f6" name="In Stock" />
                <Bar dataKey="purchased" fill="#8b5cf6" name="Purchased" />
                <Bar dataKey="sold" fill="#22c55e" name="Sold" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Product Performance</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer>
              <RechartsLineChart data={inventoryStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="performance" stroke="#3b82f6" name="Sales Performance" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}