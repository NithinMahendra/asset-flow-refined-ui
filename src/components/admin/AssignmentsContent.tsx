
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users, Clock, CheckCircle, UserCheck, Search, Filter, Plus, Eye, MoreHorizontal } from 'lucide-react';

const AssignmentsContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);

  const assignments = [
    { 
      id: 1, 
      employee: 'John Doe', 
      employeeEmail: 'john.doe@company.com',
      asset: 'MacBook Pro M3', 
      assetId: 'AST-001',
      assignedDate: '2024-01-15', 
      status: 'Active', 
      department: 'Engineering',
      dueDate: '2024-07-15',
      condition: 'Excellent',
      qrCode: 'QR001'
    },
    { 
      id: 2, 
      employee: 'Sarah Smith', 
      employeeEmail: 'sarah.smith@company.com',
      asset: 'iPhone 15 Pro', 
      assetId: 'AST-002',
      assignedDate: '2024-01-14', 
      status: 'Active', 
      department: 'Marketing',
      dueDate: '2024-06-14',
      condition: 'Good',
      qrCode: 'QR002'
    },
    { 
      id: 3, 
      employee: 'Mike Johnson', 
      employeeEmail: 'mike.johnson@company.com',
      asset: 'Dell Monitor 27"', 
      assetId: 'AST-003',
      assignedDate: '2024-01-13', 
      status: 'Pending Return', 
      department: 'Sales',
      dueDate: '2024-02-13',
      condition: 'Fair',
      qrCode: 'QR003'
    },
  ];

  const pendingRequests = [
    { 
      id: 1, 
      employee: 'Alice Brown', 
      employeeEmail: 'alice.brown@company.com',
      requestedAsset: 'iPad Pro', 
      requestDate: '2024-01-16', 
      priority: 'High',
      justification: 'Required for client presentations',
      department: 'Sales',
      manager: 'David Wilson'
    },
    { 
      id: 2, 
      employee: 'Tom Wilson', 
      employeeEmail: 'tom.wilson@company.com',
      requestedAsset: 'Wireless Headphones', 
      requestDate: '2024-01-15', 
      priority: 'Medium',
      justification: 'Remote work requirement',
      department: 'Engineering',
      manager: 'Sarah Smith'
    },
  ];

  const returnRequests = [
    {
      id: 1,
      employee: 'Emma Davis',
      asset: 'MacBook Air',
      assetId: 'AST-004',
      requestDate: '2024-01-17',
      reason: 'Project completion',
      condition: 'Good',
      status: 'Pending Inspection'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending Return':
        return 'bg-orange-100 text-orange-800';
      case 'Returned':
        return 'bg-gray-100 text-gray-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-orange-100 text-orange-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApproveRequest = (requestId: number) => {
    console.log('Approving request:', requestId);
    // Implementation for approving assignment request
  };

  const handleDeclineRequest = (requestId: number) => {
    console.log('Declining request:', requestId);
    // Implementation for declining assignment request
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <Clock className="h-8 w-8 text-orange-600" />
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

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Overdue Returns</p>
                <p className="text-2xl font-semibold text-gray-900">7</p>
              </div>
              <UserCheck className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filter
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={showAssignmentForm} onOpenChange={setShowAssignmentForm}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Asset</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="">Choose asset...</option>
                      <option value="AST-001">AST-001 - MacBook Pro M3</option>
                      <option value="AST-002">AST-002 - iPhone 15 Pro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Employee</label>
                    <input
                      type="text"
                      placeholder="Enter employee email"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Assignment Duration</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                      <option value="180">6 months</option>
                      <option value="365">1 year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <textarea
                    placeholder="Add assignment notes..."
                    className="w-full p-2 border rounded-md"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowAssignmentForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowAssignmentForm(false)}>
                    Create Assignment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active Assignments</TabsTrigger>
          <TabsTrigger value="requests">Pending Requests</TabsTrigger>
          <TabsTrigger value="returns">Return Requests</TabsTrigger>
          <TabsTrigger value="history">Assignment History</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Employee</TableHead>
                    <TableHead className="font-semibold">Asset</TableHead>
                    <TableHead className="font-semibold">Department</TableHead>
                    <TableHead className="font-semibold">Assigned Date</TableHead>
                    <TableHead className="font-semibold">Due Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Condition</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => (
                    <TableRow key={assignment.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-medium">{assignment.employee}</p>
                          <p className="text-sm text-gray-500">{assignment.employeeEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{assignment.asset}</p>
                          <p className="text-sm text-gray-500">{assignment.assetId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{assignment.department}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{assignment.assignedDate}</TableCell>
                      <TableCell className="text-gray-600">{assignment.dueDate}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(assignment.status)}>
                          {assignment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{assignment.condition}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <Card key={request.id} className="border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div>
                          <p className="font-medium">{request.employee}</p>
                          <p className="text-sm text-gray-500">{request.employeeEmail}</p>
                        </div>
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority} Priority
                        </Badge>
                        <Badge variant="outline">{request.department}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Requested Asset:</span>
                          <p className="font-medium">{request.requestedAsset}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Request Date:</span>
                          <p className="font-medium">{request.requestDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Manager:</span>
                          <p className="font-medium">{request.manager}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Justification:</span>
                          <p className="font-medium">{request.justification}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button 
                        size="sm" 
                        onClick={() => handleApproveRequest(request.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeclineRequest(request.id)}
                      >
                        Decline
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="returns" className="space-y-4">
          <div className="space-y-4">
            {returnRequests.map((returnReq) => (
              <Card key={returnReq.id} className="border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <div>
                          <p className="font-medium">{returnReq.employee}</p>
                          <p className="text-sm text-gray-500">Return request</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {returnReq.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Asset:</span>
                          <p className="font-medium">{returnReq.asset} ({returnReq.assetId})</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Request Date:</span>
                          <p className="font-medium">{returnReq.requestDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Reason:</span>
                          <p className="font-medium">{returnReq.reason}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Condition:</span>
                          <Badge variant="outline">{returnReq.condition}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button size="sm">
                        Accept Return
                      </Button>
                      <Button size="sm" variant="outline">
                        Schedule Inspection
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">AST-001 - MacBook Pro M3</p>
                    <p className="text-sm text-gray-600">
                      Assigned to John Doe (Engineering) • 2024-01-15 to 2024-01-20
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">AST-002 - iPhone 15 Pro</p>
                    <p className="text-sm text-gray-600">
                      Assigned to Sarah Smith (Marketing) • 2024-01-10 to 2024-01-18
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Completed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssignmentsContent;
