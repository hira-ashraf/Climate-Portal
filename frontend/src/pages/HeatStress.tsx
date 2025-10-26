import { useState } from 'react'
import { ArrowLeft, Download, Flame, MapPin, AlertTriangle, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

const HeatStress = () => {
  const navigate = useNavigate()
  const [temperature, setTemperature] = useState('35')
  const [humidity, setHumidity] = useState('60')
  const [heatIndex, setHeatIndex] = useState<number | null>(null)
  const [riskCategory, setRiskCategory] = useState<string>('')

  // Sample data
  const heatDaysData = [
    { month: 'Jan', extreme: 0, danger: 0, caution: 5, normal: 26 },
    { month: 'Feb', extreme: 0, danger: 1, caution: 8, normal: 19 },
    { month: 'Mar', extreme: 0, danger: 2, caution: 12, normal: 17 },
    { month: 'Apr', extreme: 1, danger: 8, caution: 15, normal: 6 },
    { month: 'May', extreme: 5, danger: 15, caution: 10, normal: 1 },
    { month: 'Jun', extreme: 8, danger: 18, caution: 4, normal: 0 },
    { month: 'Jul', extreme: 6, danger: 20, caution: 5, normal: 0 },
    { month: 'Aug', extreme: 4, danger: 18, caution: 8, normal: 1 },
    { month: 'Sep', extreme: 2, danger: 10, caution: 12, normal: 6 },
    { month: 'Oct', extreme: 0, danger: 3, caution: 15, normal: 13 },
    { month: 'Nov', extreme: 0, danger: 0, caution: 8, normal: 22 },
    { month: 'Dec', extreme: 0, danger: 0, caution: 4, normal: 27 },
  ]

  const populationExposureData = [
    { name: 'Extreme Risk', value: 12, color: '#dc2626' },
    { name: 'High Risk', value: 28, color: '#f97316' },
    { name: 'Moderate Risk', value: 35, color: '#fbbf24' },
    { name: 'Low Risk', value: 25, color: '#10b981' },
  ]

  const trendData = Array.from({ length: 10 }, (_, i) => ({
    year: 2015 + i,
    days: 35 + i * 3 + Math.random() * 5,
  }))

  const calculateHeatIndex = () => {
    const T = parseFloat(temperature)
    const RH = parseFloat(humidity)
    
    // Simplified heat index calculation
    const HI = T + 0.5555 * ((6.11 * Math.exp(5417.7530 * ((1/273.16) - (1/(273.15 + T))))) * (RH / 100) - 10)
    
    setHeatIndex(parseFloat(HI.toFixed(1)))
    
    // Determine risk category
    if (HI > 54) setRiskCategory('extreme')
    else if (HI > 41) setRiskCategory('danger')
    else if (HI > 32) setRiskCategory('caution-extreme')
    else if (HI > 27) setRiskCategory('caution')
    else setRiskCategory('normal')
  }

  const getRiskColor = (category: string) => {
    switch (category) {
      case 'extreme': return 'bg-red-600 text-white'
      case 'danger': return 'bg-orange-500 text-white'
      case 'caution-extreme': return 'bg-yellow-500 text-black'
      case 'caution': return 'bg-green-500 text-white'
      default: return 'bg-blue-500 text-white'
    }
  }

  const getRiskLabel = (category: string) => {
    switch (category) {
      case 'extreme': return 'Extreme Danger'
      case 'danger': return 'Danger'
      case 'caution-extreme': return 'Extreme Caution'
      case 'caution': return 'Caution'
      default: return 'Normal'
    }
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
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white">
                Heat Index
              </button>
              <button className="px-4 py-2 text-sm rounded-lg bg-card text-gray-400 hover:text-white border border-border">
                WBGT
              </button>
              <button className="px-4 py-2 text-sm rounded-lg bg-card text-gray-400 hover:text-white border border-border">
                Apparent Temperature
              </button>
            </div>

            <select className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-gray-300">
              <option>National</option>
              <option>Punjab</option>
              <option>Sindh</option>
            </select>

            <button className="ml-auto flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Heat Index Calculator */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-xl font-bold text-white mb-6">Heat Index Calculator</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Inputs */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter temperature"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Relative Humidity (%)
                </label>
                <input
                  type="number"
                  value={humidity}
                  onChange={(e) => setHumidity(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter humidity"
                />
              </div>
              <button
                onClick={calculateHeatIndex}
                className="w-full px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold hover:shadow-glow transition-all"
              >
                Calculate Heat Index
              </button>
              
              {heatIndex !== null && (
                <div className="bg-background rounded-xl p-6 border-2 border-orange-500/50">
                  <div className="text-sm text-gray-400 mb-2">Heat Index Result</div>
                  <div className="text-4xl font-bold text-white mb-3">{heatIndex}°C</div>
                  <div className={`inline-block px-4 py-2 rounded-lg font-semibold ${getRiskColor(riskCategory)}`}>
                    {getRiskLabel(riskCategory)}
                  </div>
                </div>
              )}
            </div>

            {/* Risk Categories Legend */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white mb-4">Risk Categories</h3>
              {[
                { label: 'Extreme Danger', range: '> 54°C', color: 'bg-red-600', desc: 'Heat stroke highly likely' },
                { label: 'Danger', range: '41-54°C', color: 'bg-orange-500', desc: 'Heat exhaustion and cramps likely' },
                { label: 'Extreme Caution', range: '32-41°C', color: 'bg-yellow-500', desc: 'Heat exhaustion possible' },
                { label: 'Caution', range: '27-32°C', color: 'bg-green-500', desc: 'Fatigue possible with activity' },
                { label: 'Normal', range: '< 27°C', color: 'bg-blue-500', desc: 'No significant risk' },
              ].map((category, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-background rounded-lg">
                  <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">{category.label}</span>
                      <span className="text-sm text-gray-400">{category.range}</span>
                    </div>
                    <div className="text-sm text-gray-400">{category.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spatial Distribution */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Spatial Heat Index Distribution</h2>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg">Today</button>
              <button className="px-3 py-1 bg-background text-gray-400 text-xs rounded-lg hover:text-white">Weekly</button>
              <button className="px-3 py-1 bg-background text-gray-400 text-xs rounded-lg hover:text-white">Monthly</button>
            </div>
          </div>
          
          <div className="bg-background rounded-xl h-96 flex items-center justify-center relative">
            <div className="text-center text-gray-500">
              <MapPin className="w-16 h-16 mx-auto mb-2 text-orange-500/50" />
              <p>Heat Index Distribution Map</p>
            </div>
            
            {/* Color Scale Legend */}
            <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-sm rounded-lg p-3">
              <div className="text-xs font-semibold text-white mb-2">Heat Index (°C)</div>
              <div className="flex space-x-1">
                {['#3b82f6', '#10b981', '#fbbf24', '#f97316', '#dc2626'].map((color, i) => (
                  <div key={i} className="w-10 h-4 rounded" style={{ backgroundColor: color }}></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>&lt;27</span>
                <span>&gt;54</span>
              </div>
            </div>
          </div>
        </div>

        {/* Three Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Days Above Threshold */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-bold text-white mb-4">Days Above Threshold</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={heatDaysData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3142" />
                <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '10px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '10px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e2433',
                    border: '1px solid #2d3142',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="extreme" stackId="a" fill="#dc2626" />
                <Bar dataKey="danger" stackId="a" fill="#f97316" />
                <Bar dataKey="caution" stackId="a" fill="#fbbf24" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Population Exposure */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-bold text-white mb-4">Population Exposure</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={populationExposureData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {populationExposureData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {populationExposureData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-400">{item.name}</span>
                  </div>
                  <span className="text-white font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Analysis */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-bold text-white mb-4">Long-term Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
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
                <Line
                  type="monotone"
                  dataKey="days"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ fill: '#f97316', r: 4 }}
                  name="Heat Stress Days"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-orange-500/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <span className="text-sm text-orange-400">+45% increase in last decade</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Panel */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Users className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-bold text-white">Public Health Advisories</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'High Risk Areas',
                items: ['Jacobabad District', 'Sibi District', 'Turbat District'],
                color: 'red'
              },
              {
                title: 'Vulnerable Groups',
                items: ['Outdoor workers', 'Elderly population', 'Children under 5'],
                color: 'orange'
              },
              {
                title: 'Recommendations',
                items: ['Stay hydrated', 'Avoid outdoor activities 12-4pm', 'Use cooling centers'],
                color: 'blue'
              },
            ].map((section, index) => (
              <div key={index} className="bg-background rounded-xl p-4">
                <h4 className={`text-sm font-semibold text-${section.color}-500 mb-3`}>
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="text-sm text-gray-400 flex items-start space-x-2">
                      <span className={`w-1.5 h-1.5 rounded-full bg-${section.color}-500 mt-1.5 flex-shrink-0`}></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeatStress

