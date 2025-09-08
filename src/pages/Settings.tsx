import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { User, Mail, Save, Upload, AlertCircle, Bell } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  currency: string;
}

const CURRENCIES = [
  { value: 'NGN', label: 'Nigerian Naira (₦)' },
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
  { value: 'CAD', label: 'Canadian Dollar (C$)' },
  { value: 'AUD', label: 'Australian Dollar (A$)' },
  { value: 'CHF', label: 'Swiss Franc (CHF)' },
  { value: 'CNY', label: 'Chinese Yuan (¥)' },
];

const Settings = () => {
  const { user, signOut } = useAuth();
  const { profile: contextProfile, refreshProfile } = useProfile();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: false
  });
  
  const [formData, setFormData] = useState({
    display_name: '',
    currency: 'NGN',
    email: user?.email || ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, email: user.email || '' }));
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      // If no profile exists, create one
      if (error.code === 'PGRST116') {
        await createProfile();
      }
    } else if (data) {
      setProfile(data);
      setFormData({
        display_name: data.display_name || '',
        currency: data.currency || 'NGN',
        email: user?.email || ''
      });
    }
    setLoading(false);
  };

  const createProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: user.id,
        display_name: user.email?.split('@')[0] || 'User',
        currency: 'NGN'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
    } else {
      setProfile(data);
      setFormData({
        display_name: data.display_name || '',
        currency: data.currency || 'NGN',
        email: user?.email || ''
      });
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setSaving(true);
    
    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: formData.display_name,
        currency: formData.currency
      })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      fetchProfile();
      refreshProfile(); // Update global profile context
    }
    
    setSaving(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setSaving(true);
      
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;
      
      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Profile image uploaded",
        description: "Your profile image has been updated successfully.",
      });
      
      // Refresh profile data
      fetchProfile();
      refreshProfile(); // Update global profile context
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload profile image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;

    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/auth`
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send password reset email",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Password reset email sent! Check your inbox."
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      // First delete the profile
      if (profile) {
        await supabase.from('profiles').delete().eq('user_id', user?.id);
      }
      
      // Then sign out (the user will need to contact support to fully delete their auth account)
      await signOut();
      
      toast({
        title: "Account Data Deleted",
        description: "Your account data has been removed. Contact support to fully delete your authentication account."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account data",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profile Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback className="text-lg">
                  {formData.display_name ? formData.display_name.charAt(0).toUpperCase() : 
                   user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Profile Image
                </Button>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <p className="text-sm text-muted">JPG, PNG up to 2MB</p>
              </div>
            </div>

            <Separator />

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  placeholder="Enter your display name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-surface"
                />
                <p className="text-sm text-muted mt-1">Email cannot be changed</p>
              </div>

              <div>
                <Label htmlFor="currency">Preferred Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map(currency => (
                      <SelectItem key={currency.value} value={currency.value}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Password</h3>
            <p className="text-sm text-muted mb-4">Change your account password</p>
            <Button variant="outline" onClick={handlePasswordReset}>
              <Mail className="h-4 w-4 mr-2" />
              Send Password Reset Email
            </Button>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2 text-destructive">Danger Zone</h3>
            <Alert className="border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Deleting your account will permanently remove all your data. This action cannot be undone.
              </AlertDescription>
            </Alert>
            <Button 
              variant="destructive" 
              className="mt-4"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Application Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Application Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Data Export</h3>
            <p className="text-sm text-muted mb-4">Download your financial data</p>
            <Button variant="outline" disabled>
              Export Data (Coming Soon)
            </Button>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-4 flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notification Preferences</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted">Receive updates via email</p>
                </div>
                <Switch 
                  checked={notificationSettings.email}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, email: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted">Get notifications on your device</p>
                </div>
                <Switch 
                  checked={notificationSettings.push}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, push: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted">Receive text messages for important updates</p>
                </div>
                <Switch 
                  checked={notificationSettings.sms}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, sms: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Communications</p>
                  <p className="text-sm text-muted">Tips, offers, and product updates</p>
                </div>
                <Switch 
                  checked={notificationSettings.marketing}
                  onCheckedChange={(checked) => 
                    setNotificationSettings(prev => ({ ...prev, marketing: checked }))
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;