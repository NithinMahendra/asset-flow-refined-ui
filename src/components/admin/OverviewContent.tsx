
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { 
  Package, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  Download,
  RefreshCw,
  Activity,
  DollarSign,
  Clock
} from 'lucide-react';

const OverviewContent = () => {
  const { 
    assets, 
    assetRequests, 
    activityLog, 
    notifications, 
    loading, 
    error,
    getAssetStats,
    getAssignmentStats,
    refetch
  } = useSupabaseData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={refetch} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }

  const assetStats = getAssetStats();
  const assignmentStats = getAssignmentStats();

  const stats = [
    {
      title: 'Total Assets',
      value: assetStats.total,
      icon: Package,
      gradient: 'from-blue-500 to-indigo-600',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Available Assets',
      value: assetStats.available,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-600',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Assigned Assets',
      value: assetStats.assigned,
      icon: Users,
      gradient: 'from-violet-500 to-purple-600',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Total Value',
      value: `$${assetStats.totalValue.toLocaleString()}`,
      icon: DollarSign,
      gradient: 'from-amber-500 to-orange-600',
      change: '+5%',
      changeType: 'positive'
    }
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

  const recentActivity = activityLog.slice(0, 5).map(activity => ({
    id: activity.id,
    action: activity.action || 'Unknown Action',
    timestamp: activity.timestamp,
    details: formatActivityDetails(activity)
  }));

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="card-enhanced hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className={`text-xs font-medium mt-1 ${
                      stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts and Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="card-enhanced">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Recent Activity
                </CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                          {activity.details}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="card-enhanced">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start btn-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Asset
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.slice(0, 3).map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
                  >
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                        {notification.title}
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        {notification.message}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default OverviewContent;
