import { startOfDay, startOfWeek, startOfMonth, startOfYear, format } from "date-fns";

// Helper function to get period start date
const getPeriodStart = (date: Date, period: string) => {
  switch (period) {
    case 'daily':
      return startOfDay(date);
    case 'weekly':
      return startOfWeek(date);
    case 'monthly':
      return startOfMonth(date);
    case 'yearly':
      return startOfYear(date);
    default:
      return startOfMonth(date);
  }
};

// Helper function to format date based on period
const formatPeriodDate = (date: Date, period: string) => {
  switch (period) {
    case 'daily':
      return format(date, 'MMM dd');
    case 'weekly':
      return `Week ${format(date, 'w')}`;
    case 'monthly':
      return format(date, 'MMM yyyy');
    case 'yearly':
      return format(date, 'yyyy');
    default:
      return format(date, 'MMM yyyy');
  }
};

export const calculateMonthlyData = (data: any[], type: string, period: string = 'monthly') => {
  const periodData = new Map();
  const today = new Date();
  const sixPeriodsAgo = new Date();

  // Set the range based on period
  switch (period) {
    case 'daily':
      sixPeriodsAgo.setDate(today.getDate() - 5);
      break;
    case 'weekly':
      sixPeriodsAgo.setDate(today.getDate() - (6 * 7));
      break;
    case 'monthly':
      sixPeriodsAgo.setMonth(today.getMonth() - 5);
      break;
    case 'yearly':
      sixPeriodsAgo.setFullYear(today.getFullYear() - 5);
      break;
  }

  // Initialize periods
  let currentDate = new Date(sixPeriodsAgo);
  while (currentDate <= today) {
    const periodKey = formatPeriodDate(currentDate, period);
    periodData.set(periodKey, {
      name: periodKey,
      value: 0,
      profit: 0,
      sales: 0
    });

    // Increment current date based on period
    switch (period) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        break;
    }
  }

  // Aggregate data
  data?.forEach((item) => {
    const itemDate = new Date(item.date);
    const periodKey = formatPeriodDate(itemDate, period);

    if (periodData.has(periodKey)) {
      const periodItem = periodData.get(periodKey);
      if (type === 'sales') {
        periodItem.sales += item.total || 0;
        periodItem.profit += item.profit || 0;
      } else if (type === 'expenses') {
        periodItem.value += item.amount;
      }
      periodData.set(periodKey, periodItem);
    }
  });

  return Array.from(periodData.values());
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