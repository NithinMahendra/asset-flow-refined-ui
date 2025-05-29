
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';

const AnalyticsCharts = () => {
  const usageTrendData = [
    { month: 'Jan', assigned: 920, available: 180, repaired: 45 },
    { month: 'Feb', assigned: 940, available: 165, repaired: 38 },
    { month: 'Mar', assigned: 965, available: 155, repaired: 42 },
    { month: 'Apr', assigned: 982, available: 215, repaired: 50 },
  ];

  const deviceDistributionData = [
    { name: 'Laptops', value: 450, color: '#404040' },
    { name: 'Phones', value: 320, color: '#606060' },
    { name: 'Tablets', value: 180, color: '#808080' },
    { name: 'Monitors', value: 150, color: '#A0A0A0' },
    { name: 'Others', value: 147, color: '#C0C0C0' },
  ];

  const repairFrequencyData = [
    { device: 'iPhone', repairs: 12 },
    { device: 'MacBook', repairs: 8 },
    { device: 'iPad', repairs: 6 },
    { device: 'Monitor', repairs: 4 },
    { device: 'Others', repairs: 3 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Usage Trends */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="lg:col-span-2"
      >
        <Card className="glass-effect">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Asset Usage Trends</CardTitle>
              <Badge variant="secondary">Last 4 months</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageTrendData}>
                  <defs>
                    <linearGradient id="colorAssigned" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#606060" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#606060" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAvailable" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#808080" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#808080" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="assigned"
                    stroke="#606060"
                    fillOpacity={1}
                    fill="url(#colorAssigned)"
                    strokeWidth={3}
                  />
                  <Area
                    type="monotone"
                    dataKey="available"
                    stroke="#808080"
                    fillOpacity={1}
                    fill="url(#colorAvailable)"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="repaired"
                    stroke="#A0A0A0"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Device Distribution */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={40}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Repair Frequency */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Repair Frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={repairFrequencyData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="device" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar dataKey="repairs" fill="#808080" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AnalyticsCharts;
