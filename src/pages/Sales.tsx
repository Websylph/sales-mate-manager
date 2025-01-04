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

export default function Sales() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("0");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Sales Management</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Total Sales"
          value="₹0"
          icon={<BarChart3 className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          title="Total Profit"
          value="₹0"
          icon={<TrendingUp className="h-4 w-4 text-green-500" />}
        />
        <MetricCard
          title="Average Margin"
          value="0.00%"
          icon={<Percent className="h-4 w-4 text-purple-500" />}
        />
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">New Sale</h2>
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
            <label className="text-sm font-medium">Product</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product1">Product 1</SelectItem>
                <SelectItem value="product2">Product 2</SelectItem>
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
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Selling Price (₹)</label>
            <Input 
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button>Add Sale</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Sales History</h2>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-6 py-4">No sales recorded yet</td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}