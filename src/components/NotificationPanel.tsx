
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationPanel = () => {
  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Device Overdue',
      message: 'MacBook Pro assigned to John Doe is 5 days overdue for return',
      time: '10 minutes ago',
      unread: true
    },
    {
      id: 2,
      type: 'success',
      title: 'Maintenance Complete',
      message: 'iPhone 14 repairs have been completed and device is ready',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      type: 'info',
      title: 'New Assignment Request',
      message: 'Sarah Smith has requested a new laptop for project work',
      time: '3 hours ago',
      unread: false
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-gray-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="absolute right-0 top-12 w-80 z-50"
      >
        <Card className="shadow-xl border-0 glass-effect">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-3 rounded-lg border transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                  notification.unread ? 'bg-gray-50/50 dark:bg-gray-800/20 border-gray-200 dark:border-gray-700' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {getIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                        {notification.title}
                      </p>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-gray-500 rounded-full" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            <Button variant="outline" className="w-full mt-3">
              View All Notifications
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationPanel;
