import ApperIcon from '@/components/ApperIcon'

const FileIcon = ({ type, size = 24, className = '' }) => {
  const getIconByType = (fileType) => {
    const type = fileType.toLowerCase()
    
    if (type.startsWith('image/')) return 'Image'
    if (type.startsWith('video/')) return 'Video'
    if (type.startsWith('audio/')) return 'Music'
    if (type.includes('pdf')) return 'FileText'
    if (type.includes('word') || type.includes('document')) return 'FileText'
    if (type.includes('excel') || type.includes('spreadsheet')) return 'FileSpreadsheet'
    if (type.includes('powerpoint') || type.includes('presentation')) return 'FilePresentation'
    if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return 'Archive'
    if (type.includes('text')) return 'FileText'
    if (type.includes('json') || type.includes('javascript') || type.includes('html') || type.includes('css')) return 'Code'
    
    return 'File'
  }

  const iconName = getIconByType(type)
  
  return (
    <ApperIcon 
      name={iconName} 
      size={size} 
      className={`text-gray-500 ${className}`}
    />
  )
}

export default FileIcon