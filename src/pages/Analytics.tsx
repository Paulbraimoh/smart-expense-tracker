import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

interface Transaction {
  amount: number;
  category: string;
  type: string;
  date: string;
}

interface ChartData {
  name: string;
  value: number;
  amount?: number;
  income?: number;
  expenses?: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff7f', '#ff6b6b', '#4ecdc4', '#45b7d1'];

const Analytics = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('3months');

  useEffect(() => {
    fetchTransactions();
  }, [user, timeRange]);

  const fetchTransactions = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '1month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('amount, category, type, date')
      .eq('user_id', user.id)
      .gte('date', startDate.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (!error && data) {
      setTransactions(data);
    }
    setLoading(false);
  };

  // Calculate category breakdown for expenses
  const getCategoryBreakdown = (): ChartData[] => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const categoryTotals: { [key: string]: number } = {};
    
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };

  // Calculate monthly trends
  const getMonthlyTrends = (): ChartData[] => {
    const monthlyData: { [key: string]: { income: number; expenses: number } } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += transaction.amount;
      } else {
        monthlyData[monthKey].expenses += transaction.amount;
      }
    });
    
    return Object.entries(monthlyData)
      .map(([name, data]) => ({
        name: new Date(name + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        income: data.income,
        expenses: data.expenses,
        value: data.income - data.expenses
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  // Calculate top spending categories
  const getTopSpendingCategories = (): ChartData[] => {
    const categoryData = getCategoryBreakdown();
    return categoryData.slice(0, 6);
  };

  // Calculate summary stats
  const getSummaryStats = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const netIncome = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;
    
    return {
      totalIncome,
      totalExpenses,
      netIncome,
      savingsRate,
      avgMonthlyIncome: totalIncome / (timeRange === '1month' ? 1 : timeRange === '3months' ? 3 : timeRange === '6months' ? 6 : 12),
      avgMonthlyExpenses: totalExpenses / (timeRange === '1month' ? 1 : timeRange === '3months' ? 3 : timeRange === '6months' ? 6 : 12)
    };
  };

  const categoryBreakdown = getCategoryBreakdown();
  const monthlyTrends = getMonthlyTrends();
  const topSpendingCategories = getTopSpendingCategories();
  const stats = getSummaryStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">${stats.totalIncome.toFixed(2)}</div>
            <p className="text-xs text-muted">
              Avg: ${stats.avgMonthlyIncome.toFixed(2)}/month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">${stats.totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted">
              Avg: ${stats.avgMonthlyExpenses.toFixed(2)}/month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.netIncome >= 0 ? 'text-success' : 'text-destructive'}`}>
              ${stats.netIncome.toFixed(2)}
            </div>
            <p className="text-xs text-muted">
              {stats.netIncome >= 0 ? 'Surplus' : 'Deficit'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.savingsRate.toFixed(1)}%</div>
            <p className="text-xs text-muted">
              {stats.savingsRate >= 20 ? 'Excellent!' : stats.savingsRate >= 10 ? 'Good' : 'Needs improvement'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Income vs Expenses */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Income vs Expenses Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#22c55e" name="Income" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Expenses" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Spending by Category (Pie Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryBreakdown.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryBreakdown.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Spending Categories (Bar Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>Top Spending Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topSpendingCategories} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card className="bg-gradient-subtle border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="p-1 bg-gradient-primary rounded">
              <TrendingUp className="h-4 w-4 text-background" />
            </div>
            <span>AI Financial Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.savingsRate < 10 && (
              <div className="p-3 bg-card rounded-lg border border-border">
                <p className="text-sm">💡 Your savings rate is {stats.savingsRate.toFixed(1)}%. Consider reducing expenses or increasing income to reach the recommended 20% savings rate.</p>
              </div>
            )}
            
            {categoryBreakdown.length > 0 && (
              <div className="p-3 bg-card rounded-lg border border-border">
                <p className="text-sm">📊 Your highest spending category is "{categoryBreakdown[0].name}" at ${categoryBreakdown[0].value.toFixed(2)}. Consider ways to optimize this expense.</p>
              </div>
            )}
            
            {stats.netIncome > 0 && (
              <div className="p-3 bg-card rounded-lg border border-border">
                <p className="text-sm">🎯 Great job! You have a positive net income of ${stats.netIncome.toFixed(2)}. Consider investing this surplus for long-term growth.</p>
              </div>
            )}
            
            {monthlyTrends.length > 1 && (
              <div className="p-3 bg-card rounded-lg border border-border">
                <p className="text-sm">📈 Your spending pattern shows {monthlyTrends[monthlyTrends.length - 1].expenses > monthlyTrends[0].expenses ? 'an increase' : 'a decrease'} in expenses compared to earlier months.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;