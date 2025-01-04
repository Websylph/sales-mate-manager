import { BarChart, LineChart, PieChart } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Jan', value: 0 },
  { name: 'Feb', value: 0 },
  { name: 'Mar', value: 0 },
  { name: 'Apr', value: 0 },
  { name: 'May', value: 0 },
  { name: 'Jun', value: 0 },
];

export default function Analytics() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Revenue Growth"
          value="0%"
          icon={<BarChart className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          title="Profit Margin"
          value="0%"
          icon={<LineChart className="h-4 w-4 text-green-500" />}
        />
        <MetricCard
          title="Expense Ratio"
          value="0%"
          icon={<PieChart className="h-4 w-4 text-purple-500" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Revenue Trend</h2>
            <Select defaultValue="6months">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-[300px]">
            <ChartContainer config={{}}>
              <RechartsBarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#3b82f6" />
              </RechartsBarChart>
            </ChartContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Expense Distribution</h2>
            <Select defaultValue="6months">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-[300px]">
            <ChartContainer config={{}}>
              <RechartsBarChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#8b5cf6" />
              </RechartsBarChart>
            </ChartContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}