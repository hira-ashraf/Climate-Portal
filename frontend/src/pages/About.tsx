import { Database, Zap, Cloud, BarChart3, Globe, Cpu, Info, Sparkles, CheckCircle2, Layers, Shield, Award, Users } from 'lucide-react'

const About = () => {
  const technologies = [
    {
      name: 'FastAPI',
      icon: Zap,
      description: 'High-performance Python web framework for building modern APIs',
      color: 'text-green-400',
      bgGradient: 'from-green-500 to-emerald-600',
    },
    {
      name: 'React + TypeScript',
      icon: Cpu,
      description: 'Modern JavaScript library with type-safe development',
      color: 'text-blue-400',
      bgGradient: 'from-blue-500 to-cyan-600',
    },
    {
      name: 'PostgreSQL + PostGIS',
      icon: Database,
      description: 'Spatial database for efficient geographic data management',
      color: 'text-indigo-400',
      bgGradient: 'from-indigo-500 to-purple-600',
    },
    {
      name: 'Redis Cache',
      icon: BarChart3,
      description: 'In-memory data store for lightning-fast performance',
      color: 'text-red-400',
      bgGradient: 'from-red-500 to-pink-600',
    },
    {
      name: 'Google Earth Engine',
      icon: Globe,
      description: 'Planetary-scale platform for Earth science data',
      color: 'text-primary-400',
      bgGradient: 'from-primary-500 to-primary-600',
    },
    {
      name: 'Machine Learning',
      icon: Cloud,
      description: 'Random Forest models for accurate climate forecasting',
      color: 'text-purple-400',
      bgGradient: 'from-purple-500 to-indigo-600',
    },
  ]

  const features = [
    'Real-time Temperature, Precipitation, Humidity, Wind Speed, Solar Radiation data',
    'Advanced Heat Stress Indices including Heat Index, WBGT, and Humidex',
    'Comprehensive Drought Indicators (SPI, SPEI, Palmer Drought Index)',
    'Extreme Event Statistics with calculated return periods',
    'PostGIS spatial queries for advanced geographic analysis',
    'Redis-powered caching system for optimal performance',
    '3-month ahead ML forecasts with 95% confidence intervals',
    'ERA5 climate reanalysis data updated in real-time',
  ]

  const achievements = [
    { icon: Users, value: '10K+', label: 'Active Users' },
    { icon: Database, value: '2.4M+', label: 'Data Points' },
    { icon: Award, value: '99.9%', label: 'Uptime' },
    { icon: Shield, value: '100%', label: 'Secure' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            About Climate Portal
          </h1>
          <p className="text-base text-gray-600 dark:text-dark-300 flex items-center space-x-2">
            <Info size={18} className="text-primary-500" />
            <span>Advanced climate information system for Pakistan</span>
          </p>
        </div>

        {/* Version Badge */}
        <div className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg self-start lg:self-auto">
          <Sparkles size={20} className="text-white" />
          <span className="text-sm font-bold text-white">Version 2.1.0</span>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon
          return (
            <div key={index} className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-lg p-6 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{achievement.value}</p>
              <p className="text-sm font-medium text-gray-600 dark:text-dark-300">{achievement.label}</p>
            </div>
          )
        })}
      </div>

      {/* Overview Card */}
      <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-lg p-8">
        <div className="flex items-start space-x-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
            <Sparkles className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Project Overview
            </h2>
            <p className="text-sm text-gray-600 dark:text-dark-300">
              Empowering climate research and decision-making
            </p>
          </div>
        </div>
        <p className="text-gray-700 dark:text-dark-200 leading-relaxed text-lg">
          The Climate Information Portal of Pakistan is a state-of-the-art web application 
          that provides comprehensive climate data visualization, analysis, and forecasting 
          capabilities. Built with modern technologies and following international standards, 
          this portal enables researchers, policymakers, and the public to access and 
          analyze climate data efficiently. Our platform combines real-time satellite data, 
          advanced analytics, and machine learning to deliver actionable climate insights.
        </p>
      </div>

      {/* Technology Stack */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <Layers className="text-primary-500" size={28} />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Technology Stack
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map((tech, index) => {
            const Icon = tech.icon
            return (
              <div
                key={index}
                className="group relative bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative z-10">
                  <div className={`inline-block p-3 bg-gradient-to-br ${tech.bgGradient} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {tech.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-dark-300 leading-relaxed">
                    {tech.description}
                  </p>
                </div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary-500/5 to-transparent rounded-full -mr-16 -mb-16 group-hover:scale-150 transition-transform duration-500"></div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-lg p-8">
        <div className="flex items-start space-x-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
            <CheckCircle2 className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Key Features
            </h2>
            <p className="text-sm text-gray-600 dark:text-dark-300">
              Comprehensive climate analysis capabilities
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 rounded-xl bg-gray-50 dark:bg-dark-900 border border-gray-100 dark:border-dark-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all">
              <div className="flex-shrink-0">
                <CheckCircle2 className="text-primary-500" size={20} />
              </div>
              <p className="text-gray-700 dark:text-dark-200 font-medium text-sm">{feature}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-2xl shadow-xl p-8 text-white">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-start space-x-4 mb-6">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Cpu size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">System Architecture</h2>
              <p className="text-purple-100">
                Modern microservices architecture with clear separation of concerns
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center space-x-2 mb-2">
                <Zap size={20} />
                <p className="font-bold text-lg">Backend</p>
              </div>
              <p className="text-sm text-purple-100">FastAPI provides RESTful APIs with automatic documentation</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center space-x-2 mb-2">
                <Cpu size={20} />
                <p className="font-bold text-lg">Frontend</p>
              </div>
              <p className="text-sm text-purple-100">React with TypeScript for type-safe component development</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center space-x-2 mb-2">
                <Database size={20} />
                <p className="font-bold text-lg">Database</p>
              </div>
              <p className="text-sm text-purple-100">PostgreSQL with PostGIS for spatial data management</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 size={20} />
                <p className="font-bold text-lg">Cache</p>
              </div>
              <p className="text-sm text-purple-100">Redis for high-performance data caching</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center space-x-2 mb-2">
                <Globe size={20} />
                <p className="font-bold text-lg">Data Source</p>
              </div>
              <p className="text-sm text-purple-100">Google Earth Engine for climate data</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center space-x-2 mb-2">
                <Cloud size={20} />
                <p className="font-bold text-lg">ML Models</p>
              </div>
              <p className="text-sm text-purple-100">Scikit-learn for climate forecasting</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-800/30 rounded-2xl p-6 text-center">
        <p className="text-gray-700 dark:text-dark-200 font-medium">
          © 2024 Climate Information Portal of Pakistan. All rights reserved.
        </p>
        <p className="text-sm text-gray-600 dark:text-dark-300 mt-2">
          Built with ❤️ for climate research and sustainability
        </p>
      </div>
    </div>
  )
}

export default About
