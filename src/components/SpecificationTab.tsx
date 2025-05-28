
import { Badge } from '@/components/ui/badge';
import { Cpu, HardDrive, Monitor, Zap } from 'lucide-react';

interface SpecificationTabProps {
  specifications: {
    processor: string;
    memory: string;
    storage: string;
    graphics: string;
    display: string;
    os: string;
  };
}

const SpecificationTab = ({ specifications }: SpecificationTabProps) => {
  const specs = [
    { 
      icon: Cpu, 
      label: 'Processor', 
      value: specifications.processor,
      color: 'text-blue-500'
    },
    { 
      icon: Zap, 
      label: 'Memory', 
      value: specifications.memory,
      color: 'text-green-500'
    },
    { 
      icon: HardDrive, 
      label: 'Storage', 
      value: specifications.storage,
      color: 'text-purple-500'
    },
    { 
      icon: Monitor, 
      label: 'Graphics', 
      value: specifications.graphics,
      color: 'text-orange-500'
    },
    { 
      icon: Monitor, 
      label: 'Display', 
      value: specifications.display,
      color: 'text-pink-500'
    },
    { 
      icon: Cpu, 
      label: 'Operating System', 
      value: specifications.os,
      color: 'text-indigo-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Technical Specifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {specs.map((spec, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div className={`p-2 rounded-lg bg-white dark:bg-gray-700 ${spec.color}`}>
                <spec.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">{spec.label}</p>
                <p className="font-medium text-gray-900 dark:text-white">{spec.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Additional Information</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-2xl font-bold text-blue-500">16"</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Screen Size</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-2xl font-bold text-green-500">4.8</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Weight (lbs)</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-2xl font-bold text-purple-500">2023</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Model Year</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-2xl font-bold text-orange-500">18h</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Battery Life</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecificationTab;
