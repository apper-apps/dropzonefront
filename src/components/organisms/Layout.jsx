import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Layout = ({ children }) => {
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
                <ApperIcon name="Upload" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold gradient-text">
                  DropZone
                </h1>
                <p className="text-sm text-gray-600">
                  Upload files with ease
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <ApperIcon name="Shield" size={16} />
                <span>Secure uploads</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <ApperIcon name="Zap" size={16} />
                <span>Fast processing</span>
              </div>
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