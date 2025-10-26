import { useState } from 'react'
import { ArrowLeft, Download, MapPin, Droplets, CloudRain } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, BarChart
} from 'recharts'

const PrecipitationAnalysis = () => {
  const navigate = useNavigate()
  const [activeParam, setActiveParam] = useState('total')

  // Sample data
  const precipitationData = [
    { month: 'Jan', amount: 45, wetDays: 8, normal: 40 },
    { month: 'Feb', amount: 52, wetDays: 9, normal: 48 },
    { month: 'Mar', amount: 68, wetDays: 11, normal: 65 },
    { month: 'Apr', amount: 42, wetDays: 7, normal: 45 },
    { month: 'May', amount: 35, wetDays: 5, normal: 38 },
    { month: 'Jun', amount: 88, wetDays: 12, normal: 75 },
    { month: 'Jul', amount: 195, wetDays: 18, normal: 180 },
    { month: 'Aug', amount: 165, wetDays: 16, normal: 155 },
    { month: 'Sep', amount: 78, wetDays: 10, normal: 70 },
    { month: 'Oct', amount: 25, wetDays: 4, normal: 28 },
    { month: 'Nov', amount: 18, wetDays: 3, normal: 20 },
    { month: 'Dec', amount: 32, wetDays: 6, normal: 35 },
  ]

  const monsoonData = [
    { day: 1, accumulated: 15, expected: 12 },
    { day: 15, accumulated: 85, expected: 78 },
    { day: 30, accumulated: 165, expected: 155 },
    { day: 45, accumulated: 285, expected: 268 },
    { day: 60, accumulated: 425, expected: 395 },
    { day: 75, accumulated: 530, expected: 512 },
    { day: 90, accumulated: 615, expected: 605 },
    { day: 105, accumulated: 680, expected: 675 },
    { day: 120, accumulated: 728, expected: 720 },
  ]

  const extremeEvents = [
    { date: 'Aug 15, 2024', location: 'Lahore', amount: '145mm', severity: 'High' },
    { date: 'Jul 28, 2024', location: 'Islamabad', amount: '120mm', severity: 'High' },
    { date: 'Jul 12, 2024', location: 'Peshawar', amount: '95mm', severity: 'Medium' },
    { date: 'Jun 22, 2024', location: 'Rawalpindi', amount: '88mm', severity: 'Medium' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Top Controls Bar */}
      <div className="sticky top-0 z-40 bg-surface border-b border-border">
        <div className="container mx-auto px-6 py-4">
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
              {['Total Precipitation', 'Wet Days', 'Dry Days', 'Anomaly', 'Intensity'].map((param, index) => {
                const paramId = ['total', 'wetdays', 'drydays', 'anomaly', 'intensity'][index]
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

            {/* Region Selector */}
            <select className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500">
              <option>National</option>
              <option>Punjab</option>
              <option>Sindh</option>
              <option>KPK</option>
              <option>Balochistan</option>
            </select>

            {/* View Toggle */}
            <div className="flex items-center space-x-2 border-l border-border pl-4">
              <button className="px-3 py-2 text-sm rounded-lg bg-blue-500 text-white">
                Daily
              </button>
              <button className="px-3 py-2 text-sm rounded-lg bg-card text-gray-400 hover:text-white border border-border">
                Monthly
              </button>
              <button className="px-3 py-2 text-sm rounded-lg bg-card text-gray-400 hover:text-white border border-border">
                Seasonal
              </button>
            </div>

            <button className="ml-auto flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Combined Chart */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Precipitation Analysis</h2>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-gray-400">Precipitation Amount</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-400">Wet Days</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-gray-400">Normal</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={precipitationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3142" />
              <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="left" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e2433',
                  border: '1px solid #2d3142',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="amount" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Precipitation (mm)" />
              <Line yAxisId="right" type="monotone" dataKey="wetDays" stroke="#f97316" strokeWidth={2} name="Wet Days" />
              <Line yAxisId="left" type="monotone" dataKey="normal" stroke="#6b7280" strokeWidth={1} strokeDasharray="5 5" name="Normal" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rainfall Map */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Spatial Distribution</h3>
              <button className="text-xs px-3 py-1 bg-blue-500 text-white rounded-lg">
                Animate
              </button>
            </div>
            <div className="bg-background rounded-xl h-64 flex items-center justify-center relative">
              <div className="text-center text-gray-500">
                <Droplets className="w-12 h-12 mx-auto mb-2 text-blue-500/50" />
                <p className="text-sm">Precipitation Map</p>
              </div>
              
              {/* Legend */}
              <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-sm rounded-lg p-2 text-xs">
                <div className="font-semibold text-white mb-1">Rainfall (mm)</div>
                <div className="flex space-x-0.5">
                  {['#eff6ff', '#bfdbfe', '#60a5fa', '#2563eb', '#1e40af', '#1e3a8a'].map((color, i) => (
                    <div key={i} className="w-6 h-3" style={{ backgroundColor: color }}></div>
                  ))}
                </div>
                <div className="flex justify-between mt-1 text-gray-400">
                  <span>0</span>
                  <span>200+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seasonal Pattern */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-bold text-white mb-4">Seasonal Pattern</h3>
            <div className="bg-background rounded-xl h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto">
                  {/* Circular chart placeholder */}
                  <div className="absolute inset-0 rounded-full border-8 border-background"></div>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <CloudRain className="w-12 h-12 text-blue-500 mb-2" />
                    <div className="text-xs text-gray-400">Monsoon Season</div>
                    <div className="text-lg font-bold text-white">Jun-Sep</div>
                  </div>
                  {/* Season indicators */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-xs text-blue-400 font-semibold">Summer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              {[
                { label: 'Total Annual', value: '843 mm', color: 'blue' },
                { label: 'Wettest Month', value: 'July (195mm)', color: 'cyan' },
                { label: 'Driest Month', value: 'Nov (18mm)', color: 'orange' },
                { label: '% Change from Normal', value: '+8.2%', color: 'green' },
              ].map((stat, index) => (
                <div key={index} className="bg-background rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">{stat.label}</div>
                      <div className="text-lg font-bold text-white">{stat.value}</div>
                    </div>
                    <Droplets className={`w-8 h-8 text-${stat.color}-500/50`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monsoon Analysis */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Monsoon Performance</h2>
            <div className="px-4 py-2 bg-green-500/20 text-green-500 rounded-lg text-sm font-semibold">
              112% of Expected Rainfall
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={monsoonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3142" />
              <XAxis
                dataKey="day"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                label={{ value: 'Days from June 1', position: 'insideBottom', offset: -5 }}
              />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e2433',
                  border: '1px solid #2d3142',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="accumulated"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Accumulated Rainfall (mm)"
                dot={{ fill: '#3b82f6', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="expected"
                stroke="#6b7280"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Expected (Normal)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Extreme Events */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-lg font-bold text-white mb-6">Heavy Precipitation Events</h3>
          <div className="space-y-4">
            {extremeEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-background rounded-lg hover:border hover:border-blue-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    event.severity === 'High' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                  }`}>
                    <Droplets className={`w-6 h-6 ${
                      event.severity === 'High' ? 'text-red-500' : 'text-yellow-500'
                    }`} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{event.location}</div>
                    <div className="text-xs text-gray-400">{event.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{event.amount}</div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    event.severity === 'High'
                      ? 'bg-red-500/20 text-red-500'
                      : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {event.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrecipitationAnalysis

