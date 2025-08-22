import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  Menu, 
  X, 
  Home, 
  CreditCard, 
  BarChart3, 
  FileText, 
  Settings,
  User,
  LogOut,
  Bell
} from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card-elevated border-b border-border">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <TrendingUp className="h-5 w-5 text-background" />
              </div>
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                FinTrack AI
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-background" />
              </div>
              <span className="hidden sm:block text-sm font-medium">
                {user?.email?.split('@')[0] || 'User'}
              </span>
              <Button variant="ghost" size="icon" onClick={signOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-card-elevated border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors
                      ${activeTab === item.id 
                        ? 'bg-primary text-background' 
                        : 'text-muted hover:text-foreground hover:bg-surface'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-6">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-primary text-background">
                    <CardHeader>
                      <CardTitle className="text-background/90">Total Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$12,450.00</div>
                      <p className="text-background/70">+12% from last month</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Income</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-success">$8,200.00</div>
                      <p className="text-muted">This month</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-destructive">$3,750.00</div>
                      <p className="text-muted">This month</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Savings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">$4,450.00</div>
                      <p className="text-muted">+8% from last month</p>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Insights */}
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
                      <div className="p-3 bg-card rounded-lg border border-border">
                        <p className="text-sm">💡 You're spending 32% on food this month. Consider reducing by 15% to save an extra $120.</p>
                      </div>
                      <div className="p-3 bg-card rounded-lg border border-border">
                        <p className="text-sm">📈 Your savings rate has improved by 8% this month. Great job staying on track!</p>
                      </div>
                      <div className="p-3 bg-card rounded-lg border border-border">
                        <p className="text-sm">🎯 You're on pace to exceed your monthly savings goal by $200.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Transactions</h1>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted text-center">Transaction management coming soon...</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Analytics</h1>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted text-center">Analytics and charts coming soon...</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Reports</h1>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted text-center">Financial reports coming soon...</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Settings</h1>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted text-center">Settings page coming soon...</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;