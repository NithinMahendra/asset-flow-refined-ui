
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Package, Laptop, Smartphone, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmployeeService } from '@/services/employeeService';

const MyAssets = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAssets = async () => {
      setLoading(true);
      const assetData = await EmployeeService.getMyAssets();
      setAssets(assetData);
      setLoading(false);
    };

    loadAssets();
  }, []);

  const getAssetIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'laptop':
        return <Laptop className="h-6 w-6 text-green-600 dark:text-green-400" />;
      case 'smartphone':
        return <Smartphone className="h-6 w-6 text-green-600 dark:text-green-400" />;
      case 'monitor':
        return <Monitor className="h-6 w-6 text-green-600 dark:text-green-400" />;
      default:
        return <Package className="h-6 w-6 text-green-600 dark:text-green-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'retired':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Assets</h1>
        </div>

        {assets.length === 0 ? (
          <Card className="glass-effect">
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No Assets Assigned
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You don't have any assets assigned to you yet. Contact your IT administrator if you need equipment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="glass-effect hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                          {getAssetIcon(asset.device_type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{asset.brand} {asset.model}</CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {asset.device_type?.replace('_', ' ')?.replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(asset.status)}>
                        {asset.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Serial Number:</span>
                        <span className="font-medium">{asset.serial_number}</span>
                      </div>
                      {asset.asset_tag && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Asset Tag:</span>
                          <span className="font-medium">{asset.asset_tag}</span>
                        </div>
                      )}
                      {asset.location && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Location:</span>
                          <span className="font-medium">{asset.location}</span>
                        </div>
                      )}
                      {asset.purchase_date && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Purchase Date:</span>
                          <span className="font-medium">
                            {new Date(asset.purchase_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {asset.warranty_expiry && (
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Warranty Expires:</span>
                          <span className="font-medium">
                            {new Date(asset.warranty_expiry).toLocaleDateString()}
                          </span>
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

export default MyAssets;
