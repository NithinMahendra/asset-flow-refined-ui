
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface GeneralInfoStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const GeneralInfoStep = ({ formData, updateFormData }: GeneralInfoStepProps) => {
  const deviceTypes = ['Laptop', 'Desktop', 'Monitor', 'Tablet', 'Phone', 'Printer', 'Other'];
  const statuses = ['Available', 'In Use', 'In Repair', 'Faulty', 'Retired'];
  const locations = ['Office A', 'Office B', 'Storage', 'Remote', 'Warehouse'];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          General Information
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Enter the basic details about the device
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="deviceName">Device Name *</Label>
          <Input
            id="deviceName"
            value={formData.deviceName}
            onChange={(e) => updateFormData('deviceName', e.target.value)}
            placeholder="Enter device name"
            className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deviceType">Device Type *</Label>
          <Select value={formData.deviceType} onValueChange={(value) => updateFormData('deviceType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select device type" />
            </SelectTrigger>
            <SelectContent>
              {deviceTypes.map((type) => (
                <SelectItem key={type} value={type.toLowerCase()}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => updateFormData('brand', e.target.value)}
            placeholder="e.g., Apple, Dell, HP"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => updateFormData('model', e.target.value)}
            placeholder="e.g., MacBook Pro 16-inch"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="serialNumber">Serial Number *</Label>
          <Input
            id="serialNumber"
            value={formData.serialNumber}
            onChange={(e) => updateFormData('serialNumber', e.target.value)}
            placeholder="Enter serial number"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assetTag">Asset Tag</Label>
          <Input
            id="assetTag"
            value={formData.assetTag}
            onChange={(e) => updateFormData('assetTag', e.target.value)}
            placeholder="Auto-generated if empty"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select value={formData.location} onValueChange={(value) => updateFormData('location', value)}>
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
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
            <SelectTrigger>
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
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoStep;
