import { Card } from "@/components/ui/card";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface InventoryChartProps {
  inventoryStats: any[];
}

export const InventoryChart = ({ inventoryStats }: InventoryChartProps) => {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Inventory Statistics</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer>
          <RechartsBarChart data={inventoryStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="inStock" fill="#3b82f6" name="In Stock" />
            <Bar dataKey="purchased" fill="#8b5cf6" name="Purchased" />
            <Bar dataKey="sold" fill="#22c55e" name="Sold" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};