import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Cloud, Database, TrendingUp, Globe, Menu, X,
  Thermometer, Droplets, Wind, Sun,
  ArrowRight, Github, Twitter, Linkedin, Mail
} from 'lucide-react'
import { useState } from 'react'

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-gray-100">
      {/* Floating Navigation Bar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-surface/80 border-b border-border"
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Globe className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold">Climate Portal</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="hover:text-blue-400 transition-colors">Home</a>
            <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
            <a href="#data" className="hover:text-blue-400 transition-colors">Data</a>
            <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
            <a href="#docs" className="hover:text-blue-400 transition-colors">Documentation</a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link 
              to="/signup" 
              className="px-6 py-2 bg-gradient-primary rounded-lg hover:shadow-glow transition-all"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-surface border-t border-border"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
              <a href="#home" className="hover:text-blue-400 transition-colors">Home</a>
              <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
              <a href="#data" className="hover:text-blue-400 transition-colors">Data</a>
              <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
              <a href="#docs" className="hover:text-blue-400 transition-colors">Documentation</a>
              <div className="flex space-x-4 pt-4 border-t border-border">
                <Link to="/login" className="text-gray-300">Login</Link>
                <Link to="/signup" className="text-blue-500">Sign Up</Link>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-500/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Glow Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Pakistan Climate Information Portal
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-400 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              ERA5-based Real-time Climate Analytics and Insights
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link 
                to="/dashboard" 
                className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-lg transition-all hover:shadow-glow flex items-center justify-center space-x-2"
              >
                <span>Explore Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a 
                href="#docs" 
                className="px-8 py-4 border-2 border-white/20 hover:border-white/40 text-white rounded-xl font-semibold text-lg transition-all backdrop-blur-sm"
              >
                View Documentation
              </a>
            </motion.div>

            {/* Animated Globe Visualization */}
            <motion.div 
              className="mt-16 relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <div className="relative w-64 h-64 mx-auto">
                <Globe className="w-full h-full text-blue-500/30 animate-float" />
                <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl animate-pulse-slow" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-400">Comprehensive climate data analysis at your fingertips</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Database,
                title: 'Real-time Data',
                description: 'Access up-to-date climate information from ERA5 reanalysis dataset with hourly updates.',
                color: 'bg-blue-500'
              },
              {
                icon: TrendingUp,
                title: 'Multi-Scale Analysis',
                description: 'Analyze climate patterns from national to district level with comprehensive spatial coverage.',
                color: 'bg-green-500'
              },
              {
                icon: Cloud,
                title: 'Historical Trends',
                description: '45+ years of historical climate data for trend analysis and pattern recognition.',
                color: 'bg-purple-500'
              },
              {
                icon: Globe,
                title: 'Open Access',
                description: 'Free and open access to climate data for research, planning, and decision-making.',
                color: 'bg-orange-500'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)' }}
                className="bg-card rounded-2xl p-6 border border-border hover:border-blue-500/50 transition-all cursor-pointer group"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
                <ArrowRight className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '45', label: 'Years Data', suffix: '+' },
              { number: '40', label: 'Parameters', suffix: '+' },
              { number: '160', label: 'Districts', suffix: '+' },
              { number: '1M', label: 'Data Points', suffix: '+' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">
                  {stat.number}<span className="text-blue-300">{stat.suffix}</span>
                </div>
                <div className="text-sm md:text-base text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section id="data" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Comprehensive Climate Analytics</h2>
            <p className="text-xl text-gray-400">Powerful tools for climate data visualization and analysis</p>
          </motion.div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 shadow-glow border border-border"
            >
              {/* Dashboard Preview Mockup */}
              <div className="bg-surface rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-xs text-gray-500">Pakistan Climate Dashboard</div>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  {[Thermometer, Droplets, Wind, Sun].map((Icon, i) => (
                    <div key={i} className="bg-background rounded-lg p-4">
                      <Icon className="w-6 h-6 text-blue-400 mb-2" />
                      <div className="h-2 bg-blue-500/30 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-background rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Globe className="w-16 h-16 mx-auto mb-2 text-blue-500/50" />
                    <p>Interactive Map Preview</p>
                  </div>
                </div>
              </div>

              {/* Floating Feature Callouts */}
              <div className="absolute -right-4 top-1/4 hidden lg:block">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Real-time Updates ⚡
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-[#0f1419] border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-bold mb-4">About</h3>
              <p className="text-gray-400 text-sm mb-4">
                Pakistan Climate Information Portal provides comprehensive climate data and analytics 
                powered by ERA5 reanalysis dataset.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/dashboard" className="text-gray-400 hover:text-blue-400 transition-colors">Dashboard</Link></li>
                <li><a href="#features" className="text-gray-400 hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#docs" className="text-gray-400 hover:text-blue-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">API Access</a></li>
                <li><a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>info@climatepk.org</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>www.climatepk.org</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Pakistan Climate Information Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

