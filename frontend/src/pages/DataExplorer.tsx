import { useState } from 'react'
import { ArrowLeft, Download, ChevronDown, ChevronRight, MapPin, Copy, Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const DataExplorer = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('preview')
  const [queryGenerated, setQueryGenerated] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    temperature: true,
    precipitation: false,
    heatStress: false,
    drought: false,
  })

  // Sample preview data
  const previewData = [
    { date: '2024-01', temp: 15.2, precip: 45, spei: -0.5 },
    { date: '2024-02', temp: 18.5, precip: 52, spei: -0.3 },
    { date: '2024-03', temp: 23.1, precip: 68, spei: 0.2 },
    { date: '2024-04', temp: 28.3, precip: 42, spei: -0.1 },
    { date: '2024-05', temp: 33.2, precip: 35, spei: -0.8 },
    { date: '2024-06', temp: 35.1, precip: 88, spei: 0.5 },
  ]

  const tableData = [
    { date: '2024-01-01', location: 'Lahore', temp: 15.2, precip: 2.1, spei: -0.5 },
    { date: '2024-01-02', location: 'Lahore', temp: 14.8, precip: 0.0, spei: -0.5 },
    { date: '2024-01-03', location: 'Lahore', temp: 16.1, precip: 3.5, spei: -0.4 },
    { date: '2024-01-04', location: 'Lahore', temp: 15.5, precip: 0.0, spei: -0.4 },
    { date: '2024-01-05', location: 'Lahore', temp: 14.2, precip: 1.2, spei: -0.4 },
  ]

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    })
  }

  const handleGenerateQuery = () => {
    setQueryGenerated(true)
    setActiveTab('preview')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-surface border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/main-dashboard')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Data Explorer</h1>
          <p className="text-gray-400">Build custom queries and download climate data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Query Builder Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Parameters Selection */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-bold text-white mb-4">Select Parameters</h3>
              
              {/* Temperature Section */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('temperature')}
                  className="w-full flex items-center justify-between py-2 text-white hover:text-blue-400 transition-colors"
                >
                  <span className="font-semibold">Temperature</span>
                  {expandedSections.temperature ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
                {expandedSections.temperature && (
                  <div className="mt-2 ml-4 space-y-2">
                    {['Mean Temperature', 'Min Temperature', 'Max Temperature', 'Temperature Anomaly'].map((param) => (
                      <label key={param} className="flex items-center space-x-2 text-sm text-gray-300">
                        <input type="checkbox" className="rounded" />
                        <span>{param}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Precipitation Section */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('precipitation')}
                  className="w-full flex items-center justify-between py-2 text-white hover:text-blue-400 transition-colors"
                >
                  <span className="font-semibold">Precipitation</span>
                  {expandedSections.precipitation ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
                {expandedSections.precipitation && (
                  <div className="mt-2 ml-4 space-y-2">
                    {['Total Precipitation', 'Wet Days', 'Precipitation Intensity'].map((param) => (
                      <label key={param} className="flex items-center space-x-2 text-sm text-gray-300">
                        <input type="checkbox" className="rounded" />
                        <span>{param}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Heat Stress Section */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('heatStress')}
                  className="w-full flex items-center justify-between py-2 text-white hover:text-blue-400 transition-colors"
                >
                  <span className="font-semibold">Heat Stress</span>
                  {expandedSections.heatStress ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
                {expandedSections.heatStress && (
                  <div className="mt-2 ml-4 space-y-2">
                    {['Heat Index', 'WBGT', 'Apparent Temperature'].map((param) => (
                      <label key={param} className="flex items-center space-x-2 text-sm text-gray-300">
                        <input type="checkbox" className="rounded" />
                        <span>{param}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Drought Section */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('drought')}
                  className="w-full flex items-center justify-between py-2 text-white hover:text-blue-400 transition-colors"
                >
                  <span className="font-semibold">Drought Indices</span>
                  {expandedSections.drought ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
                {expandedSections.drought && (
                  <div className="mt-2 ml-4 space-y-2">
                    {['SPEI-3', 'SPEI-6', 'SPEI-12', 'SPI-3', 'SPI-6'].map((param) => (
                      <label key={param} className="flex items-center space-x-2 text-sm text-gray-300">
                        <input type="checkbox" className="rounded" />
                        <span>{param}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Temporal Selection */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-bold text-white mb-4">Time Period</h3>
              
              <div className="space-y-4">
                {/* Time Aggregation */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Aggregation</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Daily', 'Monthly', 'Seasonal', 'Annual'].map((agg) => (
                      <button
                        key={agg}
                        className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-gray-300 hover:text-white hover:border-blue-500 transition-colors"
                      >
                        {agg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range Presets */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Quick Select</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500">
                    <option>Last Month</option>
                    <option>Last 3 Months</option>
                    <option>Last 6 Months</option>
                    <option>Last Year</option>
                    <option>Last 5 Years</option>
                    <option>Custom Range</option>
                  </select>
                </div>

                {/* Custom Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Custom Range</label>
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
              </div>
            </div>

            {/* Spatial Selection */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-bold text-white mb-4">Spatial Selection</h3>
              
              <div className="space-y-4">
                {/* Method Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Selection Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Admin', 'Map', 'Coords'].map((method) => (
                      <button
                        key={method}
                        className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-gray-300 hover:text-white hover:border-blue-500 transition-colors"
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Administrative Boundaries */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Province</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500">
                    <option>All Pakistan</option>
                    <option>Punjab</option>
                    <option>Sindh</option>
                    <option>KPK</option>
                    <option>Balochistan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">District</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500">
                    <option>Select District</option>
                    <option>Lahore</option>
                    <option>Karachi</option>
                    <option>Islamabad</option>
                  </select>
                </div>

                {/* Area Summary */}
                <div className="bg-background rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-400">Selected: </span>
                    <span className="text-white font-medium">All Pakistan</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Area: ~796,095 km²</div>
                </div>
              </div>
            </div>

            {/* Output Options */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-bold text-white mb-4">Output Options</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Format</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500">
                    <option>CSV</option>
                    <option>NetCDF</option>
                    <option>GeoJSON</option>
                    <option>JSON</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Aggregation Method</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500">
                    <option>Mean</option>
                    <option>Sum</option>
                    <option>Min</option>
                    <option>Max</option>
                    <option>Median</option>
                  </select>
                </div>

                <label className="flex items-center space-x-2 text-sm text-gray-300">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span>Include metadata</span>
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateQuery}
              className="w-full px-6 py-4 bg-gradient-primary text-white rounded-xl font-semibold text-lg hover:shadow-glow transition-all flex items-center justify-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>Generate Query</span>
            </button>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3">
            {queryGenerated ? (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                {/* Tab Navigation */}
                <div className="flex items-center border-b border-border">
                  {['Preview', 'Chart', 'Statistics', 'Query'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={`px-6 py-4 text-sm font-medium transition-colors ${
                        activeTab === tab.toLowerCase()
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-background'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'preview' && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white">Data Preview</h3>
                          <p className="text-sm text-gray-400">Showing first 100 rows</p>
                        </div>
                        <div className="text-sm text-gray-400">
                          Total rows: <span className="text-white font-semibold">1,825</span>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Date</th>
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Location</th>
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Temp (°C)</th>
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Precip (mm)</th>
                              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">SPEI</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tableData.map((row, index) => (
                              <tr key={index} className={`border-b border-border/50 ${index % 2 === 0 ? 'bg-background/30' : ''}`}>
                                <td className="py-3 px-4 text-sm text-white">{row.date}</td>
                                <td className="py-3 px-4 text-sm text-gray-300">{row.location}</td>
                                <td className="py-3 px-4 text-sm text-gray-300">{row.temp}</td>
                                <td className="py-3 px-4 text-sm text-gray-300">{row.precip}</td>
                                <td className="py-3 px-4 text-sm text-gray-300">{row.spei}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === 'chart' && (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4">Quick Visualization</h3>
                      <div className="flex items-center space-x-4 mb-4">
                        <select className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-gray-300">
                          <option>Line Chart</option>
                          <option>Bar Chart</option>
                          <option>Scatter Plot</option>
                        </select>
                        <select className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-gray-300">
                          <option>Temperature</option>
                          <option>Precipitation</option>
                          <option>SPEI</option>
                        </select>
                      </div>
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={previewData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#2d3142" />
                          <XAxis dataKey="date" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#1e2433',
                              border: '1px solid #2d3142',
                              borderRadius: '8px',
                            }}
                          />
                          <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {activeTab === 'statistics' && (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4">Summary Statistics</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { param: 'Temperature', count: 1825, mean: 24.8, std: 8.2, min: 8.5, max: 42.1, missing: 2 },
                          { param: 'Precipitation', count: 1825, mean: 52.3, std: 48.5, min: 0, max: 245, missing: 5 },
                          { param: 'SPEI', count: 1825, mean: -0.2, std: 1.1, min: -2.5, max: 2.1, missing: 0 },
                        ].map((stat) => (
                          <div key={stat.param} className="bg-background rounded-xl p-4">
                            <h4 className="font-semibold text-white mb-3">{stat.param}</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">Count:</span>
                                <span className="text-white">{stat.count}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Mean:</span>
                                <span className="text-white">{stat.mean}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Std Dev:</span>
                                <span className="text-white">{stat.std}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Min:</span>
                                <span className="text-white">{stat.min}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Max:</span>
                                <span className="text-white">{stat.max}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Missing:</span>
                                <span className="text-white">{stat.missing}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'query' && (
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4">API Query</h3>
                      <div className="space-y-4">
                        {/* Python Example */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-400">Python (geemap)</span>
                            <button className="flex items-center space-x-1 text-sm text-blue-500 hover:text-blue-400">
                              <Copy className="w-4 h-4" />
                              <span>Copy</span>
                            </button>
                          </div>
                          <div className="bg-background rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
                            <pre>{`import geemap
import ee

# Initialize Earth Engine
ee.Initialize()

# Define parameters
region = ee.Geometry.Rectangle([60.87, 23.69, 77.84, 37.13])
start_date = '2024-01-01'
end_date = '2024-06-30'

# Get ERA5 data
collection = ee.ImageCollection('ECMWF/ERA5_LAND/MONTHLY')
  .filterDate(start_date, end_date)
  .filterBounds(region)

# Extract temperature
data = collection.select('temperature_2m').mean()

# Download
geemap.ee_export_image(data, 'climate_data.tif')`}</pre>
                          </div>
                        </div>

                        {/* API Endpoint */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-400">REST API Endpoint</span>
                            <button className="flex items-center space-x-1 text-sm text-blue-500 hover:text-blue-400">
                              <Copy className="w-4 h-4" />
                              <span>Copy</span>
                            </button>
                          </div>
                          <div className="bg-background rounded-lg p-4 font-mono text-sm text-blue-400 overflow-x-auto">
                            https://api.climatepk.org/v1/data?params=temp,precip&region=pakistan&start=2024-01&end=2024-06&format=csv
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border p-4 bg-background/50 flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Query ready • Estimated size: 2.3 MB
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 bg-background border border-border rounded-lg text-sm text-gray-300 hover:text-white">
                      Save Query
                    </button>
                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Download Data</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border h-full flex items-center justify-center p-12">
                <div className="text-center text-gray-500">
                  <Database className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-lg mb-2">No Query Generated</p>
                  <p className="text-sm">Configure parameters and click "Generate Query" to preview data</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataExplorer

