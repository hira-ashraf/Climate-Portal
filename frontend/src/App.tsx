import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'

// New Climate Portal Pages
import LandingPage from './pages/LandingPage'
import MainDashboard from './pages/MainDashboard'
import TemperatureAnalysis from './pages/TemperatureAnalysis'
import PrecipitationAnalysis from './pages/PrecipitationAnalysis'
import HeatStress from './pages/HeatStress'
import DroughtIndices from './pages/DroughtIndices'
import ExtremeEvents from './pages/ExtremeEvents'
import DataExplorer from './pages/DataExplorer'
import SettingsPage from './pages/SettingsPage'

// Old pages (keeping for backwards compatibility)
import Dashboard from './pages/Dashboard'
import MapViewer from './pages/MapViewer'
import TimeSeries from './pages/TimeSeries'
import Forecast from './pages/Forecast'
import Download from './pages/Download'
import About from './pages/About'

function App() {
  // Always use dark mode for the new climate portal
  useEffect(() => {
    document.documentElement.classList.add('dark')
    document.body.classList.add('dark')
  }, [])

  return (
    <Router>
      <Routes>
        {/* New Climate Portal Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/main-dashboard" element={<MainDashboard />} />
        <Route path="/dashboard" element={<MainDashboard />} />
        <Route path="/temperature" element={<TemperatureAnalysis />} />
        <Route path="/precipitation" element={<PrecipitationAnalysis />} />
        <Route path="/heat-stress" element={<HeatStress />} />
        <Route path="/drought" element={<DroughtIndices />} />
        <Route path="/extreme-events" element={<ExtremeEvents />} />
        <Route path="/data-explorer" element={<DataExplorer />} />
        <Route path="/settings" element={<SettingsPage />} />
        
        {/* Old Routes (backwards compatibility) */}
        <Route path="/old-dashboard" element={<Dashboard />} />
        <Route path="/map" element={<MapViewer />} />
        <Route path="/timeseries" element={<TimeSeries />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/download" element={<Download />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}

export default App
