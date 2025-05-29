
import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, X, Flashlight } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const QRScanner = ({ onScan, onClose, isOpen }: QRScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
  const [hasFlash, setHasFlash] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !videoRef.current) return;

    const scanner = new QrScanner(
      videoRef.current,
      (result) => {
        console.log('QR Code detected:', result.data);
        onScan(result.data);
        scanner.stop();
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        maxScansPerSecond: 5,
      }
    );

    setQrScanner(scanner);

    scanner.start().then(() => {
      scanner.hasFlash().then(setHasFlash);
    }).catch((err) => {
      console.error('Error starting QR scanner:', err);
      setError('Failed to access camera. Please ensure camera permissions are granted.');
    });

    return () => {
      scanner.stop();
      scanner.destroy();
    };
  }, [isOpen, onScan]);

  const toggleFlash = () => {
    if (qrScanner && hasFlash) {
      qrScanner.toggleFlash().then(() => {
        setFlashOn(!flashOn);
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>Scan QR Code</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={onClose}>Close</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-64 bg-black rounded-lg object-cover"
                  playsInline
                />
                <div className="absolute inset-0 border-2 border-green-500 rounded-lg pointer-events-none opacity-50" />
              </div>
              
              <div className="flex justify-center space-x-4">
                {hasFlash && (
                  <Button
                    variant={flashOn ? "default" : "outline"}
                    size="sm"
                    onClick={toggleFlash}
                  >
                    <Flashlight className="h-4 w-4 mr-2" />
                    Flash
                  </Button>
                )}
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
              
              <p className="text-sm text-gray-500 text-center">
                Point your camera at a QR code to scan
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;
