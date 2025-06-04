
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminDataProvider } from "./contexts/AdminDataContext";
import ProtectedRoute from "./components/ProtectedRoute";
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
                    <Route path="/" element={<RoleSelection />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/signup" element={<AdminSignup />} />
                    <Route path="/admin/dashboard" element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    
                    {/* Employee Routes */}
                    <Route path="/employee/login" element={<EmployeeLogin />} />
                    <Route path="/employee/signup" element={<EmployeeSignup />} />
                    <Route path="/employee/dashboard" element={
                      <ProtectedRoute requiredRole="employee">
                        <EmployeeDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/employee/my-assets" element={
                      <ProtectedRoute requiredRole="employee">
                        <MyAssets />
                      </ProtectedRoute>
                    } />
                    <Route path="/employee/scan-asset" element={
                      <ProtectedRoute requiredRole="employee">
                        <ScanAsset />
                      </ProtectedRoute>
                    } />
                    <Route path="/employee/scan" element={<Navigate to="/employee/scan-asset" replace />} />
                    <Route path="/employee/request-history" element={
                      <ProtectedRoute requiredRole="employee">
                        <RequestHistory />
                      </ProtectedRoute>
                    } />
                    
                    {/* Legacy Routes - Protected */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/assets" element={
                      <ProtectedRoute>
                        <AssetList />
                      </ProtectedRoute>
                    } />
                    <Route path="/add-asset" element={
                      <ProtectedRoute>
                        <AddAsset />
                      </ProtectedRoute>
                    } />
                    <Route path="/asset/:id" element={
                      <ProtectedRoute>
                        <AssetDetail />
                      </ProtectedRoute>
                    } />
                    <Route path="/analytics" element={
                      <ProtectedRoute>
                        <Analytics />
                      </ProtectedRoute>
                    } />
                    
                    {/* Redirect old routes */}
                    <Route path="/select-role" element={<Navigate to="/" replace />} />
                    
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
