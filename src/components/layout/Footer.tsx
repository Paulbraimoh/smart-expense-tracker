import { TrendingUp, Twitter, Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <TrendingUp className="h-6 w-6 text-background" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                FinTrack AI
              </span>
            </div>
            <p className="text-muted leading-relaxed">
              Empowering individuals to make smarter financial decisions through 
              AI-powered insights and intelligent money management.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-muted hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#dashboard" className="text-muted hover:text-foreground transition-colors">Dashboard</a></li>
              <li><a href="#pricing" className="text-muted hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="text-muted hover:text-foreground transition-colors">API</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="text-muted hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="text-muted hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted hover:text-foreground transition-colors">Security</a></li>
              <li><a href="#" className="text-muted hover:text-foreground transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center">
          <div className="text-muted text-sm">
            © 2025 FinTrack AI. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <a 
              href="#" 
              className="text-muted hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-muted hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-muted hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;