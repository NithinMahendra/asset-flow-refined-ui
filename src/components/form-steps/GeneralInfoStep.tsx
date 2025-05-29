
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GeneralInfoStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const GeneralInfoStep = ({ formData, updateFormData }: GeneralInfoStepProps) => {
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

  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'In Maintenance' },
    { value: 'retired', label: 'Retired' },
    { value: 'missing', label: 'Missing' },
    { value: 'damaged', label: 'Damaged' }
  ];

  const locations = ['Office A', 'Office B', 'Storage', 'Remote', 'Warehouse'];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
          General Information
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Enter the basic details about the device
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="deviceName" className="text-sm font-medium">Device Name *</Label>
          <Input
            id="deviceName"
            value={formData.deviceName || ''}
            onChange={(e) => updateFormData('deviceName', e.target.value)}
            placeholder="Enter device name"
            className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deviceType" className="text-sm font-medium">Device Type *</Label>
          <Select 
            value={formData.deviceType || ''} 
            onValueChange={(value) => {
              console.log('GeneralInfoStep: Setting deviceType to:', value);
              updateFormData('deviceType', value);
            }}
          >
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

        <div className="space-y-2">
          <Label htmlFor="brand" className="text-sm font-medium">Brand</Label>
          <Input
            id="brand"
            value={formData.brand || ''}
            onChange={(e) => updateFormData('brand', e.target.value)}
            placeholder="e.g., Apple, Dell, HP"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model" className="text-sm font-medium">Model</Label>
          <Input
            id="model"
            value={formData.model || ''}
            onChange={(e) => updateFormData('model', e.target.value)}
            placeholder="e.g., MacBook Pro 16-inch"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="serialNumber" className="text-sm font-medium">Serial Number *</Label>
          <Input
            id="serialNumber"
            value={formData.serialNumber || ''}
            onChange={(e) => updateFormData('serialNumber', e.target.value)}
            placeholder="Enter serial number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assetTag" className="text-sm font-medium">Asset Tag</Label>
          <Input
            id="assetTag"
            value={formData.assetTag || ''}
            onChange={(e) => updateFormData('assetTag', e.target.value)}
            placeholder="Auto-generated if empty"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium">Location</Label>
          <Select 
            value={formData.location || ''} 
            onValueChange={(value) => updateFormData('location', value)}
          >
            <SelectTrigger>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium">Status</Label>
          <Select 
            value={formData.status || 'active'} 
            onValueChange={(value) => {
              console.log('GeneralInfoStep: Setting status to:', value);
              updateFormData('status', value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoStep;
