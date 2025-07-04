import { motion } from 'framer-motion'
import FileIcon from '@/components/atoms/FileIcon'
import StatusIcon from '@/components/atoms/StatusIcon'
import ProgressBar from '@/components/atoms/ProgressBar'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { formatFileSize } from '@/utils/formatters'

const FileCard = ({ file, onRemove, className = '' }) => {
  const { name, size, type, status, progress, preview } = file

  const getStatusColor = (status) => {
    switch (status) {
      case 'uploading': return 'border-l-primary bg-blue-50'
      case 'complete': return 'border-l-success bg-green-50'
      case 'error': return 'border-l-error bg-red-50'
      case 'paused': return 'border-l-warning bg-yellow-50'
      default: return 'border-l-gray-300 bg-white'
    }
  }

  return (
    <motion.div
      className={`file-card p-4 rounded-lg border-l-4 ${getStatusColor(status)} shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-3">
        {/* File Preview/Icon */}
        <div className="flex-shrink-0">
          {preview ? (
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={preview} 
                alt={name}
                className="w-full h-full object-cover file-preview"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <FileIcon type={type} size={24} />
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium text-gray-900 truncate pr-2">
              {name}
            </h4>
            <div className="flex items-center gap-2">
              <StatusIcon status={status} size={16} />
              {status === 'idle' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(file.id)}
                  className="p-1 hover:bg-red-50 hover:text-red-600 rounded-md"
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span>{formatFileSize(size)}</span>
            <span>•</span>
            <span className="uppercase">{type.split('/')[1] || 'unknown'}</span>
          </div>

          {/* Progress Bar */}
          {(status === 'uploading' || status === 'complete') && (
            <div className="space-y-1">
              <ProgressBar
                progress={progress}
                variant={status === 'complete' ? 'success' : 'primary'}
                size="sm"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{Math.round(progress)}%</span>
                {status === 'uploading' && (
                  <span>Uploading...</span>
                )}
                {status === 'complete' && (
                  <span>Complete</span>
                )}
              </div>
            </div>
          )}

          {/* Error Message */}
          {status === 'error' && (
            <div className="mt-2">
              <p className="text-xs text-red-600">
                Upload failed. Please try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default FileCard