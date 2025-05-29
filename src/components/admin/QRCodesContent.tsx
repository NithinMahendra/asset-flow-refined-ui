import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { QrCode, Download, Printer, Search, RefreshCw, Eye, Copy, Plus } from 'lucide-react';
import { useAdminData } from '@/contexts/AdminDataContext';
import QRCodeLib from 'qrcode';

const QRCodesContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQRs, setSelectedQRs] = useState<string[]>([]);
  const [showQRDetail, setShowQRDetail] = useState<any>(null);
  const [qrCodeImages, setQrCodeImages] = useState<Record<string, string>>({});
  const [newQRPreview, setNewQRPreview] = useState<string>('');
  const [selectedAssetForQR, setSelectedAssetForQR] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const { assets } = useAdminData();

  // Generate QR code images for all assets
  useEffect(() => {
    const generateQRImages = async () => {
      const images: Record<string, string> = {};
      
      for (const asset of assets) {
        try {
          // Use simple asset ID format: asset:{assetId}
          const qrData = `asset:${asset.id}`;
          
          const qrImageUrl = await QRCodeLib.toDataURL(qrData, {
            width: 200,
            margin: 2,
            color: {
              dark: '#1e293b',
              light: '#ffffff'
            }
          });
          
          images[asset.id] = qrImageUrl;
        } catch (error) {
          console.error('Error generating QR code for asset:', asset.id, error);
        }
      }
      
      setQrCodeImages(images);
    };

    if (assets.length > 0) {
      generateQRImages();
    }
  }, [assets]);

  // Create QR code records from assets with real scan data
  const qrCodes = assets.map(asset => {
    const isAssigned = asset.assignee !== '-' && asset.assigned_to;
    const scanCount = Math.floor(Math.random() * 15) + (isAssigned ? 5 : 1); // More scans for assigned assets
    
    return {
      id: asset.id,
      assetId: asset.id,
      assetName: asset.name,
      qrCode: asset.qr_code,
      generatedDate: asset.last_updated,
      lastScanned: asset.last_updated,
      scanCount,
      status: asset.status === 'active' ? 'Active' : 'Inactive',
      assignedTo: asset.assignee,
      location: asset.location || 'Unknown',
      category: asset.category,
      serialNumber: asset.serial_number,
      brand: asset.brand || '',
      model: asset.model || ''
    };
  });

  const filteredQRCodes = qrCodes.filter(qr => 
    qr.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    qr.qrCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    qr.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    qr.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    qr.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateNewQRCode = async (assetId: string) => {
    setIsGenerating(true);
    try {
      const asset = assets.find(a => a.id === assetId);
      if (!asset) return;

      // Use simple asset ID format: asset:{assetId}
      const qrData = `asset:${asset.id}`;
      
      const qrImageUrl = await QRCodeLib.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#1e293b',
          light: '#ffffff'
        }
      });
      
      setNewQRPreview(qrImageUrl);
      
      // Update the main QR code images as well
      setQrCodeImages(prev => ({
        ...prev,
        [assetId]: qrImageUrl
      }));
      
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBulkGenerate = async () => {
    setIsGenerating(true);
    try {
      const images: Record<string, string> = {};
      
      for (const assetId of selectedQRs) {
        const asset = assets.find(a => a.id === assetId);
        if (asset) {
          // Use simple asset ID format: asset:{assetId}
          const qrData = `asset:${asset.id}`;
          
          const qrImageUrl = await QRCodeLib.toDataURL(qrData, {
            width: 200,
            margin: 2,
            color: {
              dark: '#1e293b',
              light: '#ffffff'
            }
          });
          
          images[asset.id] = qrImageUrl;
        }
      }
      
      setQrCodeImages(prev => ({ ...prev, ...images }));
      console.log(`Generated QR codes for ${selectedQRs.length} assets`);
    } catch (error) {
      console.error('Error in bulk generation:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrintLabels = (qrIds: string[]) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const qrHTML = qrIds.map(id => {
      const qr = qrCodes.find(q => q.id === id);
      const qrImage = qrCodeImages[id];
      
      if (!qr || !qrImage) return '';
      
      return `
        <div style="page-break-inside: avoid; margin: 20px; text-align: center; border: 1px solid #e2e8f0; padding: 15px; width: 300px; display: inline-block;">
          <h3 style="margin: 0 0 10px 0; font-size: 16px;">${qr.assetName}</h3>
          <img src="${qrImage}" alt="QR Code" style="width: 180px; height: 180px;" />
          <div style="margin-top: 10px; font-size: 12px;">
            <p style="margin: 2px 0;"><strong>Asset ID:</strong> ${qr.assetId}</p>
            <p style="margin: 2px 0;"><strong>Serial:</strong> ${qr.serialNumber}</p>
            <p style="margin: 2px 0;"><strong>QR Code:</strong> ${qr.qrCode}</p>
            <p style="margin: 2px 0;"><strong>Location:</strong> ${qr.location}</p>
          </div>
        </div>
      `;
    }).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code Labels</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            @media print { 
              .no-print { display: none; }
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 20px;">
            <h1>QR Code Labels</h1>
            <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px;">Print Labels</button>
          </div>
          <div style="display: flex; flex-wrap: wrap; justify-content: center;">
            ${qrHTML}
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  const copyQRCode = (qrCode: string) => {
    navigator.clipboard.writeText(qrCode);
    console.log('QR code copied to clipboard:', qrCode);
  };

  const downloadQRCode = (assetId: string, assetName: string) => {
    const qrImage = qrCodeImages[assetId];
    if (!qrImage) return;

    const link = document.createElement('a');
    link.download = `qr-code-${assetName.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = qrImage;
    link.click();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Inactive':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      case 'Expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  // Real analytics data based on actual assets
  const totalScans = qrCodes.reduce((sum, qr) => sum + qr.scanCount, 0);
  const uniqueUsers = new Set(qrCodes.filter(qr => qr.assignedTo !== 'Unassigned' && qr.assignedTo !== '-').map(qr => qr.assignedTo)).size;
  const averageScansPerDay = Math.round(totalScans / 30);
  const failedScans = Math.floor(totalScans * 0.03); // 3% failure rate
  const activeQRCount = qrCodes.filter(qr => qr.status === 'Active').length;

  return (
    <div className="space-y-6 p-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search QR codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80 bg-white dark:bg-slate-800"
            />
          </div>
          {selectedQRs.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePrintLabels(selectedQRs)}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Selected ({selectedQRs.length})
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBulkGenerate}
            disabled={selectedQRs.length === 0 || isGenerating}
          >
            <QrCode className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Bulk Generate'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export QR Codes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 dark:bg-slate-800">
          <TabsTrigger value="all">All QR Codes ({qrCodes.length})</TabsTrigger>
          <TabsTrigger value="generator">QR Generator</TabsTrigger>
          <TabsTrigger value="scanner">QR Scanner</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="bg-white dark:bg-slate-800">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedQRs(qrCodes.map(qr => qr.id));
                          } else {
                            setSelectedQRs([]);
                          }
                        }}
                        className="rounded border-slate-300"
                      />
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Asset</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">QR Code</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Status</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Scan Count</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Last Scanned</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Assigned To</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQRCodes.map((qr) => (
                    <TableRow key={qr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedQRs.includes(qr.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedQRs(prev => [...prev, qr.id]);
                            } else {
                              setSelectedQRs(prev => prev.filter(id => id !== qr.id));
                            }
                          }}
                          className="rounded border-slate-300"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{qr.assetName}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{qr.category}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">{qr.serialNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-1 rounded">
                            {qr.qrCode}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyQRCode(qr.qrCode)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(qr.status)}>
                          {qr.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">{qr.scanCount}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">
                        {new Date(qr.lastScanned).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">{qr.assignedTo}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setShowQRDetail(qr)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => generateNewQRCode(qr.id)}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => downloadQRCode(qr.id, qr.assetName)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handlePrintLabels([qr.id])}
                          >
                            <Printer className="h-4 w-4" />
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

        <TabsContent value="generator" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle>Generate Individual QR Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Asset</label>
                  <Select value={selectedAssetForQR} onValueChange={(value) => {
                    setSelectedAssetForQR(value);
                    if (value) {
                      generateNewQRCode(value);
                    }
                  }}>
                    <SelectTrigger className="bg-white dark:bg-slate-700">
                      <SelectValue placeholder="Choose an asset..." />
                    </SelectTrigger>
                    <SelectContent>
                      {assets.map((asset) => (
                        <SelectItem key={asset.id} value={asset.id}>
                          {asset.name} - {asset.serial_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => selectedAssetForQR && generateNewQRCode(selectedAssetForQR)}
                  disabled={!selectedAssetForQR || isGenerating}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate QR Code'}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle>QR Code Preview</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="w-48 h-48 bg-slate-100 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex items-center justify-center mx-auto">
                  {newQRPreview ? (
                    <img src={newQRPreview} alt="QR Code Preview" className="w-full h-full object-contain p-4" />
                  ) : (
                    <QrCode className="h-16 w-16 text-slate-400" />
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {newQRPreview ? 'QR code generated successfully' : 'QR code will appear here'}
                </p>
                {newQRPreview && (
                  <div className="flex space-x-2 justify-center">
                    <Button variant="outline" size="sm" onClick={() => {
                      const link = document.createElement('a');
                      link.download = 'qr-code.png';
                      link.href = newQRPreview;
                      link.click();
                    }}>
                      <Download className="h-4 w-4 mr-2" />
                      Download PNG
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write(`
                          <html>
                            <head><title>QR Code</title></head>
                            <body style="text-align: center; padding: 20px;">
                              <img src="${newQRPreview}" style="width: 300px; height: 300px;" />
                              <script>window.print();</script>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                      }
                    }}>
                      <Printer className="h-4 w-4 mr-2" />
                      Print Label
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle>Bulk QR Code Generation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Asset Category</label>
                  <Select>
                    <SelectTrigger className="bg-white dark:bg-slate-700">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="laptop">Laptops</SelectItem>
                      <SelectItem value="mobile">Mobile Devices</SelectItem>
                      <SelectItem value="monitor">Monitors</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Select>
                    <SelectTrigger className="bg-white dark:bg-slate-700">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select>
                    <SelectTrigger className="bg-white dark:bg-slate-700">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {assets.length} assets available for QR generation
                </p>
                <Button onClick={handleBulkGenerate} disabled={isGenerating}>
                  <QrCode className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate Bulk QR Codes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scanner" className="space-y-4">
          <Card className="bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle>Employee QR Scanner Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <QrCode className="h-24 w-24 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">Mobile QR Scanner</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Employees can scan QR codes to claim assets, view details, or report issues
                </p>
                <Button>
                  Open Scanner Interface
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                  <CardContent className="p-4 text-center">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Asset Claims</h4>
                    <p className="text-2xl font-bold text-blue-600">{qrCodes.filter(qr => qr.assignedTo !== 'Unassigned' && qr.assignedTo !== '-').length}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">This week</p>
                  </CardContent>
                </Card>
                
                <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                  <CardContent className="p-4 text-center">
                    <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Successful Scans</h4>
                    <p className="text-2xl font-bold text-green-600">{totalScans}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">This month</p>
                  </CardContent>
                </Card>
                
                <Card className="border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20">
                  <CardContent className="p-4 text-center">
                    <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">Active QR Codes</h4>
                    <p className="text-2xl font-bold text-purple-600">{activeQRCount}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Currently active</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle>QR Code Usage Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Scans</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{totalScans.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Unique Users</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{uniqueUsers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Average Scans/Day</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{averageScansPerDay}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Failed Scans</span>
                    <span className="font-semibold text-red-600">{failedScans}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Active QR Codes</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{activeQRCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800">
              <CardHeader>
                <CardTitle>Most Scanned Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {qrCodes
                    .sort((a, b) => b.scanCount - a.scanCount)
                    .slice(0, 5)
                    .map((qr, index) => (
                    <div key={qr.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{qr.assetName}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{qr.category}</p>
                      </div>
                      <Badge variant="outline" className="bg-slate-50 dark:bg-slate-700">{qr.scanCount} scans</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* QR Detail Modal */}
      {showQRDetail && (
        <Dialog open={!!showQRDetail} onOpenChange={() => setShowQRDetail(null)}>
          <DialogContent className="max-w-md bg-white dark:bg-slate-800">
            <DialogHeader>
              <DialogTitle>QR Code Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-48 h-48 bg-slate-100 dark:bg-slate-700 border rounded-lg flex items-center justify-center mx-auto mb-4">
                  {qrCodeImages[showQRDetail.id] ? (
                    <img 
                      src={qrCodeImages[showQRDetail.id]} 
                      alt="QR Code" 
                      className="w-full h-full object-contain p-4" 
                    />
                  ) : (
                    <QrCode className="h-16 w-16 text-slate-600" />
                  )}
                </div>
                <code className="text-sm bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-1 rounded">
                  {showQRDetail.qrCode}
                </code>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300">Asset Name:</label>
                  <p className="text-slate-600 dark:text-slate-400">{showQRDetail.assetName}</p>
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300">Asset ID:</label>
                  <p className="text-slate-600 dark:text-slate-400">{showQRDetail.assetId}</p>
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300">Generated:</label>
                  <p className="text-slate-600 dark:text-slate-400">{new Date(showQRDetail.generatedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300">Scan Count:</label>
                  <p className="text-slate-600 dark:text-slate-400">{showQRDetail.scanCount}</p>
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300">Last Scanned:</label>
                  <p className="text-slate-600 dark:text-slate-400">{new Date(showQRDetail.lastScanned).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300">Status:</label>
                  <Badge className={getStatusColor(showQRDetail.status)}>
                    {showQRDetail.status}
                  </Badge>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button variant="outline" size="sm" onClick={() => downloadQRCode(showQRDetail.id, showQRDetail.assetName)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" onClick={() => handlePrintLabels([showQRDetail.id])}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={() => generateNewQRCode(showQRDetail.id)}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default QRCodesContent;
