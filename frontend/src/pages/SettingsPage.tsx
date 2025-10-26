import { useState } from 'react'
import { ArrowLeft, Globe, Palette, Database, Bell, Key, User, Info, Copy, RefreshCw, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SettingsPage = () => {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('general')
  const [theme, setTheme] = useState('dark')
  const [autoRefresh, setAutoRefresh] = useState(true)

  const sections = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'display', label: 'Display', icon: Palette },
    { id: 'data', label: 'Data Preferences', icon: Database },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API Access', icon: Key },
    { id: 'account', label: 'Account', icon: User },
    { id: 'about', label: 'About', icon: Info },
  ]

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

      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-4 sticky top-24">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        activeSection === section.id
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-400 hover:bg-background hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{section.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === 'general' && (
              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-xl font-bold text-white mb-6">General Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
                      <select className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-blue-500">
                        <option>English</option>
                        <option>اردو (Urdu)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Timezone</label>
                      <select className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-blue-500">
                        <option>PKT (UTC+5)</option>
                        <option>UTC</option>
                        <option>GMT</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Date Format</label>
                      <select className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-blue-500">
                        <option>DD/MM/YYYY</option>
                        <option>MM/DD/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Number Format</label>
                      <select className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-blue-500">
                        <option>1,234.56 (Comma decimal)</option>
                        <option>1.234,56 (Dot decimal)</option>
                        <option>1 234.56 (Space decimal)</option>
                      </select>
                    </div>

                    <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'display' && (
              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Display Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-3">Theme</label>
                      <div className="grid grid-cols-3 gap-4">
                        {['Light', 'Dark', 'Auto'].map((t) => (
                          <button
                            key={t}
                            onClick={() => setTheme(t.toLowerCase())}
                            className={`px-4 py-3 rounded-lg border-2 transition-all ${
                              theme === t.toLowerCase()
                                ? 'border-blue-500 bg-blue-500/20 text-white'
                                : 'border-border bg-background text-gray-400 hover:text-white'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Chart Color Scheme</label>
                      <select className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-blue-500">
                        <option>Default (Blue)</option>
                        <option>Viridis</option>
                        <option>Warm</option>
                        <option>Cool</option>
                        <option>High Contrast</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Map Style</label>
                      <div className="grid grid-cols-2 gap-4">
                        {['Standard', 'Satellite', 'Terrain', 'Dark'].map((style) => (
                          <div key={style} className="border border-border rounded-lg p-3 hover:border-blue-500 cursor-pointer transition-colors">
                            <div className="aspect-video bg-background rounded mb-2 flex items-center justify-center">
                              <span className="text-xs text-gray-500">{style}</span>
                            </div>
                            <div className="text-sm text-white text-center">{style}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-3">Font Size</label>
                      <div className="grid grid-cols-3 gap-4">
                        {['Small', 'Medium', 'Large'].map((size) => (
                          <button
                            key={size}
                            className="px-4 py-3 bg-background border border-border rounded-lg text-gray-400 hover:text-white hover:border-blue-500 transition-all"
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 rounded" />
                        <span className="text-white">Reduce animations</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" className="w-5 h-5 rounded" />
                        <span className="text-white">High contrast mode</span>
                      </label>
                    </div>

                    <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'data' && (
              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Data Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Default Administrative Level</label>
                      <select className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-blue-500">
                        <option>National</option>
                        <option>Provincial</option>
                        <option>District</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Default Time Range</label>
                      <select className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-blue-500">
                        <option>Last Month</option>
                        <option>Last 3 Months</option>
                        <option>Last 6 Months</option>
                        <option>Last Year</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-3">Default Parameters</label>
                      <div className="space-y-2">
                        {['Temperature', 'Precipitation', 'Heat Index', 'Drought Index', 'Extreme Events'].map((param) => (
                          <label key={param} className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 rounded" defaultChecked={param === 'Temperature' || param === 'Precipitation'} />
                            <span className="text-white">{param}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Temperature Unit</label>
                      <div className="grid grid-cols-3 gap-4">
                        {['Celsius', 'Fahrenheit', 'Kelvin'].map((unit) => (
                          <button
                            key={unit}
                            className="px-4 py-3 bg-background border border-border rounded-lg text-gray-400 hover:text-white hover:border-blue-500 transition-all"
                          >
                            {unit}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Precipitation Unit</label>
                      <div className="grid grid-cols-2 gap-4">
                        {['Millimeters', 'Inches'].map((unit) => (
                          <button
                            key={unit}
                            className="px-4 py-3 bg-background border border-border rounded-lg text-gray-400 hover:text-white hover:border-blue-500 transition-all"
                          >
                            {unit}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div>
                        <div className="text-white font-medium">Auto-refresh data</div>
                        <div className="text-sm text-gray-400">Automatically update dashboard every</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoRefresh}
                          onChange={(e) => setAutoRefresh(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>

                    {autoRefresh && (
                      <div>
                        <select className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-blue-500">
                          <option>5 minutes</option>
                          <option>15 minutes</option>
                          <option>30 minutes</option>
                          <option>1 hour</option>
                        </select>
                      </div>
                    )}

                    <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Notification Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div>
                        <div className="text-white font-medium">Email Notifications</div>
                        <div className="text-sm text-gray-400">Receive alerts via email</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-3">Alert Types</label>
                      <div className="space-y-3">
                        {[
                          'Extreme temperature events',
                          'Heavy precipitation warnings',
                          'Drought updates',
                          'Heat stress advisories',
                          'System updates',
                        ].map((alert) => (
                          <label key={alert} className="flex items-center space-x-3 cursor-pointer p-3 bg-background rounded-lg hover:bg-background/80">
                            <input type="checkbox" className="w-5 h-5 rounded" defaultChecked />
                            <span className="text-white">{alert}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Notification Frequency</label>
                      <select className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-blue-500">
                        <option>Immediately</option>
                        <option>Daily Digest</option>
                        <option>Weekly Summary</option>
                      </select>
                    </div>

                    <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'api' && (
              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-xl font-bold text-white mb-6">API Access</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Your API Key</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value="pk_live_51abc123def456ghi789jkl"
                          readOnly
                          className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-white font-mono text-sm"
                        />
                        <button className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                          <Copy className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <button className="flex items-center space-x-2 px-4 py-2 bg-background border border-border rounded-lg text-white hover:border-blue-500 transition-colors">
                      <RefreshCw className="w-4 h-4" />
                      <span>Generate New Key</span>
                    </button>

                    <div className="bg-background rounded-lg p-6">
                      <h3 className="text-white font-semibold mb-4">API Usage Statistics</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Requests this month</span>
                            <span className="text-white font-semibold">2,485 / 10,000</span>
                          </div>
                          <div className="w-full bg-border rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '24.85%' }}></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Rate Limit</div>
                            <div className="text-lg font-bold text-white">100/min</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400 mb-1">Data Downloaded</div>
                            <div className="text-lg font-bold text-white">4.2 GB</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <a
                      href="#"
                      className="inline-block px-6 py-3 bg-background border border-border rounded-lg text-blue-500 hover:text-blue-400 hover:border-blue-500 transition-colors"
                    >
                      View API Documentation →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'account' && (
              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        AU
                      </div>
                      <button className="px-4 py-2 bg-background border border-border rounded-lg text-white hover:border-blue-500 transition-colors">
                        Change Avatar
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue="Admin User"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                      <input
                        type="email"
                        defaultValue="admin@climate.pk"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
                      Update Profile
                    </button>

                    <div className="pt-6 border-t border-border">
                      <button className="px-6 py-3 bg-background border border-border rounded-lg text-white hover:border-blue-500 transition-colors">
                        Change Password
                      </button>
                    </div>

                    <div className="pt-6 border-t border-border">
                      <button className="px-6 py-3 bg-background border border-border rounded-lg text-white hover:border-blue-500 transition-colors">
                        Export My Data
                      </button>
                    </div>

                    <div className="pt-6 border-t border-border">
                      <h3 className="text-white font-semibold mb-3">Danger Zone</h3>
                      <button className="flex items-center space-x-2 px-6 py-3 bg-red-600/20 border border-red-600 rounded-lg text-red-500 hover:bg-red-600/30 transition-colors">
                        <Trash2 className="w-5 h-5" />
                        <span>Delete Account</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'about' && (
              <div className="space-y-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="text-xl font-bold text-white mb-6">About Climate Portal</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-background rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Portal Version</div>
                      <div className="text-lg font-semibold text-white">v2.0.0</div>
                    </div>

                    <div className="bg-background rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Last Updated</div>
                      <div className="text-lg font-semibold text-white">October 2024</div>
                    </div>

                    <div>
                      <h3 className="text-white font-semibold mb-3">Credits & Acknowledgments</h3>
                      <div className="text-gray-400 space-y-2 text-sm">
                        <p>Data Source: ERA5 Reanalysis Dataset (ECMWF)</p>
                        <p>Developed by: Pakistan Climate Research Team</p>
                        <p>Supported by: Ministry of Climate Change</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white font-semibold mb-3">Citation</h3>
                      <div className="bg-background rounded-lg p-4 font-mono text-sm text-gray-300">
                        Pakistan Climate Information Portal. (2024). ERA5-based Climate Analytics Platform. 
                        Retrieved from https://climatepk.org
                      </div>
                      <button className="mt-2 flex items-center space-x-2 text-sm text-blue-500 hover:text-blue-400">
                        <Copy className="w-4 h-4" />
                        <span>Copy Citation</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      <a href="#" className="block text-blue-500 hover:text-blue-400">Methodology Documentation →</a>
                      <a href="#" className="block text-blue-500 hover:text-blue-400">Contact Us →</a>
                      <a href="#" className="block text-blue-500 hover:text-blue-400">Terms of Service →</a>
                      <a href="#" className="block text-blue-500 hover:text-blue-400">Privacy Policy →</a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage

