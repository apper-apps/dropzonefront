import ApperIcon from '@/components/ApperIcon'
import { motion } from 'framer-motion'

const StatusIcon = ({ status, size = 20, className = '' }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'uploading':
        return {
          icon: 'Loader2',
          color: 'text-primary',
          animate: { rotate: 360 },
          transition: { duration: 1, repeat: Infinity, ease: "linear" }
        }
      case 'complete':
        return {
          icon: 'CheckCircle',
          color: 'text-success',
          animate: { scale: [0.8, 1.2, 1] },
          transition: { duration: 0.5, ease: "easeOut" }
        }
      case 'error':
        return {
          icon: 'XCircle',
          color: 'text-error',
          animate: { scale: [0.8, 1.2, 1] },
          transition: { duration: 0.5, ease: "easeOut" }
        }
      case 'paused':
        return {
          icon: 'PauseCircle',
          color: 'text-warning',
          animate: {},
          transition: {}
        }
      default:
        return {
          icon: 'Clock',
          color: 'text-gray-400',
          animate: {},
          transition: {}
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <motion.div
      className={`status-icon ${className}`}
      animate={config.animate}
      transition={config.transition}
    >
      <ApperIcon 
        name={config.icon}
        size={size}
        className={config.color}
      />
    </motion.div>
  )
}

export default StatusIcon