import { Card } from "@/components/ui/card";
import { TrendingUp, Brain, FileText, Shield } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Track Income & Expenses",
    description: "Automatically categorize and track all your financial transactions with smart AI-powered insights."
  },
  {
    icon: Brain,
    title: "AI-Powered Financial Insights",
    description: "Get personalized recommendations and smart suggestions to optimize your spending and savings."
  },
  {
    icon: FileText,
    title: "Smart Reports & Exports",
    description: "Generate detailed financial reports and export data in multiple formats for tax planning."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Bank-level security with end-to-end encryption to keep your financial data safe and private."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Everything You Need to{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Master Your Finances
            </span>
          </h2>
          <p className="text-xl text-muted max-w-3xl mx-auto">
            Powerful tools and AI-driven insights to help you take control of your financial future.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-6 bg-card-elevated border-border hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-4">
                <div className="p-3 bg-gradient-primary rounded-lg w-fit group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-background" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;