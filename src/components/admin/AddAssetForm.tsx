
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
    location: '',
    status: 'Available',
    purchaseDate: undefined as Date | undefined,
    value: '',
    supplier: '',
    warrantyExpiry: undefined as Date | undefined,
    description: '',
    assignee: '-',
    condition: 'Excellent',
    department: ''
  });

  const [currentTab, setCurrentTab] = useState('general');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const deviceTypes = ['Laptop', 'Desktop', 'Monitor', 'Tablet', 'Phone', 'Printer', 'Router', 'Switch', 'Other'];
  const locations = ['Warehouse A', 'Warehouse B', 'Office Floor 1', 'Office Floor 2', 'IT Department', 'Storage Room'];
  const statuses = ['Available', 'Assigned', 'In Repair', 'Retired'];
  const conditions = ['Excellent', 'Good', 'Fair', 'Poor'];
  const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
    if (!formData.value.trim()) newErrors.value = 'Purchase price is required';

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
        name: formData.name,
        category: formData.category,
        brand: formData.brand || '',
        model: formData.model || '',
        serialNumber: formData.serialNumber,
        location: formData.location,
        status: formData.status as 'Available' | 'Assigned' | 'In Repair' | 'Retired',
        condition: formData.condition as 'Excellent' | 'Good' | 'Fair' | 'Poor',
        purchaseDate: formData.purchaseDate ? format(formData.purchaseDate, 'yyyy-MM-dd') : '',
        value: parseFloat(formData.value) || 0,
        warrantyExpiry: formData.warrantyExpiry ? format(formData.warrantyExpiry, 'yyyy-MM-dd') : '',
        description: formData.description || '',
        assignee: formData.assignee || '-',
        department: formData.department || ''
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
        <TabsList className="grid w-full grid-cols-3 bg-slate-100">
          <TabsTrigger value="general" className="data-[state=active]:bg-white">General Info</TabsTrigger>
          <TabsTrigger value="financial" className="data-[state=active]:bg-white">Financial</TabsTrigger>
          <TabsTrigger value="assignment" className="data-[state=active]:bg-white">Assignment</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700">Asset Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter asset name"
                    className={cn("border-slate-200 focus:border-blue-500", errors.name && 'border-red-500')}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-slate-700">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className={cn("border-slate-200 focus:border-blue-500", errors.category && 'border-red-500')}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {deviceTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-slate-700">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="e.g., Apple, Dell, HP"
                    className="border-slate-200 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model" className="text-slate-700">Model</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="e.g., MacBook Pro 16-inch"
                    className="border-slate-200 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serialNumber" className="text-slate-700">Serial Number *</Label>
                  <Input
                    id="serialNumber"
                    value={formData.serialNumber}
                    onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                    placeholder="Enter serial number"
                    className={cn("border-slate-200 focus:border-blue-500", errors.serialNumber && 'border-red-500')}
                  />
                  {errors.serialNumber && <p className="text-sm text-red-500">{errors.serialNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-slate-700">Location *</Label>
                  <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                    <SelectTrigger className={cn("border-slate-200 focus:border-blue-500", errors.location && 'border-red-500')}>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-slate-700">Status *</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger className={cn("border-slate-200 focus:border-blue-500", errors.status && 'border-red-500')}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition" className="text-slate-700">Condition *</Label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                    <SelectTrigger className={cn("border-slate-200 focus:border-blue-500", errors.condition && 'border-red-500')}>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.condition && <p className="text-sm text-red-500">{errors.condition}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter asset description"
                  rows={3}
                  className="border-slate-200 focus:border-blue-500"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">Financial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-700">Purchase Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-slate-200",
                          !formData.purchaseDate && "text-slate-500",
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
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.purchaseDate && <p className="text-sm text-red-500">{errors.purchaseDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value" className="text-slate-700">Purchase Price *</Label>
                  <Input
                    id="value"
                    value={formData.value}
                    onChange={(e) => handleInputChange('value', e.target.value)}
                    placeholder="e.g., 2499.00"
                    type="number"
                    className={cn("border-slate-200 focus:border-blue-500", errors.value && 'border-red-500')}
                  />
                  {errors.value && <p className="text-sm text-red-500">{errors.value}</p>}
                </div>

                <div className="space-y-2 col-span-2">
                  <Label className="text-slate-700">Warranty Expiry Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-slate-200",
                          !formData.warrantyExpiry && "text-slate-500"
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
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignment" className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">Assignment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assignee" className="text-slate-700">Assigned To</Label>
                  <Input
                    id="assignee"
                    value={formData.assignee}
                    onChange={(e) => handleInputChange('assignee', e.target.value)}
                    placeholder="Enter employee name or email"
                    className="border-slate-200 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-slate-700">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                    <SelectTrigger className="border-slate-200 focus:border-blue-500">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
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
      </Tabs>

      <div className="flex justify-between pt-6 border-t border-slate-200">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="border-slate-200">
          Cancel
        </Button>
        <div className="space-x-2">
          {currentTab !== 'general' && (
            <Button
              variant="outline"
              onClick={() => {
                const tabs = ['general', 'financial', 'assignment'];
                const currentIndex = tabs.indexOf(currentTab);
                setCurrentTab(tabs[currentIndex - 1]);
              }}
              disabled={isSubmitting}
              className="border-slate-200"
            >
              Previous
            </Button>
          )}
          {currentTab !== 'assignment' ? (
            <Button
              onClick={() => {
                const tabs = ['general', 'financial', 'assignment'];
                const currentIndex = tabs.indexOf(currentTab);
                setCurrentTab(tabs[currentIndex + 1]);
              }}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
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
