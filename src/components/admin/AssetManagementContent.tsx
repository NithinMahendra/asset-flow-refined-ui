
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
import { useAdminData } from '@/contexts/AdminDataContext';

const AssetManagementContent = () => {
  const { toast } = useToast();
  const {
    assets,
    getAssetStats,
    getCategoryStats,
    getUtilizationRate,
    getMaintenanceRate,
    getAverageAssetAge,
    getUpcomingWarrantyExpiries,
    getOverdueMaintenanceAssets,
    addAsset
  } = useAdminData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkPanel, setShowBulkPanel] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  const assetStats = getAssetStats();
  const categoryStats = getCategoryStats();
  const utilizationRate = getUtilizationRate();
  const maintenanceRate = getMaintenanceRate();
  const averageAge = getAverageAssetAge();
  const upcomingWarranties = getUpcomingWarrantyExpiries();
  const overdueAssets = getOverdueMaintenanceAssets();

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

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-gray-100 text-gray-800',
    ];
    return colors[index % colors.length];
  };

  const handleSelectAsset = (assetId: string) => {
    setSelectedAssets(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleAssetCreated = (newAsset: any) => {
    addAsset(newAsset);
    setShowAddForm(false);
    
    toast({
      title: "Asset Created Successfully",
      description: `${newAsset.name} has been added to inventory`,
    });
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate depreciation alerts (assets older than 3 years with high value)
  const depreciationAlerts = assets.filter(asset => {
    const purchaseDate = new Date(asset.purchaseDate);
    const ageInYears = (new Date().getTime() - purchaseDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    return ageInYears > 3 && asset.value > 1000;
  });

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
                            setSelectedAssets(filteredAssets.map(a => a.id));
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
                  {filteredAssets.map((asset) => (
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
                      <TableCell className="font-medium">${asset.value.toLocaleString()}</TableCell>
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
            {categoryStats.map((category, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Package className="h-8 w-8 text-gray-400" />
                    <Badge className={getCategoryColor(index)}>{category.name}</Badge>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-gray-900 mb-1">{category.count}</p>
                    <p className="text-sm text-gray-600">Total value: ${category.value.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {categoryStats.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No assets found</p>
                </CardContent>
              </Card>
            )}
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
                  <p className="text-3xl font-bold text-gray-900">{utilizationRate.toFixed(1)}%</p>
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
                  <p className="text-3xl font-bold text-gray-900">{maintenanceRate.toFixed(1)}%</p>
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
                  <p className="text-3xl font-bold text-gray-900">{averageAge.toFixed(1)}</p>
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
                      <p className="text-2xl font-bold text-red-600">{upcomingWarranties.length}</p>
                      <p className="text-sm text-gray-600">Assets expiring in 30 days</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-blue-800 mb-2">Overdue Maintenance</h4>
                      <p className="text-2xl font-bold text-blue-600">{overdueAssets.length}</p>
                      <p className="text-sm text-gray-600">Assets requiring attention</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-gray-200">
                    <CardContent className="p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Depreciation Alert</h4>
                      <p className="text-2xl font-bold text-gray-600">{depreciationAlerts.length}</p>
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
