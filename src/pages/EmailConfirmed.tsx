import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const EmailConfirmed = () => {
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the token hash and type from URL parameters
        const tokenHash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        if (!tokenHash || !type) {
          setError('Invalid confirmation link');
          setLoading(false);
          return;
        }

        // Verify the email confirmation
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as any,
        });

        if (error) {
          throw error;
        }

        if (data.user) {
          setConfirmed(true);
          toast({
            title: "Email Confirmed!",
            description: "Your email has been successfully verified.",
          });
          
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        }
      } catch (err: any) {
        console.error('Email confirmation error:', err);
        setError(err.message || 'Failed to confirm email');
        toast({
          title: "Confirmation Failed",
          description: err.message || 'Failed to confirm email',
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    handleEmailConfirmation();
  }, [searchParams, navigate, toast]);

  const handleContinue = () => {
    navigate('/dashboard');
  };

  const handleReturnToAuth = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <TrendingUp className="h-6 w-6 text-background" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              FinTrack AI
            </span>
          </div>
        </div>

        <Card className="bg-card-elevated border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {loading ? (
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
              ) : confirmed ? (
                <CheckCircle className="h-12 w-12 text-success" />
              ) : (
                <XCircle className="h-12 w-12 text-destructive" />
              )}
            </div>
            <CardTitle>
              {loading ? 'Confirming Email...' : confirmed ? 'Email Confirmed!' : 'Confirmation Failed'}
            </CardTitle>
            <CardDescription>
              {loading 
                ? 'Please wait while we verify your email address.'
                : confirmed 
                ? 'Your email has been successfully verified. You will be redirected to your dashboard shortly.'
                : error || 'There was an issue confirming your email address.'
              }
            </CardDescription>
          </CardHeader>
          
          {!loading && (
            <CardContent className="space-y-4">
              {confirmed ? (
                <Button 
                  onClick={handleContinue}
                  className="w-full" 
                  variant="hero"
                >
                  Continue to Dashboard
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button 
                    onClick={handleReturnToAuth}
                    className="w-full" 
                    variant="hero"
                  >
                    Return to Sign In
                  </Button>
                  <p className="text-sm text-muted text-center">
                    Need help? Contact support or try signing up again.
                  </p>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EmailConfirmed;