import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const DropZone = ({ onFilesSelected, acceptedTypes = [], maxFileSize = 10 * 1024 * 1024, className = '' }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragCounter, setDragCounter] = useState(0)

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev + 1)
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true)
    }
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragCounter(prev => prev - 1)
    if (dragCounter <= 1) {
      setIsDragOver(false)
    }
  }, [dragCounter])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    setDragCounter(0)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileInput = useCallback((e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
    e.target.value = '' // Reset input
  }, [])

  const handleFiles = useCallback((files) => {
    const validFiles = files.filter(file => {
      // Check file type
      if (acceptedTypes.length > 0 && !acceptedTypes.some(type => file.type.startsWith(type))) {
        return false
      }
      
      // Check file size
      if (file.size > maxFileSize) {
        return false
      }
      
      return true
    })

    if (validFiles.length > 0) {
      onFilesSelected(validFiles)
    }
  }, [acceptedTypes, maxFileSize, onFilesSelected])

  const formatAcceptedTypes = () => {
    if (acceptedTypes.length === 0) return 'All file types'
    return acceptedTypes.map(type => type.replace('/', ' ')).join(', ')
  }

  return (
    <div
      className={`drop-zone relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-all duration-300 ${
        isDragOver ? 'drag-over' : 'hover:border-gray-400'
      } ${className}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept={acceptedTypes.join(',')}
      />
      
      <motion.div
        className="space-y-4"
        animate={{
          scale: isDragOver ? 1.02 : 1,
          transition: { duration: 0.2 }
        }}
      >
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
          <ApperIcon 
            name={isDragOver ? "Download" : "Upload"} 
            size={32} 
            className="text-white"
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-display font-semibold text-gray-900">
            {isDragOver ? "Drop files here" : "Drag & drop files here"}
          </h3>
          <p className="text-gray-600">
            or <span className="font-medium text-primary">browse</span> to choose files
          </p>
        </div>
        
        <div className="space-y-2 text-sm text-gray-500">
          <p>Accepted formats: {formatAcceptedTypes()}</p>
          <p>Maximum file size: {Math.round(maxFileSize / (1024 * 1024))}MB</p>
        </div>
        
        <Button
          variant="outline"
          size="lg"
          className="mt-4"
          onClick={(e) => {
            e.stopPropagation()
            // The click will bubble up to the input
          }}
        >
          <ApperIcon name="FolderOpen" size={20} className="mr-2" />
          Choose Files
        </Button>
      </motion.div>
    </div>
  )
}

export default DropZone