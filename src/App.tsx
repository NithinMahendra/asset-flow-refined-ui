
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminDataProvider } from "./contexts/AdminDataContext";
import Index from "./pages/Index";
import RoleSelection from "./pages/RoleSelection";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EmployeeLogin from "./pages/employee/EmployeeLogin";
import EmployeeSignup from "./pages/employee/EmployeeSignup";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import MyAssets from "./pages/employee/MyAssets";
import ScanAsset from "./pages/employee/ScanAsset";
import RequestHistory from "./pages/employee/RequestHistory";
import Dashboard from "./pages/Dashboard";
import AssetList from "./pages/AssetList";
import AddAsset from "./pages/AddAsset";
import AssetDetail from "./pages/AssetDetail";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AuthProvider>
                <AdminDataProvider>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/select-role" element={<RoleSelection />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/signup" element={<AdminSignup />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    
                    {/* Employee Routes */}
                    <Route path="/employee/login" element={<EmployeeLogin />} />
                    <Route path="/employee/signup" element={<EmployeeSignup />} />
                    <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
                    <Route path="/employee/my-assets" element={<MyAssets />} />
                    <Route path="/employee/scan-asset" element={<ScanAsset />} />
                    <Route path="/employee/scan" element={<Navigate to="/employee/scan-asset" replace />} />
                    <Route path="/employee/request-history" element={<RequestHistory />} />
                    
                    {/* Legacy Routes */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/assets" element={<AssetList />} />
                    <Route path="/add-asset" element={<AddAsset />} />
                    <Route path="/asset/:id" element={<AssetDetail />} />
                    <Route path="/analytics" element={<Analytics />} />
                    
                    {/* Catch all route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AdminDataProvider>
              </AuthProvider>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </div>
  );
};

export default App;
