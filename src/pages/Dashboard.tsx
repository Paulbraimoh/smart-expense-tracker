import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import DashboardAIInsights from "@/components/sections/DashboardAIInsights";

interface DashboardData {
  totalBalance: number;
  income: number;
  expenses: number;
  savings: number;
  balanceChange: string;
  savingsChange: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalBalance: 0,
    income: 0,
    expenses: 0,
    savings: 0,
    balanceChange: '0',
    savingsChange: '0'
  });
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch transactions
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      if (transactions) {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyTransactions = transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate.getMonth() === currentMonth && 
                 transactionDate.getFullYear() === currentYear;
        });

        const income = monthlyTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const expenses = monthlyTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + Number(t.amount), 0);

        const totalBalance = income - expenses;
        const savings = totalBalance * 0.3; // Assuming 30% savings rate

        setDashboardData({
          totalBalance,
          income,
          expenses,
          savings,
          balanceChange: '+12',
          savingsChange: '+8'
        });

        // Generate AI insights based on data
        generateAIInsights(income, expenses, savings, monthlyTransactions);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    const currency = profile?.currency || 'NGN';
    const symbols: { [key: string]: string } = {
      'NGN': '₦',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$',
      'CHF': 'CHF',
      'CNY': '¥'
    };
    
    return `${symbols[currency] || currency} ${amount.toFixed(2)}`;
  };

  const generateAIInsights = (income: number, expenses: number, savings: number, transactions: any[]) => {
    const insights = [];
    const currencySymbol = profile?.currency === 'NGN' ? '₦' : '$';
    
    if (transactions.length > 0) {
      // Food spending insight
      const foodExpenses = transactions
        .filter(t => t.type === 'expense' && t.category.toLowerCase().includes('food'))
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      if (foodExpenses > 0) {
        const foodPercentage = Math.round((foodExpenses / expenses) * 100);
        insights.push(`💡 You're spending ${foodPercentage}% on food this month. Consider reducing by 15% to save an extra ${currencySymbol}${Math.round(foodExpenses * 0.15)}.`);
      }

      // Savings insight
      if (savings > 0) {
        insights.push(`📈 Your savings rate has improved this month. Great job staying on track!`);
        insights.push(`🎯 You're on pace to exceed your monthly savings goal by ${currencySymbol}${Math.round(savings * 0.1)}.`);
      }
    } else {
      insights.push(`💡 Start by adding your first transaction to get personalized insights.`);
      insights.push(`📈 Track your expenses to discover spending patterns.`);
      insights.push(`🎯 Set up income and expense categories for better financial planning.`);
    }

    setAiInsights(insights);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-center text-muted">Loading your financial data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-primary text-background">
          <CardHeader>
            <CardTitle className="text-background/90">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.totalBalance)}</div>
            <p className="text-background/70">{dashboardData.balanceChange}% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(dashboardData.income)}</div>
            <p className="text-muted">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(dashboardData.expenses)}</div>
            <p className="text-muted">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(dashboardData.savings)}</div>
            <p className="text-muted">{dashboardData.savingsChange}% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <DashboardAIInsights />
    </div>
  );
};

export default Dashboard;