const mockCampaigns = [
  {
    Id: 1,
    title: 'Summer Tech Launch',
    description: 'Promote our latest wireless headphones for the summer season',
    productIds: [1],
    commissionStructure: {
      type: 'per_sale',
      rate: 15,
      baseAmount: 199.99
    },
    requirements: {
      minFollowers: 10000,
      niches: ['Electronics', 'Technology'],
      platforms: ['Instagram', 'TikTok']
    },
    status: 'active',
    startDate: new Date('2024-06-01').toISOString(),
    endDate: new Date('2024-08-31').toISOString(),
    maxInfluencers: 50,
    currentInfluencers: 12,
    budget: 15000,
    createdAt: new Date('2024-05-15').toISOString(),
    updatedAt: new Date('2024-05-15').toISOString()
  },
  {
    Id: 2,
    title: 'Beauty Routine Challenge',
    description: 'Showcase our organic skincare set with before/after content',
    productIds: [2],
    commissionStructure: {
      type: 'combo',
      rate: 120,
      baseAmount: 89.99
    },
    requirements: {
      minFollowers: 5000,
      niches: ['Beauty', 'Skincare'],
      platforms: ['Instagram', 'YouTube']
    },
    status: 'active',
    startDate: new Date('2024-05-20').toISOString(),
    endDate: new Date('2024-07-20').toISOString(),
    maxInfluencers: 30,
    currentInfluencers: 8,
    budget: 10000,
    createdAt: new Date('2024-05-10').toISOString(),
    updatedAt: new Date('2024-05-10').toISOString()
  }
]

let campaigns = [...mockCampaigns]
let nextId = 3

export const campaignService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...campaigns]
  },

  async getById(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid campaign ID')
    }
    
    await new Promise(resolve => setTimeout(resolve, 200))
    const campaign = campaigns.find(c => c.Id === id)
    return campaign ? { ...campaign } : null
  },

  async create(campaignData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const newCampaign = {
      ...campaignData,
      Id: nextId++,
      currentInfluencers: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    campaigns.push(newCampaign)
    return { ...newCampaign }
  },

  async update(id, campaignData) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid campaign ID')
    }
    
    await new Promise(resolve => setTimeout(resolve, 350))
    
    const index = campaigns.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Campaign not found')
    }
    
    const updatedCampaign = {
      ...campaigns[index],
      ...campaignData,
      Id: id, // Preserve ID
      updatedAt: new Date().toISOString()
    }
    
    campaigns[index] = updatedCampaign
    return { ...updatedCampaign }
  },

  async delete(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid campaign ID')
    }
    
    await new Promise(resolve => setTimeout(resolve, 250))
    
    const index = campaigns.findIndex(c => c.Id === id)
    if (index === -1) {
      throw new Error('Campaign not found')
    }
    
    campaigns.splice(index, 1)
    return true
  },

  async getActiveCampaigns() {
    await new Promise(resolve => setTimeout(resolve, 200))
    return campaigns.filter(c => c.status === 'active').map(c => ({ ...c }))
  },

  async addInfluencerToCampaign(campaignId, influencerId) {
    if (!Number.isInteger(campaignId) || !Number.isInteger(influencerId)) {
      throw new Error('Invalid campaign or influencer ID')
    }
    
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const campaign = campaigns.find(c => c.Id === campaignId)
    if (!campaign) {
      throw new Error('Campaign not found')
    }
    
    if (campaign.currentInfluencers >= campaign.maxInfluencers) {
      throw new Error('Campaign is at maximum capacity')
    }
    
    campaign.currentInfluencers += 1
    campaign.updatedAt = new Date().toISOString()
    
    return { ...campaign }
  }
}

export default campaignService