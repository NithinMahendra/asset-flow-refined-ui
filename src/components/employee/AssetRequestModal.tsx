
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { EmployeeService } from '@/services/employeeService';

interface AssetRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AssetRequestModal = ({ isOpen, onClose, onSuccess }: AssetRequestModalProps) => {
  const [formData, setFormData] = useState({
    asset_type: '',
    brand: '',
    model: '',
    justification: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.asset_type || !formData.justification) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await EmployeeService.createAssetRequest(formData);
      
      if (success) {
        toast({
          title: 'Success!',
          description: 'Your asset request has been submitted successfully'
        });
        setFormData({
          asset_type: '',
          brand: '',
          model: '',
          justification: '',
          priority: 'medium'
        });
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request New Asset</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="asset_type">Asset Type *</Label>
            <Select value={formData.asset_type} onValueChange={(value) => setFormData({...formData, asset_type: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="laptop">Laptop</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="smartphone">Smartphone</SelectItem>
                <SelectItem value="monitor">Monitor</SelectItem>
                <SelectItem value="printer">Printer</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => setFormData({...formData, brand: e.target.value})}
              placeholder="e.g., Apple, Dell, HP"
            />
          </div>

          <div>
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => setFormData({...formData, model: e.target.value})}
              placeholder="e.g., MacBook Pro, XPS 13"
            />
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={(value: any) => setFormData({...formData, priority: value})}>
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
              value={formData.justification}
              onChange={(e) => setFormData({...formData, justification: e.target.value})}
              placeholder="Please explain why you need this asset and how it will be used..."
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
      </DialogContent>
    </Dialog>
  );
};

export default AssetRequestModal;
