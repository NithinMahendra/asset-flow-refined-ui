
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Users, AlertTriangle, CheckCircle, TrendingUp, Activity } from 'lucide-react';
import { useAdminData } from '@/contexts/AdminDataContext';

const OverviewContent = () => {
  const {
    getAssetStats,
    getAssignmentStats,
    getUtilizationRate,
    getRecentActivity,
    getUpcomingTasks,
    users,
    notifications
  } = useAdminData();

  const assetStats = getAssetStats();
  const assignmentStats = getAssignmentStats();
  const utilizationRate = getUtilizationRate();
  const recentActivity = getRecentActivity();
  const upcomingTasks = getUpcomingTasks();

  const stats = [
    { 
      title: 'Total Assets', 
      value: assetStats.total.toString(), 
      change: '+12%', 
      icon: Package, 
      color: 'text-blue-600' 
    },
    { 
      title: 'Active Users', 
      value: users.filter(u => u.status === 'Active').length.toString(), 
      change: '+8%', 
      icon: Users, 
      color: 'text-green-600' 
    },
    { 
      title: 'Pending Requests', 
      value: assignmentStats.pending.toString(), 
      change: '-5%', 
      icon: AlertTriangle, 
      color: 'text-red-600' 
    },
    { 
      title: 'Available Assets', 
      value: assetStats.available.toString(), 
      change: '+15%', 
      icon: CheckCircle, 
      color: 'text-emerald-600' 
    },
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
      return timestamp;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-gray-50`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'assignment' ? 'bg-blue-500' :
                    activity.type === 'addition' ? 'bg-green-500' :
                    activity.type === 'maintenance' ? 'bg-red-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-600 truncate">{activity.details}</p>
                  </div>
                  <span className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900">Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{task.task}</p>
                    <p className="text-xs text-gray-600">{task.due}</p>
                  </div>
                  <Badge 
                    variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No upcoming tasks</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Bar */}
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-semibold text-gray-900">{utilizationRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">Asset Utilization</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {assignmentStats.active > 0 ? (assignmentStats.active * 2.1).toFixed(1) : '0'} days
              </p>
              <p className="text-sm text-gray-600">Avg. Request Time</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                ${(assetStats.totalValue / 1000).toFixed(0)}K
              </p>
              <p className="text-sm text-gray-600">Total Asset Value</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {notifications.filter(n => !n.isRead).length === 0 ? '99.2' : '98.5'}%
              </p>
              <p className="text-sm text-gray-600">System Uptime</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewContent;
