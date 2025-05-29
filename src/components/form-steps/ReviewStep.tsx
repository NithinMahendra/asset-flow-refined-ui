import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, MapPin, DollarSign, Image, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface ReviewStepProps {
  formData: any;
}

const ReviewStep = ({ formData }: ReviewStepProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-emerald-100 text-emerald-800';
      case 'in use': return 'bg-indigo-100 text-indigo-800';
      case 'in repair': return 'bg-cyan-100 text-cyan-800';
      case 'faulty': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Review & Confirm
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Please review all the information before creating the asset
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">General Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Device Name:</span>
              <span className="font-medium">{formData.deviceName || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Type:</span>
              <Badge variant="secondary">{formData.deviceType || 'Not specified'}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Brand:</span>
              <span className="font-medium">{formData.brand || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Model:</span>
              <span className="font-medium">{formData.model || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Serial Number:</span>
              <span className="font-medium font-mono text-sm">{formData.serialNumber || 'Not specified'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <Badge className={getStatusColor(formData.status)}>
                {formData.status || 'Available'}
              </Badge>
            </div>
            {formData.location && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Location:</span>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{formData.location}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assignment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.assignedTo ? (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Assigned To:</span>
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{formData.assignedTo}</span>
                  </div>
                </div>
                {formData.department && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Department:</span>
                    <Badge variant="outline">{formData.department}</Badge>
                  </div>
                )}
                {formData.assignmentDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Assignment Date:</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{format(formData.assignmentDate, 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                Device will remain unassigned
              </div>
            )}
          </CardContent>
        </Card>

        {/* Warranty Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Warranty & Purchase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formData.purchaseDate && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Purchase Date:</span>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{format(formData.purchaseDate, 'MMM dd, yyyy')}</span>
                </div>
              </div>
            )}
            {formData.warrantyExpiry && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Warranty Expiry:</span>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{format(formData.warrantyExpiry, 'MMM dd, yyyy')}</span>
                </div>
              </div>
            )}
            {formData.vendor && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Vendor:</span>
                <span className="font-medium">{formData.vendor}</span>
              </div>
            )}
            {formData.purchasePrice && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Purchase Price:</span>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">${formData.purchasePrice}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Files */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Attachments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Images:</span>
              <div className="flex items-center space-x-1">
                <Image className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{formData.images?.length || 0} files</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Documents:</span>
              <div className="flex items-center space-x-1">
                <FileText className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{formData.invoices?.length || 0} files</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReviewStep;
