import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, ShoppingCart, DollarSign, BarChart } from "lucide-react";
import { Link } from "react-router-dom";
import { SalesChart } from "@/components/analytics/SalesChart";
import { calculateMonthlyData } from "@/utils/analytics";

const Home = () => {
  const { data: analyticsData } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
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
    },
  });

  const totalSales = analyticsData?.sales?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0;
  const totalExpenses = analyticsData?.expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
  const totalInventoryItems = analyticsData?.inventory?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const lowStockItems = analyticsData?.inventory?.filter(item => item.quantity < 10).length || 0;

  const salesData = calculateMonthlyData(analyticsData?.sales || [], "sales", "monthly");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* First row: Total Sales and Inventory */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/sales">
          <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Sales</p>
                <p className="text-2xl font-bold">₹{totalSales.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/inventory">
          <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Inventory Items</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-2xl font-bold">{totalInventoryItems}</p>
                  {lowStockItems > 0 && (
                    <p className="text-sm text-red-500">({lowStockItems} low stock)</p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Second row: Total Expenses and Net Profit */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/expenses">
          <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-full">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold">₹{totalExpenses.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/analytics">
          <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Net Profit</p>
                <p className="text-2xl font-bold">₹{(totalSales - totalExpenses).toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Sales Performance</h2>
        <div className="h-[300px]">
          <SalesChart salesData={salesData} />
        </div>
      </Card>
    </div>
  );
};

export default Home;