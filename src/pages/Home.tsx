import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

  // Calculate metrics
  const totalSales = analyticsData?.sales?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0;
  const totalExpenses = analyticsData?.expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
  const totalInventoryItems = analyticsData?.inventory?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const lowStockItems = analyticsData?.inventory?.filter(item => item.quantity < 10).length || 0;

  // Calculate best selling products
  const bestSellingProducts = analyticsData?.sales?.reduce((acc: any[], sale) => {
    const existingProduct = acc.find(p => p.product_name === sale.product_name);
    if (existingProduct) {
      existingProduct.quantity += sale.quantity;
      existingProduct.total += sale.total || 0;
    } else {
      acc.push({
        product_name: sale.product_name,
        quantity: sale.quantity,
        total: sale.total || 0
      });
    }
    return acc;
  }, [])
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5) || [];

  // Calculate most profitable products
  const mostProfitableProducts = analyticsData?.sales?.reduce((acc: any[], sale) => {
    const existingProduct = acc.find(p => p.product_name === sale.product_name);
    if (existingProduct) {
      existingProduct.profit += sale.profit || 0;
      existingProduct.total += sale.total || 0;
    } else {
      acc.push({
        product_name: sale.product_name,
        profit: sale.profit || 0,
        total: sale.total || 0
      });
    }
    return acc;
  }, [])
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5) || [];

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
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Net Profit</p>
                <p className="text-2xl font-bold">₹{(totalSales - totalExpenses).toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Best Selling Products */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Best Selling Products</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quantity Sold</TableHead>
              <TableHead>Total Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bestSellingProducts.map((product) => (
              <TableRow key={product.product_name}>
                <TableCell>{product.product_name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>₹{product.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Most Profitable Products */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Most Profitable Products</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Total Profit</TableHead>
              <TableHead>Total Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mostProfitableProducts.map((product) => (
              <TableRow key={product.product_name}>
                <TableCell>{product.product_name}</TableCell>
                <TableCell className="text-green-600">₹{product.profit.toFixed(2)}</TableCell>
                <TableCell>₹{product.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Home;