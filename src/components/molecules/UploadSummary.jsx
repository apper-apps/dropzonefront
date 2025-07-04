import { motion } from 'framer-motion'
import ProgressBar from '@/components/atoms/ProgressBar'
import ApperIcon from '@/components/ApperIcon'
import { formatFileSize } from '@/utils/formatters'

const UploadSummary = ({ 
  totalFiles = 0, 
  totalSize = 0, 
  uploadedFiles = 0, 
  uploadedSize = 0, 
  isUploading = false,
  className = '' 
}) => {
  const overallProgress = totalFiles > 0 ? (uploadedFiles / totalFiles) * 100 : 0
  const sizeProgress = totalSize > 0 ? (uploadedSize / totalSize) * 100 : 0

  if (totalFiles === 0) {
    return null
  }

  return (
    <motion.div
      className={`bg-white rounded-xl p-6 shadow-lg border border-gray-200 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-display font-semibold text-gray-900">
          Upload Progress
        </h3>
        <div className="flex items-center gap-2">
          {isUploading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <ApperIcon name="Loader2" size={20} className="text-primary" />
            </motion.div>
          )}
          <span className="text-sm font-medium text-gray-600">
            {uploadedFiles} of {totalFiles} files
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Files</span>
            <span className="font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <ProgressBar
            progress={overallProgress}
            variant={overallProgress === 100 ? 'success' : 'primary'}
            size="lg"
          />
        </div>

        {/* Size Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Data</span>
            <span className="font-medium">{Math.round(sizeProgress)}%</span>
          </div>
          <ProgressBar
            progress={sizeProgress}
            variant={sizeProgress === 100 ? 'success' : 'primary'}
            size="lg"
          />
        </div>

        {/* Size Information */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {formatFileSize(uploadedSize)} of {formatFileSize(totalSize)}
          </div>
          {overallProgress === 100 && (
            <div className="flex items-center gap-1 text-sm text-success font-medium">
              <ApperIcon name="CheckCircle" size={16} />
              Complete
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default UploadSummary