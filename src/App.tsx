import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import Index from "./pages/Index";
import Scheduling from "./pages/Scheduling";
import Reports from "./pages/Reports";
import Employees from "./pages/Employees";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background">
            <AppSidebar />
            
            <div className="flex-1 flex flex-col">
              {/* Global header with sidebar trigger */}
              <header className="h-16 flex items-center border-b border-border bg-card px-6">
                <SidebarTrigger className="mr-4 text-muted-foreground hover:text-foreground" />
                <div className="flex-1">
                  <h1 className="text-xl font-semibold text-foreground">Restaurant Schedule Management</h1>
                </div>
              </header>

              {/* Main content */}
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/scheduling" element={<Scheduling />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
