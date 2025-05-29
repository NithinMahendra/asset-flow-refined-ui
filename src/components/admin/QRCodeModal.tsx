
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Printer, Copy, CheckCircle } from 'lucide-react';
import QRCode from 'qrcode';
import { useToast } from '@/hooks/use-toast';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: any;
}

const QRCodeModal = ({ isOpen, onClose, asset }: QRCodeModalProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (asset?.qr_code && isOpen) {
      generateQRCodeImage();
    }
  }, [asset, isOpen]);

  const generateQRCodeImage = async () => {
    try {
      const url = await QRCode.toDataURL(asset.qr_code, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate QR code',
        variant: 'destructive'
      });
    }
  };

  const handleCopyQRData = async () => {
    try {
      await navigator.clipboard.writeText(asset.qr_code);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'QR code data copied to clipboard'
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive'
      });
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${asset.name}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                margin: 20px;
              }
              .qr-container {
                display: inline-block;
                padding: 20px;
                border: 2px solid #000;
                margin: 10px;
              }
              .asset-info {
                margin-top: 10px;
                font-size: 12px;
              }
              img {
                display: block;
                margin: 0 auto;
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <img src="${qrCodeUrl}" alt="QR Code" />
              <div class="asset-info">
                <strong>${asset.name}</strong><br/>
                Serial: ${asset.serial_number}<br/>
                Location: ${asset.location || 'Not specified'}
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `qr-code-${asset.serial_number}.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  if (!asset) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Asset QR Code</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Asset Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">{asset.name}</h3>
                <p className="text-sm text-gray-600">Serial: {asset.serial_number}</p>
                <p className="text-sm text-gray-600">Location: {asset.location || 'Not specified'}</p>
              </div>
            </CardContent>
          </Card>

          {/* QR Code Display */}
          <div className="flex justify-center">
            {qrCodeUrl ? (
              <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                <img 
                  src={qrCodeUrl} 
                  alt="Asset QR Code"
                  className="w-64 h-64 object-contain"
                />
              </div>
            ) : (
              <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Generating QR code...</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyQRData}
              className="flex flex-col items-center gap-1 h-16"
            >
              {copied ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
              <span className="text-xs">{copied ? 'Copied!' : 'Copy Data'}</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex flex-col items-center gap-1 h-16"
              disabled={!qrCodeUrl}
            >
              <Download className="h-5 w-5" />
              <span className="text-xs">Download</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="flex flex-col items-center gap-1 h-16"
              disabled={!qrCodeUrl}
            >
              <Printer className="h-5 w-5" />
              <span className="text-xs">Print</span>
            </Button>
          </div>

          <div className="text-center">
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
