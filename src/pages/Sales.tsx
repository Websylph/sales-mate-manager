import { BarChart3, TrendingUp, Percent } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Sales() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("0");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch sales data
  const { data: sales, isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Calculate metrics
  const totalSales = sales?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0;
  const averagePrice = sales?.length 
    ? sales.reduce((sum, sale) => sum + sale.price, 0) / sales.length 
    : 0;
  const margin = 20; // Example margin percentage

  // Add new sale mutation
  const addSaleMutation = useMutation({
    mutationFn: async (newSale: any) => {
      const { data, error } = await supabase
        .from('sales')
        .insert([newSale]);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      toast({
        title: "Sale added successfully",
        description: "The new sale has been recorded.",
      });
      // Reset form
      setProductName("");
      setQuantity("1");
      setPrice("0");
    },
    onError: (error) => {
      toast({
        title: "Error adding sale",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSaleMutation.mutate({
      date,
      product_name: productName,
      quantity: parseInt(quantity),
      price: parseFloat(price),
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Sales Management</h1>
      
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

      <Card className="p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4">New Sale</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name</label>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input 
                type="number" 
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Price (₹)</label>
              <Input 
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={addSaleMutation.isPending}>
              {addSaleMutation.isPending ? "Adding..." : "Add Sale"}
            </Button>
          </div>
        </form>
      </Card>

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
    </div>
  );
}