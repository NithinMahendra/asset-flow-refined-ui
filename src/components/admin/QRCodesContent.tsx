
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
import { QrCode, Download, Printer, Search, RefreshCw, Eye, Copy } from 'lucide-react';

const QRCodesContent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQRs, setSelectedQRs] = useState<string[]>([]);
  const [showQRDetail, setShowQRDetail] = useState<any>(null);

  // Mock QR code data linked to assets
  const qrCodes = [
    {
      id: 'QR001',
      assetId: 'AST-001',
      assetName: 'MacBook Pro M3',
      qrCode: 'QR001-AST001-2024',
      generatedDate: '2024-01-15',
      lastScanned: '2024-01-20',
      scanCount: 5,
      status: 'Active',
      assignedTo: '-',
      location: 'Warehouse A'
    },
    {
      id: 'QR002',
      assetId: 'AST-002',
      assetName: 'iPhone 15 Pro',
      qrCode: 'QR002-AST002-2024',
      generatedDate: '2024-01-14',
      lastScanned: '2024-01-21',
      scanCount: 12,
      status: 'Active',
      assignedTo: 'John Doe',
      location: 'Office Floor 2'
    },
    {
      id: 'QR003',
      assetId: 'AST-003',
      assetName: 'Dell Monitor 27"',
      qrCode: 'QR003-AST003-2024',
      generatedDate: '2024-01-13',
      lastScanned: '2024-01-18',
      scanCount: 3,
      status: 'Active',
      assignedTo: '-',
      location: 'IT Department'
    },
  ];

  const generateQRCode = (assetId: string) => {
    const timestamp = Date.now();
    const uniqueCode = `QR${timestamp}-${assetId}-${new Date().getFullYear()}`;
    console.log('Generated QR Code:', uniqueCode);
    return uniqueCode;
  };

  const handleBulkGenerate = () => {
    console.log('Generating QR codes for multiple assets...');
    // Implementation for bulk QR generation
  };

  const handlePrintLabels = (qrIds: string[]) => {
    console.log('Printing labels for:', qrIds);
    // Implementation for printing QR code labels
  };

  const copyQRCode = (qrCode: string) => {
    navigator.clipboard.writeText(qrCode);
    console.log('QR code copied to clipboard:', qrCode);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'Expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search QR codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80"
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
          <Button variant="outline" size="sm" onClick={handleBulkGenerate}>
            <QrCode className="h-4 w-4 mr-2" />
            Bulk Generate
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export QR Codes
          </Button>
          <Button size="sm">
            <QrCode className="h-4 w-4 mr-2" />
            Generate QR Code
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All QR Codes</TabsTrigger>
          <TabsTrigger value="generator">QR Generator</TabsTrigger>
          <TabsTrigger value="scanner">QR Scanner</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
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
                            setSelectedQRs(qrCodes.map(qr => qr.id));
                          } else {
                            setSelectedQRs([]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </TableHead>
                    <TableHead className="font-semibold">QR ID</TableHead>
                    <TableHead className="font-semibold">Asset</TableHead>
                    <TableHead className="font-semibold">QR Code</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Scan Count</TableHead>
                    <TableHead className="font-semibold">Last Scanned</TableHead>
                    <TableHead className="font-semibold">Assigned To</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qrCodes.map((qr) => (
                    <TableRow key={qr.id} className="hover:bg-gray-50">
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
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{qr.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{qr.assetName}</p>
                          <p className="text-sm text-gray-500">{qr.assetId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
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
                      <TableCell>{qr.scanCount}</TableCell>
                      <TableCell className="text-gray-600">{qr.lastScanned}</TableCell>
                      <TableCell className="text-gray-600">{qr.assignedTo}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setShowQRDetail(qr)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
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
            <Card>
              <CardHeader>
                <CardTitle>Generate Individual QR Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Asset</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">Choose an asset...</option>
                    <option value="AST-001">AST-001 - MacBook Pro M3</option>
                    <option value="AST-002">AST-002 - iPhone 15 Pro</option>
                    <option value="AST-003">AST-003 - Dell Monitor 27"</option>
                  </select>
                </div>
                <Button className="w-full">
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate QR Code
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>QR Code Preview</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto">
                  <QrCode className="h-16 w-16 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600">QR code will appear here</p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download PNG
                  </Button>
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Label
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Bulk QR Code Generation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Asset Category</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">All Categories</option>
                    <option value="laptop">Laptops</option>
                    <option value="mobile">Mobile Devices</option>
                    <option value="monitor">Monitors</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">All Locations</option>
                    <option value="warehouse-a">Warehouse A</option>
                    <option value="warehouse-b">Warehouse B</option>
                    <option value="office">Office</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select className="w-full p-2 border rounded-md">
                    <option value="">All Statuses</option>
                    <option value="available">Available</option>
                    <option value="assigned">Assigned</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <p className="text-sm text-gray-600">45 assets selected for QR generation</p>
                <Button>
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate Bulk QR Codes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scanner" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee QR Scanner Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <QrCode className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Mobile QR Scanner</h3>
                <p className="text-gray-600 mb-6">
                  Employees can scan QR codes to claim assets, view details, or report issues
                </p>
                <Button>
                  Open Scanner Interface
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-blue-200">
                  <CardContent className="p-4 text-center">
                    <h4 className="font-medium text-blue-800 mb-2">Asset Claims</h4>
                    <p className="text-2xl font-bold text-blue-600">23</p>
                    <p className="text-sm text-gray-600">This week</p>
                  </CardContent>
                </Card>
                
                <Card className="border-green-200">
                  <CardContent className="p-4 text-center">
                    <h4 className="font-medium text-green-800 mb-2">Successful Scans</h4>
                    <p className="text-2xl font-bold text-green-600">156</p>
                    <p className="text-sm text-gray-600">This month</p>
                  </CardContent>
                </Card>
                
                <Card className="border-purple-200">
                  <CardContent className="p-4 text-center">
                    <h4 className="font-medium text-purple-800 mb-2">Active QR Codes</h4>
                    <p className="text-2xl font-bold text-purple-600">89</p>
                    <p className="text-sm text-gray-600">Currently active</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>QR Code Usage Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Scans</span>
                    <span className="font-semibold">1,234</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Unique Users</span>
                    <span className="font-semibold">89</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Scans/Day</span>
                    <span className="font-semibold">42</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Failed Scans</span>
                    <span className="font-semibold text-red-600">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Scanned Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {qrCodes.slice(0, 3).map((qr, index) => (
                    <div key={qr.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{qr.assetName}</p>
                        <p className="text-sm text-gray-500">{qr.assetId}</p>
                      </div>
                      <Badge variant="outline">{qr.scanCount} scans</Badge>
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>QR Code Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-100 border rounded-lg flex items-center justify-center mx-auto mb-4">
                  <QrCode className="h-16 w-16 text-gray-600" />
                </div>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {showQRDetail.qrCode}
                </code>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-gray-700">Asset Name:</label>
                  <p>{showQRDetail.assetName}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Asset ID:</label>
                  <p>{showQRDetail.assetId}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Generated:</label>
                  <p>{showQRDetail.generatedDate}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Scan Count:</label>
                  <p>{showQRDetail.scanCount}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Last Scanned:</label>
                  <p>{showQRDetail.lastScanned}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Status:</label>
                  <Badge className={getStatusColor(showQRDetail.status)}>
                    {showQRDetail.status}
                  </Badge>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm">
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
