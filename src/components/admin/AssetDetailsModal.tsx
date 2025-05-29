
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, QrCode, History, FileText, X } from 'lucide-react';

interface AssetDetailsModalProps {
  asset: any;
  isOpen: boolean;
  onClose: () => void;
}

const AssetDetailsModal = ({ asset, isOpen, onClose }: AssetDetailsModalProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Assigned':
        return 'bg-blue-100 text-blue-800';
      case 'In Repair':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <span>Asset Details</span>
              <Badge className={getStatusColor(asset.status)}>{asset.status}</Badge>
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button size="sm" variant="outline">
                <QrCode className="h-4 w-4 mr-2" />
                View QR
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="assignment">Assignment</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Asset ID:</span>
                    <span className="font-medium">{asset.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{asset.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <Badge variant="outline">{asset.category}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Serial Number:</span>
                    <span className="font-medium">{asset.serial_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{asset.location}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Purchase Value:</span>
                    <span className="font-medium">${asset.value?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Purchase Date:</span>
                    <span className="font-medium">{asset.purchase_date || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Warranty Expiry:</span>
                    <span className="font-medium">{asset.warranty_expiry || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Value:</span>
                    <span className="font-medium">${(asset.value * 0.76)?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Depreciation:</span>
                    <span className="font-medium text-red-600">24%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assignment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Assignment</CardTitle>
              </CardHeader>
              <CardContent>
                {asset.assignee !== '-' ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assigned To:</span>
                      <span className="font-medium">{asset.assignee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium">Engineering</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assignment Date:</span>
                      <span className="font-medium">2024-01-10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">19 days</span>
                    </div>
                    <div className="pt-4 border-t">
                      <Button variant="outline" size="sm">
                        Request Return
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Asset is currently unassigned</p>
                    <Button size="sm">
                      Assign to Employee
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Maintenance Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Routine Maintenance</p>
                      <p className="text-sm text-gray-600">System cleaning and updates</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Due: 2024-02-15</p>
                      <Badge variant="outline">Scheduled</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                    <div>
                      <p className="font-medium">Hardware Check</p>
                      <p className="text-sm text-gray-600">Screen calibration required</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Overdue: 2024-01-20</p>
                      <Badge className="bg-red-100 text-red-800">Overdue</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Asset History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 border-l-4 border-blue-500 bg-blue-50">
                    <div className="flex-1">
                      <p className="font-medium">Asset Created</p>
                      <p className="text-sm text-gray-600">Asset added to inventory</p>
                      <p className="text-xs text-gray-500">2024-01-15 10:30 AM by Admin</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 border-l-4 border-green-500 bg-green-50">
                    <div className="flex-1">
                      <p className="font-medium">QR Code Generated</p>
                      <p className="text-sm text-gray-600">Unique QR code created: {asset.qr_code}</p>
                      <p className="text-xs text-gray-500">2024-01-15 10:31 AM by System</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 border-l-4 border-purple-500 bg-purple-50">
                    <div className="flex-1">
                      <p className="font-medium">Status Updated</p>
                      <p className="text-sm text-gray-600">Status changed to Available</p>
                      <p className="text-xs text-gray-500">2024-01-15 11:00 AM by Admin</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AssetDetailsModal;
