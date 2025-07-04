export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const formatUploadSpeed = (bytesPerSecond) => {
  return formatFileSize(bytesPerSecond) + '/s'
}

export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  } else {
    return `${remainingSeconds}s`
  }
}

export const getFileExtension = (filename) => {
  return filename.split('.').pop().toLowerCase()
}

export const isImageFile = (type) => {
  return type.startsWith('image/')
}

export const isVideoFile = (type) => {
  return type.startsWith('video/')
}

export const isAudioFile = (type) => {
  return type.startsWith('audio/')
}

export const isDocumentFile = (type) => {
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
]
  return documentTypes.includes(type)
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount)
}

export const calculateCommission = (commissionType, baseAmount, rate) => {
  switch (commissionType) {
    case 'per_post':
      return rate
    case 'per_sale':
      return baseAmount * (rate / 100)
    case 'product_in_hand':
      return baseAmount
    case 'combo':
      return rate
    default:
      return 0
  }
}

export const validateCommissionStructure = (structure) => {
  const { type, rate, baseAmount } = structure
  
  switch (type) {
    case 'per_post':
      return rate > 0
    case 'per_sale':
      return rate > 0 && rate <= 100
    case 'product_in_hand':
      return baseAmount > 0
    case 'combo':
      return rate > 0
    default:
      return false
  }
}