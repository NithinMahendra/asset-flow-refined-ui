
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Filter, Download, Edit, Trash2, Eye, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAdminData } from '@/contexts/AdminDataContext';
import SimpleAddAssetForm from '@/components/SimpleAddAssetForm';
import AssetDetailsModal from './AssetDetailsModal';
import { motion } from 'framer-motion';

const AssetManagementContent = () => {
  const { assets, loading, addAsset, deleteAsset } = useAdminData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter assets based on search and filters
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || asset.category.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAssetCreated = async (assetData: any) => {
    console.log('🎯 AssetManagementContent: Handling asset creation...');
    try {
      await addAsset(assetData);
      setShowAddForm(false);
      console.log('✅ AssetManagementContent: Asset creation handled successfully');
    } catch (error) {
      console.error('❌ AssetManagementContent: Error handling asset creation:', error);
      throw error;
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      await deleteAsset(assetId);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'maintenance': return 'destructive';
      case 'retired': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'active': return 'from-emerald-500 to-green-600';
      case 'inactive': return 'from-slate-400 to-slate-500';
      case 'maintenance': return 'from-amber-500 to-orange-600';
      case 'retired': return 'from-red-500 to-rose-600';
      default: return 'from-slate-400 to-slate-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400">Loading assets...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-responsive-xl font-bold text-gradient-primary mb-2">Asset Management</h1>
          <p className="text-slate-600 dark:text-slate-400 text-responsive-base">Manage your organization's assets</p>
        </div>
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button className="btn-gradient-primary shadow-lg hover:shadow-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass-effect border-0">
            <DialogHeader>
              <DialogTitle className="text-gradient-primary">Add New Asset</DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                Fill in the details below to add a new asset to your inventory.
              </DialogDescription>
            </DialogHeader>
            <SimpleAddAssetForm 
              onClose={() => setShowAddForm(false)}
              onAssetCreated={handleAssetCreated}
            />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="card-enhanced card-gradient border-0">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input
                    placeholder="Search assets by name, serial number, or assignee..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 glass-effect border-0 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48 h-12 glass-effect border-0">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="glass-effect border-0 shadow-xl">
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48 h-12 glass-effect border-0">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent className="glass-effect border-0 shadow-xl">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="laptop">Laptops</SelectItem>
                    <SelectItem value="desktop">Desktops</SelectItem>
                    <SelectItem value="monitor">Monitors</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Assets Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="card-enhanced card-gradient border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardTitle className="text-gradient-primary flex items-center justify-between">
              <span>Assets ({filteredAssets.length})</span>
              <Button variant="outline" size="sm" className="glass-effect border-0 hover:scale-105 transition-all duration-300">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                    <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Asset</th>
                    <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Serial Number</th>
                    <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                    <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Assignee</th>
                    <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Location</th>
                    <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Value</th>
                    <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset, index) => (
                    <motion.tr 
                      key={asset.id} 
                      className="border-b border-slate-200/30 dark:border-slate-700/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg">
                            {asset.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">{asset.name}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">{asset.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-sm font-mono">
                          {asset.serial_number}
                        </code>
                      </td>
                      <td className="p-4">
                        <Badge className={`bg-gradient-to-r ${getStatusGradient(asset.status)} text-white border-0 shadow-lg flex items-center gap-1 w-fit`}>
                          {getStatusIcon(asset.status)}
                          {asset.status}
                        </Badge>
                      </td>
                      <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{asset.assignee}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{asset.location || '-'}</td>
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">
                        ${asset.value?.toLocaleString() || '0'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAsset(asset);
                              setShowDetails(true);
                            }}
                            className="hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:scale-110 transition-all duration-300"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAsset(asset.id)}
                            className="hover:bg-red-100 dark:hover:bg-red-900/20 hover:scale-110 transition-all duration-300"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {filteredAssets.length === 0 && (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Package className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="text-slate-500 dark:text-slate-400 text-lg">No assets found matching your criteria</p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">Try adjusting your search or filters</p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Asset Details Modal */}
      {selectedAsset && (
        <AssetDetailsModal
          asset={selectedAsset}
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false);
            setSelectedAsset(null);
          }}
        />
      )}
    </div>
  );
};

export default AssetManagementContent;
