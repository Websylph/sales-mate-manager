import { Card } from "@/components/ui/card";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ExpensesChartProps {
  expensesData: any[];
}

export const ExpensesChart = ({ expensesData }: ExpensesChartProps) => {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Monthly Expenses</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer>
          <RechartsBarChart data={expensesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#ef4444" name="Expenses" />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};