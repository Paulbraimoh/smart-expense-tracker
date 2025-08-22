import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-primary relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-90" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-background animate-pulse" />
              <span className="text-background/80 font-medium">Start Your Financial Journey</span>
              <Sparkles className="h-6 w-6 text-background animate-pulse" />
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-background">
              Take Control of Your Finances Today
            </h2>
            
            <p className="text-xl text-background/90 max-w-2xl mx-auto leading-relaxed">
              Join thousands of users who have already transformed their financial lives 
              with AI-powered insights and smart money management.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-background/10 backdrop-blur-sm border-background/30 text-background hover:bg-background hover:text-primary group"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex items-center space-x-4 text-background/80">
              <span className="text-sm">✓ No credit card required</span>
              <span className="text-sm">✓ 14-day free trial</span>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 border-t border-background/20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-background/90">
              <div className="text-center">
                <div className="text-2xl font-bold">50,000+</div>
                <div className="text-sm">Happy Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">$10M+</div>
                <div className="text-sm">Money Saved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">4.9/5</div>
                <div className="text-sm">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;