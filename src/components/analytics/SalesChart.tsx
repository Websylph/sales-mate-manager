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

interface SalesChartProps {
  salesData: any[];
}

export const SalesChart = ({ salesData }: SalesChartProps) => {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Sales and Profit</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer>
          <RechartsBarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#3b82f6" name="Sales" />
            <Bar dataKey="profit" fill="#22c55e" name="Profit" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};