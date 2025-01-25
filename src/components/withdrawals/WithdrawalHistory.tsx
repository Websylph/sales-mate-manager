import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface Withdrawal {
  id: string;
  date: string;
  amount: number;
  description: string | null;
}

interface WithdrawalHistoryProps {
  withdrawals: Withdrawal[];
  isLoading: boolean;
}

export function WithdrawalHistory({ withdrawals, isLoading }: WithdrawalHistoryProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {withdrawals.map((withdrawal) => (
            <TableRow key={withdrawal.id}>
              <TableCell>{format(new Date(withdrawal.date), "PPP")}</TableCell>
              <TableCell>₹{withdrawal.amount.toFixed(2)}</TableCell>
              <TableCell>{withdrawal.description || "-"}</TableCell>
            </TableRow>
          ))}
          {withdrawals.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No withdrawals recorded
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}