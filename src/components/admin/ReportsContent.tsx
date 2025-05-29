
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar } from 'lucide-react';

const ReportsContent = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Reports & Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-6 border rounded-lg">
              <h3 className="font-medium mb-2">Asset Utilization Report</h3>
              <p className="text-sm text-gray-600 mb-4">Monthly asset usage statistics</p>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h3 className="font-medium mb-2">Financial Summary</h3>
              <p className="text-sm text-gray-600 mb-4">Cost analysis and depreciation</p>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
            
            <div className="p-6 border rounded-lg">
              <h3 className="font-medium mb-2">Maintenance Report</h3>
              <p className="text-sm text-gray-600 mb-4">Service history and schedules</p>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsContent;
