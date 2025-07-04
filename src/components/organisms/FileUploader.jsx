import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import DropZone from '@/components/molecules/DropZone'
import FileCard from '@/components/molecules/FileCard'
import UploadSummary from '@/components/molecules/UploadSummary'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { fileUploadService } from '@/services/api/fileUploadService'

const FileUploader = () => {
  const [files, setFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSession, setUploadSession] = useState(null)

  const handleFilesSelected = useCallback((selectedFiles) => {
    const newFiles = selectedFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'idle',
      progress: 0,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      file: file
    }))

    setFiles(prev => [...prev, ...newFiles])
    toast.success(`${selectedFiles.length} file(s) added to upload queue`)
  }, [])

  const handleRemoveFile = useCallback((fileId) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === fileId)
      if (file && file.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== fileId)
    })
  }, [])

  const handleStartUpload = useCallback(async () => {
    if (files.length === 0) {
      toast.warning('Please select files to upload')
      return
    }

    setIsUploading(true)
    const session = {
      totalFiles: files.length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0),
      uploadedFiles: 0,
      uploadedSize: 0,
      startTime: new Date().toISOString()
    }
    setUploadSession(session)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Update file status to uploading
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'uploading', progress: 0 } : f
        ))

        try {
          // Simulate upload progress
          await fileUploadService.uploadFile(file.file, (progress) => {
            setFiles(prev => prev.map(f => 
              f.id === file.id ? { ...f, progress } : f
            ))
          })

          // Mark as complete
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'complete', progress: 100 } : f
          ))

          // Update session
          setUploadSession(prev => ({
            ...prev,
            uploadedFiles: prev.uploadedFiles + 1,
            uploadedSize: prev.uploadedSize + file.size
          }))

        } catch (error) {
          // Mark as error
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, status: 'error', progress: 0 } : f
          ))
          toast.error(`Failed to upload ${file.name}`)
        }
      }

      toast.success('All files uploaded successfully!')
      setUploadSession(prev => ({ ...prev, endTime: new Date().toISOString() }))
      
    } catch (error) {
      toast.error('Upload process failed')
    } finally {
      setIsUploading(false)
    }
  }, [files])

  const handleClearAll = useCallback(() => {
    // Cleanup preview URLs
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    setFiles([])
    setUploadSession(null)
    toast.info('Upload queue cleared')
  }, [files])

  const pendingFiles = files.filter(f => f.status === 'idle')
  const completedFiles = files.filter(f => f.status === 'complete')

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <DropZone
        onFilesSelected={handleFilesSelected}
        acceptedTypes={['image/', 'video/', 'audio/', 'application/', 'text/']}
        maxFileSize={50 * 1024 * 1024} // 50MB
      />

      {/* Upload Summary */}
      {uploadSession && (
        <UploadSummary
          totalFiles={uploadSession.totalFiles}
          totalSize={uploadSession.totalSize}
          uploadedFiles={uploadSession.uploadedFiles}
          uploadedSize={uploadSession.uploadedSize}
          isUploading={isUploading}
        />
      )}

      {/* Action Buttons */}
      {files.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleStartUpload}
              disabled={isUploading || pendingFiles.length === 0}
              size="lg"
              className="min-w-[140px]"
            >
              {isUploading ? (
                <>
                  <ApperIcon name="Loader2" size={20} className="mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <ApperIcon name="Upload" size={20} className="mr-2" />
                  Upload Files
                </>
              )}
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleClearAll}
              disabled={isUploading}
            >
              <ApperIcon name="Trash2" size={20} className="mr-2" />
              Clear All
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            {files.length} file(s) • {completedFiles.length} completed
          </div>
        </div>
      )}

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-display font-semibold text-gray-900">
              Upload Queue
            </h3>
            <div className="grid gap-3">
              {files.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onRemove={handleRemoveFile}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FileUploader