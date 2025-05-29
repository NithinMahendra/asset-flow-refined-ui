
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Upload,
  Package,
  QrCode,
  MoreHorizontal
} from 'lucide-react';
import AddAssetForm from '@/components/admin/AddAssetForm';
import AssetDetailsModal from '@/components/admin/AssetDetailsModal';
import BulkOperationsPanel from '@/components/admin/BulkOperationsPanel';

interface Asset {
  id: string;
  name: string;
  category: string;
  status: string;
  assignee: string;
  value: string;
  location: string;
  lastUpdated: string;
  qrCode: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry: string;
}

const AssetManagementContent = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkPanel, setShowBulkPanel] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  
  const [assets, setAssets] = useState<Asset[]>([
    { 
      id: 'AST-001', 
      name: 'MacBook Pro M3', 
      category: 'Laptop', 
      status: 'Available', 
      assignee: '-', 
      value: '$2,499', 
      location: 'Warehouse A', 
      lastUpdated: '2024-01-15',
      qrCode: 'QR001-AST001-2024',
      serialNumber: 'MP-2024-001',
      purchaseDate: '2024-01-10',
      warrantyExpiry: '2027-01-10'
    },
    { 
      id: 'AST-002', 
      name: 'iPhone 15 Pro', 
      category: 'Mobile', 
      status: 'Assigned', 
      assignee: 'John Doe', 
      value: '$999', 
      location: 'Office Floor 2', 
      lastUpdated: '2024-01-14',
      qrCode: 'QR002-AST002-2024',
      serialNumber: 'IP-2024-002',
      purchaseDate: '2024-01-08',
      warrantyExpiry: '2026-01-08'
    },
    { 
      id: 'AST-003', 
      name: 'Dell Monitor 27"', 
      category: 'Monitor', 
      status: 'In Repair', 
      assignee: '-', 
      value: '$329', 
      location: 'IT Department', 
      lastUpdated: '2024-01-13',
      qrCode: 'QR003-AST003-2024',
      serialNumber: 'DM-2024-003',
      purchaseDate: '2024-01-05',
      warrantyExpiry: '2026-01-05'
    },
  ]);

  const categories = [
    { name: 'Laptops', count: 45, value: '$112,455', color: 'bg-blue-100 text-blue-800' },
    { name: 'Mobile Devices', count: 32, value: '$31,968', color: 'bg-green-100 text-green-800' },
    { name: 'Monitors', count: 28, value: '$9,212', color: 'bg-purple-100 text-purple-800' },
    { name: 'Accessories', count: 156, value: '$12,324', color: 'bg-gray-100 text-gray-800' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Assigned':
        return 'bg-blue-100 text-blue-800';
      case 'In Repair':
        return 'bg-red-100 text-red-800';
      case 'Retired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSelectAsset = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleAssetCreated = (newAsset: any) => {
    // Generate unique asset ID and QR code
    const assetId = `AST-${String(assets.length + 1).padStart(3, '0')}`;
    const qrCode = `QR${Date.now()}-${assetId}-${new Date().getFullYear()}`;
    
    const asset: Asset = {
      id: assetId,
      name: newAsset.name,
      category: newAsset.category,
      status: newAsset.status,
      assignee: newAsset.assignedTo || '-',
      value: `$${newAsset.purchasePrice}`,
      location: newAsset.location,
      lastUpdated: new Date().toISOString().split('T')[0],
      qrCode: qrCode,
      serialNumber: newAsset.serialNumber,
      purchaseDate: newAsset.purchaseDate,
      warrantyExpiry: newAsset.warrantyExpiry
    };

    setAssets(prev => [...prev, asset]);
    setShowAddForm(false);
    
    toast({
      title: "Asset Created Successfully",
      description: `${newAsset.name} has been added with ID ${assetId}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filter
          </Button>
          {selectedAssets.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowBulkPanel(true)}
            >
              Bulk Actions ({selectedAssets.length})
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Asset</DialogTitle>
              </DialogHeader>
              <AddAssetForm 
                onClose={() => setShowAddForm(false)} 
                onAssetCreated={handleAssetCreated}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="assets" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assets">All Assets</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="lifecycle">Lifecycle</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAssets(assets.map(a => a.id));
                          } else {
                            setSelectedAssets([]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead className="font-semibold">Asset ID</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Assignee</TableHead>
                    <TableHead className="font-semibold">Value</TableHead>
                    <TableHead className="font-semibold">Location</TableHead>
                    <TableHead className="font-semibold">QR Code</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assets.map((asset) => (
                    <TableRow key={asset.id} className="hover:bg-gray-50">
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedAssets.includes(asset.id)}
                          onChange={() => handleSelectAsset(asset.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{asset.id}</TableCell>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{asset.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(asset.status)}>
                          {asset.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{asset.assignee}</TableCell>
                      <TableCell className="font-medium">{asset.value}</TableCell>
                      <TableCell className="text-gray-600">{asset.location}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <QrCode className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedAsset(asset)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Package className="h-8 w-8 text-gray-400" />
                    <Badge className={category.color}>{category.name}</Badge>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-gray-900 mb-1">{category.count}</p>
                    <p className="text-sm text-gray-600">Total value: {category.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Asset Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">85.2%</p>
                  <p className="text-sm text-gray-600">Currently in use</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Maintenance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">3.1%</p>
                  <p className="text-sm text-gray-600">Assets under repair</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Average Age</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">2.4</p>
                  <p className="text-sm text-gray-600">Years</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="lifecycle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Lifecycle Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-red-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-red-800 mb-2">Warranty Expiring Soon</h4>
                      <p className="text-2xl font-bold text-red-600">12</p>
                      <p className="text-sm text-gray-600">Assets expiring in 30 days</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-blue-800 mb-2">Overdue Maintenance</h4>
                      <p className="text-2xl font-bold text-blue-600">5</p>
                      <p className="text-sm text-gray-600">Assets requiring attention</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-gray-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Depreciation Alert</h4>
                      <p className="text-2xl font-bold text-gray-600">8</p>
                      <p className="text-sm text-gray-600">High depreciation assets</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Asset Details Modal */}
      {selectedAsset && (
        <AssetDetailsModal 
          asset={selectedAsset} 
          onClose={() => setSelectedAsset(null)} 
        />
      )}

      {/* Bulk Operations Panel */}
      {showBulkPanel && (
        <BulkOperationsPanel 
          selectedAssets={selectedAssets}
          onClose={() => setShowBulkPanel(false)}
          onComplete={() => {
            setSelectedAssets([]);
            setShowBulkPanel(false);
          }}
        />
      )}
    </div>
  );
};

export default AssetManagementContent;
