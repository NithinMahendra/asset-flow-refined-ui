
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, QrCode, Camera, CheckCircle, AlertTriangle, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'qr-scanner';
import { EmployeeService } from '@/services/employeeService';
import { toast } from 'sonner';

const ScanAsset = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scannedAsset, setScannedAsset] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => {
      if (qrScanner) {
        console.log('Cleaning up QR scanner on unmount');
        qrScanner.stop();
        qrScanner.destroy();
      }
    };
  }, [qrScanner]);

  const stopScanning = () => {
    console.log('Stopping QR scanner...');
    if (qrScanner) {
      qrScanner.stop();
      qrScanner.destroy();
      setQrScanner(null);
    }
    setScanning(false);
    setCameraError(null);
    
    // Stop the video stream completely
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startScanning = async () => {
    console.log('Starting scan process...');
    setCameraError(null);
    setScanning(true);

    try {
      // Wait for video element to be available
      let attempts = 0;
      while (!videoRef.current && attempts < 30) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (!videoRef.current) {
        throw new Error('Video element not available');
      }

      // Ensure any existing scanner is cleaned up
      if (qrScanner) {
        console.log('Cleaning up existing scanner');
        qrScanner.stop();
        qrScanner.destroy();
        setQrScanner(null);
      }

      console.log('Creating new QR scanner...');
      const scanner = new QrScanner(
        videoRef.current!,
        (result) => {
          console.log('QR Code detected:', result.data);
          handleScanSuccess(result.data);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 5,
          preferredCamera: 'environment',
          returnDetailedScanResult: true
        }
      );

      setQrScanner(scanner);

      // Start the scanner
      console.log('Starting scanner...');
      await scanner.start();
      console.log('Scanner started successfully');
      toast.success('Camera ready - Point at a QR code');

    } catch (error) {
      console.error('Error starting scanner:', error);
      setScanning(false);
      setQrScanner(null);
      
      let errorMessage = 'Failed to start camera';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Camera access denied. Please allow camera access and try again.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No camera found on this device.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage = 'Camera not supported on this device.';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Camera is already in use by another application.';
        } else {
          errorMessage = `Camera error: ${error.message}`;
        }
      }
      
      setCameraError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleScanSuccess = async (qrCodeData: string) => {
    console.log('QR Code scanned:', qrCodeData);
    
    // Stop scanning immediately and clean up camera
    stopScanning();
    setIsProcessing(true);

    try {
      // Try to fetch asset from database first
      const asset = await EmployeeService.getAssetByQRCode(qrCodeData);
      
      if (asset) {
        console.log('Asset found in database:', asset);
        setScannedAsset(asset);
        toast.success('Asset found!');
      } else {
        // Create a placeholder asset for unknown QR codes
        const placeholderAsset = {
          id: `unknown_${Date.now()}`,
          device_type: 'unknown',
          brand: 'Unknown',
          model: 'Scanned Device',
          serial_number: qrCodeData,
          status: 'active',
          assigned_to: '',
          qr_code: qrCodeData,
          notes: 'Asset scanned via QR code - details to be updated'
        };
        
        console.log('Asset not found in database, creating placeholder:', placeholderAsset);
        setScannedAsset(placeholderAsset);
        toast.info('QR code scanned - Asset details need to be verified');
      }
    } catch (error) {
      console.error('Error processing scanned QR code:', error);
      toast.error('Error processing QR code');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToMyAssets = async () => {
    if (!scannedAsset) return;

    setIsProcessing(true);
    console.log('Attempting to add asset to local storage:', scannedAsset);

    try {
      const success = await EmployeeService.addAssetToMyLocalAssets(scannedAsset);
      
      if (success) {
        toast.success('Asset added to your local assets!');
        console.log('Asset successfully added to local storage');
        navigate('/employee/my-assets');
      } else {
        toast.error('Failed to add asset. Please try again.');
        console.error('Failed to add asset to local storage');
      }
    } catch (error) {
      console.error('Error adding asset:', error);
      toast.error('An error occurred while adding the asset.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScan = () => {
    setScannedAsset(null);
    setCameraError(null);
  };

  const retryScan = () => {
    setCameraError(null);
    setScanning(false);
    // Wait a moment then try again
    setTimeout(() => {
      startScanning();
    }, 500);
  };

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Scan Asset QR Code</h1>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {!scannedAsset ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <QrCode className="h-6 w-6 mr-2 text-green-600" />
                    QR Code Scanner
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!scanning && !cameraError ? (
                    <div className="text-center space-y-4">
                      <div className="w-32 h-32 mx-auto bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-2xl flex items-center justify-center">
                        <Camera className="h-16 w-16 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          Ready to Scan
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Click the button below to start scanning QR codes on assets
                        </p>
                      </div>
                      <Button
                        onClick={startScanning}
                        className="bg-green-600 hover:bg-green-700"
                        size="lg"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Start Scanning
                      </Button>
                    </div>
                  ) : cameraError ? (
                    <div className="text-center space-y-4">
                      <div className="w-32 h-32 mx-auto bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900 dark:to-orange-900 rounded-2xl flex items-center justify-center">
                        <AlertTriangle className="h-16 w-16 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          Camera Error
                        </h3>
                        <p className="text-red-600 dark:text-red-400 mb-4">
                          {cameraError}
                        </p>
                      </div>
                      <div className="flex space-x-3 justify-center">
                        <Button
                          onClick={retryScan}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Try Again
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => window.location.reload()}
                        >
                          Refresh Page
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        <video
                          ref={videoRef}
                          className="w-full h-64 object-cover rounded-lg bg-black"
                          autoPlay
                          playsInline
                          muted
                        />
                        {isProcessing && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                            <div className="text-white text-center">
                              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                              <p>Processing QR code...</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          Position the QR code within the camera view
                        </p>
                        <Button
                          variant="outline"
                          onClick={stopScanning}
                          disabled={isProcessing}
                        >
                          Stop Scanning
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
                    Asset Scanned Successfully
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold text-xl">
                        {scannedAsset.brand.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {scannedAsset.brand} {scannedAsset.model}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 capitalize">
                          {scannedAsset.device_type?.replace('_', ' ')}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge className="bg-green-100 text-green-800 border-green-200">
                            {scannedAsset.status}
                          </Badge>
                          <span className="text-sm text-gray-500 font-mono">
                            {scannedAsset.serial_number}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {scannedAsset.notes && (
                      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            {scannedAsset.notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      onClick={handleAddToMyAssets}
                      disabled={isProcessing}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <Package className="h-4 w-4 mr-2" />
                          Add to My Assets
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={resetScan}
                      disabled={isProcessing}
                    >
                      Scan Another
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanAsset;
