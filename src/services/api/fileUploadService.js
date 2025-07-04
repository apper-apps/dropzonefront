export const fileUploadService = {
  async uploadFile(file, onProgress) {
    return new Promise((resolve, reject) => {
      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 15
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          
          // Simulate success/failure
          if (Math.random() > 0.1) { // 90% success rate
            resolve({
              id: Date.now() + Math.random(),
              name: file.name,
              size: file.size,
              type: file.type,
              uploadedAt: new Date().toISOString(),
              url: URL.createObjectURL(file)
            })
          } else {
            reject(new Error('Upload failed'))
          }
        }
        
        onProgress(progress)
      }, 100)
    })
  },

  async getUploadHistory() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return [
      {
        id: 1,
        name: 'document.pdf',
        size: 1024 * 1024 * 2,
        type: 'application/pdf',
        uploadedAt: new Date(Date.now() - 3600000).toISOString(),
        url: '#'
      },
      {
        id: 2,
        name: 'image.jpg',
        size: 1024 * 512,
        type: 'image/jpeg',
        uploadedAt: new Date(Date.now() - 7200000).toISOString(),
        url: '#'
}
    ]
  },

  async uploadProductImage(file, onProgress) {
    return new Promise((resolve, reject) => {
      // Simulate image upload with progress
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 20
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          
          if (Math.random() > 0.05) { // 95% success rate for images
            resolve({
              id: Date.now() + Math.random(),
              url: URL.createObjectURL(file),
              name: file.name,
              size: file.size,
              type: file.type,
              uploadedAt: new Date().toISOString()
            })
          } else {
            reject(new Error('Image upload failed'))
          }
        }
        
        onProgress(progress)
      }, 80)
    })
  },

  async generateTrackingLink(campaignId, influencerId) {
    // Simulate tracking link generation
    await new Promise(resolve => setTimeout(resolve, 200))
    return `https://track.influencerhub.com/c/${campaignId}/i/${influencerId}?ref=${Date.now()}`
  }
}