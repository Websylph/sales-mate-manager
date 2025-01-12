import { Card } from "@/components/ui/card";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface PerformanceChartProps {
  inventoryStats: any[];
}

export const PerformanceChart = ({ inventoryStats }: PerformanceChartProps) => {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Product Sales Performance</h2>
      <div className="h-[300px] w-full">
        {inventoryStats.length > 0 ? (
          <ResponsiveContainer>
            <RechartsLineChart data={inventoryStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sold"
                stroke="#3b82f6"
                name="Units Sold"
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No sales data available
          </div>
        )}
      </div>
    </Card>
  );
};