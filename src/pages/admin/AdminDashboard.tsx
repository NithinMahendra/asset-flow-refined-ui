import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  BarChart3,
  Package,
  QrCode,
  FileText,
  Settings,
  Bell,
  LogOut,
  Building,
  Download,
  Plus
} from 'lucide-react';
import { AdminDataProvider } from '@/contexts/AdminDataContext';
import { motion } from 'framer-motion';

// Import content components
import OverviewContent from '@/components/admin/OverviewContent';
import AssetManagementContent from '@/components/admin/AssetManagementContent';
import QRCodesContent from '@/components/admin/QRCodesContent';
import ReportsContent from '@/components/admin/ReportsContent';
import SettingsContent from '@/components/admin/SettingsContent';
import NotificationsContent from '@/components/admin/NotificationsContent';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3, gradient: 'from-blue-500 to-indigo-600' },
    { id: 'assets', label: 'Asset Management', icon: Package, gradient: 'from-emerald-500 to-teal-600' },
    { id: 'qr-codes', label: 'QR Codes', icon: QrCode, gradient: 'from-amber-500 to-orange-600' },
    { id: 'reports', label: 'Reports', icon: FileText, gradient: 'from-rose-500 to-red-600' },
    { id: 'notifications', label: 'Notifications', icon: Bell, gradient: 'from-pink-500 to-rose-600' },
    { id: 'settings', label: 'Settings', icon: Settings, gradient: 'from-slate-500 to-slate-600' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewContent />;
      case 'assets':
        return <AssetManagementContent />;
      case 'qr-codes':
        return <QRCodesContent />;
      case 'reports':
        return <ReportsContent />;
      case 'notifications':
        return <NotificationsContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <OverviewContent />;
    }
  };

  return (
    <AdminDataProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full">
            <Sidebar className="sidebar-gradient border-r border-white/30 dark:border-slate-700/30 shadow-xl">
              <SidebarHeader className="border-b border-white/30 dark:border-slate-700/30 p-6">
                <motion.div 
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="font-bold text-xl text-gradient-primary">AssetPro</h1>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Admin Panel</p>
                  </div>
                </motion.div>
              </SidebarHeader>
              
              <SidebarContent className="px-3 py-6">
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-2">
                      {menuItems.map((item, index) => (
                        <SidebarMenuItem key={item.id}>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <SidebarMenuButton
                              isActive={activeTab === item.id}
                              onClick={() => setActiveTab(item.id)}
                              className={`w-full justify-start rounded-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden ${
                                activeTab === item.id
                                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg hover:shadow-xl`
                                  : 'text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50'
                              }`}
                            >
                              <div className="flex items-center space-x-3 relative z-10">
                                <item.icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${
                                  activeTab === item.id ? 'text-white' : 'text-slate-600 dark:text-slate-400'
                                }`} />
                                <span className="font-medium">{item.label}</span>
                              </div>
                              {activeTab === item.id && (
                                <motion.div
                                  className="absolute inset-0 bg-white/20 rounded-xl"
                                  layoutId="activeTab"
                                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                              )}
                            </SidebarMenuButton>
                          </motion.div>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              
              <SidebarFooter className="border-t border-white/30 dark:border-slate-700/30 p-4">
                <motion.div 
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10 ring-2 ring-blue-200 dark:ring-blue-800">
                      <AvatarFallback className="gradient-primary text-white font-semibold">
                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                        Administrator
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 hover:scale-110"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </motion.div>
              </SidebarFooter>
            </Sidebar>
            
            <SidebarInset className="flex-1">
              <header className="glass-effect-strong border-b border-white/30 dark:border-slate-700/30 px-6 py-4 sticky top-0 z-40">
                <motion.div 
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center space-x-4">
                    <SidebarTrigger className="h-8 w-8 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all duration-300 hover:scale-110" />
                    <h2 className="text-responsive-xl font-bold text-gradient-primary">
                      {menuItems.find(item => item.id === activeTab)?.label}
                    </h2>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-white/50 glass-effect hover:scale-105 transition-all duration-300 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button 
                      size="sm" 
                      className="btn-gradient-primary hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Asset
                    </Button>
                  </div>
                </motion.div>
              </header>
              
              <main className="flex-1 bg-gradient-to-br from-slate-50/50 via-blue-50/50 to-indigo-50/50 dark:from-slate-900/50 dark:via-blue-900/50 dark:to-indigo-900/50 min-h-screen">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="p-6"
                >
                  {renderContent()}
                </motion.div>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </AdminDataProvider>
  );
};

export default AdminDashboard;
