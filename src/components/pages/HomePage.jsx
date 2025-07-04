import { motion } from 'framer-motion'
import FileUploader from '@/components/organisms/FileUploader'
import ApperIcon from '@/components/ApperIcon'

const HomePage = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.section
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text">
          Upload Files Effortlessly
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Drag and drop your files or click to browse. Track progress in real-time 
          with our beautiful, responsive uploader.
        </p>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4 mx-auto">
              <ApperIcon name="Upload" size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
              Drag & Drop
            </h3>
            <p className="text-gray-600">
              Simply drag files from your computer directly into the upload zone
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-success to-green-400 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <ApperIcon name="BarChart3" size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
              Real-time Progress
            </h3>
            <p className="text-gray-600">
              Watch your files upload with detailed progress bars and status updates
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-pink-400 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <ApperIcon name="FileCheck" size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">
              File Preview
            </h3>
            <p className="text-gray-600">
              Preview images and see file details before uploading
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Upload Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <FileUploader />
      </motion.section>
    </div>
  )
}

export default HomePage