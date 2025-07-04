import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const Layout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const navigationItems = [
    { path: '/', label: 'Upload', icon: 'Upload' },
    { path: '/products', label: 'Products', icon: 'Package' },
    { path: '/campaigns', label: 'Campaigns', icon: 'Megaphone' },
    { path: '/influencers', label: 'Influencers', icon: 'Users' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold gradient-text">
                  InfluencerHub
                </h1>
                <p className="text-sm text-gray-600">
                  Connect brands with influencers
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  <ApperIcon name={item.icon} size={16} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>© 2024 DropZone. Secure file uploads made simple.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout