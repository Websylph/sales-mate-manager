import { Package, PlusCircle, Search } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Inventory() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Total Products"
          value="0"
          icon={<Package className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          title="Low Stock Items"
          value="0"
          icon={<Package className="h-4 w-4 text-yellow-500" />}
        />
        <MetricCard
          title="Out of Stock"
          value="0"
          icon={<Package className="h-4 w-4 text-red-500" />}
        />
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Products</h2>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-8" />
            </div>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Product
            </Button>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">No products available</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}