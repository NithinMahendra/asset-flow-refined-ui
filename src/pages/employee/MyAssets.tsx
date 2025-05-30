
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Package, QrCode, Calendar, MapPin, RefreshCw, Smartphone, Trash2, Plus } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { EmployeeService } from '@/services/employeeService';
import { LocalAsset } from '@/services/localAssetService';
import { AssetCreationService } from '@/services/assetCreationService';
import QRCodeModal from '@/components/admin/QRCodeModal';
import SimpleAddAssetForm from '@/components/SimpleAddAssetForm';
import { toast } from 'sonner';

interface MyAsset {
  id: string;
  device_type: string;
  brand: string;
  model: string;
  serial_number: string;
  status: string;
  assigned_to: string;
  location?: string;
  purchase_date?: string;
  warranty_expiry?: string;
  notes?: string;
  qr_code?: string;
}

const MyAssets = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [assets, setAssets] = useState<(MyAsset | LocalAsset)[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<MyAsset | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);

  useEffect(() => {
    loadMyAssets();
  }, []);

  // Check for action=add in URL parameters to auto-open modal
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'add') {
      setShowAddAssetModal(true);
      // Remove the action parameter from URL without triggering navigation
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('action');
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Reload assets when the component receives focus (e.g., when navigating back from scan)
  useEffect(() => {
    const handleFocus = () => {
      loadMyAssets();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadMyAssets = async () => {
    try {
      setLoading(true);
      const myAssets = await EmployeeService.getMyAssets();
      setAssets(myAssets);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLocalAsset = async (localId: string) => {
    try {
      const success = await EmployeeService.removeLocalAsset(localId);
      if (success) {
        toast.success('Local asset removed');
        loadMyAssets(); // Refresh the list
      } else {
        toast.error('Failed to remove asset');
      }
    } catch (error) {
      console.error('Error removing local asset:', error);
      toast.error('Failed to remove asset');
    }
  };

  const handleShowQRCode = (asset: MyAsset | LocalAsset) => {
    // Only show QR code if the asset has one
    if (!asset.qr_code) return;
    
    setSelectedAsset({
      ...asset,
      name: `${asset.brand} ${asset.model}`,
      category: asset.device_type,
      assignee: asset.assigned_to,
      value: 0
    } as any);
    setShowQRCode(true);
  };

  const isLocalAsset = (asset: MyAsset | LocalAsset): asset is LocalAsset => {
    return 'isLocal' in asset && asset.isLocal;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'retired': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString();
  };

  const handleAssetCreated = async (assetData: any) => {
    try {
      console.log('Creating asset with data:', assetData);
      
      const result = await AssetCreationService.createAndStoreAsset(assetData);
      
      if (result.success) {
        toast.success('Asset created successfully!');
        setShowAddAssetModal(false);
        // Refresh the assets list to show the new asset
        await loadMyAssets();
      } else {
        toast.error(`Failed to create asset: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating asset:', error);
      toast.error('Failed to create asset');
    }
  };

  if (loading) {
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

          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg text-gray-600 dark:text-gray-400">Loading your assets...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/employee/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Assets</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {assets.length} asset{assets.length !== 1 ? 's' : ''} assigned to you
                {assets.some(isLocalAsset) && (
                  <span className="ml-2 text-sm">
                    ({assets.filter(isLocalAsset).length} local)
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setShowAddAssetModal(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
            <Button
              variant="outline"
              onClick={loadMyAssets}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {assets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="glass-effect">
              <CardContent className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No Assets Assigned
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You don't have any assets assigned to you yet. Add an asset or scan QR codes.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => setShowAddAssetModal(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Asset
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/employee/scan')}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Scan QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset, index) => (
              <motion.div
                key={isLocalAsset(asset) ? asset.localId : asset.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="glass-effect hover:shadow-lg transition-all duration-300 group relative">
                  {/* Local Asset Indicator */}
                  {isLocalAsset(asset) && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                        <Smartphone className="h-3 w-3 mr-1" />
                        Local
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold">
                          {asset.brand.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                            {asset.brand} {asset.model}
                          </CardTitle>
                          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                            {asset.device_type?.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {asset.qr_code && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShowQRCode(asset)}
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {isLocalAsset(asset) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveLocalAsset(asset.localId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <Badge className={`${getStatusColor(asset.status)} border`}>
                        {asset.status}
                      </Badge>
                      <span className="text-xs text-gray-500 font-mono">
                        {asset.serial_number}
                      </span>
                    </div>

                    {/* Asset Details */}
                    <div className="space-y-3">
                      {asset.location && (
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">{asset.location}</span>
                        </div>
                      )}
                      
                      {asset.purchase_date && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            Purchased: {formatDate(asset.purchase_date)}
                          </span>
                        </div>
                      )}
                      
                      {asset.warranty_expiry && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            Warranty: {formatDate(asset.warranty_expiry)}
                          </span>
                        </div>
                      )}

                      {isLocalAsset(asset) && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-blue-400" />
                          <span className="text-blue-600 dark:text-blue-400">
                            Scanned: {formatDate(asset.scannedAt)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {asset.notes && (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {asset.notes}
                        </p>
                      </div>
                    )}

                    {isLocalAsset(asset) && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          This asset is stored locally on your device
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Asset Modal */}
      <Dialog open={showAddAssetModal} onOpenChange={setShowAddAssetModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Asset</DialogTitle>
          </DialogHeader>
          <SimpleAddAssetForm
            onClose={() => setShowAddAssetModal(false)}
            onAssetCreated={handleAssetCreated}
          />
        </DialogContent>
      </Dialog>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQRCode}
        onClose={() => {
          setShowQRCode(false);
          setSelectedAsset(null);
        }}
        asset={selectedAsset}
      />
    </div>
  );
};

export default MyAssets;
