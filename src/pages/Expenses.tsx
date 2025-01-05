import { Receipt, TrendingDown, CreditCard, Calculator } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Expenses() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch expenses data
  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Add new expense mutation
  const addExpenseMutation = useMutation({
    mutationFn: async (newExpense: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const expenseWithUserId = {
        ...newExpense,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('expenses')
        .insert([expenseWithUserId]);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: "Success",
        description: "Expense added successfully",
      });
      setDescription("");
      setAmount("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add expense: " + error.message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    addExpenseMutation.mutate({
      date,
      description,
      amount: parseFloat(amount),
    });
  };

  const totalExpenses = expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
  const averageExpense = expenses?.length ? totalExpenses / expenses.length : 0;
  const largestExpense = expenses?.reduce((max, expense) => Math.max(max, Number(expense.amount)), 0) || 0;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Expense Management</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Total Expenses"
          value={`₹${totalExpenses.toFixed(2)}`}
          icon={<Receipt className="h-4 w-4 text-primary" />}
        />
        <MetricCard
          title="Monthly Average"
          value={`₹${averageExpense.toFixed(2)}`}
          icon={<Calculator className="h-4 w-4 text-purple-500" />}
        />
        <MetricCard
          title="Largest Expense"
          value={`₹${largestExpense.toFixed(2)}`}
          icon={<TrendingDown className="h-4 w-4 text-red-500" />}
        />
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add New Expense</h2>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
          <Input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
          <Input 
            placeholder="Description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
          <Input 
            type="number" 
            placeholder="Amount" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
          />
          <Button type="submit" disabled={addExpenseMutation.isPending}>
            {addExpenseMutation.isPending ? "Adding..." : "Add Expense"}
          </Button>
        </form>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : expenses?.length ? (
                expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell>{expense.category || '-'}</TableCell>
                    <TableCell>₹{Number(expense.amount).toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No expenses recorded</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}