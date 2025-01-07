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
      <h2 className="text-lg font-semibold mb-4">Product Performance</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer>
          <RechartsLineChart data={inventoryStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="performance"
              stroke="#3b82f6"
              name="Sales Performance"
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};