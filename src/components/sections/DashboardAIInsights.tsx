import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, AlertTriangle, DollarSign, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Insight {
  title: string;
  description: string;
  type: string;
}

const DashboardAIInsights = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAIInsights = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('ai-insights', {
          body: { userId: user.id }
        });

        if (error) throw error;
        
        setInsights(data.insights || []);
      } catch (error) {
        console.error('Error fetching AI insights:', error);
        // Fallback insights
        setInsights([
          {
            title: "Connect Your Data",
            description: "Add more transactions to get personalized AI insights about your spending patterns.",
            type: "info"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAIInsights();
  }, [user]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "saving":
        return <DollarSign className="h-4 w-4" />;
      case "investment":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "warning":
        return "destructive";
      case "saving":
        return "default";
      case "investment":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Financial Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing your financial data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Financial Insights
        </CardTitle>
        <CardDescription>
          Personalized recommendations based on your spending patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
            <div className="flex-shrink-0 mt-1">
              {getInsightIcon(insight.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium">{insight.title}</h4>
                <Badge variant={getInsightColor(insight.type) as any} className="text-xs">
                  AI Powered
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DashboardAIInsights;