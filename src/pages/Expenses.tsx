import { Receipt, TrendingDown, CreditCard, Calculator, Calendar } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Expenses() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [nextDueDate, setNextDueDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch regular expenses
  const { data: expenses, isLoading: expensesLoading } = useQuery({
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

  // Fetch recurring expenses
  const { data: recurringExpenses, isLoading: recurringLoading } = useQuery({
    queryKey: ['recurring-expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recurring_expenses')
        .select('*')
        .order('next_due_date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  // Add new regular expense mutation
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

  // Add new recurring expense mutation
  const addRecurringExpenseMutation = useMutation({
    mutationFn: async (newRecurringExpense: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const recurringExpenseWithUserId = {
        ...newRecurringExpense,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('recurring_expenses')
        .insert([recurringExpenseWithUserId]);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring-expenses'] });
      toast({
        title: "Success",
        description: "Recurring expense added successfully",
      });
      setDescription("");
      setAmount("");
      setFrequency("monthly");
      setNextDueDate(new Date().toISOString().split('T')[0]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add recurring expense: " + error.message,
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

  const handleRecurringSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !frequency || !nextDueDate) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    addRecurringExpenseMutation.mutate({
      description,
      amount: parseFloat(amount),
      frequency,
      next_due_date: nextDueDate,
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

      <Tabs defaultValue="one-time" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="one-time">One-time Expense</TabsTrigger>
          <TabsTrigger value="recurring">Recurring Expense</TabsTrigger>
        </TabsList>
        
        <TabsContent value="one-time">
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
        </TabsContent>

        <TabsContent value="recurring">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add Recurring Expense</h2>
            </div>
            <form onSubmit={handleRecurringSubmit} className="grid gap-4 md:grid-cols-4">
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
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Input 
                type="date" 
                value={nextDueDate} 
                onChange={(e) => setNextDueDate(e.target.value)} 
              />
              <div className="md:col-span-4">
                <Button type="submit" disabled={addRecurringExpenseMutation.isPending}>
                  {addRecurringExpenseMutation.isPending ? "Adding..." : "Add Recurring Expense"}
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="p-6">
        <Tabs defaultValue="one-time" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="one-time">One-time Expenses</TabsTrigger>
            <TabsTrigger value="recurring">Recurring Expenses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="one-time">
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
                  {expensesLoading ? (
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
          </TabsContent>

          <TabsContent value="recurring">
            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Next Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recurringLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : recurringExpenses?.length ? (
                    recurringExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>₹{Number(expense.amount).toFixed(2)}</TableCell>
                        <TableCell className="capitalize">{expense.frequency}</TableCell>
                        <TableCell>{new Date(expense.next_due_date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">No recurring expenses recorded</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}