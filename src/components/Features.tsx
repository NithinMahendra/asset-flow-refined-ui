
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Shield, BarChart3, Zap, Cloud, Users } from 'lucide-react';

const Features = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleCards(prev => [...prev, index]);
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Monitor,
      title: 'Device Management',
      description: 'Track and manage all your devices with real-time monitoring and automated inventory updates.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Advanced Security',
      description: 'Enterprise-grade security with end-to-end encryption and multi-factor authentication.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Powerful analytics dashboard with custom reports and predictive maintenance alerts.',
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      icon: Zap,
      title: 'Automation',
      description: 'Automate routine tasks with smart workflows and intelligent asset lifecycle management.',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Cloud,
      title: 'Cloud Integration',
      description: 'Seamless cloud synchronization with support for all major cloud platforms and services.',
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Enhanced team collaboration with role-based access control and real-time notifications.',
      gradient: 'from-pink-500 to-rose-500'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage your assets efficiently and securely
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const isVisible = visibleCards.includes(index);
            
            return (
              <Card 
                key={index}
                data-index={index}
                className={`feature-card group hover:shadow-2xl transition-all duration-500 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardHeader className="text-center pb-2">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.gradient} p-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-full h-full text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
