
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AssignmentStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const AssignmentStep = ({ formData, updateFormData }: AssignmentStepProps) => {
  const [assignmentDate, setAssignmentDate] = useState<Date>();
  const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
  
  // Mock employee data for auto-suggestions
  const employees = [
    'John Doe (john.doe@company.com)',
    'Sarah Smith (sarah.smith@company.com)',
    'Mike Johnson (mike.johnson@company.com)',
    'Emily Brown (emily.brown@company.com)',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Assignment Details
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Assign this device to a user and set assignment details
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="assignedTo">Assigned To</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="assignedTo"
              value={formData.assignedTo}
              onChange={(e) => updateFormData('assignedTo', e.target.value)}
              placeholder="Search employee name or email"
              className="pl-10"
              list="employees"
            />
            <datalist id="employees">
              {employees.map((employee, index) => (
                <option key={index} value={employee} />
              ))}
            </datalist>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Start typing to see suggestions or leave empty if unassigned
          </p>
        </div>

        <div className="space-y-2">
          <Label>Assignment Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !assignmentDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {assignmentDate ? format(assignmentDate, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={assignmentDate}
                onSelect={(date) => {
                  setAssignmentDate(date);
                  updateFormData('assignmentDate', date);
                }}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select 
            value={formData.department} 
            onValueChange={(value) => updateFormData('department', value)}
          >
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

      {formData.assignedTo && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-500" />
            <h4 className="font-medium text-blue-900 dark:text-blue-200">Assignment Preview</h4>
          </div>
          <div className="mt-2 text-sm text-blue-800 dark:text-blue-300">
            <p><span className="font-medium">User:</span> {formData.assignedTo}</p>
            <p><span className="font-medium">Department:</span> {formData.department || 'Not specified'}</p>
            <p><span className="font-medium">Date:</span> {assignmentDate ? format(assignmentDate, "PPP") : 'Not set'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentStep;
