
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Users, Settings, QrCode, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const QuickActions = () => {
  const actions = [
    {
      icon: Plus,
      label: 'Add Device',
      description: 'Register new asset',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => console.log('Add device')
    },
    {
      icon: FileText,
      label: 'Generate Report',
      description: 'Create asset report',
      color: 'bg-green-500 hover:bg-green-600',
      action: () => console.log('Generate report')
    },
    {
      icon: Users,
      label: 'Assign Device',
      description: 'Assign to user',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => console.log('Assign device')
    },
    {
      icon: QrCode,
      label: 'Scan QR Code',
      description: 'Quick asset lookup',
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => console.log('Scan QR')
    },
    {
      icon: Package,
      label: 'Bulk Import',
      description: 'Import multiple assets',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: () => console.log('Bulk import')
    },
    {
      icon: Settings,
      label: 'System Settings',
      description: 'Configure system',
      color: 'bg-gray-500 hover:bg-gray-600',
      action: () => console.log('Settings')
    }
  ];

  return (
    <Card className="glass-effect h-fit">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Button
              variant="ghost"
              onClick={action.action}
              className="w-full justify-start p-4 h-auto hover:bg-gray-50 dark:hover:bg-gray-800/50 group transition-all duration-200"
            >
              <div className={`p-2 rounded-lg ${action.color} mr-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-white">
                  {action.label}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {action.description}
                </p>
              </div>
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
