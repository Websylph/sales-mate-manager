import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowDownCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WithdrawalForm } from "@/components/withdrawals/WithdrawalForm";
import { WithdrawalHistory } from "@/components/withdrawals/WithdrawalHistory";
import { WithdrawalMetrics } from "@/components/withdrawals/WithdrawalMetrics";

const MoneyOut = () => {
  const [open, setOpen] = useState(false);

  const { data: withdrawals, isLoading: isLoadingWithdrawals } = useQuery({
    queryKey: ["withdrawals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("withdrawals")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: sales, isLoading: isLoadingSales } = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales")
        .select("total");

      if (error) throw error;
      return data;
    },
  });

  const totalWithdrawn = withdrawals?.reduce((sum, w) => sum + Number(w.amount), 0) || 0;
  const totalRevenue = sales?.reduce((sum, sale) => sum + Number(sale.total || 0), 0) || 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold">Money Out</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <ArrowDownCircle className="mr-2 h-4 w-4" />
              Record Withdrawal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record New Withdrawal</DialogTitle>
            </DialogHeader>
            <WithdrawalForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <WithdrawalMetrics totalWithdrawn={totalWithdrawn} totalRevenue={totalRevenue} />
      <WithdrawalHistory withdrawals={withdrawals || []} isLoading={isLoadingWithdrawals} />
    </div>
  );
};

export default MoneyOut;