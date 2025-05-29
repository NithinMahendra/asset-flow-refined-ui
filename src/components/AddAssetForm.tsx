
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminData } from '@/contexts/AdminDataContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, X } from 'lucide-react';
import QRCode from 'qrcode';

const assetSchema = z.object({
  name: z.string().min(1, 'Asset name is required'),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required').optional(),
  model: z.string().min(1, 'Model is required').optional(),
  serial_number: z.string().min(1, 'Serial number is required'),
  device_type: z.string().min(1, 'Device type is required').optional(),
  status: z.enum(['active', 'inactive', 'maintenance', 'retired', 'missing', 'damaged']).default('active'),
  location: z.string().min(1, 'Location is required'),
  department: z.string().optional(),
  assignee: z.string().default('-'),
  value: z.number().min(0, 'Value must be positive'),
  purchase_date: z.string().min(1, 'Purchase date is required'),
  warranty_expiry: z.string().optional(),
  condition: z.enum(['Excellent', 'Good', 'Fair', 'Poor']).default('Excellent'),
  description: z.string().optional(),
});

type AssetFormData = z.infer<typeof assetSchema>;

interface AddAssetFormProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

const AddAssetForm = ({ onClose, onSuccess }: AddAssetFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const { addAsset } = useAdminData();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      status: 'active',
      assignee: '-',
      condition: 'Excellent'
    }
  });

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

  const generateQRCode = async (assetData: AssetFormData) => {
    try {
      const qrData = JSON.stringify({
        name: assetData.name,
        serial: assetData.serial_number,
        type: assetData.device_type,
        timestamp: Date.now()
      });
      
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeUrl(qrCodeDataUrl);
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return '';
    }
  };

  const onSubmit = async (data: AssetFormData) => {
    setIsSubmitting(true);
    
    try {
      // Generate QR code
      await generateQRCode(data);
      
      // Prepare asset data - map to the correct Asset interface
      const assetData = {
        device_type: data.device_type || 'other',
        status: data.status,
        assigned_to: data.assignee === '-' ? null : data.assignee,
        purchase_price: data.value,
        location: data.location,
        serial_number: data.serial_number,
        purchase_date: data.purchase_date,
        warranty_expiry: data.warranty_expiry || null,
        brand: data.brand || '',
        model: data.model || '',
        notes: data.description || null,
        asset_tag: null, // Will be auto-generated
        updated_at: new Date().toISOString(),
        // Computed fields for compatibility
        name: data.name,
        category: data.category,
        assignee: data.assignee,
        value: data.value,
        last_updated: new Date().toISOString().split('T')[0],
        qr_code: '', // Will be generated
        condition: data.condition,
        department: data.department || '',
        description: data.description || ''
      };

      await addAsset(assetData);
      
      toast({
        title: 'Success!',
        description: 'Asset has been created successfully with QR code generated.',
      });

      reset();
      setQrCodeUrl('');
      onSuccess?.();
      
    } catch (error) {
      console.error('Error creating asset:', error);
      toast({
        title: 'Error',
        description: 'Failed to create asset. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    setQrCodeUrl('');
    onClose?.();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Add New Asset</span>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
              
              <div>
                <Label htmlFor="name">Asset Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="e.g., MacBook Pro 16-inch"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  {...register('category')}
                  placeholder="e.g., Laptop, Desktop, Mobile"
                  className={errors.category ? 'border-red-500' : ''}
                />
                {errors.category && (
                  <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="device_type">Device Type</Label>
                <Select onValueChange={(value) => setValue('device_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    {...register('brand')}
                    placeholder="e.g., Apple, Dell, HP"
                  />
                </div>

                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    {...register('model')}
                    placeholder="e.g., MacBook Pro M3"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="serial_number">Serial Number *</Label>
                <Input
                  id="serial_number"
                  {...register('serial_number')}
                  placeholder="e.g., MP-2024-001"
                  className={errors.serial_number ? 'border-red-500' : ''}
                />
                {errors.serial_number && (
                  <p className="text-sm text-red-500 mt-1">{errors.serial_number.message}</p>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select onValueChange={(value) => setValue('status', value as any)} defaultValue="active">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                      <SelectItem value="missing">Missing</SelectItem>
                      <SelectItem value="damaged">Damaged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select onValueChange={(value) => setValue('condition', value as any)} defaultValue="Excellent">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  {...register('location')}
                  placeholder="e.g., Office Floor 2"
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && (
                  <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  {...register('department')}
                  placeholder="e.g., Engineering, Marketing"
                />
              </div>

              <div>
                <Label htmlFor="value">Value ($) *</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  {...register('value', { valueAsNumber: true })}
                  placeholder="0.00"
                  className={errors.value ? 'border-red-500' : ''}
                />
                {errors.value && (
                  <p className="text-sm text-red-500 mt-1">{errors.value.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="purchase_date">Purchase Date *</Label>
                  <Input
                    id="purchase_date"
                    type="date"
                    {...register('purchase_date')}
                    className={errors.purchase_date ? 'border-red-500' : ''}
                  />
                  {errors.purchase_date && (
                    <p className="text-sm text-red-500 mt-1">{errors.purchase_date.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="warranty_expiry">Warranty Expiry</Label>
                  <Input
                    id="warranty_expiry"
                    type="date"
                    {...register('warranty_expiry')}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Additional notes or description..."
                  rows={3}
                />
              </div>

              {/* QR Code Preview */}
              {qrCodeUrl && (
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Generated QR Code</h4>
                  <img src={qrCodeUrl} alt="Asset QR Code" className="mx-auto" />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Asset...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
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

export default AddAssetForm;
