
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const AssetChart = () => {
  const data = [
    { name: 'Week 1', total: 1200, inUse: 950, available: 200, faulty: 50 },
    { name: 'Week 2', total: 1220, inUse: 980, available: 190, faulty: 50 },
    { name: 'Week 3', total: 1235, inUse: 970, available: 210, faulty: 55 },
    { name: 'Week 4', total: 1247, inUse: 982, available: 215, faulty: 50 },
  ];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#606060" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#606060" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorInUse" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#808080" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#808080" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="name" 
            axisLine={false}
            tickLine={false}
            className="text-xs"
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            className="text-xs"
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#606060"
            fillOpacity={1}
            fill="url(#colorTotal)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="inUse"
            stroke="#808080"
            fillOpacity={1}
            fill="url(#colorInUse)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetChart;
