import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, User, Clock, Bell, LogOut, Smartphone, Laptop, QrCode } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';
import AssetRequestModal from '@/components/employee/AssetRequestModal';
import ProfileUpdateModal from '@/components/employee/ProfileUpdateModal';
import { EmployeeService } from '@/services/employeeService';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    assignedAssets: 0,
    pendingRequests: 0,
    totalRequests: 0,
    unreadNotifications: 0,
    lastActivity: 'No activity'
  });
  const [assets, setAssets] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, assetsData, requestsData] = await Promise.all([
        EmployeeService.getEmployeeStats(),
        EmployeeService.getMyAssets(),
        EmployeeService.getMyRequests()
      ]);
      
      setStats(statsData);
      setAssets(assetsData.slice(0, 3)); // Show only first 3 assets
      setRequests(requestsData.slice(0, 3)); // Show only first 3 requests
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const quickActions = [
    { 
      title: 'Scan Asset', 
      icon: QrCode, 
      color: 'bg-green-500', 
      action: () => navigate('/employee/scan')
    },
    { 
      title: 'Request New Asset', 
      icon: Package, 
      color: 'bg-blue-500', 
      action: () => setShowRequestModal(true)
    },
    { 
      title: 'View My Assets', 
      icon: Package, 
      color: 'bg-purple-500', 
      action: () => navigate('/employee/assets')
    },
    { 
      title: 'Update Profile', 
      icon: User, 
      color: 'bg-orange-500', 
      action: () => setShowProfileModal(true)
    },
    { 
      title: 'Request History', 
      icon: Clock, 
      color: 'bg-indigo-500', 
      action: () => navigate('/employee/requests')
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Approved</Badge>;
      case 'fulfilled':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Fulfilled</Badge>;
      case 'denied':
        return <Badge variant="destructive">Denied</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-green-200/20 dark:border-green-700/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  My Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome back, {user?.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {stats.unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                    {stats.unreadNotifications}
                  </Badge>
                )}
              </Button>
              <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'My Assets', value: stats.assignedAssets, icon: Package, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900' },
            { title: 'Pending Requests', value: stats.pendingRequests, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900' },
            { title: 'Total Requests', value: stats.totalRequests, icon: Bell, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900' },
            { title: 'Last Activity', value: stats.lastActivity, icon: User, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900', isString: true },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="glass-effect hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {stat.isString ? stat.value : Number(stat.value).toLocaleString()}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bg} group-hover:scale-110 transition-transform`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  >
                    <Button
                      onClick={action.action}
                      variant="ghost"
                      className="w-full justify-start h-12 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className={`p-2 rounded-lg ${action.color} text-white mr-3`}>
                        <action.icon className="h-4 w-4" />
                      </div>
                      {action.title}
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Requests */}
            <Card className="glass-effect mt-6">
              <CardHeader>
                <CardTitle>Recent Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {requests.length > 0 ? requests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-sm">{request.asset_type}</p>
                        <p className="text-xs text-gray-500">{new Date(request.requested_date).toLocaleDateString()}</p>
                      </div>
                      {getStatusBadge(request.status)}
                    </motion.div>
                  )) : (
                    <p className="text-gray-500 text-sm text-center py-4">No requests yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* My Assets */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="glass-effect">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Assets</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => navigate('/employee/assets')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assets.length > 0 ? assets.map((asset, index) => (
                    <motion.div
                      key={asset.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        {asset.device_type === 'laptop' ? <Laptop className="h-6 w-6 text-green-600 dark:text-green-400" /> :
                         asset.device_type === 'smartphone' ? <Smartphone className="h-6 w-6 text-green-600 dark:text-green-400" /> :
                         <Package className="h-6 w-6 text-green-600 dark:text-green-400" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{asset.brand} {asset.model}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Serial: {asset.serial_number}</p>
                        {asset.purchase_date && (
                          <p className="text-xs text-gray-500">Assigned: {new Date(asset.purchase_date).toLocaleDateString()}</p>
                        )}
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {asset.status}
                      </Badge>
                    </motion.div>
                  )) : (
                    <div className="text-center py-8">
                      <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No assets assigned yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* Modals */}
      <AssetRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSuccess={loadData}
      />
      
      <ProfileUpdateModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSuccess={loadData}
      />
    </div>
  );
};

export default EmployeeDashboard;
