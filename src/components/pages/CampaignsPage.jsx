import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import campaignService from '@/services/api/campaignService'
import productService from '@/services/api/productService'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { formatCurrency, calculateCommission, validateCommissionStructure } from '@/utils/formatters'

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    productIds: [],
    commissionStructure: {
      type: 'per_sale',
      rate: 10,
      baseAmount: 0
    },
    requirements: {
      minFollowers: 1000,
      niches: [],
      platforms: []
    },
    startDate: '',
    endDate: '',
    maxInfluencers: 10,
    budget: 1000
  })

  const commissionTypes = [
    { value: 'per_post', label: 'Per Post', description: 'Fixed payment per post' },
    { value: 'per_sale', label: 'Per Sale', description: 'Percentage of each sale' },
    { value: 'product_in_hand', label: 'Product In Hand', description: 'Free product as payment' },
    { value: 'combo', label: 'Combo Deal', description: 'Mix of payment and product' }
  ]

  const platforms = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'Facebook']
  const niches = ['Electronics', 'Beauty', 'Fashion', 'Health', 'Home', 'Sports', 'Technology', 'Travel']

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [campaignsData, productsData] = await Promise.all([
        campaignService.getAll(),
        productService.getAll()
      ])
      setCampaigns(campaignsData)
      setProducts(productsData)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || formData.productIds.length === 0) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!validateCommissionStructure(formData.commissionStructure)) {
      toast.error('Invalid commission structure')
      return
    }

    try {
      const campaignData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        productIds: formData.productIds.map(id => parseInt(id))
      }

      if (editingCampaign) {
        await campaignService.update(editingCampaign.Id, campaignData)
        toast.success('Campaign updated successfully')
      } else {
        await campaignService.create(campaignData)
        toast.success('Campaign created successfully')
      }

      resetForm()
      loadData()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleEdit = (campaign) => {
    setEditingCampaign(campaign)
    setFormData({
      title: campaign.title,
      description: campaign.description,
      productIds: campaign.productIds,
      commissionStructure: campaign.commissionStructure,
      requirements: campaign.requirements,
      startDate: campaign.startDate.split('T')[0],
      endDate: campaign.endDate.split('T')[0],
      maxInfluencers: campaign.maxInfluencers,
      budget: campaign.budget
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return

    try {
      await campaignService.delete(id)
      toast.success('Campaign deleted successfully')
      loadData()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      productIds: [],
      commissionStructure: {
        type: 'per_sale',
        rate: 10,
        baseAmount: 0
      },
      requirements: {
        minFollowers: 1000,
        niches: [],
        platforms: []
      },
      startDate: '',
      endDate: '',
      maxInfluencers: 10,
      budget: 1000
    })
    setEditingCampaign(null)
    setShowForm(false)
  }

  const getCommissionDisplay = (structure) => {
    const { type, rate, baseAmount } = structure
    switch (type) {
      case 'per_post':
        return `${formatCurrency(rate)} per post`
      case 'per_sale':
        return `${rate}% per sale`
      case 'product_in_hand':
        return `Free product (${formatCurrency(baseAmount)} value)`
      case 'combo':
        return `${formatCurrency(rate)} + product`
      default:
        return 'Unknown'
    }
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text">Campaigns</h1>
          <p className="text-gray-600 mt-1">Create and manage influencer campaigns</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="btn-gradient"
        >
          <ApperIcon name="Plus" size={16} />
          Create Campaign
        </Button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold mb-4">
            {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget
                </label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: parseInt(e.target.value)})}
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
                Products *
              </label>
              <select
                multiple
                value={formData.productIds}
                onChange={(e) => setFormData({
                  ...formData,
                  productIds: Array.from(e.target.selectedOptions, option => parseInt(option.value))
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                size="4"
              >
                {products.map(product => (
                  <option key={product.Id} value={product.Id}>
                    {product.name} - {formatCurrency(product.price)}
                  </option>
                ))}
              </select>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-3">Commission Structure</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commission Type
                  </label>
                  <select
                    value={formData.commissionStructure.type}
                    onChange={(e) => setFormData({
                      ...formData,
                      commissionStructure: {
                        ...formData.commissionStructure,
                        type: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {commissionTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label} - {type.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {formData.commissionStructure.type === 'per_sale' ? 'Percentage' : 'Rate'}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.commissionStructure.rate}
                      onChange={(e) => setFormData({
                        ...formData,
                        commissionStructure: {
                          ...formData.commissionStructure,
                          rate: parseFloat(e.target.value)
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Base Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.commissionStructure.baseAmount}
                      onChange={(e) => setFormData({
                        ...formData,
                        commissionStructure: {
                          ...formData.commissionStructure,
                          baseAmount: parseFloat(e.target.value)
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-3">Requirements</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Followers
                  </label>
                  <input
                    type="number"
                    value={formData.requirements.minFollowers}
                    onChange={(e) => setFormData({
                      ...formData,
                      requirements: {
                        ...formData.requirements,
                        minFollowers: parseInt(e.target.value)
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Niches
                  </label>
                  <select
                    multiple
                    value={formData.requirements.niches}
                    onChange={(e) => setFormData({
                      ...formData,
                      requirements: {
                        ...formData.requirements,
                        niches: Array.from(e.target.selectedOptions, option => option.value)
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    size="3"
                  >
                    {niches.map(niche => (
                      <option key={niche} value={niche}>{niche}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platforms
                  </label>
                  <select
                    multiple
                    value={formData.requirements.platforms}
                    onChange={(e) => setFormData({
                      ...formData,
                      requirements: {
                        ...formData.requirements,
                        platforms: Array.from(e.target.selectedOptions, option => option.value)
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    size="3"
                  >
                    {platforms.map(platform => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Influencers
                </label>
                <input
                  type="number"
                  value={formData.maxInfluencers}
                  onChange={(e) => setFormData({...formData, maxInfluencers: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="btn-gradient">
                {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaigns.map((campaign) => (
          <motion.div
            key={campaign.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">{campaign.title}</h3>
                <p className="text-gray-600 text-sm">{campaign.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {campaign.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Commission:</span>
                <span className="font-medium">{getCommissionDisplay(campaign.commissionStructure)}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Influencers:</span>
                <span className="font-medium">{campaign.currentInfluencers}/{campaign.maxInfluencers}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Budget:</span>
                <span className="font-medium">{formatCurrency(campaign.budget)}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Min Followers:</span>
                <span className="font-medium">{campaign.requirements.minFollowers.toLocaleString()}</span>
              </div>

              {campaign.requirements.niches.length > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Niches:</span>
                  <span className="font-medium">{campaign.requirements.niches.join(', ')}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleEdit(campaign)}
                className="flex-1 bg-blue-500 text-white hover:bg-blue-600"
              >
                <ApperIcon name="Edit" size={14} />
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(campaign.Id)}
                className="flex-1 bg-red-500 text-white hover:bg-red-600"
              >
                <ApperIcon name="Trash2" size={14} />
                Delete
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {campaigns.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Megaphone" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
          <p className="text-gray-600 mb-4">Create your first campaign to get started</p>
          <Button
            onClick={() => setShowForm(true)}
            className="btn-gradient"
          >
            <ApperIcon name="Plus" size={16} />
            Create Campaign
          </Button>
        </div>
      )}
    </div>
  )
}

export default CampaignsPage