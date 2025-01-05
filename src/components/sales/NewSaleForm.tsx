import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const NewSaleForm = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("0");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addSaleMutation = useMutation({
    mutationFn: async (newSale: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const saleWithUserId = {
        ...newSale,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('sales')
        .insert([saleWithUserId]);
      
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
    });
  };

  return (
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
  );
};