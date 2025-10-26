import { useState } from 'react'
import { ArrowLeft, Download, Flame, Droplets, Snowflake, Calendar, MapPin, Clock, AlertTriangle, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const ExtremeEvents = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [selectedEvents, setSelectedEvents] = useState<number[]>([])

  // Sample data
  const events = [
    {
      id: 1,
      type: 'heatwave',
      title: 'Severe Heatwave',
      startDate: '2024-06-15',
      endDate: '2024-06-22',
      duration: 8,
      locations: ['Jacobabad', 'Sibi', 'Dadu'],
      maxIntensity: '51.2°C',
      population: '2.5M',
      severity: 'extreme',
    },
    {
      id: 2,
      type: 'precipitation',
      title: 'Heavy Monsoon Rainfall',
      startDate: '2024-07-28',
      endDate: '2024-07-30',
      duration: 3,
      locations: ['Lahore', 'Islamabad', 'Rawalpindi'],
      maxIntensity: '195mm',
      population: '8.5M',
      severity: 'high',
    },
    {
      id: 3,
      type: 'heatwave',
      title: 'Extended Heat Period',
      startDate: '2024-05-10',
      endDate: '2024-05-20',
      duration: 11,
      locations: ['Multan', 'Bahawalpur', 'Rahim Yar Khan'],
      maxIntensity: '48.5°C',
      population: '4.2M',
      severity: 'high',
    },
    {
      id: 4,
      type: 'coldspell',
      title: 'Cold Wave',
      startDate: '2024-01-05',
      endDate: '2024-01-12',
      duration: 8,
      locations: ['Quetta', 'Kalat', 'Ziarat'],
      maxIntensity: '-8°C',
      population: '1.2M',
      severity: 'medium',
    },
  ]

  const frequencyData = Array.from({ length: 10 }, (_, i) => ({
    year: 2015 + i,
    heatwaves: 8 + Math.floor(Math.random() * 5),
    heavyRain: 12 + Math.floor(Math.random() * 6),
    coldSpells: 4 + Math.floor(Math.random() * 3),
  }))

  const durationData = [
    { type: 'Heatwaves', avgDays: 8.5 },
    { type: 'Heavy Rain', avgDays: 3.2 },
    { type: 'Cold Spells', avgDays: 6.8 },
    { type: 'Drought', avgDays: 45 },
  ]

  const monthlyPattern = [
    { month: 'Jan', count: 3 },
    { month: 'Feb', count: 2 },
    { month: 'Mar', count: 4 },
    { month: 'Apr', count: 6 },
    { month: 'May', count: 12 },
    { month: 'Jun', count: 15 },
    { month: 'Jul', count: 18 },
    { month: 'Aug', count: 14 },
    { month: 'Sep', count: 8 },
    { month: 'Oct', count: 5 },
    { month: 'Nov', count: 3 },
    { month: 'Dec', count: 4 },
  ]

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'heatwave': return Flame
      case 'precipitation': return Droplets
      case 'coldspell': return Snowflake
      default: return AlertTriangle
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'heatwave': return 'text-red-500 bg-red-500/20'
      case 'precipitation': return 'text-blue-500 bg-blue-500/20'
      case 'coldspell': return 'text-cyan-500 bg-cyan-500/20'
      default: return 'text-gray-500 bg-gray-500/20'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme': return 'bg-red-600/20 text-red-500'
      case 'high': return 'bg-orange-500/20 text-orange-500'
      case 'medium': return 'bg-yellow-500/20 text-yellow-500'
      default: return 'bg-green-500/20 text-green-500'
    }
  }

  const filteredEvents = activeTab === 'all' ? events : events.filter(e => e.type === activeTab)

  const tabs = [
    { id: 'all', label: 'All Events', count: events.length },
    { id: 'heatwave', label: 'Heatwaves', count: events.filter(e => e.type === 'heatwave').length },
    { id: 'precipitation', label: 'Heavy Precipitation', count: events.filter(e => e.type === 'precipitation').length },
    { id: 'coldspell', label: 'Cold Spells', count: events.filter(e => e.type === 'coldspell').length },
  ]

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

          {/* Tab Navigation */}
          <div className="flex items-center space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-card text-gray-400 hover:text-white border border-border'
                }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-0.5 bg-background/50 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Timeline - 2 columns */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Event Timeline</h2>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>

            {/* Events List */}
            <div className="space-y-4">
              {filteredEvents.map((event) => {
                const Icon = getEventIcon(event.type)
                return (
                  <div
                    key={event.id}
                    className="bg-card rounded-xl border border-border p-6 hover:border-blue-500/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Event Icon */}
                      <div className={`w-14 h-14 rounded-xl ${getEventColor(event.type)} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-7 h-7" />
                      </div>

                      {/* Event Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-1">{event.title}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{event.startDate} to {event.endDate}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{event.duration} days</span>
                              </span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(event.severity)}`}>
                            {event.severity.toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div>
                            <div className="text-xs text-gray-400 mb-1">Locations</div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-blue-400" />
                              <span className="text-sm text-white">{event.locations[0]}</span>
                              {event.locations.length > 1 && (
                                <span className="text-xs text-gray-400">+{event.locations.length - 1}</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400 mb-1">Max Intensity</div>
                            <div className="text-sm font-semibold text-white">{event.maxIntensity}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400 mb-1">Population</div>
                            <div className="text-sm font-semibold text-white">{event.population}</div>
                          </div>
                        </div>

                        <button className="mt-4 flex items-center space-x-2 text-sm text-blue-500 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>View Details</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(event.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedEvents([...selectedEvents, event.id])
                          } else {
                            setSelectedEvents(selectedEvents.filter(id => id !== event.id))
                          }
                        }}
                        className="mt-2 w-4 h-4"
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Comparison Tool */}
            {selectedEvents.length > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-white">{selectedEvents.length} events selected</span>
                  <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm">
                    Compare Events
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Filter & Stats Panel - 1 column */}
          <div className="space-y-6">
            {/* Filter Panel */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-bold text-white mb-4">Filters</h3>
              
              <div className="space-y-4">
                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Date Range</label>
                  <div className="space-y-2">
                    <input
                      type="date"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="date"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Severity Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Severity</label>
                  <div className="space-y-2">
                    {['Extreme', 'High', 'Medium', 'Low'].map((severity) => (
                      <label key={severity} className="flex items-center space-x-2 text-sm text-gray-300">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span>{severity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500">
                    <option>All Pakistan</option>
                    <option>Punjab</option>
                    <option>Sindh</option>
                    <option>KPK</option>
                    <option>Balochistan</option>
                  </select>
                </div>

                {/* Duration Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Duration (days)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-1/2 px-3 py-2 bg-background border border-border rounded-lg text-sm text-gray-300"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-1/2 px-3 py-2 bg-background border border-border rounded-lg text-sm text-gray-300"
                    />
                  </div>
                </div>

                <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium">
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="bg-background rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Total Events (2024)</div>
                  <div className="text-2xl font-bold text-white">94</div>
                </div>
                <div className="bg-background rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Most Common Type</div>
                  <div className="text-lg font-semibold text-white">Heatwaves</div>
                </div>
                <div className="bg-background rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Avg Duration</div>
                  <div className="text-lg font-semibold text-white">6.8 days</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Frequency Trend */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-bold text-white mb-4">Frequency Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={frequencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3142" />
                <XAxis dataKey="year" stroke="#9ca3af" style={{ fontSize: '10px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '10px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e2433',
                    border: '1px solid #2d3142',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="heatwaves" stroke="#dc2626" strokeWidth={2} />
                <Line type="monotone" dataKey="heavyRain" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="coldSpells" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Average Duration */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-bold text-white mb-4">Average Duration</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={durationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3142" />
                <XAxis dataKey="type" stroke="#9ca3af" style={{ fontSize: '10px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '10px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e2433',
                    border: '1px solid #2d3142',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="avgDays" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Seasonal Pattern */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-bold text-white mb-4">Seasonal Pattern</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyPattern}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3142" />
                <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '9px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '10px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e2433',
                    border: '1px solid #2d3142',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExtremeEvents

