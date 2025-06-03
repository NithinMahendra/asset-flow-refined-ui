
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, X } from 'lucide-react';
import { useAdminData } from '@/contexts/AdminDataContext';

interface SimpleAddAssetFormProps {
  onClose?: () => void;
  onAssetCreated?: () => void;
}

const SimpleAddAssetForm = ({ onClose, onAssetCreated }: SimpleAddAssetFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { addAsset } = useAdminData();

  const [formData, setFormData] = useState({
    device_type: 'laptop',
    brand: '',
    model: '',
    serial_number: '',
    status: 'active',
    location: '',
    purchase_price: '',
    purchase_date: '',
    warranty_expiry: '',
    notes: ''
  });

  // Use exact enum values from database
  const deviceTypes = [
    { value: 'laptop', label: 'Laptop' },
    { value: 'desktop', label: 'Desktop' },
    { value: 'server', label: 'Server' },
    { value: 'monitor', label: 'Monitor' },
    { value: 'tablet', label: 'Tablet' },
    { value: 'smartphone', label: 'Smartphone' },
    { value: 'network_switch', label: 'Network Switch' },
    { value: 'router', label: 'Router' },
    { value: 'printer', label: 'Printer' },
    { value: 'scanner', label: 'Scanner' },
    { value: 'projector', label: 'Projector' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'In Maintenance' },
    { value: 'retired', label: 'Retired' },
    { value: 'missing', label: 'Missing' },
    { value: 'damaged', label: 'Damaged' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.device_type) newErrors.device_type = 'Device type is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.serial_number.trim()) newErrors.serial_number = 'Serial number is required';
    if (!formData.status) newErrors.status = 'Status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 SimpleAddAssetForm: Form submission started');
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Generate QR code for the asset
      const qrCode = `ASSET-${Date.now()}-${formData.serial_number}`;
      
      // Prepare data for database
      const assetData = {
        device_type: formData.device_type as any,
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        serial_number: formData.serial_number.trim(),
        status: formData.status as any,
        location: formData.location.trim() || null,
        purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : null,
        purchase_date: formData.purchase_date || null,
        warranty_expiry: formData.warranty_expiry || null,
        notes: formData.notes.trim() || null,
        qr_code: qrCode,
        name: `${formData.brand} ${formData.model}`.trim(),
        category: formData.device_type
      };

      console.log('📤 SimpleAddAssetForm: Sending asset data:', assetData);

      await addAsset(assetData);

      // Reset form on success
      setFormData({
        device_type: 'laptop',
        brand: '',
        model: '',
        serial_number: '',
        status: 'active',
        location: '',
        purchase_price: '',
        purchase_date: '',
        warranty_expiry: '',
        notes: ''
      });

      onAssetCreated?.();
      onClose?.();

    } catch (error) {
      console.error('❌ SimpleAddAssetForm: Form submission error:', error);
      // Error toast is handled by the context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Add New Asset</span>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Device Type */}
          <div>
            <Label htmlFor="device_type">Device Type *</Label>
            <Select 
              value={formData.device_type} 
              onValueChange={(value) => handleInputChange('device_type', value)}
            >
              <SelectTrigger className={errors.device_type ? 'border-red-500' : ''}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {deviceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.device_type && <p className="text-sm text-red-500 mt-1">{errors.device_type}</p>}
          </div>

          {/* Brand and Model */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                placeholder="e.g., Apple, Dell"
                className={errors.brand ? 'border-red-500' : ''}
              />
              {errors.brand && <p className="text-sm text-red-500 mt-1">{errors.brand}</p>}
            </div>
            <div>
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                placeholder="e.g., MacBook Pro"
                className={errors.model ? 'border-red-500' : ''}
              />
              {errors.model && <p className="text-sm text-red-500 mt-1">{errors.model}</p>}
            </div>
          </div>

          {/* Serial Number */}
          <div>
            <Label htmlFor="serial_number">Serial Number *</Label>
            <Input
              id="serial_number"
              value={formData.serial_number}
              onChange={(e) => handleInputChange('serial_number', e.target.value)}
              placeholder="e.g., SN-2024-001"
              className={errors.serial_number ? 'border-red-500' : ''}
            />
            {errors.serial_number && <p className="text-sm text-red-500 mt-1">{errors.serial_number}</p>}
          </div>

          {/* Status and Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., Office Floor 2"
              />
            </div>
          </div>

          {/* Purchase Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purchase_price">Purchase Price</Label>
              <Input
                id="purchase_price"
                type="number"
                step="0.01"
                value={formData.purchase_price}
                onChange={(e) => handleInputChange('purchase_price', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="purchase_date">Purchase Date</Label>
              <Input
                id="purchase_date"
                type="date"
                value={formData.purchase_date}
                onChange={(e) => handleInputChange('purchase_date', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="warranty_expiry">Warranty Expiry</Label>
            <Input
              id="warranty_expiry"
              type="date"
              value={formData.warranty_expiry}
              onChange={(e) => handleInputChange('warranty_expiry', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Asset
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimpleAddAssetForm;
