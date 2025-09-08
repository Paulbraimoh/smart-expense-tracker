import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from "@/hooks/useAuth";
import { ProfileProvider } from "@/hooks/useProfile";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProfileProvider>
          <Router>
            <App />
            <Toaster />
          </Router>
        </ProfileProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
