
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Users, MapPin, Settings } from 'lucide-react';

interface BulkOperationsPanelProps {
  selectedAssets: string[];
  onClose: () => void;
  onComplete: () => void;
}

const BulkOperationsPanel = ({ selectedAssets, onClose, onComplete }: BulkOperationsPanelProps) => {
  const [operation, setOperation] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const operations = [
    { value: 'update-status', label: 'Update Status', icon: Settings },
    { value: 'update-location', label: 'Update Location', icon: MapPin },
    { value: 'bulk-assign', label: 'Bulk Assignment', icon: Users },
    { value: 'export-data', label: 'Export Selected', icon: CheckCircle },
    { value: 'generate-qr', label: 'Generate QR Codes', icon: CheckCircle },
  ];

  const statusOptions = ['Available', 'In Use', 'In Repair', 'Faulty', 'Retired'];
  const locationOptions = ['Warehouse A', 'Warehouse B', 'Office Floor 1', 'Office Floor 2', 'IT Department'];

  const handleExecute = async () => {
    setIsProcessing(true);
    setProgress(0);

    // Simulate bulk operation progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }

    console.log(`Executing ${operation} on ${selectedAssets.length} assets with value: ${targetValue}`);
    
    setIsProcessing(false);
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  const getTargetInput = () => {
    switch (operation) {
      case 'update-status':
        return (
          <Select value={targetValue} onValueChange={setTargetValue}>
            <SelectTrigger>
              <SelectValue placeholder="Select new status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status.toLowerCase()}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'update-location':
        return (
          <Select value={targetValue} onValueChange={setTargetValue}>
            <SelectTrigger>
              <SelectValue placeholder="Select new location" />
            </SelectTrigger>
            <SelectContent>
              {locationOptions.map((location) => (
                <SelectItem key={location} value={location.toLowerCase()}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'bulk-assign':
        return (
          <input
            type="text"
            placeholder="Enter employee email or name"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Operations</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selected Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{selectedAssets.length} Assets Selected</p>
                  <p className="text-sm text-gray-600">Ready for bulk operation</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Operation</label>
              <Select value={operation} onValueChange={setOperation}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose bulk operation" />
                </SelectTrigger>
                <SelectContent>
                  {operations.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      <div className="flex items-center space-x-2">
                        <op.icon className="h-4 w-4" />
                        <span>{op.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {operation && operation !== 'export-data' && operation !== 'generate-qr' && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  {operation === 'update-status' && 'New Status'}
                  {operation === 'update-location' && 'New Location'}
                  {operation === 'bulk-assign' && 'Assign To'}
                </label>
                {getTargetInput()}
              </div>
            )}
          </div>

          {isProcessing && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {operation && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Operation Preview</p>
                    <p className="text-sm text-blue-800">
                      {operation === 'update-status' && `Update status to "${targetValue}" for ${selectedAssets.length} assets`}
                      {operation === 'update-location' && `Move ${selectedAssets.length} assets to "${targetValue}"`}
                      {operation === 'bulk-assign' && `Assign ${selectedAssets.length} assets to "${targetValue}"`}
                      {operation === 'export-data' && `Export data for ${selectedAssets.length} selected assets`}
                      {operation === 'generate-qr' && `Generate QR codes for ${selectedAssets.length} assets`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              onClick={handleExecute} 
              disabled={!operation || isProcessing || (operation !== 'export-data' && operation !== 'generate-qr' && !targetValue)}
            >
              {isProcessing ? 'Processing...' : 'Execute Operation'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkOperationsPanel;
