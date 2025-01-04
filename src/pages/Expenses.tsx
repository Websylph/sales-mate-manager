import { Receipt, TrendingDown, CreditCard, Calculator } from "lucide-react";
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

export default function Expenses() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Expense Management</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Total Expenses"
          value="₹0"
          icon={<Receipt className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          title="Monthly Average"
          value="₹0"
          icon={<Calculator className="h-4 w-4 text-purple-500" />}
        />
        <MetricCard
          title="Largest Expense"
          value="₹0"
          icon={<TrendingDown className="h-4 w-4 text-red-500" />}
        />
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add New Expense</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          <Input type="date" />
          <Input placeholder="Description" />
          <Input type="number" placeholder="Amount" />
          <Button>Add Expense</Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Expenses</h2>
        </div>
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">No expenses recorded</TableCell>
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