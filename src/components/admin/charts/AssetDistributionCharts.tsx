
import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Asset {
  id: string;
  device_type: string;
  status: string;
  location?: string;
  purchase_price?: number;
  purchase_date?: string;
}

interface AssetDistributionChartsProps {
  assets: Asset[];
}

const AssetDistributionCharts: React.FC<AssetDistributionChartsProps> = ({ assets }) => {
  // Device type distribution
  const deviceTypeData = assets.reduce((acc, asset) => {
    const type = asset.device_type || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const deviceTypePieData = Object.entries(deviceTypeData).map(([type, count]) => ({
    name: type.replace('_', ' ').toUpperCase(),
    value: count,
  }));

  // Status distribution
  const statusData = assets.reduce((acc, asset) => {
    const status = asset.status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusPieData = Object.entries(statusData).map(([status, count]) => ({
    name: status.toUpperCase(),
    value: count,
  }));

  // Location distribution
  const locationData = assets.reduce((acc, asset) => {
    const location = asset.location || 'Not Specified';
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const locationBarData = Object.entries(locationData).map(([location, count]) => ({
    location: location.length > 15 ? location.substring(0, 15) + '...' : location,
    count,
  }));

  // Asset value distribution
  const valueRanges = {
    '< $500': 0,
    '$500 - $1000': 0,
    '$1000 - $2000': 0,
    '$2000 - $5000': 0,
    '> $5000': 0,
  };

  assets.forEach(asset => {
    const price = asset.purchase_price || 0;
    if (price < 500) valueRanges['< $500']++;
    else if (price < 1000) valueRanges['$500 - $1000']++;
    else if (price < 2000) valueRanges['$1000 - $2000']++;
    else if (price < 5000) valueRanges['$2000 - $5000']++;
    else valueRanges['> $5000']++;
  });

  const valueBarData = Object.entries(valueRanges).map(([range, count]) => ({
    range,
    count,
  }));

  // Monthly acquisition trends
  const monthlyData = assets.reduce((acc, asset) => {
    if (asset.purchase_date) {
      const date = new Date(asset.purchase_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[monthKey] = (acc[monthKey] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const monthlyLineData = Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12) // Last 12 months
    .map(([month, count]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      count,
    }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices less than 5%
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12" fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Device Type Distribution */}
      <Card className="card-enhanced">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Device Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceTypePieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceTypePieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status Distribution */}
      <Card className="card-enhanced">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Asset Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusPieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Location Distribution */}
      <Card className="card-enhanced">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Assets by Location</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={locationBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="location" angle={-45} textAnchor="end" height={80} fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Value Distribution */}
      <Card className="card-enhanced">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Asset Value Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={valueBarData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Acquisition Trends */}
      {monthlyLineData.length > 0 && (
        <Card className="card-enhanced lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Asset Acquisition Trends (Last 12 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyLineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AssetDistributionCharts;
