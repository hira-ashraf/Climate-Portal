import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { getTimeSeries } from '@/lib/api'
import { format, subMonths } from 'date-fns'
import { TrendingUp, MapPin, Calendar, BarChart3, Sparkles, Activity, TrendingDown, Minus } from 'lucide-react'

const TimeSeries = () => {
  const [location, setLocation] = useState('punjab')
  const [variable, setVariable] = useState('temperature')
  const [startDate, setStartDate] = useState(format(subMonths(new Date(), 12), 'yyyy-MM-dd'))
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))

  const { data, isLoading } = useQuery({
    queryKey: ['timeseries', location, variable, startDate, endDate],
    queryFn: () => getTimeSeries(location, variable, startDate, endDate, 'monthly'),
  })

  const locations = [
    { value: 'punjab', label: 'Punjab', icon: '🏙️' },
    { value: 'sindh', label: 'Sindh', icon: '🌆' },
    { value: 'kpk', label: 'Khyber Pakhtunkhwa', icon: '⛰️' },
    { value: 'balochistan', label: 'Balochistan', icon: '🏜️' },
  ]

  const variables = [
    { value: 'temperature', label: 'Temperature (°C)', color: '#ef4444', bgColor: 'from-red-500 to-orange-500' },
    { value: 'precipitation', label: 'Precipitation (mm)', color: '#3b82f6', bgColor: 'from-blue-500 to-cyan-500' },
    { value: 'humidity', label: 'Humidity (%)', color: '#00af66', bgColor: 'from-green-500 to-emerald-500' },
    { value: 'wind_speed', label: 'Wind Speed (m/s)', color: '#ffb900', bgColor: 'from-yellow-500 to-orange-500' },
  ]

  const currentVariable = variables.find(v => v.value === variable)
  const avgValue = data?.data && data.data.length > 0 
    ? (data.data.reduce((sum: number, item: any) => sum + item.value, 0) / data.data.length).toFixed(2)
    : '--'
  const maxValue = data?.data && data.data.length > 0
    ? Math.max(...data.data.map((item: any) => item.value)).toFixed(2)
    : '--'
  const minValue = data?.data && data.data.length > 0
    ? Math.min(...data.data.map((item: any) => item.value)).toFixed(2)
    : '--'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Time Series Analysis
          </h1>
          <p className="text-base text-gray-600 dark:text-dark-300 flex items-center space-x-2">
            <TrendingUp size={18} className="text-primary-500" />
            <span>Analyze climate trends over time</span>
          </p>
        </div>

        {/* Location Badge */}
        <div className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg self-start lg:self-auto">
          <MapPin size={16} className="text-white" />
          <span className="text-sm font-bold text-white">
            {locations.find(l => l.value === location)?.label}
          </span>
        </div>
      </div>

      {/* Controls Card */}
      <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-5">
          <BarChart3 className="text-primary-500" size={22} />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Analysis Parameters</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Location */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-dark-300 mb-3">
              <MapPin size={14} className="inline mr-1.5" />
              Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium cursor-pointer"
            >
              {locations.map((l) => (
                <option key={l.value} value={l.value}>{l.icon} {l.label}</option>
              ))}
            </select>
          </div>

          {/* Variable */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-dark-300 mb-3">
              <Activity size={14} className="inline mr-1.5" />
              Variable
            </label>
            <select
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium cursor-pointer"
            >
              {variables.map((v) => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-dark-300 mb-3">
              <Calendar size={14} className="inline mr-1.5" />
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium cursor-pointer"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-dark-300 mb-3">
              <Calendar size={14} className="inline mr-1.5" />
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              max={format(new Date(), 'yyyy-MM-dd')}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      {!isLoading && data?.data && data.data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`relative overflow-hidden bg-gradient-to-br ${currentVariable?.bgColor} rounded-2xl shadow-lg p-6 text-white`}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold uppercase tracking-wide opacity-90">Average Value</p>
                <Minus size={20} className="opacity-75" />
              </div>
              <p className="text-4xl font-bold">{avgValue}</p>
              <p className="text-sm opacity-80 mt-1">{currentVariable?.label}</p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold uppercase tracking-wide opacity-90">Maximum Value</p>
                <TrendingUp size={20} className="opacity-75" />
              </div>
              <p className="text-4xl font-bold">{maxValue}</p>
              <p className="text-sm opacity-80 mt-1">Peak recorded</p>
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16"></div>
          </div>

          <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold uppercase tracking-wide opacity-90">Minimum Value</p>
                <TrendingDown size={20} className="opacity-75" />
              </div>
              <p className="text-4xl font-bold">{minValue}</p>
              <p className="text-sm opacity-80 mt-1">Lowest recorded</p>
            </div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mt-16"></div>
          </div>
        </div>
      )}

      {/* Chart Card */}
      <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-xl p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {currentVariable?.label} Trend
          </h3>
          <p className="text-sm text-gray-600 dark:text-dark-300">
            Historical data from {format(new Date(startDate), 'MMM dd, yyyy')} to {format(new Date(endDate), 'MMM dd, yyyy')}
          </p>
        </div>

        {isLoading ? (
          <div className="h-96 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary-500/30 border-t-primary-500"></div>
              <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-500" size={28} />
            </div>
            <p className="text-gray-600 dark:text-dark-300 font-medium">Loading time series data...</p>
          </div>
        ) : data?.data && data.data.length > 0 ? (
          <div className="bg-gray-50 dark:bg-dark-900/50 rounded-xl p-6">
            <ResponsiveContainer width="100%" height={450}>
              <LineChart data={data.data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentVariable?.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={currentVariable?.color} stopOpacity={0}/>
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
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={currentVariable?.color || '#00af66'} 
                  strokeWidth={3}
                  dot={{ r: 5, fill: currentVariable?.color, strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 8, strokeWidth: 3 }}
                  name={currentVariable?.label}
                  fill="url(#colorValue)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center">
            <p className="text-gray-500 dark:text-dark-400 font-medium">No data available for the selected parameters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TimeSeries
