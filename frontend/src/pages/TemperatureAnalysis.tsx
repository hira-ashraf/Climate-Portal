import { useState } from 'react'
import { ArrowLeft, Download, Info, MapPin, TrendingUp, Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts'

const TemperatureAnalysis = () => {
  const navigate = useNavigate()
  const [activeParam, setActiveParam] = useState('mean')
  const [activeAggregation, setActiveAggregation] = useState('monthly')

  // Sample data
  const temperatureTrendData = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    current: [15, 18, 23, 28, 33, 35, 34, 33, 31, 27, 21, 16][i],
    previous: [14, 17, 22, 27, 32, 34, 33, 32, 30, 26, 20, 15][i],
    normal: [13, 16, 21, 26, 31, 33, 32, 31, 29, 25, 19, 14][i],
  }))

  const distributionData = [
    { range: '10-15', count: 12 },
    { range: '15-20', count: 28 },
    { range: '20-25', count: 45 },
    { range: '25-30', count: 52 },
    { range: '30-35', count: 38 },
    { range: '35-40', count: 15 },
  ]

  const seasonalData = [
    { season: 'Winter', value: 14 },
    { season: 'Spring', value: 25 },
    { season: 'Summer', value: 34 },
    { season: 'Autumn', value: 26 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Top Controls Bar */}
      <div className="sticky top-0 z-40 bg-surface border-b border-border">
        <div className="container mx-auto px-6 py-4">
          {/* Back Button */}
          <button
            onClick={() => navigate('/main-dashboard')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex flex-wrap items-center gap-4">
            {/* Parameter Selector */}
            <div className="flex items-center space-x-2">
              {['Mean Temp', 'Min Temp', 'Max Temp', 'Anomaly'].map((param, index) => {
                const paramId = ['mean', 'min', 'max', 'anomaly'][index]
                return (
                  <button
                    key={paramId}
                    onClick={() => setActiveParam(paramId)}
                    className={`px-4 py-2 text-sm rounded-lg transition-all ${
                      activeParam === paramId
                        ? 'bg-blue-500 text-white'
                        : 'bg-card text-gray-400 hover:text-white border border-border'
                    }`}
                  >
                    {param}
                  </button>
                )
              })}
            </div>

            {/* Temporal Aggregation */}
            <div className="flex items-center space-x-2 border-l border-border pl-4">
              {['Monthly', 'Seasonal', 'Annual'].map((agg, index) => {
                const aggId = ['monthly', 'seasonal', 'annual'][index]
                return (
                  <button
                    key={aggId}
                    onClick={() => setActiveAggregation(aggId)}
                    className={`px-3 py-2 text-sm rounded-lg transition-all ${
                      activeAggregation === aggId
                        ? 'bg-card text-white border border-blue-500'
                        : 'bg-card text-gray-400 hover:text-white border border-border'
                    }`}
                  >
                    {agg}
                  </button>
                )
              })}
            </div>

            {/* Region Selector */}
            <select className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500">
              <option>National</option>
              <option>Punjab</option>
              <option>Sindh</option>
              <option>KPK</option>
              <option>Balochistan</option>
            </select>

            {/* Date Range */}
            <div className="flex items-center space-x-2">
              <input
                type="month"
                className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500"
                defaultValue="2024-01"
              />
              <span className="text-gray-400">to</span>
              <input
                type="month"
                className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500"
                defaultValue="2024-12"
              />
            </div>

            {/* Export Button */}
            <button className="ml-auto flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Primary Chart */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-white">Temperature Trend Analysis</h2>
              <button className="p-1 hover:bg-background rounded transition-colors">
                <Info className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-400">Current Year</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400">Previous Year</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-gray-400">Normal</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={temperatureTrendData}>
              <defs>
                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3142" />
              <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e2433',
                  border: '1px solid #2d3142',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey="current"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorCurrent)"
              />
              <Line
                type="monotone"
                dataKey="previous"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="normal"
                stroke="#6b7280"
                strokeWidth={1}
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Spatial Distribution Map */}
          <div className="lg:col-span-3 bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Spatial Distribution</h2>
              <select className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm text-gray-300">
                <option>October 2024</option>
                <option>September 2024</option>
                <option>August 2024</option>
              </select>
            </div>
            
            {/* Map Placeholder */}
            <div className="bg-background rounded-xl h-96 flex items-center justify-center relative">
              <div className="text-center text-gray-500">
                <MapPin className="w-16 h-16 mx-auto mb-2 text-blue-500/50" />
                <p>Temperature Distribution Map</p>
                <p className="text-sm">Color-coded by temperature ranges</p>
              </div>
              
              {/* Color Scale Legend */}
              <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-sm rounded-lg p-3">
                <div className="text-xs font-semibold text-white mb-2">Temperature (°C)</div>
                <div className="flex space-x-1">
                  {['#1e3a8a', '#3b82f6', '#22c55e', '#fbbf24', '#f97316', '#dc2626'].map((color, i) => (
                    <div key={i} className="w-8 h-4 rounded" style={{ backgroundColor: color }}></div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>10°</span>
                  <span>40°</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-bold text-white mb-4">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Mean', value: '28.5°C', icon: Activity },
                  { label: 'Std Dev', value: '±3.2°C', icon: TrendingUp },
                  { label: 'Maximum', value: '42.1°C', icon: TrendingUp },
                  { label: 'Minimum', value: '12.3°C', icon: Activity },
                  { label: 'Trend', value: '+1.2%', icon: TrendingUp },
                  { label: 'Completeness', value: '98%', icon: Activity },
                ].map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="bg-background rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-gray-400 uppercase">{stat.label}</span>
                      </div>
                      <div className="text-lg font-bold text-white">{stat.value}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Trend Chart */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-bold text-white mb-4">Long-term Trend</h3>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={temperatureTrendData}>
                  <Line
                    type="monotone"
                    dataKey="current"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Distribution Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Histogram */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-bold text-white mb-4">Frequency Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3142" />
                <XAxis dataKey="range" stroke="#9ca3af" style={{ fontSize: '11px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '11px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e2433',
                    border: '1px solid #2d3142',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Box Plot Placeholder */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-bold text-white mb-4">Monthly Box Plot</h3>
            <div className="h-64 bg-background rounded-xl flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-2 text-blue-500/50" />
                <p className="text-sm">Box plot visualization</p>
              </div>
            </div>
          </div>

          {/* Seasonal Comparison */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-bold text-white mb-4">Seasonal Comparison</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={seasonalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3142" />
                <XAxis dataKey="season" stroke="#9ca3af" style={{ fontSize: '11px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '11px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e2433',
                    border: '1px solid #2d3142',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Detailed Data View</h3>
            <button className="px-4 py-2 bg-background border border-border rounded-lg text-sm text-gray-300 hover:text-white hover:border-blue-500 transition-colors">
              Download CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Mean Temp</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Min</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Max</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Anomaly</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: 'Oct 2024', location: 'Lahore', mean: '28.5', min: '22.1', max: '34.2', anomaly: '+1.2' },
                  { date: 'Oct 2024', location: 'Karachi', mean: '30.2', min: '25.3', max: '35.8', anomaly: '+0.8' },
                  { date: 'Oct 2024', location: 'Islamabad', mean: '24.8', min: '18.2', max: '30.1', anomaly: '+1.5' },
                  { date: 'Oct 2024', location: 'Quetta', mean: '18.3', min: '10.5', max: '25.6', anomaly: '+0.5' },
                ].map((row, index) => (
                  <tr key={index} className={`border-b border-border/50 ${index % 2 === 0 ? 'bg-background/30' : ''}`}>
                    <td className="py-3 px-4 text-sm text-white">{row.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{row.location}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{row.mean}°C</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{row.min}°C</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{row.max}°C</td>
                    <td className="py-3 px-4 text-sm text-green-500">{row.anomaly}°C</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemperatureAnalysis

