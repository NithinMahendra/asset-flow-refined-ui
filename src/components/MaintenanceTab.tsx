
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wrench, Calendar, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const MaintenanceTab = () => {
  const maintenanceHistory = [
    {
      id: 1,
      type: 'Preventive',
      description: 'Software update and system optimization',
      date: '2023-11-15',
      technician: 'IT Support Team',
      status: 'Completed',
      cost: '$0',
      duration: '2 hours',
      nextDue: '2024-02-15'
    },
    {
      id: 2,
      type: 'Repair',
      description: 'Keyboard replacement due to sticky keys',
      date: '2023-09-20',
      technician: 'Apple Service Center',
      status: 'Completed',
      cost: '$299',
      duration: '3 days',
      nextDue: null
    },
    {
      id: 3,
      type: 'Inspection',
      description: 'Annual hardware inspection and cleaning',
      date: '2023-07-10',
      technician: 'Internal IT',
      status: 'Completed',
      cost: '$0',
      duration: '1 hour',
      nextDue: '2024-07-10'
    }
  ];

  const upcomingMaintenance = [
    {
      type: 'Preventive',
      description: 'Quarterly software update',
      dueDate: '2024-02-15',
      priority: 'Medium'
    },
    {
      type: 'Inspection',
      description: 'Annual hardware inspection',
      dueDate: '2024-07-10',
      priority: 'Low'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'In Progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'Pending': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Completed</Badge>;
      case 'In Progress': return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">In Progress</Badge>;
      case 'Pending': return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Schedule New Maintenance */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Maintenance Records
        </h3>
        <Button className="flex items-center space-x-2">
          <Wrench className="h-4 w-4" />
          <span>Schedule Maintenance</span>
        </Button>
      </div>

      {/* Upcoming Maintenance */}
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Upcoming Maintenance</h4>
        <div className="space-y-3">
          {upcomingMaintenance.map((maintenance, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-blue-50/50 dark:bg-blue-900/20">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {maintenance.description}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Due: {new Date(maintenance.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={getPriorityColor(maintenance.priority)}>
                  {maintenance.priority}
                </Badge>
                <Button size="sm" variant="outline">
                  Schedule
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance History */}
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Maintenance History</h4>
        <div className="space-y-4">
          {maintenanceHistory.map((maintenance, index) => (
            <div key={maintenance.id} className="relative">
              {/* Timeline Line */}
              {index < maintenanceHistory.length - 1 && (
                <div className="absolute left-6 top-12 h-20 w-0.5 bg-gray-200 dark:bg-gray-700" />
              )}
              
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="p-2 rounded-full bg-blue-500">
                  {getStatusIcon(maintenance.status)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        {maintenance.type} Maintenance
                      </h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {maintenance.description}
                      </p>
                    </div>
                    {getStatusBadge(maintenance.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Date</p>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(maintenance.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Technician</p>
                      <p className="text-gray-900 dark:text-white">{maintenance.technician}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Duration</p>
                      <p className="text-gray-900 dark:text-white">{maintenance.duration}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Cost</p>
                      <p className="text-gray-900 dark:text-white">{maintenance.cost}</p>
                    </div>
                  </div>
                  
                  {maintenance.nextDue && (
                    <div className="mt-2 text-sm">
                      <p className="text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Next due:</span> {new Date(maintenance.nextDue).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaintenanceTab;
