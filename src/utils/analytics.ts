// Calculate monthly data
export const calculateMonthlyData = (data: any[], type: string) => {
  const monthlyData = new Array(6).fill(0).map((_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    return {
      name: date.toLocaleString("default", { month: "short" }),
      value: 0,
      profit: 0,
      sales: 0,
    };
  });

  data?.forEach((item) => {
    const itemDate = new Date(item.date);
    const monthIndex = monthlyData.findIndex(
      (d) => d.name === itemDate.toLocaleString("default", { month: "short" })
    );
    if (monthIndex !== -1) {
      if (type === 'sales') {
        monthlyData[monthIndex].sales += item.total || 0;
        monthlyData[monthIndex].profit += item.profit || 0;
      } else if (type === 'expenses') {
        monthlyData[monthIndex].value += item.amount;
      }
    }
  });

  return monthlyData;
};

export const calculateInventoryStats = (inventory: any[], sales: any[]) => {
  const stats = inventory.map(item => {
    const soldQuantity = sales
      .filter(sale => sale.product_name === item.product_name)
      .reduce((sum, sale) => sum + sale.quantity, 0);

    return {
      name: item.product_name,
      inStock: item.quantity,
      purchased: item.quantity + soldQuantity,
      sold: soldQuantity,
      performance: soldQuantity * item.price
    };
  });

  return stats;
};