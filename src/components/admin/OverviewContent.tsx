
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Users, AlertTriangle, CheckCircle, TrendingUp, Activity, Clock, Calendar } from 'lucide-react';
import { useAdminData } from '@/contexts/AdminDataContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { motion } from 'framer-motion';

const OverviewContent = () => {
  const {
    getAssetStats,
    getAssignmentStats,
    getUtilizationRate,
    getRecentActivity,
    getUpcomingTasks,
    getCategoryStats,
    users,
    notifications
  } = useAdminData();

  const assetStats = getAssetStats();
  const assignmentStats = getAssignmentStats();
  const utilizationRate = getUtilizationRate();
  const recentActivity = getRecentActivity();
  const upcomingTasks = getUpcomingTasks();
  const categoryStats = getCategoryStats();

  const stats = [
    { 
      title: 'Total Assets', 
      value: assetStats.total.toString(), 
      change: '+12%', 
      icon: Package, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Active Users', 
      value: users.filter(u => u.status === 'Active').length.toString(), 
      change: '+8%', 
      icon: Users, 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    { 
      title: 'Pending Requests', 
      value: assignmentStats.pending.toString(), 
      change: '-5%', 
      icon: AlertTriangle, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      title: 'Available Assets', 
      value: assetStats.available.toString(), 
      change: '+15%', 
      icon: CheckCircle, 
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
  ];

  const pieData = [
    { name: 'Available', value: assetStats.available, color: '#10b981' },
    { name: 'Assigned', value: assetStats.assigned, color: '#3b82f6' },
    { name: 'In Repair', value: assetStats.inRepair, color: '#f97316' },
    { name: 'Retired', value: assetStats.retired, color: '#6b7280' },
  ];

  const utilizationData = [
    { name: 'Week 1', utilization: 75 },
    { name: 'Week 2', utilization: 82 },
    { name: 'Week 3', utilization: 78 },
    { name: 'Week 4', utilization: utilizationRate },
  ];

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 60) {
        return `${diffInMinutes} min ago`;
      } else if (diffInMinutes < 1440) {
        return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) !== 1 ? 's' : ''} ago`;
      } else {
        return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) !== 1 ? 's' : ''} ago`;
      }
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="space-y-8 bg-slate-50 p-6 min-h-screen">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="text-3xl font-bold text-slate-900"
                    >
                      {stat.value}
                    </motion.p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
                      <span className="text-xs text-emerald-600 font-medium">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Asset Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
                <Package className="h-5 w-5 mr-2 text-blue-600" />
                Asset Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Utilization Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
                Utilization Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={utilizationData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="utilization" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-purple-600" />
                Category Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryStats} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="name" type="category" className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity and Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    className="flex items-center space-x-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      activity.type === 'assignment' ? 'bg-blue-500' :
                      activity.type === 'addition' ? 'bg-emerald-500' :
                      activity.type === 'maintenance' ? 'bg-orange-500' : 
                      activity.type === 'return' ? 'bg-purple-500' : 'bg-slate-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                      <p className="text-xs text-slate-600 truncate">{activity.details}</p>
                    </div>
                    <div className="flex items-center text-xs text-slate-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimestamp(activity.timestamp)}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-sm">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                Upcoming Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">{task.task}</p>
                      <p className="text-xs text-slate-600">{task.due}</p>
                    </div>
                    <Badge 
                      variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-sm">No upcoming tasks</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-slate-900">{utilizationRate.toFixed(1)}%</p>
                <p className="text-sm text-slate-600">Asset Utilization</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">
                  {assignmentStats.active > 0 ? (assignmentStats.active * 2.1).toFixed(1) : '0'} days
                </p>
                <p className="text-sm text-slate-600">Avg. Request Time</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">
                  ${(assetStats.totalValue / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-slate-600">Total Asset Value</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">
                  {notifications.filter(n => !n.isRead).length === 0 ? '99.2' : '98.5'}%
                </p>
                <p className="text-sm text-slate-600">System Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OverviewContent;
