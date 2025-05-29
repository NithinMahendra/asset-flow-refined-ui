
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
  Users,
  QrCode,
  FileText,
  Settings,
  Bell,
  LogOut,
  Building,
  UserCheck
} from 'lucide-react';
import { AdminDataProvider } from '@/contexts/AdminDataContext';

// Import content components
import OverviewContent from '@/components/admin/OverviewContent';
import AssetManagementContent from '@/components/admin/AssetManagementContent';
import AssignmentsContent from '@/components/admin/AssignmentsContent';
import QRCodesContent from '@/components/admin/QRCodesContent';
import ReportsContent from '@/components/admin/ReportsContent';
import UserManagementContent from '@/components/admin/UserManagementContent';
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
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'assets', label: 'Asset Management', icon: Package },
    { id: 'assignments', label: 'Assignments', icon: UserCheck },
    { id: 'qr-codes', label: 'QR Codes', icon: QrCode },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewContent />;
      case 'assets':
        return <AssetManagementContent />;
      case 'assignments':
        return <AssignmentsContent />;
      case 'qr-codes':
        return <QRCodesContent />;
      case 'reports':
        return <ReportsContent />;
      case 'users':
        return <UserManagementContent />;
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
      <div className="min-h-screen bg-gray-50">
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full">
            <Sidebar className="border-r border-gray-200">
              <SidebarHeader className="border-b border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-semibold text-gray-900">AssetPro</h1>
                    <p className="text-xs text-gray-500">Admin Panel</p>
                  </div>
                </div>
              </SidebarHeader>
              
              <SidebarContent className="px-2 py-4">
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {menuItems.map((item) => (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            isActive={activeTab === item.id}
                            onClick={() => setActiveTab(item.id)}
                            className="w-full justify-start hover:bg-gray-100 data-[active=true]:bg-gray-900 data-[active=true]:text-white"
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              
              <SidebarFooter className="border-t border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gray-200 text-gray-700">
                        {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        Administrator
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="h-8 w-8 text-gray-500 hover:text-gray-700"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </SidebarFooter>
            </Sidebar>
            
            <SidebarInset className="flex-1">
              <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <SidebarTrigger className="h-8 w-8" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      {menuItems.find(item => item.id === activeTab)?.label}
                    </h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Export Data
                    </Button>
                    <Button size="sm">
                      New Asset
                    </Button>
                  </div>
                </div>
              </header>
              
              <main className="flex-1 p-6">
                {renderContent()}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </AdminDataProvider>
  );
};

export default AdminDashboard;
