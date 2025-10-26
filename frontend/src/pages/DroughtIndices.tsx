import { useState } from 'react'
import { ArrowLeft, Download, MapPin, Play, AlertCircle, TrendingDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart
} from 'recharts'

const DroughtIndices = () => {
  const navigate = useNavigate()
  const [activeIndex, setActiveIndex] = useState('SPEI')
  const [timeScale, setTimeScale] = useState('3')

  // Sample data
  const droughtTimeSeriesData = Array.from({ length: 24 }, (_, i) => ({
    month: `M${i + 1}`,
    punjab: -0.5 + Math.random() * 2 - 1,
    sindh: -1.2 + Math.random() * 2 - 1,
    kpk: 0.2 + Math.random() * 2 - 1,
    balochistan: -1.5 + Math.random() * 2 - 1,
  }))

  const severityData = [
    { month: 'Jan', extreme: 5, severe: 8, moderate: 15, normal: 72 },
    { month: 'Feb', extreme: 8, severe: 12, moderate: 18, normal: 62 },
    { month: 'Mar', extreme: 12, severe: 18, moderate: 22, normal: 48 },
    { month: 'Apr', extreme: 15, severe: 22, moderate: 25, normal: 38 },
    { month: 'May', extreme: 18, severe: 25, moderate: 28, normal: 29 },
    { month: 'Jun', extreme: 20, severe: 28, moderate: 25, normal: 27 },
  ]

  const districtData = [
    { district: 'Tharparkar', index: -2.1, category: 'Extreme Drought', trend: 'down', duration: 8, population: '1.6M' },
    { district: 'Khairpur', index: -1.8, category: 'Severe Drought', trend: 'down', duration: 6, population: '2.4M' },
    { district: 'Lasbela', index: -1.5, category: 'Severe Drought', trend: 'stable', duration: 5, population: '0.5M' },
    { district: 'Umerkot', index: -1.2, category: 'Moderate Drought', trend: 'up', duration: 4, population: '1.1M' },
    { district: 'Badin', index: -1.0, category: 'Moderate Drought', trend: 'up', duration: 3, population: '1.8M' },
  ]

  const getCategoryColor = (category: string) => {
    if (category.includes('Extreme')) return 'bg-red-600/20 text-red-500'
    if (category.includes('Severe')) return 'bg-orange-600/20 text-orange-500'
    if (category.includes('Moderate')) return 'bg-yellow-600/20 text-yellow-500'
    return 'bg-green-600/20 text-green-500'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
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
            {/* Index Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveIndex('SPEI')}
                className={`px-6 py-2 text-sm rounded-lg font-semibold transition-all ${
                  activeIndex === 'SPEI'
                    ? 'bg-blue-500 text-white'
                    : 'bg-card text-gray-400 hover:text-white border border-border'
                }`}
              >
                SPEI
              </button>
              <button
                onClick={() => setActiveIndex('SPI')}
                className={`px-6 py-2 text-sm rounded-lg font-semibold transition-all ${
                  activeIndex === 'SPI'
                    ? 'bg-blue-500 text-white'
                    : 'bg-card text-gray-400 hover:text-white border border-border'
                }`}
              >
                SPI
              </button>
            </div>

            {/* Timescale Selector */}
            <div className="flex items-center space-x-2 border-l border-border pl-4">
              <span className="text-sm text-gray-400">Timescale:</span>
              {['1', '3', '6', '12', '24'].map((scale) => (
                <button
                  key={scale}
                  onClick={() => setTimeScale(scale)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    timeScale === scale
                      ? 'bg-blue-500 text-white'
                      : 'bg-card text-gray-400 hover:text-white'
                  }`}
                >
                  {scale}-month
                </button>
              ))}
            </div>

            {/* Date Selector */}
            <input
              type="month"
              className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500"
              defaultValue="2024-10"
            />

            <button className="p-2 bg-card border border-border rounded-lg hover:bg-background transition-colors">
              <AlertCircle className="w-5 h-5 text-gray-400" />
            </button>

            <button className="ml-auto flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Drought Map */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Drought Distribution Map</h2>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600">
                <Play className="w-4 h-4" />
                <span>Animate</span>
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Speed:</span>
                <input type="range" min="1" max="10" defaultValue="5" className="w-20" />
              </div>
            </div>
          </div>
          
          <div className="bg-background rounded-xl h-[500px] flex items-center justify-center relative">
            <div className="text-center text-gray-500">
              <MapPin className="w-16 h-16 mx-auto mb-2 text-orange-500/50" />
              <p className="text-lg">Drought Index Distribution</p>
              <p className="text-sm">Color-coded by {activeIndex} values</p>
            </div>
            
            {/* Drought Color Scale Legend */}
            <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
              <div className="text-xs font-semibold text-white mb-2">{activeIndex} Index</div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-3 bg-[#8B4513] rounded"></div>
                  <span className="text-gray-400">≤ -2.0 Extreme Drought</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-3 bg-[#D2691E] rounded"></div>
                  <span className="text-gray-400">-1.5 to -2.0 Severe</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-3 bg-[#DEB887] rounded"></div>
                  <span className="text-gray-400">-1.0 to -1.5 Moderate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-3 bg-gray-400 rounded"></div>
                  <span className="text-gray-400">-1.0 to 1.0 Normal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-3 bg-green-400 rounded"></div>
                  <span className="text-gray-400">1.0 to 1.5 Moderately Wet</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-3 bg-green-600 rounded"></div>
                  <span className="text-gray-400">1.5 to 2.0 Very Wet</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-3 bg-green-800 rounded"></div>
                  <span className="text-gray-400">≥ 2.0 Extremely Wet</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Time Series */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-bold text-white mb-4">Drought Index Evolution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={droughtTimeSeriesData}>
                <defs>
                  <linearGradient id="droughtGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="50%" stopColor="#6b7280" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3142" />
                <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '11px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '11px' }} domain={[-3, 3]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e2433',
                    border: '1px solid #2d3142',
                    borderRadius: '8px',
                  }}
                />
                {/* Drought threshold lines */}
                <Line type="monotone" dataKey={() => -1} stroke="#fbbf24" strokeWidth={1} strokeDasharray="3 3" dot={false} />
                <Line type="monotone" dataKey={() => 1} stroke="#10b981" strokeWidth={1} strokeDasharray="3 3" dot={false} />
                
                <Area type="monotone" dataKey="punjab" stroke="#3b82f6" strokeWidth={2} fill="url(#droughtGradient)" fillOpacity={0.3} />
                <Area type="monotone" dataKey="sindh" stroke="#f97316" strokeWidth={2} fill="none" />
                <Area type="monotone" dataKey="kpk" stroke="#10b981" strokeWidth={2} fill="none" />
                <Area type="monotone" dataKey="balochistan" stroke="#dc2626" strokeWidth={2} fill="none" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-400">Punjab</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-400">Sindh</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400">KPK</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span className="text-gray-400">Balochistan</span>
              </div>
            </div>
          </div>

          {/* Severity Breakdown */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-bold text-white mb-4">Area Under Drought (%)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={severityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3142" />
                <XAxis type="number" stroke="#9ca3af" style={{ fontSize: '11px' }} />
                <YAxis dataKey="month" type="category" stroke="#9ca3af" style={{ fontSize: '11px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e2433',
                    border: '1px solid #2d3142',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="extreme" stackId="a" fill="#7c2d12" />
                <Bar dataKey="severe" stackId="a" fill="#c2410c" />
                <Bar dataKey="moderate" stackId="a" fill="#fbbf24" />
                <Bar dataKey="normal" stackId="a" fill="#6b7280" />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#7c2d12] rounded"></div>
                <span className="text-gray-400">Extreme</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[#c2410c] rounded"></div>
                <span className="text-gray-400">Severe</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span className="text-gray-400">Moderate</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded"></div>
                <span className="text-gray-400">Normal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Affected Areas Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Area Under Drought', value: '145,320 km²', percent: '42%', icon: MapPin, color: 'orange' },
            { label: 'Most Affected District', value: 'Tharparkar', index: '-2.1', icon: AlertCircle, color: 'red' },
            { label: 'Current Drought Duration', value: '8 months', change: '+2', icon: TrendingDown, color: 'orange' },
            { label: 'vs Historical Average', value: '35% worse', change: 'Critical', icon: TrendingDown, color: 'red' },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-start justify-between mb-3">
                  <Icon className={`w-8 h-8 text-${stat.color}-500`} />
                </div>
                <div className="text-xs text-gray-400 uppercase mb-2">{stat.label}</div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">
                  {'percent' in stat && stat.percent}
                  {'index' in stat && `Index: ${stat.index}`}
                  {'change' in stat && stat.change}
                </div>
              </div>
            )
          })}
        </div>

        {/* District-Level Table */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">District-Level Drought Status</h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search districts..."
                className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500"
              />
              <button className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm text-gray-300 hover:text-white">
                Export CSV
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">District</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">{activeIndex} Index</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Trend</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Duration (months)</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Pop. Affected</th>
                </tr>
              </thead>
              <tbody>
                {districtData.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b border-border/50 ${index % 2 === 0 ? 'bg-background/30' : ''}`}
                  >
                    <td className="py-3 px-4 text-sm text-white font-medium">{row.district}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{row.index}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(row.category)}`}>
                        {row.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <TrendingDown className={`w-4 h-4 ${
                        row.trend === 'down' ? 'text-red-500' :
                        row.trend === 'up' ? 'text-green-500' : 'text-gray-500'
                      }`} />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-300">{row.duration}</td>
                    <td className="py-3 px-4 text-sm text-gray-300">{row.population}</td>
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

export default DroughtIndices

