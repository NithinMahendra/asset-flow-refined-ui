
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const NotificationsContent = () => {
  const notifications = [
    { id: 1, type: 'warning', title: 'Asset Maintenance Due', message: 'MacBook Pro #AST-001 requires scheduled maintenance', time: '5 min ago' },
    { id: 2, type: 'info', title: 'New Asset Request', message: 'John Doe requested a new monitor', time: '15 min ago' },
    { id: 3, type: 'success', title: 'Assignment Completed', message: 'Surface Pro assigned to Sarah Smith', time: '1 hour ago' },
    { id: 4, type: 'warning', title: 'Low Stock Alert', message: 'Wireless keyboards running low (3 remaining)', time: '2 hours ago' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-100 border-yellow-200';
      case 'info':
        return 'bg-blue-100 border-blue-200';
      case 'success':
        return 'bg-green-100 border-green-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className={`p-4 rounded-lg border ${getTypeColor(notification.type)}`}>
              <div className="flex items-start space-x-3">
                {getIcon(notification.type)}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{notification.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsContent;
