import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, QrCode, User, MapPin, Calendar, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import AssetGallery from '@/components/AssetGallery';
import SpecificationTab from '@/components/SpecificationTab';
import AssignmentTab from '@/components/AssignmentTab';
import MaintenanceTab from '@/components/MaintenanceTab';

const AssetDetail = () => {
  const [selectedTab, setSelectedTab] = useState('specifications');

  // Mock asset data
  const asset = {
    id: 1,
    name: 'MacBook Pro 16"',
    type: 'Laptop',
    status: 'In Use',
    assignedTo: 'John Doe',
    location: 'Office A',
    warrantyStatus: 'Active',
    tags: ['Laptop', 'Apple', 'Development'],
    images: [
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'
    ],
    serialNumber: 'MBP16-2023-001',
    purchaseDate: '2023-01-15',
    warrantyExpiry: '2026-01-15',
    specifications: {
      processor: 'Apple M2 Max',
      memory: '32GB Unified Memory',
      storage: '1TB SSD',
      graphics: 'Apple M2 Max GPU',
      display: '16.2-inch Liquid Retina XDR',
      os: 'macOS Ventura'
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Use': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'Available': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'In Repair': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
      case 'Faulty': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {asset.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Serial: {asset.serialNumber}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge className={getStatusColor(asset.status)}>
              {asset.status}
            </Badge>
            <Button variant="outline" className="flex items-center space-x-2">
              <QrCode className="h-4 w-4" />
              <span>Generate QR</span>
            </Button>
            <Button className="flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span>Edit Asset</span>
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image Gallery and Quick Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <AssetGallery images={asset.images} />
            
            {/* Quick Info Card */}
            <Card className="glass-effect mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Assigned to</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {asset.assignedTo || 'Unassigned'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white">{asset.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Purchase Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(asset.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Wrench className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Warranty</p>
                    <Badge 
                      variant={asset.warrantyStatus === 'Active' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {asset.warrantyStatus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <Button className="w-full" variant="outline">
                Assign to User
              </Button>
              <Button className="w-full" variant="outline">
                Mark as Repaired
              </Button>
              <Button className="w-full" variant="outline">
                Update Location
              </Button>
            </div>
          </motion.div>

          {/* Right Column - Detailed Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="glass-effect">
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="specifications">Specifications</TabsTrigger>
                  <TabsTrigger value="assignment">Assignment History</TabsTrigger>
                  <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                </TabsList>
                
                <TabsContent value="specifications" className="mt-6">
                  <SpecificationTab specifications={asset.specifications} />
                </TabsContent>
                
                <TabsContent value="assignment" className="mt-6">
                  <AssignmentTab />
                </TabsContent>
                
                <TabsContent value="maintenance" className="mt-6">
                  <MaintenanceTab />
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;
