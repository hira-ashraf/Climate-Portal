import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Thermometer, Droplets, Flame, CloudRain,
  AlertTriangle, Database, Settings, User, Calendar, ChevronDown,
  Bell, Download, TrendingUp, TrendingDown, MapPin
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MainDashboard = () => {
  const navigate = useNavigate()
  const [activeMenu, setActiveMenu] = useState('dashboard')

  // Sample data for charts
  const temperatureData = [
    { month: 'Jan', value: 15 },
    { month: 'Feb', value: 18 },
    { month: 'Mar', value: 23 },
    { month: 'Apr', value: 28 },
    { month: 'May', value: 33 },
    { month: 'Jun', value: 35 },
    { month: 'Jul', value: 34 },
    { month: 'Aug', value: 33 },
    { month: 'Sep', value: 31 },
    { month: 'Oct', value: 27 },
    { month: 'Nov', value: 21 },
    { month: 'Dec', value: 16 },
  ]

  const precipitationData = [
    { month: 'Jan', value: 45 },
    { month: 'Feb', value: 52 },
    { month: 'Mar', value: 68 },
    { month: 'Apr', value: 42 },
    { month: 'May', value: 35 },
    { month: 'Jun', value: 88 },
    { month: 'Jul', value: 195 },
    { month: 'Aug', value: 165 },
    { month: 'Sep', value: 78 },
    { month: 'Oct', value: 25 },
    { month: 'Nov', value: 18 },
    { month: 'Dec', value: 32 },
  ]

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/main-dashboard' },
    { id: 'temperature', label: 'Temperature', icon: Thermometer, path: '/temperature' },
    { id: 'precipitation', label: 'Precipitation', icon: Droplets, path: '/precipitation' },
    { id: 'heat-stress', label: 'Heat Stress', icon: Flame, path: '/heat-stress' },
    { id: 'drought', label: 'Drought', icon: CloudRain, path: '/drought' },
    { id: 'extreme-events', label: 'Extreme Events', icon: AlertTriangle, path: '/extreme-events' },
    { id: 'data-explorer', label: 'Data Explorer', icon: Database, path: '/data-explorer' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ]

  const kpiCards = [
    {
      label: 'Temperature',
      value: '28.5°C',
      trend: '+2.3%',
      trendUp: true,
      icon: Thermometer,
      color: 'text-red-500',
      bgColor: 'bg-red-500/20'
    },
    {
      label: 'Precipitation',
      value: '125mm',
      trend: '-5.1%',
      trendUp: false,
      icon: Droplets,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/20'
    },
    {
      label: 'Drought Index',
      value: '-0.8',
      trend: '+0.2',
      trendUp: false,
      icon: CloudRain,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/20'
    },
    {
      label: 'Heat Index',
      value: '32.1°C',
      trend: '+1.8%',
      trendUp: true,
      icon: Flame,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/20'
    },
  ]

  const recentAlerts = [
    { type: 'warning', text: 'High temperature alert', district: 'Jacobabad', time: '2h ago' },
    { type: 'danger', text: 'Extreme heat conditions', district: 'Sibi', time: '3h ago' },
    { type: 'info', text: 'Heavy rainfall expected', district: 'Lahore', time: '5h ago' },
    { type: 'warning', text: 'Drought conditions', district: 'Tharparkar', time: '1d ago' },
  ]

  const provinceData = [
    { province: 'Punjab', temp: '29.2', precip: '145', drought: '-0.5', status: 'normal' },
    { province: 'Sindh', temp: '32.1', precip: '98', drought: '-1.2', status: 'warning' },
    { province: 'KPK', temp: '26.5', precip: '178', drought: '0.2', status: 'normal' },
    { province: 'Balochistan', temp: '30.8', precip: '65', drought: '-1.8', status: 'danger' },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col">
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <MapPin className="w-8 h-8 text-blue-500" />
            <div>
              <div className="font-bold text-white">Climate Portal</div>
              <div className="text-xs text-gray-400">Pakistan</div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeMenu === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id)
                  navigate(item.path)
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400 hover:bg-card hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-card cursor-pointer transition-colors">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Admin User</div>
              <div className="text-xs text-gray-400">admin@climate.pk</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-18 bg-surface border-b border-border flex items-center justify-between px-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>Home</span>
            <span>/</span>
            <span className="text-white">Dashboard</span>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Date Range Picker */}
            <button className="flex items-center space-x-2 px-4 py-2 bg-card rounded-lg border border-border hover:border-blue-500/50 transition-colors">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">Last 30 days</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Region Selector */}
            <button className="flex items-center space-x-2 px-4 py-2 bg-card rounded-lg border border-border hover:border-blue-500/50 transition-colors">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">National</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Notification Bell */}
            <button className="relative p-2 hover:bg-card rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Export Button */}
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
            </button>

            {/* User Avatar */}
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {kpiCards.map((card, index) => {
              const Icon = card.icon
              return (
                <div
                  key={index}
                  className="bg-card rounded-xl border border-border p-6 hover:border-blue-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${card.bgColor} rounded-full flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                    <div className={`flex items-center space-x-1 text-sm ${
                      card.trendUp ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {card.trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span>{card.trend}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 uppercase mb-1">{card.label}</div>
                  <div className="text-3xl font-bold text-white">{card.value}</div>
                  {/* Mini sparkline placeholder */}
                  <div className="mt-4 h-3 flex items-end space-x-1">
                    {[40, 60, 55, 70, 65, 80, 75, 85].map((height, i) => (
                      <div
                        key={i}
                        className={`flex-1 ${card.bgColor} rounded-sm`}
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Main Visualization Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Interactive Map */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Spatial Distribution</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg">
                    Temperature
                  </button>
                  <button className="px-3 py-1 bg-card border border-border text-gray-400 text-xs rounded-lg hover:text-white">
                    Precipitation
                  </button>
                  <button className="px-3 py-1 bg-card border border-border text-gray-400 text-xs rounded-lg hover:text-white">
                    Drought
                  </button>
                </div>
              </div>
              
              {/* Map Placeholder */}
              <div className="bg-background rounded-lg h-80 flex items-center justify-center relative">
                <div className="text-center text-gray-500">
                  <MapPin className="w-16 h-16 mx-auto mb-2 text-blue-500/50" />
                  <p>Interactive Map</p>
                  <p className="text-sm">Pakistan Climate Zones</p>
                </div>
                
                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-sm rounded-lg p-3 text-xs">
                  <div className="font-semibold text-white mb-2">Temperature (°C)</div>
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    <span className="text-gray-400">&lt; 20</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-gray-400">20 - 30</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-600 rounded"></div>
                    <span className="text-gray-400">&gt; 30</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights Panel */}
            <div className="space-y-6">
              {/* Recent Alerts */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Alerts</h3>
                <div className="space-y-3">
                  {recentAlerts.map((alert, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-background rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${
                        alert.type === 'danger' ? 'bg-red-500' :
                        alert.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="text-sm text-white font-medium">{alert.text}</div>
                        <div className="text-xs text-gray-400 mt-1">{alert.district} · {alert.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Quality */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Data Quality</h3>
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-32 h-32 mb-2">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="#2d3142"
                        strokeWidth="8"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 56 * 0.96} ${2 * Math.PI * 56}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <div className="text-2xl font-bold text-white">96%</div>
                      <div className="text-xs text-gray-400">Complete</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Time Series Chart */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Temperature Trend - Last 12 Months</h3>
                <div className="flex space-x-2">
                  <button className="px-2 py-1 text-xs bg-background rounded text-gray-400 hover:text-white">1M</button>
                  <button className="px-2 py-1 text-xs bg-background rounded text-gray-400 hover:text-white">3M</button>
                  <button className="px-2 py-1 text-xs bg-background rounded text-gray-400 hover:text-white">6M</button>
                  <button className="px-2 py-1 text-xs bg-blue-500 text-white rounded">1Y</button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3142" />
                  <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e2433',
                      border: '1px solid #2d3142',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Monthly Precipitation</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={precipitationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3142" />
                  <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e2433',
                      border: '1px solid #2d3142',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Provincial Overview</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Province</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Temp (°C)</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Precipitation (mm)</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Drought Index</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {provinceData.map((row, index) => (
                    <tr
                      key={index}
                      className={`border-b border-border/50 ${
                        index % 2 === 0 ? 'bg-background/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-sm text-white font-medium">{row.province}</td>
                      <td className="py-3 px-4 text-sm text-gray-300">{row.temp}</td>
                      <td className="py-3 px-4 text-sm text-gray-300">{row.precip}</td>
                      <td className="py-3 px-4 text-sm text-gray-300">{row.drought}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          row.status === 'normal' ? 'bg-green-500/20 text-green-500' :
                          row.status === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-red-500/20 text-red-500'
                        }`}>
                          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainDashboard

