
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Calendar, MapPin, CheckCircle } from 'lucide-react';

const AssignmentTab = () => {
  const assignmentHistory = [
    {
      id: 1,
      user: 'John Doe',
      department: 'Engineering',
      assignedDate: '2023-11-01',
      returnDate: null,
      status: 'Current',
      location: 'Office A - Desk 12',
      purpose: 'Development work'
    },
    {
      id: 2,
      user: 'Sarah Smith',
      department: 'Design',
      assignedDate: '2023-08-15',
      returnDate: '2023-10-30',
      status: 'Returned',
      location: 'Office B - Creative Zone',
      purpose: 'UI/UX Design projects'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      department: 'Marketing',
      assignedDate: '2023-06-01',
      returnDate: '2023-08-10',
      status: 'Returned',
      location: 'Office A - Marketing Dept',
      purpose: 'Content creation and campaigns'
    }
  ];

  const getStatusBadge = (status: string) => {
    return status === 'Current' 
      ? <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">Current</Badge>
      : <Badge variant="secondary">Returned</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Assignment History
        </h3>
        <Button className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>New Assignment</span>
        </Button>
      </div>
      
      <div className="space-y-4">
        {assignmentHistory.map((assignment, index) => (
          <div key={assignment.id} className="relative">
            {/* Timeline Line */}
            {index < assignmentHistory.length - 1 && (
              <div className="absolute left-6 top-12 h-16 w-0.5 bg-gray-200 dark:bg-gray-700" />
            )}
            
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className={`p-2 rounded-full ${assignment.status === 'Current' ? 'bg-gray-500' : 'bg-gray-400'}`}>
                {assignment.status === 'Current' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <CheckCircle className="h-4 w-4 text-white" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {assignment.user}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {assignment.department}
                    </p>
                  </div>
                  {getStatusBadge(assignment.status)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Assigned</p>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(assignment.assignedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Returned</p>
                      <p className="text-gray-900 dark:text-white">
                        {assignment.returnDate 
                          ? new Date(assignment.returnDate).toLocaleDateString() 
                          : 'Not returned'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Location</p>
                      <p className="text-gray-900 dark:text-white">{assignment.location}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Purpose:</span> {assignment.purpose}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentTab;
