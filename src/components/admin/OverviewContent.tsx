import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Package, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign,
  Activity,
  Bell,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useAdminData } from '@/contexts/AdminDataContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const OverviewContent = () => {
  const { 
    getAssetStats, 
    getCategoryStats, 
    getAssignmentStats,
    getUtilizationRate,
    getMaintenanceRate,
    getAverageAssetAge,
    getUpcomingWarrantyExpiries,
    getOverdueMaintenanceAssets,
    getRecentActivity,
    getUpcomingTasks,
    notifications
  } = useAdminData();

  const assetStats = getAssetStats();
  const categoryStats = getCategoryStats();
  const assignmentStats = getAssignmentStats();
  const utilizationRate = getUtilizationRate();
  const maintenanceRate = getMaintenanceRate();
  const averageAge = getAverageAssetAge();
  const upcomingWarranties = getUpcomingWarrantyExpiries();
  const overdueAssets = getOverdueMaintenanceAssets();
  const recentActivity = getRecentActivity();
  const upcomingTasks = getUpcomingTasks();

  // Mock trend data for charts
  const trendData = [
    { month: 'Jan', assets: 45, utilization: 78 },
    { month: 'Feb', assets: 52, utilization: 82 },
    { month: 'Mar', assets: 49, utilization: 75 },
    { month: 'Apr', assets: 63, utilization: 85 },
    { month: 'May', assets: 58, utilization: 80 },
    { month: 'Jun', assets: 67, utilization: 88 }
  ];

  const COLORS = ['#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#EC4899', '#EF4444'];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'maintenance':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'addition':
        return <Package className="h-4 w-4 text-emerald-500" />;
      default:
        return <Activity className="h-4 w-4 text-slate-500" />;
    }
  };

  const unreadNotifications = notifications.filter(n => !n.is_read).length;

  const kpiCards = [
    {
      title: 'Total Assets',
      value: assetStats.total,
      change: '+12%',
      trend: 'up',
      icon: Package,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20'
    },
    {
      title: 'Utilization Rate',
      value: `${utilizationRate.toFixed(1)}%`,
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20'
    },
    {
      title: 'In Maintenance',
      value: assetStats.inRepair,
      change: '-8%',
      trend: 'down',
      icon: AlertTriangle,
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20'
    },
    {
      title: 'Total Value',
      value: `$${(assetStats.totalValue / 1000).toFixed(0)}K`,
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      gradient: 'from-violet-500 to-purple-600',
      bgGradient: 'from-violet-50 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-responsive-xl font-bold text-gradient-primary mb-2">
            Dashboard Overview
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-responsive-base">
            Monitor your asset management system performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {unreadNotifications > 0 && (
            <motion.div 
              className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-xl border border-blue-200/50 dark:border-blue-800/50"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Bell className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                {unreadNotifications} new notifications
              </span>
            </motion.div>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            className="glass-effect border-slate-200/50 hover:scale-105 transition-all duration-300"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View Reports
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
          >
            <Card className={`card-enhanced bg-gradient-to-br ${kpi.bgGradient} border-0 overflow-hidden relative group`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                      {kpi.title}
                    </p>
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="text-3xl font-bold text-slate-900 dark:text-white mb-2"
                    >
                      {kpi.value}
                    </motion.p>
                    <div className="flex items-center space-x-1">
                      {kpi.trend === 'up' ? (
                        <ArrowUp className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs font-medium ${
                        kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {kpi.change}
                      </span>
                      <span className="text-xs text-slate-500">vs last month</span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${kpi.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <kpi.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="card-enhanced card-gradient border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-gradient-primary">Asset Trends</CardTitle>
              <Badge className="w-fit bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                Live Data
              </Badge>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.3)" />
                  <XAxis dataKey="month" stroke="#64748B" />
                  <YAxis stroke="#64748B" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="assets" 
                    stroke="url(#gradient1)" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="utilization" 
                    stroke="url(#gradient2)" 
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                  />
                  <defs>
                    <linearGradient id="gradient1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="card-enhanced card-gradient border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-gradient-primary">Asset Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, count }) => `${name}: ${count}`}
                  >
                    {categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="card-enhanced bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-emerald-700 dark:text-emerald-300">
                <CheckCircle className="h-5 w-5 mr-2" />
                Assignment Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Active Assignments', value: assignmentStats.active, color: 'bg-emerald-500' },
                { label: 'Pending Requests', value: assignmentStats.pending, color: 'bg-amber-500' },
                { label: 'Overdue Returns', value: assignmentStats.overdue, color: 'bg-red-500' }
              ].map((item, index) => (
                <motion.div 
                  key={item.label}
                  className="flex justify-between items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                >
                  <span className="text-sm text-slate-600 dark:text-slate-400">{item.label}</span>
                  <Badge className={`${item.color} text-white shadow-lg`}>
                    {item.value}
                  </Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="card-enhanced bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-amber-700 dark:text-amber-300">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Attention Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Warranty Expiring', value: upcomingWarranties.length, color: 'bg-amber-500' },
                { label: 'Maintenance Due', value: overdueAssets.length, color: 'bg-red-500' },
                { label: 'Unread Notifications', value: unreadNotifications, color: 'bg-blue-500' }
              ].map((item, index) => (
                <motion.div 
                  key={item.label}
                  className="flex justify-between items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                >
                  <span className="text-sm text-slate-600 dark:text-slate-400">{item.label}</span>
                  <Badge className={`${item.color} text-white shadow-lg`}>
                    {item.value}
                  </Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card className="card-enhanced bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20 border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-violet-700 dark:text-violet-300">
                <Clock className="h-5 w-5 mr-2" />
                Upcoming Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingTasks.length > 0 ? upcomingTasks.map((task, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{task.task}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{task.due}</p>
                  </div>
                  <Badge className={`bg-gradient-to-r ${
                    task.priority === 'high' ? 'from-red-500 to-red-600' :
                    task.priority === 'medium' ? 'from-amber-500 to-orange-600' :
                    'from-emerald-500 to-teal-600'
                  } text-white shadow-lg`}>
                    {task.priority}
                  </Badge>
                </motion.div>
              )) : (
                <div className="text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400">No upcoming tasks</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <Card className="card-enhanced card-gradient border-0">
          <CardHeader>
            <CardTitle className="text-gradient-primary">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="flex items-center space-x-4 p-4 glass-effect rounded-xl hover:scale-[1.02] transition-all duration-300 group"
                >
                  <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white group-hover:scale-110 transition-transform">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">{activity.action}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{activity.details}</p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </motion.div>
              )) : (
                <div className="text-center py-12">
                  <Activity className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="text-slate-500 dark:text-slate-400 text-lg">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OverviewContent;
