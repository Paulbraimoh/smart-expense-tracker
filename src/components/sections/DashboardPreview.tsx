import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const mockData = [
  { month: 'Jan', income: 4000, expenses: 2400 },
  { month: 'Feb', income: 3000, expenses: 1398 },
  { month: 'Mar', income: 5000, expenses: 9800 },
  { month: 'Apr', income: 2780, expenses: 3908 },
  { month: 'May', income: 1890, expenses: 4800 },
  { month: 'Jun', income: 2390, expenses: 3800 }
];

const pieData = [
  { name: 'Food', value: 30, color: '#8B5CF6' },
  { name: 'Transport', value: 20, color: '#3B82F6' },
  { name: 'Entertainment', value: 15, color: '#10B981' },
  { name: 'Bills', value: 25, color: '#F59E0B' },
  { name: 'Other', value: 10, color: '#EF4444' }
];

const DashboardPreview = () => {
  return (
    <section id="dashboard" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Your Financial{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Command Center
            </span>
          </h2>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            Get a complete overview of your finances with our intuitive dashboard and powerful analytics.
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-card-elevated border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Total Balance</p>
                  <p className="text-2xl font-bold text-foreground">$12,450</p>
                </div>
                <div className="p-3 bg-gradient-primary rounded-lg">
                  <DollarSign className="h-6 w-6 text-background" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card-elevated border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Monthly Income</p>
                  <p className="text-2xl font-bold text-success">$4,200</p>
                </div>
                <div className="p-3 bg-success rounded-lg">
                  <TrendingUp className="h-6 w-6 text-success-foreground" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card-elevated border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Monthly Expenses</p>
                  <p className="text-2xl font-bold text-destructive">$2,850</p>
                </div>
                <div className="p-3 bg-destructive rounded-lg">
                  <TrendingDown className="h-6 w-6 text-destructive-foreground" />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card-elevated border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Savings Goal</p>
                  <p className="text-2xl font-bold text-primary">68%</p>
                </div>
                <div className="p-3 bg-gradient-secondary rounded-lg">
                  <Target className="h-6 w-6 text-background" />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="p-6 bg-card-elevated border-border">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Income vs Expenses</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockData}>
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={3} />
                      <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card-elevated border-border">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Spending Breakdown</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;