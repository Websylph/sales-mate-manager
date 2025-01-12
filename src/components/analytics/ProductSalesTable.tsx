import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductSale {
  product_name: string;
  total_quantity: number;
  total_profit: number;
}

export const ProductSalesTable = () => {
  const { data: productSales, isLoading } = useQuery({
    queryKey: ['product-sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select('product_name, quantity, profit')
        .order('quantity', { ascending: false });

      if (error) throw error;

      // Aggregate sales data by product
      const salesByProduct = data.reduce((acc: { [key: string]: ProductSale }, sale) => {
        if (!acc[sale.product_name]) {
          acc[sale.product_name] = {
            product_name: sale.product_name,
            total_quantity: 0,
            total_profit: 0,
          };
        }
        acc[sale.product_name].total_quantity += sale.quantity;
        acc[sale.product_name].total_profit += sale.profit || 0;
        return acc;
      }, {});

      // Convert to array and sort by quantity
      return Object.values(salesByProduct)
        .filter(product => product.total_quantity > 0)
        .sort((a, b) => b.total_quantity - a.total_quantity);
    },
  });

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Product Sales Statistics</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead className="text-right">Units Sold</TableHead>
              <TableHead className="text-right">Total Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : !productSales?.length ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">No sales data available</TableCell>
              </TableRow>
            ) : (
              productSales.map((product) => (
                <TableRow key={product.product_name}>
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell className="text-right">{product.total_quantity}</TableCell>
                  <TableCell className="text-right text-green-600">
                    ₹{product.total_profit.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};