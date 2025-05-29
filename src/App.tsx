
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import RoleSelection from "./pages/RoleSelection";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EmployeeLogin from "./pages/employee/EmployeeLogin";
import EmployeeSignup from "./pages/employee/EmployeeSignup";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import MyAssets from "./pages/employee/MyAssets";
import RequestHistory from "./pages/employee/RequestHistory";
import ScanAsset from "./pages/employee/ScanAsset";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<RoleSelection />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route path="/employee/login" element={<EmployeeLogin />} />
            <Route path="/employee/signup" element={<EmployeeSignup />} />
            
            {/* Protected Admin Routes - All admin functionality now in AdminDashboard */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Employee Routes */}
            <Route 
              path="/employee/dashboard" 
              element={
                <ProtectedRoute requiredRole="employee">
                  <EmployeeDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employee/assets" 
              element={
                <ProtectedRoute requiredRole="employee">
                  <MyAssets />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employee/requests" 
              element={
                <ProtectedRoute requiredRole="employee">
                  <RequestHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employee/scan" 
              element={
                <ProtectedRoute requiredRole="employee">
                  <ScanAsset />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
