
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bell, Plus, Search, Settings, User, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import AssetChart from '@/components/AssetChart';
import NotificationPanel from '@/components/NotificationPanel';
import QuickActions from '@/components/QuickActions';
import { useAdminData } from '@/contexts/AdminDataContext';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const { getAssetStats, getRecentActivity, notifications, loading } = useAdminData();

  const assetStats = getAssetStats();
  const recentActivity = getRecentActivity();
  const unreadNotifications = notifications.filter(n => !n.is_read).length;

  const statsCards = [
    { title: 'Total Devices', value: assetStats.total, color: 'bg-gray-500', icon: '📱' },
    { title: 'In Use', value: assetStats.assigned, color: 'bg-gray-500', icon: '✅' },
    { title: 'Available', value: assetStats.available, color: 'bg-gray-500', icon: '🔄' },
    { title: 'In Repair', value: assetStats.inRepair, color: 'bg-gray-500', icon: '⚠️' },
  ];

  // Helper function to safely convert activity details to string
  const formatActivityDetails = (activity: any) => {
    if (!activity.details) return 'No details available';
    
    if (typeof activity.details === 'string') return activity.details;
    
    if (typeof activity.details === 'object' && activity.details !== null) {
      const { asset_name, serial_number } = activity.details;
      if (asset_name && serial_number) {
        return `${asset_name} (${serial_number})`;
      }
      if (asset_name) {
        return asset_name;
      }
      if (serial_number) {
        return `Serial: ${serial_number}`;
      }
      // Fallback for other object structures
      return JSON.stringify(activity.details);
    }
    
    return 'No details available';
  };

  // Helper function to determine activity type from action
  const getActivityType = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('assignment') || actionLower.includes('assign')) return 'assignment';
    if (actionLower.includes('maintenance') || actionLower.includes('repair')) return 'maintenance';
    if (actionLower.includes('addition') || actionLower.includes('add') || actionLower.includes('create')) return 'addition';
    return 'general';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-gray-200/20 dark:border-gray-700/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-600 bg-clip-text text-transparent">
                Asset Management
              </h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search assets, users, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-gray-500">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
                {showNotifications && <NotificationPanel />}
              </div>
              
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">Welcome back, Admin</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here's an overview of your asset management system
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
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
                      <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                        className="text-3xl font-bold text-gray-900 dark:text-white"
                      >
                        {stat.value.toLocaleString()}
                      </motion.p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.color} text-white text-xl group-hover:scale-110 transition-transform`}>
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Chart and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Asset Trends Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Asset Trends</span>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">Live Data</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AssetChart />
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <QuickActions />
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? recentActivity.map((activity, index) => {
                  const activityType = getActivityType(activity.action);
                  const details = formatActivityDetails(activity);
                  
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        activityType === 'assignment' ? 'bg-gray-500' :
                        activityType === 'maintenance' ? 'bg-gray-500' :
                        activityType === 'addition' ? 'bg-gray-500' : 'bg-gray-500'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {details}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </motion.div>
                  );
                }) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
