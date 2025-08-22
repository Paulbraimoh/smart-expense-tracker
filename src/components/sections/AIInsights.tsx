import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, TrendingDown, ArrowRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";

const trendData = [
  { month: 'Jan', spending: 2400 },
  { month: 'Feb', spending: 2200 },
  { month: 'Mar', spending: 2800 },
  { month: 'Apr', spending: 2600 },
  { month: 'May', spending: 2300 },
  { month: 'Jun', spending: 2100 }
];

const AIInsights = () => {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            AI-Powered{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Financial Intelligence
            </span>
          </h2>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            Our advanced AI analyzes your spending patterns and provides personalized recommendations.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* AI Insight Card */}
          <div className="space-y-6">
            <Card className="p-6 bg-card-elevated border-border shadow-elevated">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-primary rounded-lg">
                    <Brain className="h-5 w-5 text-background" />
                  </div>
                  <span className="text-sm font-medium text-primary">AI Insight</span>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    Smart Savings Opportunity Detected
                  </h3>
                  <p className="text-muted leading-relaxed">
                    You're spending 32% of your income on food delivery. By reducing this to 20%, 
                    you could save <span className="text-success font-semibold">$240 per month</span> 
                    and reach your savings goal 3 months earlier.
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg border border-success/20">
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="h-5 w-5 text-success" />
                    <span className="text-sm font-medium text-success">Potential Monthly Savings</span>
                  </div>
                  <span className="text-lg font-bold text-success">$240</span>
                </div>

                <Button variant="outline" className="w-full group">
                  Apply This Suggestion
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-card-elevated border-border">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">15</div>
                  <div className="text-sm text-muted">Active Insights</div>
                </div>
              </Card>
              <Card className="p-4 bg-card-elevated border-border">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-success">$1,250</div>
                  <div className="text-sm text-muted">Saved This Month</div>
                </div>
              </Card>
            </div>
          </div>

          {/* Spending Trend Chart */}
          <div>
            <Card className="p-6 bg-card-elevated border-border">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-foreground">Spending Trend Analysis</h3>
                  <div className="flex items-center space-x-2 text-success">
                    <TrendingDown className="h-4 w-4" />
                    <span className="text-sm font-medium">-12% vs last month</span>
                  </div>
                </div>
                
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Area 
                        type="monotone" 
                        dataKey="spending" 
                        stroke="#8B5CF6" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorSpending)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="text-sm text-muted">
                  AI predicts you'll save an additional $180 next month based on current trends.
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIInsights;