import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts'
import { getForecast } from '@/lib/api'
import { CloudRain, MapPin, Brain, Sparkles, TrendingUp, AlertCircle, Zap, Target } from 'lucide-react'

const Forecast = () => {
  const [location, setLocation] = useState('punjab')
  const [variable, setVariable] = useState('temperature')

  const { data, isLoading } = useQuery({
    queryKey: ['forecast', location, variable],
    queryFn: () => getForecast(location, variable, 'monthly'),
  })

  const locations = [
    { value: 'punjab', label: 'Punjab', icon: '🏙️' },
    { value: 'sindh', label: 'Sindh', icon: '🌆' },
    { value: 'kpk', label: 'Khyber Pakhtunkhwa', icon: '⛰️' },
    { value: 'balochistan', label: 'Balochistan', icon: '🏜️' },
  ]

  const variableOptions = [
    { value: 'temperature', label: '🌡️ Temperature', color: '#ef4444' },
    { value: 'precipitation', label: '💧 Precipitation', color: '#3b82f6' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Climate Forecast
          </h1>
          <p className="text-base text-gray-600 dark:text-dark-300 flex items-center space-x-2">
            <CloudRain size={18} className="text-primary-500" />
            <span>3-month ahead ML predictions with confidence intervals</span>
          </p>
        </div>

        {/* AI Badge */}
        <div className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg self-start lg:self-auto">
          <Brain size={20} className="text-white" />
          <span className="text-sm font-bold text-white uppercase tracking-wide">AI-Powered</span>
        </div>
      </div>

      {/* AI Model Info Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-2xl shadow-xl p-6 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Brain size={32} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1">Machine Learning Predictions</h3>
            <p className="text-purple-100 text-sm">
              Advanced Random Forest models trained on historical climate patterns to predict future trends with confidence intervals
            </p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Target size={18} />
            <span className="text-sm font-semibold">High Accuracy</span>
          </div>
        </div>
      </div>

      {/* Controls Card */}
      <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-5">
          <TrendingUp className="text-primary-500" size={22} />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Forecast Parameters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-dark-300 mb-3">
              <MapPin size={14} className="inline mr-1.5" />
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium cursor-pointer"
            >
              {locations.map((l) => (
                <option key={l.value} value={l.value}>{l.icon} {l.label}</option>
              ))}
            </select>
          </div>

          {/* Variable */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-dark-300 mb-3">
              <Zap size={14} className="inline mr-1.5" />
              Climate Variable
            </label>
            <select
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium cursor-pointer"
            >
              {variableOptions.map((v) => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Selection Info */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-800/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-dark-300">Forecast Range</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">Next 3 Months</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600 dark:text-dark-300">Model Type</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">Random Forest</p>
            </div>
          </div>
        </div>
      </div>

      {/* Forecast Chart Card */}
      <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-xl p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Forecast Visualization
          </h3>
          <p className="text-sm text-gray-600 dark:text-dark-300">
            Predicted values with upper and lower confidence bounds
          </p>
        </div>

        {isLoading ? (
          <div className="h-96 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-500/30 border-t-purple-500"></div>
              <Brain className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-500" size={28} />
            </div>
            <p className="text-gray-600 dark:text-dark-300 font-medium">Generating AI forecast...</p>
          </div>
        ) : data?.forecast && data.forecast.length > 0 ? (
          <div className="bg-gray-50 dark:bg-dark-900/50 rounded-xl p-6">
            <ResponsiveContainer width="100%" height={450}>
              <ComposedChart data={data.forecast}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00af66" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00af66" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-dark-700" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  style={{ fontSize: '13px', fontWeight: '600' }}
                  tickMargin={10}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '13px', fontWeight: '600' }}
                  tickMargin={10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                    border: '2px solid #00af66',
                    borderRadius: '12px',
                    fontWeight: '600',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }}
                  labelStyle={{ color: '#00af66', fontWeight: '700', marginBottom: '5px' }}
                />
                <Legend 
                  wrapperStyle={{ 
                    paddingTop: '24px',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="upper_bound" 
                  fill="url(#colorArea)" 
                  stroke="none"
                  fillOpacity={1}
                  name="Upper Confidence"
                />
                <Area 
                  type="monotone" 
                  dataKey="lower_bound" 
                  fill="url(#colorArea)" 
                  stroke="none"
                  fillOpacity={1}
                  name="Lower Confidence"
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00af66" 
                  strokeWidth={4}
                  dot={{ r: 6, fill: '#00af66', strokeWidth: 3, stroke: '#ffffff' }}
                  activeDot={{ r: 9, strokeWidth: 3 }}
                  name="Predicted Value"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center">
            <p className="text-gray-500 dark:text-dark-400 font-medium">No forecast data available</p>
          </div>
        )}
        
        {/* Model Info */}
        {data?.model_info && (
          <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800/30">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-blue-500/10 rounded-xl">
                <AlertCircle className="text-blue-500 dark:text-blue-400" size={22} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                  <span>Model Information</span>
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-md">
                    {data.model_info.model_type}
                  </span>
                </h4>
                <p className="text-sm text-gray-700 dark:text-dark-300">
                  {data.model_info.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Target size={20} />
            </div>
            <h4 className="font-bold">High Accuracy</h4>
          </div>
          <p className="text-sm opacity-90">Models trained on decades of historical climate data</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles size={20} />
            </div>
            <h4 className="font-bold">Real-time Updates</h4>
          </div>
          <p className="text-sm opacity-90">Forecasts updated automatically with latest data</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Brain size={20} />
            </div>
            <h4 className="font-bold">Machine Learning</h4>
          </div>
          <p className="text-sm opacity-90">Advanced algorithms for precise predictions</p>
        </div>
      </div>
    </div>
  )
}

export default Forecast
