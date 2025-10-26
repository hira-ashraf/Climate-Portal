import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { getMapData } from '@/lib/api'
import { format } from 'date-fns'
import { MapPin, Calendar, Layers, Sparkles, ChevronDown } from 'lucide-react'

const MapViewer = () => {
  const [variable, setVariable] = useState('temperature')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM'))

  const { data: mapData, isLoading } = useQuery({
    queryKey: ['map-data', variable, date],
    queryFn: () => getMapData(variable, date, 1),
  })

  const getColor = (value: number | null) => {
    if (value === null) return '#6b7280'
    
    if (variable === 'temperature') {
      if (value < 10) return '#3b82f6'
      if (value < 20) return '#00af66'
      if (value < 30) return '#ffb900'
      return '#ef4444'
    } else if (variable === 'precipitation') {
      if (value < 25) return '#fef3c7'
      if (value < 50) return '#93c5fd'
      if (value < 100) return '#3b82f6'
      return '#1e40af'
    }
    return '#6b7280'
  }

  const variables = [
    { value: 'temperature', label: 'Temperature', icon: '🌡️', unit: '°C' },
    { value: 'precipitation', label: 'Precipitation', icon: '💧', unit: 'mm' },
    { value: 'humidity', label: 'Humidity', icon: '💨', unit: '%' },
    { value: 'wind_speed', label: 'Wind Speed', icon: '🌪️', unit: 'm/s' },
    { value: 'solar_radiation', label: 'Solar Radiation', icon: '☀️', unit: 'W/m²' },
  ]

  const currentVariable = variables.find(v => v.value === variable)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Interactive Climate Map
          </h1>
          <p className="text-base text-gray-600 dark:text-dark-300 flex items-center space-x-2">
            <MapPin size={18} className="text-primary-500" />
            <span>Visualize climate data across Pakistan regions</span>
          </p>
        </div>
        
        {/* Live Badge */}
        <div className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg self-start lg:self-auto">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-white uppercase tracking-wide">Real-time Data</span>
        </div>
      </div>

      {/* Controls Card */}
      <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-5">
          <Layers className="text-primary-500" size={22} />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Map Controls</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Climate Variable Selector */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-dark-300 mb-3">
              Climate Variable
            </label>
            <div className="relative">
              <select
                value={variable}
                onChange={(e) => setVariable(e.target.value)}
                className="w-full appearance-none px-4 py-3.5 pr-10 rounded-xl border-2 border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium cursor-pointer"
              >
                {variables.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.icon} {v.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-dark-300 pointer-events-none" size={20} />
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-dark-300 mb-3">
              Date (Year-Month)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-primary-500 z-10 pointer-events-none" size={18} />
              <input
                type="month"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={format(new Date(), 'yyyy-MM')}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Current Selection Display */}
        <div className="mt-5 flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border border-primary-200 dark:border-primary-800/30">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{currentVariable?.icon}</span>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-dark-300">Currently Viewing</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {currentVariable?.label} ({currentVariable?.unit})
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600 dark:text-dark-300">Date</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {format(new Date(date + '-01'), 'MMM yyyy')}
            </p>
          </div>
        </div>
      </div>

      {/* Legend Card */}
      <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-lg p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <span className="text-sm font-bold text-gray-700 dark:text-dark-300 uppercase tracking-wider">Color Scale:</span>
          <div className="flex items-center space-x-4 flex-wrap gap-2">
            {variable === 'temperature' ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-5 rounded-md shadow-sm" style={{ backgroundColor: '#3b82f6' }}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-dark-200">Cold (&lt;10°C)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-5 rounded-md shadow-sm" style={{ backgroundColor: '#00af66' }}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-dark-200">Mild (10-20°C)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-5 rounded-md shadow-sm" style={{ backgroundColor: '#ffb900' }}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-dark-200">Warm (20-30°C)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-5 rounded-md shadow-sm" style={{ backgroundColor: '#ef4444' }}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-dark-200">Hot (&gt;30°C)</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-5 rounded-md shadow-sm" style={{ backgroundColor: '#fef3c7' }}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-dark-200">Very Low</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-5 rounded-md shadow-sm" style={{ backgroundColor: '#93c5fd' }}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-dark-200">Low</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-5 rounded-md shadow-sm" style={{ backgroundColor: '#3b82f6' }}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-dark-200">Moderate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-5 rounded-md shadow-sm" style={{ backgroundColor: '#1e40af' }}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-dark-200">High</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Map Card */}
      <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="h-[600px] flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary-500/30 border-t-primary-500"></div>
              <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary-500" size={28} />
            </div>
            <p className="text-gray-600 dark:text-dark-300 font-medium">Loading map data...</p>
          </div>
        ) : (
          <div className="h-[600px] relative">
            <MapContainer
              center={[30.3753, 69.3451]}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {mapData && (
                <GeoJSON
                  data={mapData as any}
                  style={(feature) => ({
                    fillColor: getColor(feature?.properties?.climate_value),
                    weight: 2,
                    opacity: 1,
                    color: '#ffffff',
                    fillOpacity: 0.75,
                  })}
                  onEachFeature={(feature, layer) => {
                    const props = feature.properties
                    layer.bindPopup(`
                      <div class="p-4 min-w-[200px]">
                        <strong class="text-primary-500 text-lg font-bold block mb-2">${props.name}</strong>
                        <div class="flex items-center justify-between">
                          <span class="text-gray-600 font-medium">${props.climate_variable}:</span>
                          <span class="text-gray-900 font-bold text-lg">${props.climate_value?.toFixed(2) || 'N/A'}</span>
                        </div>
                      </div>
                    `)
                  }}
                />
              )}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  )
}

export default MapViewer
