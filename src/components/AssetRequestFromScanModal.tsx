
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

interface AssetRequestFromScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  asset: any | null;
}

const AssetRequestFromScanModal = ({ isOpen, onClose, onSuccess, asset }: AssetRequestFromScanModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Scanned Asset</DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            Asset Scanning Coming Soon
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Asset scanning and request functionality is being developed and will be available soon.
          </p>
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssetRequestFromScanModal;
