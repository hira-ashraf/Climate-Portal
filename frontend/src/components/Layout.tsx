import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Map, 
  TrendingUp, 
  CloudRain, 
  Download, 
  Info,
  Bell,
  User,
  Leaf
} from 'lucide-react'
import { useLanguage } from '@/lib/languageStore'

interface LayoutProps {
  children: ReactNode
  darkMode: boolean
  toggleDarkMode: () => void
}

const Layout = ({ children, darkMode, toggleDarkMode }: LayoutProps) => {
  const location = useLocation()
  const { t } = useLanguage()

  const navigation = [
    { name: t('dashboard'), path: '/', icon: Home },
    { name: t('interactiveMap'), path: '/map', icon: Map },
    { name: t('timeSeries'), path: '/timeseries', icon: TrendingUp },
    { name: t('forecast'), path: '/forecast', icon: CloudRain },
    { name: t('download'), path: '/download', icon: Download },
    { name: t('about'), path: '/about', icon: Info },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Top Navigation - EarthEye Style */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a] border-b border-gray-800">
        <div className="px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Leaf className="text-cyan-400" size={24} />
              <div>
                <span className="text-white font-bold text-lg">Climate</span>
                <span className="text-cyan-400 font-light text-lg ml-1">Portal</span>
              </div>
            </div>
          </Link>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>
          
          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Alerts */}
            <button className="flex items-center space-x-2 text-gray-400 hover:text-white">
              <Bell size={18} />
              <span className="text-sm">3 alerts</span>
            </button>

            {/* User */}
            <button className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-[52px]">
        {children}
      </main>
    </div>
  )
}

export default Layout
