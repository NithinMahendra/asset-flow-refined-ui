
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { EmployeeService } from '@/services/employeeService';
import { Package, MapPin } from 'lucide-react';

interface AssetRequestFromScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  asset: any | null;
}

const AssetRequestFromScanModal = ({ isOpen, onClose, onSuccess, asset }: AssetRequestFromScanModalProps) => {
  const [justification, setJustification] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!justification.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a justification for this request',
        variant: 'destructive'
      });
      return;
    }

    if (!asset) {
      toast({
        title: 'Error',
        description: 'Asset information is missing',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await EmployeeService.createAssetRequestFromScan(
        asset.id,
        justification,
        priority
      );
      
      if (success) {
        toast({
          title: 'Success!',
          description: 'Your asset request has been submitted successfully'
        });
        setJustification('');
        setPriority('medium');
        onSuccess();
        onClose();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to submit asset request',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Scanned Asset</DialogTitle>
        </DialogHeader>
        
        {asset && (
          <div className="space-y-6">
            {/* Asset Details */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{asset.brand} {asset.model}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Serial: {asset.serial_number}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Asset Tag: {asset.asset_tag}
                  </p>
                  {asset.location && (
                    <div className="flex items-center mt-2">
                      <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {asset.location}
                      </span>
                    </div>
                  )}
                  <div className="mt-2">
                    <Badge className={getStatusColor(asset.status)}>
                      {asset.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Request Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="justification">Business Justification *</Label>
                <Textarea
                  id="justification"
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Please explain why you need this asset..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AssetRequestFromScanModal;
