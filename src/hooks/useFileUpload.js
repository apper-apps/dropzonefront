import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { fileUploadService } from '@/services/api/fileUploadService'

export const useFileUpload = () => {
  const [files, setFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSession, setUploadSession] = useState(null)

  const addFiles = useCallback((newFiles) => {
    const processedFiles = newFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'idle',
      progress: 0,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      file: file
    }))

    setFiles(prev => [...prev, ...processedFiles])
    return processedFiles
  }, [])

  const removeFile = useCallback((fileId) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === fileId)
      if (file && file.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== fileId)
    })
  }, [])

  const updateFileStatus = useCallback((fileId, status, progress = 0) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status, progress } : f
    ))
  }, [])

  const startUpload = useCallback(async () => {
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
      for (const file of files) {
        updateFileStatus(file.id, 'uploading', 0)

        try {
          await fileUploadService.uploadFile(file.file, (progress) => {
            updateFileStatus(file.id, 'uploading', progress)
          })

          updateFileStatus(file.id, 'complete', 100)
          setUploadSession(prev => ({
            ...prev,
            uploadedFiles: prev.uploadedFiles + 1,
            uploadedSize: prev.uploadedSize + file.size
          }))

        } catch (error) {
          updateFileStatus(file.id, 'error', 0)
          toast.error(`Failed to upload ${file.name}`)
        }
      }

      toast.success('Upload completed!')
      setUploadSession(prev => ({ ...prev, endTime: new Date().toISOString() }))
      
    } catch (error) {
      toast.error('Upload process failed')
    } finally {
      setIsUploading(false)
    }
  }, [files, updateFileStatus])

  const clearAll = useCallback(() => {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    setFiles([])
    setUploadSession(null)
  }, [files])

  return {
    files,
    isUploading,
    uploadSession,
    addFiles,
    removeFile,
    startUpload,
    clearAll
  }
}