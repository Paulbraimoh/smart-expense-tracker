import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Check, Trash2, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      generateSampleNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
    } else {
      setNotifications(data || []);
    }
    setLoading(false);
  };

  // Generate sample notifications for demo purposes
  const generateSampleNotifications = async () => {
    if (!user) return;

    // Check if we already have notifications
    const { data: existing } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    if (existing && existing.length > 0) return;

    // Create sample notifications
    const sampleNotifications = [
      {
        user_id: user.id,
        title: 'Monthly Budget Alert',
        message: 'You have spent 85% of your monthly budget. Consider reviewing your expenses for the remaining days.',
        type: 'warning'
      },
      {
        user_id: user.id,
        title: 'Unusual Spending Detected',
        message: 'Your spending in the "Entertainment" category is 40% higher than usual this month.',
        type: 'info'
      },
      {
        user_id: user.id,
        title: 'Savings Goal Achievement',
        message: 'Congratulations! You have reached 75% of your monthly savings goal.',
        type: 'success'
      },
      {
        user_id: user.id,
        title: 'Low Balance Warning',
        message: 'Your account balance is below $500. Consider reviewing your upcoming expenses.',
        type: 'warning'
      },
      {
        user_id: user.id,
        title: 'Weekly Summary Ready',
        message: 'Your weekly financial summary is ready. You saved $120 this week compared to last week.',
        type: 'info'
      }
    ];

    await supabase.from('notifications').insert(sampleNotifications);
    fetchNotifications();
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      });
    } else {
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive"
      });
    } else {
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      toast({
        title: "Success",
        description: "All notifications marked as read"
      });
    }
  };

  const deleteNotification = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive"
      });
    } else {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
      toast({
        title: "Success",
        description: "Notification deleted"
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationBadgeVariant = (type: string) => {
    switch (type) {
      case 'warning':
        return 'secondary';
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-sm">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
          <Button variant="outline" disabled>
            <Bell className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Notification Preferences Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notification Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Budget Alerts</span>
              </div>
              <p className="text-sm text-muted">Get notified when you exceed budget limits</p>
              <Badge variant="default" className="mt-2">Enabled</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Info className="h-4 w-4 text-blue-500" />
                <span className="font-medium">Spending Insights</span>
              </div>
              <p className="text-sm text-muted">AI-powered spending pattern alerts</p>
              <Badge variant="default" className="mt-2">Enabled</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">Goal Updates</span>
              </div>
              <p className="text-sm text-muted">Progress on your financial goals</p>
              <Badge variant="default" className="mt-2">Enabled</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <BellOff className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Weekly Reports</span>
              </div>
              <p className="text-sm text-muted">Weekly financial summary emails</p>
              <Badge variant="secondary" className="mt-2">Disabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-muted text-center">
                You're all caught up! We'll notify you when there's something important to share.
              </p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card key={notification.id} className={`transition-colors ${!notification.read ? 'bg-surface border-primary/20' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">{notification.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getNotificationBadgeVariant(notification.type)} className="text-xs">
                          {notification.type}
                        </Badge>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted mb-3">{notification.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted">
                        {format(new Date(notification.created_at), 'MMM dd, yyyy • h:mm a')}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;