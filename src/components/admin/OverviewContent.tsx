
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
  Bell
} from 'lucide-react';
import { useAdminData } from '@/contexts/AdminDataContext';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';

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

  const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'maintenance':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'addition':
        return <Package className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-slate-500" />;
    }
  };

  const unreadNotifications = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Overview</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Dashboard overview of your asset management system
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {unreadNotifications > 0 && (
            <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-800">
              <Bell className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                {unreadNotifications} new notifications
              </span>
            </div>
          )}
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Assets</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{assetStats.total}</p>
                <p className="text-xs text-green-600 dark:text-green-400">+12% from last month</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Utilization Rate</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{utilizationRate.toFixed(1)}%</p>
                <p className="text-xs text-green-600 dark:text-green-400">+5% from last month</p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">In Maintenance</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{assetStats.inRepair}</p>
                <p className="text-xs text-orange-600 dark:text-orange-400">{maintenanceRate.toFixed(1)}% of total</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Value</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  ${assetStats.totalValue.toLocaleString()}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Avg age: {averageAge.toFixed(1)}y</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Asset Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="assets" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="utilization" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset Categories</CardTitle>
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
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Assignment Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Active Assignments</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                {assignmentStats.active}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Pending Requests</span>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                {assignmentStats.pending}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Overdue Returns</span>
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                {assignmentStats.overdue}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
              Attention Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Warranty Expiring</span>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                {upcomingWarranties.length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Maintenance Due</span>
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                {overdueAssets.length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Unread Notifications</span>
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                {unreadNotifications}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.length > 0 ? upcomingTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{task.task}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{task.due}</p>
                </div>
                <Badge className={getStatusColor(task.priority)}>
                  {task.priority}
                </Badge>
              </div>
            )) : (
              <p className="text-sm text-slate-600 dark:text-slate-400">No upcoming tasks</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">{activity.action}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{activity.details}</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            )) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-slate-500 dark:text-slate-400">No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewContent;
