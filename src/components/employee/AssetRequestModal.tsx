
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Package, Clock, Wrench } from 'lucide-react';
import { toast } from 'sonner';

interface AssetRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: any;
  onRequestSubmit: (requestData: {
    asset_id: string;
    request_type: string;
    description: string;
  }) => Promise<boolean>;
}

const AssetRequestModal: React.FC<AssetRequestModalProps> = ({
  open,
  onOpenChange,
  asset,
  onRequestSubmit
}) => {
  const [requestType, setRequestType] = useState('assignment');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error('Please provide a description for your request');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onRequestSubmit({
        asset_id: asset.id,
        request_type: requestType,
        description: description.trim()
      });

      if (success) {
        toast.success('Asset request submitted successfully!');
        onOpenChange(false);
        setDescription('');
        setRequestType('assignment');
      } else {
        toast.error('Failed to submit request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('An error occurred while submitting your request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestTypes = [
    {
      value: 'assignment',
      label: 'Assignment Request',
      description: 'Request to have this asset assigned to you',
      icon: Package
    },
    {
      value: 'maintenance',
      label: 'Maintenance Request',
      description: 'Report an issue or request maintenance',
      icon: Wrench
    },
    {
      value: 'return',
      label: 'Return Request',
      description: 'Request to return this asset',
      icon: Clock
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Asset</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Asset Info */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-2">
              Asset Details
            </h3>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="font-medium">{asset?.brand || 'Unknown'} {asset?.model || 'Asset'}</span>
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Serial: {asset?.serial_number || 'N/A'}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Type: {asset?.device_type || 'Unknown'}
              </p>
            </div>
          </div>

          {/* Request Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Request Type</Label>
            <RadioGroup value={requestType} onValueChange={setRequestType}>
              {requestTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div key={type.value} className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                    <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                    <div className="flex-1">
                      <label htmlFor={type.value} className="flex items-center space-x-2 cursor-pointer">
                        <Icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </label>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {type.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description / Justification
            </Label>
            <Textarea
              id="description"
              placeholder="Please explain why you need this asset or provide additional details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-slate-500">
              Provide a clear justification for your request to help with approval.
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !description.trim()}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssetRequestModal;
