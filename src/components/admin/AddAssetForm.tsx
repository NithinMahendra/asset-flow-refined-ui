
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AddAssetFormProps {
  onClose: () => void;
  onAssetCreated: (asset: any) => void;
}

const AddAssetForm = ({ onClose, onAssetCreated }: AddAssetFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    model: '',
    serialNumber: '',
    assetTag: '',
    location: '',
    status: '',
    purchaseDate: undefined as Date | undefined,
    purchasePrice: '',
    supplier: '',
    warrantyPeriod: '',
    warrantyExpiry: undefined as Date | undefined,
    description: '',
    specifications: '',
    assignedTo: '',
    department: '',
    condition: '',
    images: [] as File[]
  });

  const [currentTab, setCurrentTab] = useState('general');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const deviceTypes = ['Laptop', 'Desktop', 'Monitor', 'Tablet', 'Phone', 'Printer', 'Router', 'Switch', 'Other'];
  const locations = ['Warehouse A', 'Warehouse B', 'Office Floor 1', 'Office Floor 2', 'IT Department', 'Storage Room'];
  const statuses = ['Available', 'In Use', 'In Repair', 'Faulty', 'Retired'];
  const conditions = ['New', 'Excellent', 'Good', 'Fair', 'Poor'];
  const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Asset name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.serialNumber.trim()) newErrors.serialNumber = 'Serial number is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (!formData.purchaseDate) newErrors.purchaseDate = 'Purchase date is required';
    if (!formData.purchasePrice.trim()) newErrors.purchasePrice = 'Purchase price is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Format the data for creation
      const assetData = {
        ...formData,
        purchaseDate: formData.purchaseDate ? format(formData.purchaseDate, 'yyyy-MM-dd') : '',
        warrantyExpiry: formData.warrantyExpiry ? format(formData.warrantyExpiry, 'yyyy-MM-dd') : '',
      };
      
      onAssetCreated(assetData);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create asset. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="assignment">Assignment</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Asset Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter asset name"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {deviceTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="e.g., Apple, Dell, HP"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="e.g., MacBook Pro 16-inch"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number *</Label>
                  <Input
                    id="serialNumber"
                    value={formData.serialNumber}
                    onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                    placeholder="Enter serial number"
                    className={errors.serialNumber ? 'border-red-500' : ''}
                  />
                  {errors.serialNumber && <p className="text-sm text-red-500">{errors.serialNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assetTag">Asset Tag</Label>
                  <Input
                    id="assetTag"
                    value={formData.assetTag}
                    onChange={(e) => handleInputChange('assetTag', e.target.value)}
                    placeholder="Will be auto-generated if empty"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                    <SelectTrigger className={errors.location ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location.toLowerCase()}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status.toLowerCase()}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                    <SelectTrigger className={errors.condition ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition.toLowerCase()}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.condition && <p className="text-sm text-red-500">{errors.condition}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter asset description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specifications">Technical Specifications</Label>
                <Textarea
                  id="specifications"
                  value={formData.specifications}
                  onChange={(e) => handleInputChange('specifications', e.target.value)}
                  placeholder="Enter technical specifications"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Purchase Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.purchaseDate && "text-muted-foreground",
                          errors.purchaseDate && "border-red-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.purchaseDate ? format(formData.purchaseDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.purchaseDate}
                        onSelect={(date) => handleInputChange('purchaseDate', date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.purchaseDate && <p className="text-sm text-red-500">{errors.purchaseDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Purchase Price *</Label>
                  <Input
                    id="purchasePrice"
                    value={formData.purchasePrice}
                    onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                    placeholder="e.g., 2499.00"
                    type="number"
                    className={errors.purchasePrice ? 'border-red-500' : ''}
                  />
                  {errors.purchasePrice && <p className="text-sm text-red-500">{errors.purchasePrice}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    value={formData.supplier}
                    onChange={(e) => handleInputChange('supplier', e.target.value)}
                    placeholder="Enter supplier name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warrantyPeriod">Warranty Period (months)</Label>
                  <Input
                    id="warrantyPeriod"
                    value={formData.warrantyPeriod}
                    onChange={(e) => handleInputChange('warrantyPeriod', e.target.value)}
                    placeholder="e.g., 24"
                    type="number"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label>Warranty Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.warrantyExpiry && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.warrantyExpiry ? format(formData.warrantyExpiry, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.warrantyExpiry}
                        onSelect={(date) => handleInputChange('warrantyExpiry', date)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    value={formData.assignedTo}
                    onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                    placeholder="Enter employee name or email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept.toLowerCase()}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Upload asset images</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button asChild variant="outline">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    Choose Files
                  </label>
                </Button>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Asset image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between pt-6 border-t">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <div className="space-x-2">
          {currentTab !== 'general' && (
            <Button
              variant="outline"
              onClick={() => {
                const tabs = ['general', 'financial', 'assignment', 'images'];
                const currentIndex = tabs.indexOf(currentTab);
                setCurrentTab(tabs[currentIndex - 1]);
              }}
              disabled={isSubmitting}
            >
              Previous
            </Button>
          )}
          {currentTab !== 'images' ? (
            <Button
              onClick={() => {
                const tabs = ['general', 'financial', 'assignment', 'images'];
                const currentIndex = tabs.indexOf(currentTab);
                setCurrentTab(tabs[currentIndex + 1]);
              }}
              disabled={isSubmitting}
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Asset...
                </>
              ) : (
                'Create Asset'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAssetForm;
