import { useQuery } from '@tanstack/react-query'
import { getMapData, getStatistics } from '@/lib/api'
import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { 
  Droplets,
  Activity,
  Layers as LayersIcon,
  MapPin,
  Gauge,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  GripVertical
} from 'lucide-react'
import { format } from 'date-fns'

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM'))
  const [showLeftSidebar, setShowLeftSidebar] = useState(true)
  const [showRightPanel, setShowRightPanel] = useState(false) // Floating modal - OFF by default
  const [leftWidth, setLeftWidth] = useState(280) // Minimal default width
  const [isResizingLeft, setIsResizingLeft] = useState(false)
  const [showDataLayer, setShowDataLayer] = useState(false) // Only show data when user requests it
  
  const { data: mapData } = useQuery({
    queryKey: ['map-data', 'temperature', selectedDate],
    queryFn: () => getMapData('temperature', selectedDate, 1),
    enabled: showDataLayer, // Only fetch when user wants to see data
  })

  const { data: stats } = useQuery({
    queryKey: ['statistics'],
    queryFn: () => getStatistics('current_month'),
  })

  const getColor = (value: number | null) => {
    if (value === null) return '#6b7280'
    if (value < 10) return '#3b82f6'
    if (value < 20) return '#00af66'
    if (value < 30) return '#ffb900'
    return '#ef4444'
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft) {
        const newWidth = e.clientX
        // Allow from 240px to 700px for more flexibility
        if (newWidth >= 240 && newWidth <= 700) {
          setLeftWidth(newWidth)
        }
      }
    }

    const handleMouseUp = () => {
      setIsResizingLeft(false)
    }

    if (isResizingLeft) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizingLeft])

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      {/* LEFT SIDEBAR */}
      {showLeftSidebar && (
        <div 
          className="bg-[#1a1a1a] border-r border-gray-800 overflow-y-auto flex-shrink-0 relative"
          style={{ width: `${leftWidth}px` }}
        >
          <div className="p-3 space-y-2">
            {/* Main Location Card */}
            <div className="bg-[#252525] rounded-lg p-3 border border-gray-800">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="text-cyan-400" size={14} />
                  <span className="text-white font-semibold text-sm">Punjab</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-1">Pakistan</p>
              <div className="text-right">
                <span className="text-3xl font-bold text-white">
                  {stats?.avg_temperature?.toFixed(1) || '--'}
                </span>
                <span className="text-xl text-gray-400">°C</span>
              </div>
            </div>

            {/* Metric Cards */}
            <div className="bg-[#252525] rounded-lg p-2.5 border border-gray-800">
              <div className="flex items-center space-x-1.5 mb-0.5">
                <Gauge className="text-gray-400" size={14} />
                <span className="text-white text-xs">Soil</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">Medium</p>
              <div className="text-right">
                <span className="text-2xl font-bold text-white">45.2</span>
                <span className="text-sm text-gray-400">%</span>
              </div>
            </div>

            <div className="bg-[#252525] rounded-lg p-2.5 border border-gray-800">
              <div className="flex items-center space-x-1.5 mb-0.5">
                <Droplets className="text-blue-400" size={14} />
                <span className="text-white text-xs">Precipitation</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">Normal</p>
              <div className="text-right">
                <span className="text-2xl font-bold text-white">
                  {stats?.total_precipitation?.toFixed(0) || '--'}
                </span>
                <span className="text-sm text-gray-400">mm</span>
              </div>
            </div>

            <div className="bg-[#252525] rounded-lg p-2.5 border border-gray-800">
              <div className="flex items-center space-x-1.5 mb-0.5">
                <Activity className="text-cyan-400" size={14} />
                <span className="text-white text-xs">Humidity</span>
              </div>
              <p className="text-xs text-gray-500 mb-1">Normal</p>
              <div className="text-right">
                <span className="text-2xl font-bold text-white">65</span>
                <span className="text-sm text-gray-400">%</span>
              </div>
            </div>

            {/* Small Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#252525] rounded-lg p-2 border border-gray-800">
                <p className="text-xs text-gray-500 mb-0.5">Wind</p>
                <p className="text-xl font-bold text-white">
                  {stats?.avg_wind_speed?.toFixed(1) || '--'}
                  <span className="text-xs text-gray-400 ml-1">m/s</span>
                </p>
              </div>
              <div className="bg-[#252525] rounded-lg p-2 border border-gray-800">
                <p className="text-xs text-gray-500 mb-0.5">Solar</p>
                <p className="text-xl font-bold text-white">
                  {stats?.avg_solar?.toFixed(0) || '--'}
                  <span className="text-xs text-gray-400 ml-1">W</span>
                </p>
              </div>
            </div>

            {/* Add Block Button */}
            <button className="w-full bg-[#252525] border border-gray-800 rounded-lg p-2 flex items-center justify-center space-x-2 text-gray-400 hover:text-white hover:border-cyan-500 transition-colors">
              <Plus size={14} />
              <span className="text-xs font-medium">Add Block</span>
            </button>

            {/* Hide Sidebar Button */}
            <button
              onClick={() => setShowLeftSidebar(false)}
              className="w-full bg-[#252525] border border-gray-800 rounded-lg p-2 flex items-center justify-center space-x-2 text-gray-400 hover:text-white hover:border-cyan-500 transition-colors"
            >
              <ChevronLeft size={14} />
              <span className="text-xs font-medium">Hide</span>
            </button>
          </div>

          {/* Resize Handle */}
          <div
            className="absolute top-0 right-0 w-2 h-full cursor-col-resize flex items-center justify-center group hover:bg-cyan-500/20"
            onMouseDown={(e) => {
              e.preventDefault()
              setIsResizingLeft(true)
            }}
          >
            <GripVertical className="text-gray-600 group-hover:text-cyan-500" size={16} />
          </div>
        </div>
      )}

      {/* CENTER - MAP */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Toggle Buttons - Floating Above Map */}
        {!showLeftSidebar && (
          <button
            onClick={() => setShowLeftSidebar(true)}
            className="absolute top-6 left-6 z-[1000] p-4 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-white shadow-2xl transition-all hover:scale-110 flex items-center space-x-2 font-semibold"
            title="Show left sidebar"
          >
            <ChevronRight size={22} />
            <span className="text-sm">Dashboard</span>
          </button>
        )}

        {!showRightPanel && (
          <button
            onClick={() => setShowRightPanel(true)}
            className="absolute top-6 right-6 z-[1000] p-4 bg-cyan-500 hover:bg-cyan-600 rounded-xl text-white shadow-2xl transition-all hover:scale-110 flex items-center space-x-2 font-semibold"
            title="Show layers panel"
          >
            <span className="text-sm">Layers</span>
            <LayersIcon size={22} />
          </button>
        )}

        {/* Clean Map - Full Height Container */}
        <div className="flex-1 w-full relative">
          <div className="absolute inset-0">
            <MapContainer
              key={`${showLeftSidebar}-${showRightPanel}`}
              center={[30.3753, 69.3451]}
              zoom={6}
              className="w-full h-full"
              style={{ background: '#0a0a0a', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              zoomControl={true}
            >
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='Esri'
              />
              {/* Only show data overlay when user explicitly enables it */}
              {showDataLayer && mapData && mapData.features && mapData.features.length > 0 && (
                <GeoJSON
                  data={mapData}
                  style={(feature) => ({
                    fillColor: getColor(feature?.properties?.value),
                    fillOpacity: 0.4,
                    color: '#ffffff',
                    weight: 1.5,
                  })}
                  onEachFeature={(feature, layer) => {
                    if (feature.properties) {
                      layer.bindPopup(`
                        <div style="padding: 12px; background: #1a1a1a; color: white; border-radius: 8px; font-family: 'Inter', sans-serif;">
                          <strong style="color: #22d3ee; font-size: 14px;">${feature.properties.name}</strong><br/>
                          <span style="font-size: 12px;">Value: ${feature.properties.value?.toFixed(2) || 'N/A'}</span>
                        </div>
                      `)
                    }
                  }}
                />
              )}
            </MapContainer>
            
            {/* Legend - Only show when data is visible */}
            {showDataLayer && mapData && (
              <div className="absolute bottom-4 left-4 bg-[#1a1a1a] rounded-lg shadow-xl p-4 border border-gray-800 backdrop-blur-sm bg-opacity-95 z-[500]">
                <p className="text-xs font-bold text-gray-300 mb-3 uppercase tracking-wider">Legend</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-3 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
                    <span className="text-xs text-gray-300">Cold (&lt;10°C)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-3 rounded" style={{ backgroundColor: '#00af66' }}></div>
                    <span className="text-xs text-gray-300">Mild (10-20°C)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-3 rounded" style={{ backgroundColor: '#ffb900' }}></div>
                    <span className="text-xs text-gray-300">Warm (20-30°C)</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-3 rounded" style={{ backgroundColor: '#ef4444' }}></div>
                    <span className="text-xs text-gray-300">Hot (&gt;30°C)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FLOATING LAYERS MODAL */}
      {showRightPanel && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000]"
            onClick={() => setShowRightPanel(false)}
          />
          
          {/* Floating Modal */}
          <div className="fixed top-20 right-8 z-[2001] w-[420px] max-h-[calc(100vh-120px)] bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-top-4">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <LayersIcon className="text-cyan-400" size={20} />
                  <h2 className="text-white font-bold text-lg">Map Data Layers</h2>
                </div>
                <button
                  onClick={() => setShowRightPanel(false)}
                  className="p-2 hover:bg-[#252525] rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Date Selector */}
              <div className="mb-4">
                <label className="text-xs text-gray-400 mb-2 block uppercase tracking-wider font-semibold">Select Period</label>
                <input
                  type="month"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full text-sm text-white bg-[#252525] border border-gray-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                />
              </div>

              {/* Load/Clear Data Button */}
              <button
                onClick={() => setShowDataLayer(!showDataLayer)}
                className={`w-full py-3 px-4 rounded-lg font-bold text-sm transition-all mb-5 shadow-lg ${
                  showDataLayer
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                    : 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white'
                }`}
              >
                {showDataLayer ? '✕ Clear Data from Map' : '+ Load Temperature Data'}
              </button>

              {/* Calculated Data Section */}
              <div className="border-t border-gray-800 pt-4">
                <h3 className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-semibold">Available Data Layers</h3>
                
                <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {/* Temperature - Currently Loaded */}
                  {showDataLayer && (
                    <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-cyan-600/10 border border-cyan-500/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Activity className="text-cyan-400" size={16} />
                          <div>
                            <p className="text-white text-sm font-semibold">Temperature</p>
                            <p className="text-xs text-cyan-300">Active on map</p>
                          </div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                      </div>
                    </div>
                  )}

                  {/* Available Stats from API */}
                  {stats && (
                    <>
                      <div className="p-3 bg-[#252525] border border-gray-800 rounded-lg hover:border-cyan-500/50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Droplets className="text-blue-400" size={16} />
                            <div>
                              <p className="text-white text-sm font-medium">Precipitation</p>
                              <p className="text-xs text-gray-500">
                                {stats?.total_precipitation?.toFixed(1) || '--'} mm total
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-[#252525] border border-gray-800 rounded-lg hover:border-cyan-500/50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Gauge className="text-green-400" size={16} />
                            <div>
                              <p className="text-white text-sm font-medium">Humidity</p>
                              <p className="text-xs text-gray-500">Available for mapping</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-[#252525] border border-gray-800 rounded-lg hover:border-cyan-500/50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Activity className="text-yellow-400" size={16} />
                            <div>
                              <p className="text-white text-sm font-medium">Wind Speed</p>
                              <p className="text-xs text-gray-500">
                                Avg {stats?.avg_wind_speed?.toFixed(1) || '--'} m/s
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Placeholder when no data */}
                  {!showDataLayer && !stats && (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      <LayersIcon className="mx-auto mb-2 text-gray-600" size={32} />
                      <p>Load data to see available layers</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
