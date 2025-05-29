
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Grid, List, ChevronDown, Tag, Edit, Trash2, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AssetCard from '@/components/AssetCard';
import FilterPanel from '@/components/FilterPanel';
import { useAdminData } from '@/contexts/AdminDataContext';

const AssetList = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { assets, loading, deleteAsset, updateAsset } = useAdminData();

  // Filter and sort assets
  const filteredAssets = useMemo(() => {
    let filtered = assets.filter(asset =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.serial_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assignee.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort assets
    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a];
      let bValue = b[sortBy as keyof typeof b];
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [assets, searchQuery, sortBy, sortOrder]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'maintenance': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'retired': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'damaged': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'assigned': return 'Assigned';
      case 'active': return 'Available';
      case 'maintenance': return 'In Repair';
      case 'retired': return 'Retired';
      case 'damaged': return 'Damaged';
      default: return status;
    }
  };

  const handleEdit = (asset: any) => {
    console.log('Edit asset:', asset);
    // TODO: Open edit modal
  };

  const handleDelete = async (assetId: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      await deleteAsset(assetId);
    }
  };

  const handleView = (asset: any) => {
    console.log('View asset:', asset);
    // TODO: Open view modal
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading assets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Asset Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredAssets.length} assets found
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Tabs value={view} onValueChange={(value) => setView(value as 'grid' | 'list')}>
              <TabsList>
                <TabsTrigger value="grid" className="flex items-center space-x-2">
                  <Grid className="h-4 w-4" />
                  <span>Grid</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center space-x-2">
                  <List className="h-4 w-4" />
                  <span>List</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search assets by name, type, or assigned user..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="category">Type</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="last_updated">Date Updated</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </motion.div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && <FilterPanel />}
        </AnimatePresence>

        {/* Asset Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="glass-effect hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{asset.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{asset.serial_number}</p>
                        </div>
                        <Badge className={getStatusColor(asset.status)}>
                          {getStatusLabel(asset.status)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Brand:</span>
                          <span>{asset.brand}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Model:</span>
                          <span>{asset.model}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Assigned to:</span>
                          <span>{asset.assignee || 'Unassigned'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Location:</span>
                          <span>{asset.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleView(asset)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(asset)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(asset.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="glass-effect">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset, index) => (
                    <motion.tr
                      key={asset.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {asset.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {asset.serial_number}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{asset.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(asset.status)}>
                          {getStatusLabel(asset.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{asset.assignee || 'Unassigned'}</TableCell>
                      <TableCell>{asset.location}</TableCell>
                      <TableCell>${asset.value?.toLocaleString() || 0}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleView(asset)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(asset)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(asset.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </motion.div>

        {filteredAssets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No assets found</p>
            <p className="text-gray-400 dark:text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetList;
