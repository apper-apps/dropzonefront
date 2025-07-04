const mockProducts = [
  {
    Id: 1,
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    images: [
      { id: 1, url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', alt: 'Headphones front view' },
      { id: 2, url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400', alt: 'Headphones side view' }
    ],
    niche: 'Electronics',
    category: 'Audio',
    sku: 'WH-001',
    stock: 50,
    status: 'active',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString()
  },
  {
    Id: 2,
    name: 'Organic Skincare Set',
    description: 'Complete skincare routine with organic ingredients',
    price: 89.99,
    images: [
      { id: 3, url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', alt: 'Skincare products' }
    ],
    niche: 'Beauty',
    category: 'Skincare',
    sku: 'SK-002',
    stock: 25,
    status: 'active',
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString()
  }
]

let products = [...mockProducts]
let nextId = 3

export const productService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...products]
  },

  async getById(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid product ID')
    }
    
    await new Promise(resolve => setTimeout(resolve, 200))
    const product = products.find(p => p.Id === id)
    return product ? { ...product } : null
  },

  async create(productData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const newProduct = {
      ...productData,
      Id: nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    }
    
    products.push(newProduct)
    return { ...newProduct }
  },

  async update(id, productData) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid product ID')
    }
    
    await new Promise(resolve => setTimeout(resolve, 350))
    
    const index = products.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Product not found')
    }
    
    const updatedProduct = {
      ...products[index],
      ...productData,
      Id: id, // Preserve ID
      updatedAt: new Date().toISOString()
    }
    
    products[index] = updatedProduct
    return { ...updatedProduct }
  },

  async delete(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid product ID')
    }
    
    await new Promise(resolve => setTimeout(resolve, 250))
    
    const index = products.findIndex(p => p.Id === id)
    if (index === -1) {
      throw new Error('Product not found')
    }
    
    products.splice(index, 1)
    return true
  },

  async searchByNiche(niche) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return products.filter(p => 
      p.niche.toLowerCase().includes(niche.toLowerCase())
    ).map(p => ({ ...p }))
  },

  async getNiches() {
    await new Promise(resolve => setTimeout(resolve, 150))
    const niches = [...new Set(products.map(p => p.niche))]
    return niches.sort()
  }
}

export default productService