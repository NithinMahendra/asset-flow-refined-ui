
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface WarrantyStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const WarrantyStep = ({ formData, updateFormData }: WarrantyStepProps) => {
  const [purchaseDate, setPurchaseDate] = useState<Date>();
  const [warrantyExpiry, setWarrantyExpiry] = useState<Date>();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Warranty & Support
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Enter purchase and warranty information for tracking
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Purchase Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !purchaseDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {purchaseDate ? format(purchaseDate, "PPP") : "Select purchase date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={purchaseDate}
                onSelect={(date) => {
                  setPurchaseDate(date);
                  updateFormData('purchaseDate', date);
                }}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Warranty Expiry</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !warrantyExpiry && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {warrantyExpiry ? format(warrantyExpiry, "PPP") : "Select warranty expiry"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={warrantyExpiry}
                onSelect={(date) => {
                  setWarrantyExpiry(date);
                  updateFormData('warrantyExpiry', date);
                }}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vendor">Vendor/Supplier</Label>
          <Input
            id="vendor"
            value={formData.vendor}
            onChange={(e) => updateFormData('vendor', e.target.value)}
            placeholder="e.g., Apple Store, Amazon Business"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchasePrice">Purchase Price</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="purchasePrice"
              type="number"
              step="0.01"
              value={formData.purchasePrice}
              onChange={(e) => updateFormData('purchasePrice', e.target.value)}
              placeholder="0.00"
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {(purchaseDate || warrantyExpiry) && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h4 className="font-medium text-green-900 dark:text-green-200 mb-2">
            Warranty Information
          </h4>
          <div className="text-sm text-green-800 dark:text-green-300 space-y-1">
            {purchaseDate && (
              <p><span className="font-medium">Purchased:</span> {format(purchaseDate, "PPP")}</p>
            )}
            {warrantyExpiry && (
              <p><span className="font-medium">Warranty expires:</span> {format(warrantyExpiry, "PPP")}</p>
            )}
            {purchaseDate && warrantyExpiry && (
              <p className="text-xs mt-2">
                Warranty period: {Math.ceil((warrantyExpiry.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365))} year(s)
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WarrantyStep;
