
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const FilterPanel = () => {
  const deviceTypes = ['Laptop', 'Mobile', 'Monitor', 'Tablet', 'Desktop', 'Printer'];
  const statuses = ['In Use', 'Available', 'In Repair', 'Faulty'];
  const locations = ['Office A', 'Office B', 'Storage', 'Remote', 'Warehouse'];
  const warrantyStatuses = ['Active', 'Expired', 'Expiring Soon'];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <Card className="glass-effect">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            <Button variant="ghost" size="sm">
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Device Type Filter */}
            <div>
              <h4 className="font-medium mb-3 text-gray-900 dark:text-white">Device Type</h4>
              <div className="space-y-2">
                {deviceTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox id={type} />
                    <label htmlFor={type} className="text-sm text-gray-700 dark:text-gray-300">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <h4 className="font-medium mb-3 text-gray-900 dark:text-white">Status</h4>
              <div className="space-y-2">
                {statuses.map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox id={status} />
                    <label htmlFor={status} className="text-sm text-gray-700 dark:text-gray-300">
                      {status}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <h4 className="font-medium mb-3 text-gray-900 dark:text-white">Location</h4>
              <Select>
                <SelectTrigger>
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
            </div>

            {/* Warranty Status Filter */}
            <div>
              <h4 className="font-medium mb-3 text-gray-900 dark:text-white">Warranty Status</h4>
              <div className="space-y-2">
                {warrantyStatuses.map((warranty) => (
                  <div key={warranty} className="flex items-center space-x-2">
                    <Checkbox id={warranty} />
                    <label htmlFor={warranty} className="text-sm text-gray-700 dark:text-gray-300">
                      {warranty}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-medium mb-3 text-gray-900 dark:text-white">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <span>Laptop</span>
                <X className="h-3 w-3 cursor-pointer" />
              </Badge>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <span>In Use</span>
                <X className="h-3 w-3 cursor-pointer" />
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FilterPanel;
