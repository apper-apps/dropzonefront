import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import productService from '@/services/api/productService'
import { fileUploadService } from '@/services/api/fileUploadService'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { formatCurrency } from '@/utils/formatters'

const ProductsPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    niche: '',
    category: '',
    sku: '',
    stock: ''
  })
  const [images, setImages] = useState([])
  const [uploadingImages, setUploadingImages] = useState(false)

  const niches = [
    'Electronics', 'Beauty', 'Fashion', 'Health', 'Home', 'Sports', 
    'Technology', 'Travel', 'Food', 'Books', 'Art', 'Music'
  ]

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productService.getAll()
      setProducts(data)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (files) => {
    if (files.length === 0) return

    setUploadingImages(true)
    const uploadPromises = Array.from(files).map(file => 
      fileUploadService.uploadProductImage(file, () => {})
    )

    try {
      const uploadedImages = await Promise.all(uploadPromises)
      setImages(prev => [...prev, ...uploadedImages])
      toast.success(`${uploadedImages.length} images uploaded successfully`)
    } catch (err) {
      toast.error('Failed to upload images')
    } finally {
      setUploadingImages(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description || !formData.price || !formData.niche) {
      toast.error('Please fill in all required fields')
      return
    }

    if (images.length === 0) {
      toast.error('Please upload at least one product image')
      return
    }

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        images: images.map((img, index) => ({
          id: index + 1,
          url: img.url,
          alt: `${formData.name} image ${index + 1}`
        }))
      }

      if (editingProduct) {
        await productService.update(editingProduct.Id, productData)
        toast.success('Product updated successfully')
      } else {
        await productService.create(productData)
        toast.success('Product created successfully')
      }

      resetForm()
      loadProducts()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      niche: product.niche,
      category: product.category,
      sku: product.sku,
      stock: product.stock.toString()
    })
    setImages(product.images || [])
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await productService.delete(id)
      toast.success('Product deleted successfully')
      loadProducts()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      niche: '',
      category: '',
      sku: '',
      stock: ''
    })
    setImages([])
    setEditingProduct(null)
    setShowForm(false)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadProducts} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="btn-gradient"
        >
          <ApperIcon name="Plus" size={16} />
          Add Product
        </Button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niche *
                </label>
                <select
                  value={formData.niche}
                  onChange={(e) => setFormData({...formData, niche: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Select a niche</option>
                  {niches.map(niche => (
                    <option key={niche} value={niche}>{niche}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Images *
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={uploadingImages}
              />
              {uploadingImages && (
                <p className="text-sm text-gray-500 mt-1">Uploading images...</p>
              )}
              {images.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative w-20 h-20">
                      <img
                        src={image.url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="btn-gradient">
                {editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
              <Button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            {product.images && product.images.length > 0 && (
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <span className="text-lg font-bold text-primary">
                  {formatCurrency(product.price)}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span className="bg-gray-100 px-2 py-1 rounded">{product.niche}</span>
                <span>Stock: {product.stock}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(product)}
                  className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
                >
                  <ApperIcon name="Edit" size={14} />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(product.Id)}
                  className="flex-1 bg-red-500 text-white hover:bg-red-600"
                >
                  <ApperIcon name="Trash2" size={14} />
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Package" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first product</p>
          <Button
            onClick={() => setShowForm(true)}
            className="btn-gradient"
          >
            <ApperIcon name="Plus" size={16} />
            Add Product
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProductsPage