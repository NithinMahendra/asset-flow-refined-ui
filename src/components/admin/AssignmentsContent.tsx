
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, CheckCircle } from 'lucide-react';

const AssignmentsContent = () => {
  const assignments = [
    { id: 1, employee: 'John Doe', asset: 'MacBook Pro M3', assignedDate: '2024-01-15', status: 'Active', department: 'Engineering' },
    { id: 2, employee: 'Sarah Smith', asset: 'iPhone 15 Pro', assignedDate: '2024-01-14', status: 'Active', department: 'Marketing' },
    { id: 3, employee: 'Mike Johnson', asset: 'Dell Monitor 27"', assignedDate: '2024-01-13', status: 'Pending Return', department: 'Sales' },
  ];

  const pendingRequests = [
    { id: 1, employee: 'Alice Brown', requestedAsset: 'iPad Pro', requestDate: '2024-01-16', priority: 'High' },
    { id: 2, employee: 'Tom Wilson', requestedAsset: 'Wireless Headphones', requestDate: '2024-01-15', priority: 'Medium' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Assignments</p>
                <p className="text-2xl font-semibold text-gray-900">156</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
                <p className="text-2xl font-semibold text-gray-900">23</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed This Month</p>
                <p className="text-2xl font-semibold text-gray-900">89</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Current Assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{assignment.employee}</p>
                  <p className="text-sm text-gray-600">{assignment.asset}</p>
                  <p className="text-xs text-gray-500">{assignment.department}</p>
                </div>
                <div className="text-right">
                  <Badge variant={assignment.status === 'Active' ? 'default' : 'secondary'}>
                    {assignment.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{assignment.assignedDate}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{request.employee}</p>
                  <p className="text-sm text-gray-600">{request.requestedAsset}</p>
                  <p className="text-xs text-gray-500">{request.requestDate}</p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge variant={request.priority === 'High' ? 'destructive' : 'default'}>
                    {request.priority}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Decline</Button>
                    <Button size="sm">Approve</Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssignmentsContent;
