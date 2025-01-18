import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Sale {
  id: string;
  date: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
  profit: number;
  payment_method: string;
  cost_price?: number;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

interface SalesTableProps {
  sales: Sale[] | undefined;
  isLoading: boolean;
}

export const SalesTable = ({ sales, isLoading }: SalesTableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updatePaymentMethodMutation = useMutation({
    mutationFn: async ({ saleId, paymentMethod }: { saleId: string; paymentMethod: 'cash' | 'upi' }) => {
      const { data, error } = await supabase
        .from('sales')
        .update({ payment_method: paymentMethod })
        .eq('id', saleId);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast({
        title: "Payment method updated",
        description: "The payment method has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating payment method",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePaymentMethodChange = (saleId: string, newMethod: 'cash' | 'upi') => {
    updatePaymentMethodMutation.mutate({ saleId, paymentMethod: newMethod });
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.toDateString() === today.toDateString();
  };

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
              <TableHead>Profit</TableHead>
              <TableHead>Payment Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : sales?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">No sales recorded yet</TableCell>
              </TableRow>
            ) : (
              sales?.map((sale) => (
                <TableRow 
                  key={sale.id}
                  className={cn(
                    isToday(sale.date) && "bg-gradient-to-r from-[#FEC6A1]/30 to-[#F97316]/20 hover:from-[#FEC6A1]/40 hover:to-[#F97316]/30"
                  )}
                >
                  <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                  <TableCell>{sale.product_name}</TableCell>
                  <TableCell>{sale.quantity}</TableCell>
                  <TableCell>₹{sale.price.toFixed(2)}</TableCell>
                  <TableCell>₹{(sale.total || 0).toFixed(2)}</TableCell>
                  <TableCell className="text-green-600">₹{(sale.profit || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <Select
                      value={sale.payment_method}
                      onValueChange={(value: 'cash' | 'upi') => handlePaymentMethodChange(sale.id, value)}
                    >
                      <SelectTrigger className={cn(
                        "w-[100px]",
                        sale.payment_method === 'cash' 
                          ? "bg-green-500 hover:bg-green-600 text-white" 
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      )}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                      </SelectContent>
                    </Select>
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