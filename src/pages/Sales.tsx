import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { SalesMetrics } from "@/components/sales/SalesMetrics";
import { NewSaleForm } from "@/components/sales/NewSaleForm";
import { SalesTable } from "@/components/sales/SalesTable";

export default function Sales() {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        toast({
          title: "Authentication required",
          description: "Please log in to access this page.",
          variant: "destructive",
        });
      }
    };
    checkAuth();
  }, [navigate, toast]);

  // Subscribe to auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch sales data
  const { data: sales, isLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Calculate metrics
  const totalSales = sales?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0;
  const averagePrice = sales?.length 
    ? sales.reduce((sum, sale) => sum + sale.price, 0) / sales.length 
    : 0;
  const margin = 20; // Example margin percentage

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Sales Management</h1>
      
      <SalesMetrics 
        totalSales={totalSales}
        averagePrice={averagePrice}
        margin={margin}
      />

      <NewSaleForm />
      
      <SalesTable sales={sales} isLoading={isLoading} />
    </div>
  );
}