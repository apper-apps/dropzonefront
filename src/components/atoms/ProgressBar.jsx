import { motion } from 'framer-motion'

const ProgressBar = ({ 
  progress = 0, 
  size = 'md',
  variant = 'primary',
  showPercentage = false,
  className = ''
}) => {
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }
  
  const variants = {
    primary: 'from-primary to-secondary',
    success: 'from-success to-green-400',
    warning: 'from-warning to-yellow-400',
    error: 'from-error to-red-400'
  }

  return (
    <div className={`relative ${className}`}>
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          className={`bg-gradient-to-r ${variants[variant]} ${sizes[size]} rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(progress, 100)}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-700">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  )
}

export default ProgressBar