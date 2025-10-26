import { useState } from 'react'
import { Download as DownloadIcon, FileText, Calendar, MapPin, CheckCircle2, Sparkles, Package, File } from 'lucide-react'
import { downloadData } from '@/lib/api'
import { format } from 'date-fns'

const Download = () => {
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState('punjab')
  const [variables, setVariables] = useState(['temperature'])
  const [startDate, setStartDate] = useState('2023-01-01')
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [formatType, setFormatType] = useState('csv')

  const handleDownload = async () => {
    setLoading(true)
    try {
      const data = await downloadData(
        { id: location },
        variables,
        startDate,
        endDate,
        'monthly',
        formatType
      )

      if (formatType === 'csv') {
        const blob = new Blob([data], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `climate_data_${startDate}_${endDate}.csv`
        a.click()
      } else {
        const jsonStr = JSON.stringify(data, null, 2)
        const blob = new Blob([jsonStr], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `climate_data_${startDate}_${endDate}.json`
        a.click()
      }
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const availableVariables = [
    { value: 'temperature', label: 'Temperature', icon: '🌡️', color: 'from-red-500 to-orange-500' },
    { value: 'precipitation', label: 'Precipitation', icon: '💧', color: 'from-blue-500 to-cyan-500' },
    { value: 'humidity', label: 'Humidity', icon: '💨', color: 'from-cyan-500 to-teal-500' },
    { value: 'wind_speed', label: 'Wind Speed', icon: '🌪️', color: 'from-purple-500 to-indigo-500' },
  ]

  const locations = [
    { value: 'punjab', label: 'Punjab', icon: '🏙️' },
    { value: 'sindh', label: 'Sindh', icon: '🌆' },
    { value: 'kpk', label: 'Khyber Pakhtunkhwa', icon: '⛰️' },
    { value: 'balochistan', label: 'Balochistan', icon: '🏜️' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Download Climate Data
          </h1>
          <p className="text-base text-gray-600 dark:text-dark-300 flex items-center space-x-2">
            <DownloadIcon size={18} className="text-primary-500" />
            <span>Export climate data in CSV or JSON format</span>
          </p>
        </div>

        {/* Data Size Badge */}
        <div className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg self-start lg:self-auto">
          <Package size={20} className="text-white" />
          <span className="text-sm font-bold text-white uppercase tracking-wide">2.4M+ Data Points</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Download Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Location & Date Card */}
          <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center space-x-2">
              <MapPin size={20} className="text-primary-500" />
              <span>Location & Date Range</span>
            </h3>
            
            <div className="space-y-5">
              {/* Location */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-dark-300 mb-3">
                  Select Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium cursor-pointer"
                >
                  {locations.map((l) => (
                    <option key={l.value} value={l.value}>{l.icon} {l.label}</option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-dark-300 mb-3">
                    <Calendar size={14} className="inline mr-1.5" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium cursor-pointer"
                  />
                </div>
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
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-dark-600 bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Variables Selection Card */}
          <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
              Select Climate Variables
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableVariables.map((v) => {
                const isSelected = variables.includes(v.value)
                return (
                  <label 
                    key={v.value} 
                    className={`
                      group relative flex items-center space-x-4 p-5 rounded-xl border-2 transition-all cursor-pointer overflow-hidden
                      ${isSelected
                        ? 'border-primary-500 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20'
                        : 'border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900 hover:border-primary-300 dark:hover:border-primary-700'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setVariables([...variables, v.value])
                        } else {
                          setVariables(variables.filter((variable) => variable !== v.value))
                        }
                      }}
                      className="w-5 h-5 rounded-md border-gray-300 text-primary-500 focus:ring-primary-500"
                    />
                    <div className={`flex-shrink-0 p-2.5 rounded-xl bg-gradient-to-br ${v.color}`}>
                      <span className="text-2xl">{v.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-dark-200'}`}>
                        {v.label}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="text-primary-500" size={24} />
                    )}
                  </label>
                )
              })}
            </div>
          </div>

          {/* Format Selection Card */}
          <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center space-x-2">
              <FileText size={20} className="text-primary-500" />
              <span>Export Format</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setFormatType('csv')}
                className={`
                  relative p-6 rounded-xl border-2 transition-all font-semibold overflow-hidden
                  ${formatType === 'csv'
                    ? 'border-primary-500 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 text-gray-900 dark:text-white'
                    : 'border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900 text-gray-700 dark:text-dark-200 hover:border-primary-300 dark:hover:border-primary-700'
                  }
                `}
              >
                <div className="flex flex-col items-center space-y-3">
                  <File size={32} className={formatType === 'csv' ? 'text-primary-500' : 'text-gray-400 dark:text-dark-400'} />
                  <span className="text-lg">CSV Format</span>
                  <span className="text-xs text-gray-600 dark:text-dark-300">For Excel & Spreadsheets</span>
                </div>
                {formatType === 'csv' && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="text-primary-500" size={24} />
                  </div>
                )}
              </button>

              <button
                onClick={() => setFormatType('json')}
                className={`
                  relative p-6 rounded-xl border-2 transition-all font-semibold overflow-hidden
                  ${formatType === 'json'
                    ? 'border-primary-500 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 text-gray-900 dark:text-white'
                    : 'border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900 text-gray-700 dark:text-dark-200 hover:border-primary-300 dark:hover:border-primary-700'
                  }
                `}
              >
                <div className="flex flex-col items-center space-y-3">
                  <FileText size={32} className={formatType === 'json' ? 'text-primary-500' : 'text-gray-400 dark:text-dark-400'} />
                  <span className="text-lg">JSON Format</span>
                  <span className="text-xs text-gray-600 dark:text-dark-300">For APIs & Developers</span>
                </div>
                {formatType === 'json' && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="text-primary-500" size={24} />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={loading || variables.length === 0}
            className="w-full flex items-center justify-center space-x-3 px-8 py-5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-lg border-2 border-primary-400"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-3 border-white/30 border-t-white"></div>
                <span>Preparing Download...</span>
              </>
            ) : (
              <>
                <DownloadIcon size={24} />
                <span>Download Data</span>
              </>
            )}
          </button>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-5">
              <Sparkles className="text-primary-500" size={22} />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Download Summary</h3>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-dark-400 uppercase tracking-wider mb-1">Selected Variables</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{variables.length}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-dark-400 uppercase tracking-wider mb-1">Location</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{locations.find(l => l.value === location)?.label}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-dark-400 uppercase tracking-wider mb-1">Date Range</p>
                <p className="text-sm font-medium text-gray-700 dark:text-dark-200">
                  {format(new Date(startDate), 'MMM dd, yyyy')} - {format(new Date(endDate), 'MMM dd, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-dark-400 uppercase tracking-wider mb-1">Format</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white uppercase">{formatType}</p>
              </div>
            </div>
          </div>

          {/* Usage Tips Card */}
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-3">💡 Pro Tips</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-start space-x-2">
                <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
                <span>Select at least one variable to download</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
                <span>CSV format works great with Excel & Google Sheets</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
                <span>JSON format is perfect for API integration</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
                <span>Large date ranges may take a moment to process</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Download
