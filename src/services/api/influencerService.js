const mockInfluencers = [
  {
    Id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0123',
    socialMedia: {
      instagram: '@sarah_lifestyle',
      tiktok: '@sarahj_official',
      followers: 85000
    },
    niches: ['Beauty', 'Fashion', 'Lifestyle'],
    location: 'Los Angeles, CA',
    bio: 'Beauty enthusiast and lifestyle content creator',
    status: 'active',
    joinedCampaigns: [1, 2],
    termsAccepted: true,
    termsAcceptedAt: new Date('2024-05-01').toISOString(),
    createdAt: new Date('2024-04-15').toISOString(),
    updatedAt: new Date('2024-05-01').toISOString()
  },
  {
    Id: 2,
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    phone: '+1-555-0456',
    socialMedia: {
      instagram: '@tech_with_mike',
      youtube: 'TechMike',
      followers: 125000
    },
    niches: ['Technology', 'Electronics', 'Gaming'],
    location: 'San Francisco, CA',
    bio: 'Tech reviewer and gadget enthusiast',
    status: 'active',
    joinedCampaigns: [1],
    termsAccepted: true,
    termsAcceptedAt: new Date('2024-04-20').toISOString(),
    createdAt: new Date('2024-04-10').toISOString(),
    updatedAt: new Date('2024-04-20').toISOString()
  }
]

let influencers = [...mockInfluencers]
let nextId = 3

export const influencerService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...influencers]
  },

  async getById(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid influencer ID')
    }
    
    await new Promise(resolve => setTimeout(resolve, 200))
    const influencer = influencers.find(i => i.Id === id)
    return influencer ? { ...influencer } : null
  },

  async create(influencerData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const newInfluencer = {
      ...influencerData,
      Id: nextId++,
      status: 'pending',
      joinedCampaigns: [],
      termsAccepted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    influencers.push(newInfluencer)
    return { ...newInfluencer }
  },

  async update(id, influencerData) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid influencer ID')
    }
    
    await new Promise(resolve => setTimeout(resolve, 350))
    
    const index = influencers.findIndex(i => i.Id === id)
    if (index === -1) {
      throw new Error('Influencer not found')
    }
    
    const updatedInfluencer = {
      ...influencers[index],
      ...influencerData,
      Id: id, // Preserve ID
      updatedAt: new Date().toISOString()
    }
    
    influencers[index] = updatedInfluencer
    return { ...updatedInfluencer }
  },

  async delete(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid influencer ID')
    }
    
    await new Promise(resolve => setTimeout(resolve, 250))
    
    const index = influencers.findIndex(i => i.Id === id)
    if (index === -1) {
      throw new Error('Influencer not found')
    }
    
    influencers.splice(index, 1)
    return true
  },

  async acceptTerms(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid influencer ID')
    }
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const influencer = influencers.find(i => i.Id === id)
    if (!influencer) {
      throw new Error('Influencer not found')
    }
    
    influencer.termsAccepted = true
    influencer.termsAcceptedAt = new Date().toISOString()
    influencer.status = 'active'
    influencer.updatedAt = new Date().toISOString()
    
    return { ...influencer }
  },

  async searchByNiche(niche) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return influencers.filter(i => 
      i.niches.some(n => n.toLowerCase().includes(niche.toLowerCase()))
    ).map(i => ({ ...i }))
  },

  async getEligibleForCampaign(campaignRequirements) {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    return influencers.filter(influencer => {
      if (!influencer.termsAccepted || influencer.status !== 'active') {
        return false
      }
      
      const hasRequiredFollowers = influencer.socialMedia.followers >= campaignRequirements.minFollowers
      const hasMatchingNiche = influencer.niches.some(niche => 
        campaignRequirements.niches.includes(niche)
      )
      
      return hasRequiredFollowers && hasMatchingNiche
    }).map(i => ({ ...i }))
  }
}

export default influencerService