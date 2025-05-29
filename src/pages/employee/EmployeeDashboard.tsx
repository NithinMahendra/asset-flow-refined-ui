
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, User, Clock, Bell, LogOut, Smartphone, Laptop } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats] = useState({
    assignedAssets: 3,
    pendingRequests: 1,
    totalRequests: 8,
    lastActivity: '2 hours ago'
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const myAssets = [
    { name: 'MacBook Pro 16"', type: 'Laptop', serial: 'MBA-2024-001', status: 'Active', assignedDate: '2024-01-15' },
    { name: 'iPhone 15 Pro', type: 'Mobile', serial: 'IPH-2024-042', status: 'Active', assignedDate: '2024-02-01' },
    { name: 'AirPods Pro', type: 'Accessory', serial: 'APD-2024-123', status: 'Active', assignedDate: '2024-02-15' },
  ];

  const recentRequests = [
    { item: 'iPad Air', status: 'Pending', date: '2024-01-20', type: 'Request' },
    { item: 'MacBook Pro 16"', status: 'Approved', date: '2024-01-15', type: 'Request' },
    { item: 'iPhone 15 Pro', status: 'Approved', date: '2024-02-01', type: 'Request' },
  ];

  const quickActions = [
    { title: 'Request New Asset', icon: Plus, color: 'bg-green-500', action: () => {} },
    { title: 'View My Assets', icon: Package, color: 'bg-blue-500', action: () => {} },
    { title: 'Update Profile', icon: User, color: 'bg-purple-500', action: () => {} },
    { title: 'Request History', icon: Clock, color: 'bg-orange-500', action: () => {} },
  ];

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
                {stats.pendingRequests > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                    {stats.pendingRequests}
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
                  {recentRequests.map((request, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-sm">{request.item}</p>
                        <p className="text-xs text-gray-500">{request.date}</p>
                      </div>
                      <Badge variant={request.status === 'Approved' ? 'default' : request.status === 'Pending' ? 'secondary' : 'destructive'}>
                        {request.status}
                      </Badge>
                    </motion.div>
                  ))}
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
                <CardTitle>My Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myAssets.map((asset, index) => (
                    <motion.div
                      key={asset.serial}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        {asset.type === 'Laptop' ? <Laptop className="h-6 w-6 text-green-600 dark:text-green-400" /> :
                         asset.type === 'Mobile' ? <Smartphone className="h-6 w-6 text-green-600 dark:text-green-400" /> :
                         <Package className="h-6 w-6 text-green-600 dark:text-green-400" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{asset.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Serial: {asset.serial}</p>
                        <p className="text-xs text-gray-500">Assigned: {asset.assignedDate}</p>
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {asset.status}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
