
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Download, Printer } from 'lucide-react';

const QRCodesContent = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <QrCode className="h-5 w-5 mr-2" />
            QR Code Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-12">
            <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Generate QR Codes for Assets</h3>
            <p className="text-gray-600 mb-6">Create QR codes for easy asset tracking and identification</p>
            <div className="flex justify-center space-x-4">
              <Button>
                <QrCode className="h-4 w-4 mr-2" />
                Generate Individual QR Code
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Bulk Generate
              </Button>
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print Labels
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodesContent;
