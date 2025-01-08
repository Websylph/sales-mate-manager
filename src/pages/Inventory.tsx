import { Package, PlusCircle, Search, Pencil } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EditInventoryForm } from "@/components/inventory/EditInventoryForm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Inventory() {
  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch inventory data
  const { data: inventory, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Add new product mutation
  const addProductMutation = useMutation({
    mutationFn: async (newProduct: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const productWithUserId = {
        ...newProduct,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('inventory')
        .insert([productWithUserId]);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast({
        title: "Success",
        description: "Product added successfully",
      });
      setProductName("");
      setSku("");
      setCategory("");
      setQuantity("");
      setPrice("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add product: " + error.message,
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

    addProductMutation.mutate({
      product_name: productName,
      sku,
      category,
      quantity: parseInt(quantity),
      price: parseFloat(price),
    });
  };

  const filteredInventory = inventory?.filter(item =>
    item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalProducts = inventory?.length || 0;
  const lowStockItems = inventory?.filter(item => item.quantity < 10).length || 0;
  const outOfStockItems = inventory?.filter(item => item.quantity === 0).length || 0;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Total Products"
          value={totalProducts.toString()}
          icon={<Package className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          title="Low Stock Items"
          value={lowStockItems.toString()}
          icon={<Package className="h-4 w-4 text-yellow-500" />}
        />
        <MetricCard
          title="Out of Stock"
          value={outOfStockItems.toString()}
          icon={<Package className="h-4 w-4 text-red-500" />}
        />
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add New Product</h2>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-5">
          <Input
            placeholder="Product Name *"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <Input
            placeholder="SKU"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
          />
          <Input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Quantity *"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Price *"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Button type="submit" className="md:col-span-5" disabled={addProductMutation.isPending}>
            {addProductMutation.isPending ? "Adding..." : "Add Product"}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Products</h2>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : filteredInventory?.length ? (
                filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell>{item.sku || '-'}</TableCell>
                    <TableCell>{item.category || '-'}</TableCell>
                    <TableCell>₹{Number(item.price).toFixed(2)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {item.quantity === 0 ? (
                        <span className="text-red-500">Out of Stock</span>
                      ) : item.quantity < 10 ? (
                        <span className="text-yellow-500">Low Stock</span>
                      ) : (
                        <span className="text-green-500">In Stock</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingItem(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No products available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {editingItem && (
        <EditInventoryForm
          item={editingItem}
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}