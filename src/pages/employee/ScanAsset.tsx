
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, Camera, CheckCircle, AlertTriangle } from 'lucide-react';
import QRScanner from '@/components/QRScanner';
import { EmployeeService } from '@/services/employeeService';
import { toast } from 'sonner';

const ScanAsset = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedAsset, setScannedAsset] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartScan = () => {
    setIsScanning(true);
    setScannedAsset(null);
  };

  const handleQRScan = async (data: string) => {
    console.log('QR Code scanned:', data);
    setIsScanning(false);
    setIsProcessing(true);

    try {
      // Parse QR code data
      let qrData;
      try {
        qrData = JSON.parse(data);
      } catch {
        // If it's not JSON, treat it as a simple string
        qrData = { id: data };
      }

      // Look up asset by QR code
      const asset = await EmployeeService.getAssetByQRCode(data);
      
      if (asset) {
        setScannedAsset(asset);
        toast.success('Asset found!');
      } else {
        toast.error('Asset not found in database');
      }
    } catch (error) {
      console.error('Error processing QR scan:', error);
      toast.error('Failed to process QR code');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToMyAssets = async () => {
    if (!scannedAsset) return;

    setIsProcessing(true);
    try {
      // Check if asset is available (not assigned)
      if (!scannedAsset.assigned_to) {
        // Create asset request for instant assignment
        const success = await EmployeeService.createAssetRequestFromScan(scannedAsset);
        
        if (success) {
          toast.success('Asset request created! Admin will assign it to you.');
          navigate('/employee/requests');
        } else {
          toast.error('Failed to create asset request');
        }
      } else {
        // Asset is already assigned
        toast.error('This asset is already assigned to someone else');
      }
    } catch (error) {
      console.error('Error adding asset:', error);
      toast.error('Failed to add asset');
    } finally {
      setIsProcessing(false);
    }
  };

  const getAssetStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'retired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const isAssetAvailable = scannedAsset && !scannedAsset.assigned_to && scannedAsset.status === 'active';

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
          {!isScanning && !scannedAsset && (
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
                  <h2 className="text-xl font-semibold mb-2">Ready to Scan</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Point your camera at an asset QR code to get started
                  </p>
                  <Button onClick={handleStartScan} className="bg-green-600 hover:bg-green-700">
                    <Camera className="h-4 w-4 mr-2" />
                    Start Scanning
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* QR Scanner */}
          <QRScanner
            isOpen={isScanning}
            onScan={handleQRScan}
            onClose={() => setIsScanning(false)}
          />

          {/* Processing State */}
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass-effect text-center">
                <CardContent className="p-8">
                  <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Processing QR code...</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Scanned Asset Display */}
          {scannedAsset && !isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glass-effect">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Asset Found!</h2>
                  </div>

                  {/* Asset Details */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">
                        {scannedAsset.brand} {scannedAsset.model}
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Type:</span>
                          <p className="font-medium capitalize">{scannedAsset.device_type}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Serial:</span>
                          <p className="font-mono">{scannedAsset.serial_number}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Location:</span>
                          <p className="font-medium">{scannedAsset.location || 'Not specified'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Status:</span>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getAssetStatusColor(scannedAsset.status)}`}>
                            {scannedAsset.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Assignment Status */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        {isAssetAvailable ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        )}
                        <span className="font-medium">
                          {isAssetAvailable ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {scannedAsset.assigned_to 
                          ? `Currently assigned to: ${scannedAsset.assigned_to}`
                          : 'This asset is available for assignment'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setScannedAsset(null);
                        setIsScanning(false);
                      }}
                      className="flex-1"
                    >
                      Scan Another
                    </Button>
                    
                    {isAssetAvailable && (
                      <Button
                        onClick={handleAddToMyAssets}
                        disabled={isProcessing}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Processing...
                          </>
                        ) : (
                          'Request Asset'
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ScanAsset;
