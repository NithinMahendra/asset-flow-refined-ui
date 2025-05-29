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
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, X } from 'lucide-react';
import QRCode from 'qrcode';

const assetSchema = z.object({
  device_type: z.enum(['laptop', 'desktop', 'server', 'monitor', 'tablet', 'smartphone', 'network_switch', 'router', 'printer', 'scanner', 'projector', 'other']),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  serial_number: z.string().min(1, 'Serial number is required'),
  status: z.enum(['active', 'inactive', 'maintenance', 'retired', 'missing', 'damaged']).default('active'),
  location: z.string().min(1, 'Location is required'),
  assigned_to: z.string().optional(),
  purchase_price: z.number().min(0, 'Value must be positive'),
  purchase_date: z.string().min(1, 'Purchase date is required'),
  warranty_expiry: z.string().optional(),
  notes: z.string().optional(),
});

type AssetFormData = z.infer<typeof assetSchema>;

interface AddAssetFormProps {
  onClose?: () => void;
  onAssetCreated?: (asset: AssetFormData) => Promise<void>;
}

const AddAssetForm = ({ onClose, onAssetCreated }: AddAssetFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
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
      assigned_to: '',
      device_type: 'laptop',
      brand: '',
      model: '',
      serial_number: '',
      location: '',
      purchase_price: 0,
      purchase_date: '',
      warranty_expiry: '',
      notes: ''
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

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'In Maintenance' },
    { value: 'retired', label: 'Retired' },
    { value: 'missing', label: 'Missing' },
    { value: 'damaged', label: 'Damaged' }
  ];

  const generateQRCode = async (assetId: string) => {
    try {
      // Use simple asset ID format: asset:{assetId}
      const qrData = `asset:${assetId}`;
      
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
    console.log('📝 Form submission started with data:', data);
    setIsSubmitting(true);
    
    try {
      // Pre-submission validation
      if (!data.brand?.trim()) {
        throw new Error('Brand is required');
      }
      if (!data.model?.trim()) {
        throw new Error('Model is required');
      }
      if (!data.serial_number?.trim()) {
        throw new Error('Serial number is required');
      }
      if (!data.location?.trim()) {
        throw new Error('Location is required');
      }
      if (!data.purchase_date) {
        throw new Error('Purchase date is required');
      }

      // Call the parent component's handler first to create the asset and get the ID
      if (onAssetCreated) {
        console.log('🔄 Calling parent asset creation handler...');
        await onAssetCreated(data);
        
        // Note: In a real implementation, we'd need the asset ID returned from onAssetCreated
        // For now, we'll generate a placeholder QR code
        // The admin should regenerate QR codes after asset creation with the real asset ID
        const tempId = 'temp-' + Date.now();
        await generateQRCode(tempId);
      }
      
      // Reset form on success
      reset();
      setQrCodeUrl('');
      
    } catch (error) {
      console.error('❌ Form submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: 'Form Submission Error',
        description: errorMessage,
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
        <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
          <span>Add New Asset</span>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
              
              <div>
                <Label htmlFor="device_type" className="text-sm font-medium">Device Type *</Label>
                <Select 
                  value={watch('device_type')} 
                  onValueChange={(value) => {
                    console.log('Setting device_type to:', value);
                    setValue('device_type', value as any, { shouldValidate: true });
                  }}
                >
                  <SelectTrigger className={`mt-1 ${errors.device_type ? 'border-red-500' : ''}`}>
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
                {errors.device_type && (
                  <p className="text-sm text-red-500 mt-1">{errors.device_type.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand" className="text-sm font-medium">Brand *</Label>
                  <Input
                    id="brand"
                    {...register('brand')}
                    placeholder="e.g., Apple, Dell, HP"
                    className={`mt-1 ${errors.brand ? 'border-red-500' : ''}`}
                  />
                  {errors.brand && (
                    <p className="text-sm text-red-500 mt-1">{errors.brand.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="model" className="text-sm font-medium">Model *</Label>
                  <Input
                    id="model"
                    {...register('model')}
                    placeholder="e.g., MacBook Pro M3"
                    className={`mt-1 ${errors.model ? 'border-red-500' : ''}`}
                  />
                  {errors.model && (
                    <p className="text-sm text-red-500 mt-1">{errors.model.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="serial_number" className="text-sm font-medium">Serial Number *</Label>
                <Input
                  id="serial_number"
                  {...register('serial_number')}
                  placeholder="e.g., MP-2024-001"
                  className={`mt-1 ${errors.serial_number ? 'border-red-500' : ''}`}
                />
                {errors.serial_number && (
                  <p className="text-sm text-red-500 mt-1">{errors.serial_number.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="location" className="text-sm font-medium">Location *</Label>
                <Input
                  id="location"
                  {...register('location')}
                  placeholder="e.g., Office Floor 2"
                  className={`mt-1 ${errors.location ? 'border-red-500' : ''}`}
                />
                {errors.location && (
                  <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Additional Details</h3>
              
              <div>
                <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                <Select 
                  value={watch('status')} 
                  onValueChange={(value) => {
                    console.log('Setting status to:', value);
                    setValue('status', value as any, { shouldValidate: true });
                  }}
                >
                  <SelectTrigger className="mt-1">
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
                <Label htmlFor="assigned_to" className="text-sm font-medium">Assigned To</Label>
                <Input
                  id="assigned_to"
                  {...register('assigned_to')}
                  placeholder="Employee name or email"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="purchase_price" className="text-sm font-medium">Purchase Price ($) *</Label>
                <Input
                  id="purchase_price"
                  type="number"
                  step="0.01"
                  {...register('purchase_price', { valueAsNumber: true })}
                  placeholder="0.00"
                  className={`mt-1 ${errors.purchase_price ? 'border-red-500' : ''}`}
                />
                {errors.purchase_price && (
                  <p className="text-sm text-red-500 mt-1">{errors.purchase_price.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="purchase_date" className="text-sm font-medium">Purchase Date *</Label>
                  <Input
                    id="purchase_date"
                    type="date"
                    {...register('purchase_date')}
                    className={`mt-1 ${errors.purchase_date ? 'border-red-500' : ''}`}
                  />
                  {errors.purchase_date && (
                    <p className="text-sm text-red-500 mt-1">{errors.purchase_date.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="warranty_expiry" className="text-sm font-medium">Warranty Expiry</Label>
                  <Input
                    id="warranty_expiry"
                    type="date"
                    {...register('warranty_expiry')}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Additional notes or description..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              {qrCodeUrl && (
                <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
                  <h4 className="text-sm font-medium mb-2 text-indigo-700 dark:text-indigo-300">Generated QR Code</h4>
                  <img src={qrCodeUrl} alt="Asset QR Code" className="mx-auto" />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel} 
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white"
            >
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
