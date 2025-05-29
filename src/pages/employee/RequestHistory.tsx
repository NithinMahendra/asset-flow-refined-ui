
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmployeeService, AssetRequest } from '@/services/employeeService';

const RequestHistory = () => {
  const [requests, setRequests] = useState<AssetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      const requestData = await EmployeeService.getMyRequests();
      setRequests(requestData);
      setLoading(false);
    };

    loadRequests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
      case 'fulfilled':
        return <CheckCircle className="h-4 w-4" />;
      case 'denied':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'approved':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'fulfilled':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'denied':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/employee/dashboard')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Request History</h1>
        </div>

        {requests.length === 0 ? (
          <Card className="glass-effect">
            <CardContent className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No Requests Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You haven't submitted any asset requests yet. Start by requesting the equipment you need!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="glass-effect hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(request.status)}
                          <CardTitle className="text-lg">
                            {request.asset_type.replace(/\b\w/g, l => l.toUpperCase())}
                            {request.brand && ` - ${request.brand}`}
                            {request.model && ` ${request.model}`}
                          </CardTitle>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">Business Justification:</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{request.justification}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Requested:</span>
                          <p className="font-medium">
                            {new Date(request.requested_date).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {request.approved_date && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Approved:</span>
                            <p className="font-medium">
                              {new Date(request.approved_date).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        
                        {request.fulfilled_date && (
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Fulfilled:</span>
                            <p className="font-medium">
                              {new Date(request.fulfilled_date).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        
                        <div>
                          <span className="text-gray-600 dark:text-gray-400">Priority:</span>
                          <p className="font-medium">{request.priority}</p>
                        </div>
                      </div>

                      {request.denial_reason && (
                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                          <h4 className="font-medium text-red-900 dark:text-red-200 mb-1">Denial Reason:</h4>
                          <p className="text-red-700 dark:text-red-300 text-sm">{request.denial_reason}</p>
                        </div>
                      )}

                      {request.notes && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                          <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-1">Notes:</h4>
                          <p className="text-blue-700 dark:text-blue-300 text-sm">{request.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestHistory;
