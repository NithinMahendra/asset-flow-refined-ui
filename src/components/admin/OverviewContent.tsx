
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Users, AlertTriangle, CheckCircle, TrendingUp, Activity } from 'lucide-react';

const OverviewContent = () => {
  const stats = [
    { title: 'Total Assets', value: '1,247', change: '+12%', icon: Package, color: 'text-blue-600' },
    { title: 'Active Users', value: '156', change: '+8%', icon: Users, color: 'text-green-600' },
    { title: 'Pending Requests', value: '23', change: '-5%', icon: AlertTriangle, color: 'text-yellow-600' },
    { title: 'Available Assets', value: '482', change: '+15%', icon: CheckCircle, color: 'text-emerald-600' },
  ];

  const recentActivity = [
    { action: 'Asset Assignment', details: 'MacBook Pro assigned to John Doe', time: '5 min ago', status: 'completed' },
    { action: 'Maintenance Request', details: 'iPhone 15 Pro requires repair', time: '15 min ago', status: 'pending' },
    { action: 'Asset Return', details: 'Dell Monitor returned by Sarah Smith', time: '1 hour ago', status: 'completed' },
    { action: 'New Asset Added', details: 'Surface Pro 9 added to inventory', time: '2 hours ago', status: 'completed' },
    { action: 'User Registration', details: 'New employee Mike Johnson registered', time: '3 hours ago', status: 'completed' },
  ];

  const upcomingTasks = [
    { task: 'Quarterly Asset Audit', due: 'Due in 3 days', priority: 'high' },
    { task: 'Software License Renewal', due: 'Due in 1 week', priority: 'medium' },
    { task: 'Hardware Inventory Check', due: 'Due in 2 weeks', priority: 'low' },
    { task: 'Employee Asset Training', due: 'Due in 1 month', priority: 'medium' },
  ];

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
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600 truncate">{activity.details}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900">Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.map((task, index) => (
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
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Bar */}
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-semibold text-gray-900">98.5%</p>
              <p className="text-sm text-gray-600">Asset Utilization</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">2.1 days</p>
              <p className="text-sm text-gray-600">Avg. Request Time</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">$125K</p>
              <p className="text-sm text-gray-600">Total Asset Value</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">99.2%</p>
              <p className="text-sm text-gray-600">System Uptime</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewContent;
