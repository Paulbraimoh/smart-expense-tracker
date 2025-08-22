import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import DashboardPreview from "@/components/sections/DashboardPreview";
import AIInsights from "@/components/sections/AIInsights";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <DashboardPreview />
      <AIInsights />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
