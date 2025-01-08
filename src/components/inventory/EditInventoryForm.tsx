import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EditInventoryFormProps {
  item: any;
  isOpen: boolean;
  onClose: () => void;
}

export const EditInventoryForm = ({ item, isOpen, onClose }: EditInventoryFormProps) => {
  const [productName, setProductName] = useState(item.product_name);
  const [sku, setSku] = useState(item.sku || "");
  const [category, setCategory] = useState(item.category || "");
  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [price, setPrice] = useState(item.price.toString());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateInventoryMutation = useMutation({
    mutationFn: async (updatedProduct: any) => {
      const { data, error } = await supabase
        .from('inventory')
        .update(updatedProduct)
        .eq('id', item.id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to update product: " + error.message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !quantity || !price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    updateInventoryMutation.mutate({
      product_name: productName,
      sku,
      category,
      quantity: parseInt(quantity),
      price: parseFloat(price),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Name *</label>
            <Input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Product Name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">SKU</label>
            <Input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="SKU"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity *</label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Quantity"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Price *</label>
            <Input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateInventoryMutation.isPending}>
              {updateInventoryMutation.isPending ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};