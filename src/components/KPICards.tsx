
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Monitor, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const KPICards = () => {
  const kpis = [
    {
      title: 'Total Devices',
      value: 1247,
      change: '+5.2%',
      trend: 'up',
      icon: Monitor,
      color: 'bg-blue-500',
    },
    {
      title: 'Assigned',
      value: 982,
      change: '+2.1%',
      trend: 'up',
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      title: 'Available',
      value: 215,
      change: '-1.5%',
      trend: 'down',
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: 'Under Repair',
      value: 50,
      change: '+12.3%',
      trend: 'up',
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className="glass-effect hover:shadow-xl transition-all duration-300 group cursor-pointer border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {kpi.title}
                  </p>
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                    className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                  >
                    {kpi.value.toLocaleString()}
                  </motion.p>
                  <div className="flex items-center space-x-1">
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${
                      kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {kpi.change}
                    </span>
                    <span className="text-xs text-gray-500">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${kpi.color} text-white group-hover:scale-110 transition-transform`}>
                  <kpi.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default KPICards;
