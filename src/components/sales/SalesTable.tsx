import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

interface Sale {
  id: string;
  date: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}

interface SalesTableProps {
  sales: Sale[] | undefined;
  isLoading: boolean;
}

export const SalesTable = ({ sales, isLoading }: SalesTableProps) => {
  return (
    <Card className="p-4 md:p-6">
      <h2 className="text-lg font-semibold mb-4">Sales History</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : sales?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No sales recorded yet</TableCell>
              </TableRow>
            ) : (
              sales?.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                  <TableCell>{sale.product_name}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>₹{sale.price.toFixed(2)}</TableCell>
                  <TableCell>₹{(sale.total || 0).toFixed(2)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};