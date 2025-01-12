import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const NewSaleForm = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("0");
  const [costPrice, setCostPrice] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch inventory data
  const { data: inventory } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .gt('quantity', 0); // Only get products with stock
      
      if (error) throw error;
      return data;
    }
  });

  // Update price when product is selected
  useEffect(() => {
    if (productName && inventory) {
      const selectedProduct = inventory.find(item => item.product_name === productName);
      if (selectedProduct) {
        setPrice(selectedProduct.price.toString());
        setCostPrice(selectedProduct.price.toString());
      }
    }
  }, [productName, inventory]);

  const addSaleMutation = useMutation({
    mutationFn: async (newSale: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Check inventory quantity
      const selectedProduct = inventory?.find(item => item.product_name === newSale.product_name);
      if (!selectedProduct) throw new Error("Product not found in inventory");
      if (selectedProduct.quantity < newSale.quantity) {
        throw new Error(`Only ${selectedProduct.quantity} units available in stock`);
      }

      // Remove total from the insert operation as it's a generated column
      const saleWithUserId = {
        date: newSale.date,
        product_name: newSale.product_name,
        quantity: newSale.quantity,
        price: newSale.price,
        user_id: user.id,
        cost_price: selectedProduct.price,
        payment_method: newSale.payment_method,
      };

      const { data, error } = await supabase
        .from('sales')
        .insert([saleWithUserId]);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: "Sale added successfully",
        description: "The new sale has been recorded.",
      });
      // Reset form
      setProductName("");
      setQuantity("1");
      setPrice("0");
      setCostPrice("0");
      setPaymentMethod("cash");
    },
    onError: (error: Error) => {
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
      payment_method: paymentMethod,
    });
  };

  const calculateProfit = () => {
    const totalSale = parseFloat(price) * parseInt(quantity || "0");
    const totalCost = parseFloat(costPrice) * parseInt(quantity || "0");
    return (totalSale - totalCost).toFixed(2);
  };

  return (
    <Card className="p-4 md:p-6">
      <h2 className="text-lg font-semibold mb-4">New Sale</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Product</label>
            <Select value={productName} onValueChange={setProductName}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {inventory?.map((item) => (
                  <SelectItem key={item.id} value={item.product_name}>
                    {item.product_name} ({item.quantity} in stock)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity</label>
            <Input 
              type="number" 
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Selling Price (₹)</label>
            <Input 
              type="number"
              min={costPrice}
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method</label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {productName && (
          <div className="text-sm text-muted-foreground">
            Estimated Profit: ₹{calculateProfit()}
          </div>
        )}
        
        <div className="flex justify-end">
          <Button type="submit" disabled={addSaleMutation.isPending}>
            {addSaleMutation.isPending ? "Adding..." : "Add Sale"}
          </Button>
        </div>
      </form>
    </Card>
  );
};