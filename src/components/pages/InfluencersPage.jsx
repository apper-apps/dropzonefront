import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import influencerService from '@/services/api/influencerService'
import campaignService from '@/services/api/campaignService'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'

const InfluencersPage = () => {
  const [influencers, setInfluencers] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [selectedInfluencer, setSelectedInfluencer] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    socialMedia: {
      instagram: '',
      tiktok: '',
      youtube: '',
      followers: ''
    },
    niches: [],
    location: '',
    bio: ''
  })

  const availableNiches = [
    'Electronics', 'Beauty', 'Fashion', 'Health', 'Home', 'Sports', 
    'Technology', 'Travel', 'Food', 'Books', 'Art', 'Music', 'Lifestyle'
  ]

  const termsAndConditions = `
INFLUENCER MARKETING PLATFORM TERMS AND CONDITIONS

1. PLATFORM OVERVIEW
This platform connects brands with influencers for marketing campaigns. By joining, you agree to promote products authentically and transparently.

2. COMMISSION STRUCTURE
- Per Post: Fixed payment for each promotional post
- Per Sale: Percentage-based commission on sales generated
- Product in Hand: Receive free products as compensation
- Combo Deals: Combination of payment and products

3. CONTENT REQUIREMENTS
- All content must clearly disclose paid partnerships (#ad, #sponsored)
- Content must align with your authentic voice and style
- No misleading claims about product benefits
- Maintain professional standards in all communications

4. PAYMENT TERMS
- Payments processed within 30 days of campaign completion
- Commission tracking through provided links
- Valid social media metrics required for payment
- Disputes resolved through platform mediation

5. OBLIGATIONS
- Deliver content by agreed deadlines
- Maintain follower count within 10% of stated metrics
- Respond to brand communications within 48 hours
- Provide usage rights for promotional content

6. PROHIBITED ACTIVITIES
- Fake followers or engagement manipulation
- Promoting competing brands during exclusive campaigns
- Sharing confidential brand information
- Violating platform community guidelines

7. TERMINATION
Either party may terminate with 7 days notice. Incomplete campaigns must be finished or compensation returned.

By clicking "I Accept", you acknowledge reading and agreeing to these terms.
  `

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [influencersData, campaignsData] = await Promise.all([
        influencerService.getAll(),
        campaignService.getAll()
      ])
      setInfluencers(influencersData)
      setCampaigns(campaignsData)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.socialMedia.followers) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.niches.length === 0) {
      toast.error('Please select at least one niche')
      return
    }

    try {
      const influencerData = {
        ...formData,
        socialMedia: {
          ...formData.socialMedia,
          followers: parseInt(formData.socialMedia.followers)
        }
      }

      const newInfluencer = await influencerService.create(influencerData)
      setSelectedInfluencer(newInfluencer)
      setShowTermsModal(true)
      setShowRegistrationForm(false)
      toast.success('Registration submitted! Please review and accept terms.')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleAcceptTerms = async () => {
    if (!selectedInfluencer) return

    try {
      await influencerService.acceptTerms(selectedInfluencer.Id)
      toast.success('Terms accepted! You can now join campaigns.')
      setShowTermsModal(false)
      setSelectedInfluencer(null)
      loadData()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleJoinCampaign = async (campaignId, influencerId) => {
    try {
      await campaignService.addInfluencerToCampaign(campaignId, influencerId)
      toast.success('Successfully joined campaign!')
      loadData()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      socialMedia: {
        instagram: '',
        tiktok: '',
        youtube: '',
        followers: ''
      },
      niches: [],
      location: '',
      bio: ''
    })
    setShowRegistrationForm(false)
  }

  const getEligibleCampaigns = (influencer) => {
    if (!influencer.termsAccepted) return []
    
    return campaigns.filter(campaign => {
      const hasRequiredFollowers = influencer.socialMedia.followers >= campaign.requirements.minFollowers
      const hasMatchingNiche = influencer.niches.some(niche => 
        campaign.requirements.niches.includes(niche)
      )
      const notAlreadyJoined = !influencer.joinedCampaigns.includes(campaign.Id)
      const hasCapacity = campaign.currentInfluencers < campaign.maxInfluencers
      
      return hasRequiredFollowers && hasMatchingNiche && notAlreadyJoined && hasCapacity
    })
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text">Influencers</h1>
          <p className="text-gray-600 mt-1">Join campaigns and connect with brands</p>
        </div>
        <Button
          onClick={() => setShowRegistrationForm(!showRegistrationForm)}
          className="btn-gradient"
        >
          <ApperIcon name="UserPlus" size={16} />
          Register as Influencer
        </Button>
      </div>

      {showRegistrationForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Influencer Registration</h2>
          
          <form onSubmit={handleRegistrationSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
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
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={formData.socialMedia.instagram}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialMedia: {...formData.socialMedia, instagram: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TikTok Handle
                </label>
                <input
                  type="text"
                  value={formData.socialMedia.tiktok}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialMedia: {...formData.socialMedia, tiktok: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube Channel
                </label>
                <input
                  type="text"
                  value={formData.socialMedia.youtube}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialMedia: {...formData.socialMedia, youtube: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Channel name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Followers *
                </label>
                <input
                  type="number"
                  value={formData.socialMedia.followers}
                  onChange={(e) => setFormData({
                    ...formData,
                    socialMedia: {...formData.socialMedia, followers: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content Niches *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableNiches.map(niche => (
                  <label key={niche} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.niches.includes(niche)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            niches: [...formData.niches, niche]
                          })
                        } else {
                          setFormData({
                            ...formData,
                            niches: formData.niches.filter(n => n !== niche)
                          })
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{niche}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tell us about yourself and your content..."
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="btn-gradient">
                Register
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

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Terms and Conditions</h3>
              <p className="text-sm text-gray-600 mt-1">
                Please review and accept to complete your registration
              </p>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-96">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                {termsAndConditions}
              </pre>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex gap-2">
              <Button
                onClick={handleAcceptTerms}
                className="btn-gradient flex-1"
              >
                <ApperIcon name="Check" size={16} />
                I Accept Terms
              </Button>
              <Button
                onClick={() => setShowTermsModal(false)}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 flex-1"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {influencers.map((influencer) => {
          const eligibleCampaigns = getEligibleCampaigns(influencer)
          
          return (
            <motion.div
              key={influencer.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{influencer.name}</h3>
                  <p className="text-gray-600 text-sm">{influencer.email}</p>
                  {influencer.location && (
                    <p className="text-gray-500 text-sm">{influencer.location}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    influencer.termsAccepted 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {influencer.termsAccepted ? 'Active' : 'Pending'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Followers:</span>
                  <span className="font-medium">{influencer.socialMedia.followers.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Campaigns:</span>
                  <span className="font-medium">{influencer.joinedCampaigns.length}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Niches:</span>
                  <span className="font-medium text-right">{influencer.niches.join(', ')}</span>
                </div>

                {influencer.socialMedia.instagram && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Instagram:</span>
                    <span className="font-medium">{influencer.socialMedia.instagram}</span>
                  </div>
                )}
              </div>

              {influencer.bio && (
                <p className="text-gray-600 text-sm mb-4">{influencer.bio}</p>
              )}

              {influencer.termsAccepted && eligibleCampaigns.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Available Campaigns:</h4>
                  {eligibleCampaigns.slice(0, 2).map((campaign) => (
                    <div key={campaign.Id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{campaign.title}</span>
                      <Button
                        onClick={() => handleJoinCampaign(campaign.Id, influencer.Id)}
                        className="bg-primary text-white hover:bg-primary/90 text-xs px-2 py-1"
                      >
                        Join
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {!influencer.termsAccepted && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <ApperIcon name="AlertCircle" size={16} className="inline mr-1" />
                    Please accept terms and conditions to join campaigns
                  </p>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {influencers.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Users" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No influencers registered yet</h3>
          <p className="text-gray-600 mb-4">Be the first to join our platform</p>
          <Button
            onClick={() => setShowRegistrationForm(true)}
            className="btn-gradient"
          >
            <ApperIcon name="UserPlus" size={16} />
            Register as Influencer
          </Button>
        </div>
      )}
    </div>
  )
}

export default InfluencersPage