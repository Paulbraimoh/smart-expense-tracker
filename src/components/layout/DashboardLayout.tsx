import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import AppSidebar from './AppSidebar';
import { Menu, X, Bell, User, LogOut } from 'lucide-react';

const DashboardLayout = () => {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:flex">
      {/* Sidebar */}
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-card-elevated border-b border-border">
          <div className="flex items-center justify-between px-4 h-16">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center space-x-2">
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                FinTrack AI
              </span>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4 ml-auto">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-background" />
                </div>
                <span className="text-sm font-medium">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
              </div>
              
              <Button variant="ghost" size="icon" onClick={signOut} className="lg:hidden">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;