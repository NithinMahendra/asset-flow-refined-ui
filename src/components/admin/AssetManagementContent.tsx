
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
  MoreHorizontal,
  Printer
} from 'lucide-react';
import AddAssetForm from '@/components/admin/AddAssetForm';
import { useAdminData } from '@/contexts/AdminDataContext';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
    addAsset,
    updateAsset,
    deleteAsset
  } = useAdminData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);

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
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Assigned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Repair':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Retired':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-emerald-100 text-emerald-800 border-emerald-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-amber-100 text-amber-800 border-amber-200',
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

  const handleEditAsset = (asset: any) => {
    setEditingAsset(asset);
  };

  const handleDeleteAsset = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      deleteAsset(assetId);
      toast({
        title: "Asset Deleted",
        description: `${asset.name} has been removed from inventory`,
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = () => {
    selectedAssets.forEach(id => deleteAsset(id));
    setSelectedAssets([]);
    toast({
      title: "Assets Deleted",
      description: `${selectedAssets.length} assets have been removed`,
      variant: "destructive",
    });
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Name,Category,Status,Assignee,Value,Location\n"
      + assets.map(a => `${a.id},${a.name},${a.category},${a.status},${a.assignee},${a.value},${a.location}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "assets.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: "Asset data has been exported to CSV",
    });
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pieData = [
    { name: 'Available', value: assetStats.available, color: '#10b981' },
    { name: 'Assigned', value: assetStats.assigned, color: '#3b82f6' },
    { name: 'In Repair', value: assetStats.inRepair, color: '#f59e0b' },
    { name: 'Retired', value: assetStats.retired, color: '#6b7280' },
  ];

  return (
    <div className="space-y-6 bg-slate-50/50 p-6 min-h-screen">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline" size="sm" className="border-slate-200 text-slate-700 hover:bg-slate-50">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filter
          </Button>
          {selectedAssets.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleBulkDelete}
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete ({selectedAssets.length})
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="border-slate-200 text-slate-700 hover:bg-slate-50">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
            className="border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
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

      <Tabs defaultValue="assets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100">
          <TabsTrigger value="assets" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">All Assets</TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">Categories</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">Analytics</TabsTrigger>
          <TabsTrigger value="lifecycle" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">Lifecycle</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 border-slate-200">
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
                        className="rounded border-slate-300"
                      />
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700">Asset ID</TableHead>
                    <TableHead className="font-semibold text-slate-700">Name</TableHead>
                    <TableHead className="font-semibold text-slate-700">Category</TableHead>
                    <TableHead className="font-semibold text-slate-700">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700">Assignee</TableHead>
                    <TableHead className="font-semibold text-slate-700">Value</TableHead>
                    <TableHead className="font-semibold text-slate-700">Location</TableHead>
                    <TableHead className="font-semibold text-slate-700">QR Code</TableHead>
                    <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset, index) => (
                    <motion.tr 
                      key={asset.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="hover:bg-slate-50 border-slate-200"
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedAssets.includes(asset.id)}
                          onChange={() => handleSelectAsset(asset.id)}
                          className="rounded border-slate-300"
                        />
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">{asset.id}</TableCell>
                      <TableCell className="text-slate-900">{asset.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-slate-200 text-slate-700">{asset.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(asset.status)}>
                          {asset.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">{asset.assignee}</TableCell>
                      <TableCell className="font-medium text-slate-900">${asset.value.toLocaleString()}</TableCell>
                      <TableCell className="text-slate-600">{asset.location}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                          <QrCode className="h-4 w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-slate-600 hover:text-blue-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditAsset(asset)}
                            className="text-slate-600 hover:text-amber-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteAsset(asset.id)}
                            className="text-slate-600 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-slate-600 hover:text-slate-900"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryStats.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow border-slate-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Package className="h-8 w-8 text-slate-400" />
                      <Badge className={getCategoryColor(index)}>{category.name}</Badge>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-slate-900 mb-1">{category.count}</p>
                      <p className="text-sm text-slate-600">Total value: ${category.value.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Asset Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Category Values</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryStats}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base text-slate-900">Asset Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{utilizationRate.toFixed(1)}%</p>
                  <p className="text-sm text-slate-600">Currently in use</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base text-slate-900">Maintenance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-600">{maintenanceRate.toFixed(1)}%</p>
                  <p className="text-sm text-slate-600">Assets under repair</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base text-slate-900">Average Age</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-600">{averageAge.toFixed(1)}</p>
                  <p className="text-sm text-slate-600">Years</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="lifecycle" className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Asset Lifecycle Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-red-800 mb-2">Warranty Expiring Soon</h4>
                    <p className="text-2xl font-bold text-red-600">{upcomingWarranties.length}</p>
                    <p className="text-sm text-red-700">Assets expiring in 30 days</p>
                  </CardContent>
                </Card>
                
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-amber-800 mb-2">Overdue Maintenance</h4>
                    <p className="text-2xl font-bold text-amber-600">{overdueAssets.length}</p>
                    <p className="text-sm text-amber-700">Assets requiring attention</p>
                  </CardContent>
                </Card>
                
                <Card className="border-slate-200 bg-slate-50">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-slate-800 mb-2">Total Value</h4>
                    <p className="text-2xl font-bold text-slate-600">${(assetStats.totalValue / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-slate-700">Current asset portfolio</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssetManagementContent;
