
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, Package, MapPin, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import QRScanner from '@/components/QRScanner';
import AssetRequestFromScanModal from '@/components/AssetRequestFromScanModal';
import { EmployeeService } from '@/services/employeeService';
import { useToast } from '@/hooks/use-toast';

const ScanAsset = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showScanner, setShowScanner] = useState(false);
  const [scannedAsset, setScannedAsset] = useState<any | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleScan = async (qrData: string) => {
    setLoading(true);
    setShowScanner(false);
    
    try {
      const asset = await EmployeeService.getAssetByQRCode(qrData);
      
      if (asset) {
        setScannedAsset(asset);
        toast({
          title: 'QR Code Scanned!',
          description: `Found asset: ${asset.brand} ${asset.model}`
        });
      } else {
        toast({
          title: 'Asset Not Found',
          description: 'The scanned QR code does not match any asset in our system',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error processing scanned QR:', error);
      toast({
        title: 'Scan Error',
        description: 'Failed to process the scanned QR code',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAsset = () => {
    if (scannedAsset) {
      setShowRequestModal(true);
    }
  };

  const handleRequestSuccess = () => {
    setScannedAsset(null);
    navigate('/employee/requests');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const canRequestAsset = (asset: any) => {
    return asset && (asset.status === 'active' || asset.status === 'inactive') && !asset.employee_id;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-green-900 dark:to-emerald-900">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-effect border-b border-green-200/20 dark:border-green-700/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/employee/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Scan Asset
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Scan QR codes to view and request assets
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Scan Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="glass-effect text-center">
              <CardContent className="p-8">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Scan Asset QR Code</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Point your camera at an asset's QR code to view details and request it
                </p>
                <Button 
                  onClick={() => setShowScanner(true)} 
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Start Scanning'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Scanned Asset Display */}
          {scannedAsset && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Scanned Asset</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Asset Info */}
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <Package className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{scannedAsset.brand} {scannedAsset.model}</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Device Type: {scannedAsset.device_type}
                        </p>
                        <p className="text-sm text-gray-500">
                          Serial: {scannedAsset.serial_number}
                        </p>
                        <p className="text-sm text-gray-500">
                          Asset Tag: {scannedAsset.asset_tag}
                        </p>
                      </div>
                      <Badge className={getStatusColor(scannedAsset.status)}>
                        {scannedAsset.status}
                      </Badge>
                    </div>

                    {/* Location */}
                    {scannedAsset.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Location: {scannedAsset.location}
                        </span>
                      </div>
                    )}

                    {/* Assignment Status */}
                    {scannedAsset.employee_id && (
                      <div className="flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <span className="text-yellow-700 dark:text-yellow-300">
                          This asset is currently assigned to another employee
                        </span>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      {canRequestAsset(scannedAsset) ? (
                        <Button 
                          onClick={handleRequestAsset}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Request This Asset
                        </Button>
                      ) : (
                        <Button disabled variant="outline">
                          {scannedAsset.employee_id ? 'Asset Already Assigned' : 'Asset Not Available'}
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        onClick={() => setScannedAsset(null)}
                      >
                        Scan Another
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>How to Scan</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>1. Click "Start Scanning" to open your camera</li>
                  <li>2. Point your camera at the QR code on the asset</li>
                  <li>3. Wait for the QR code to be detected</li>
                  <li>4. View the asset details and request if available</li>
                </ol>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={showScanner}
        onScan={handleScan}
        onClose={() => setShowScanner(false)}
      />

      {/* Asset Request Modal */}
      <AssetRequestFromScanModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSuccess={handleRequestSuccess}
        asset={scannedAsset}
      />
    </div>
  );
};

export default ScanAsset;
