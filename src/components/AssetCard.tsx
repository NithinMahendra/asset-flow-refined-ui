
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

interface Asset {
  id: number;
  name: string;
  type: string;
  status: string;
  assignedTo: string | null;
  location: string;
  warrantyStatus: string;
  tags: string[];
  image: string;
  serialNumber: string;
  purchaseDate: string;
}

interface AssetCardProps {
  asset: Asset;
}

const AssetCard = ({ asset }: AssetCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Use': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Available': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'In Repair': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
      case 'Faulty': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="glass-effect overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
        <div className="relative">
          <img
            src={asset.image}
            alt={asset.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <Badge className={getStatusColor(asset.status)}>
              {asset.status}
            </Badge>
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              <Button size="sm" variant="secondary" className="backdrop-blur-sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" className="backdrop-blur-sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="secondary" className="backdrop-blur-sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {asset.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {asset.serialNumber}
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {asset.type}
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Assigned to:</span>
              <span className="text-gray-900 dark:text-white">
                {asset.assignedTo || 'Unassigned'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Location:</span>
              <span className="text-gray-900 dark:text-white">{asset.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Warranty:</span>
              <Badge 
                variant={asset.warrantyStatus === 'Active' ? 'default' : 'destructive'}
                className="text-xs"
              >
                {asset.warrantyStatus}
              </Badge>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-3">
            {asset.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {asset.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{asset.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AssetCard;
