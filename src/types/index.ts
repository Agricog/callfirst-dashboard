export interface DashboardLead {
  id: string;
  customerName: string;
  customerPhone: string;
  jobType: string;
  propertyType: string;
  estimatedValue: string;
  callbackTime: string;
  leadScore: 'hot' | 'warm' | 'cold';
  area: string;
  suggestedOpener: string;
  status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost' | 'dead' | 'completed';
  createdAt: string;
}

export interface ClientSettings {
  businessName: string;
  contactName: string;
  trade: string;
  area: string;
  urgencyMode: boolean;
  discountPercent: number;
  priceGuidance: string;
}

export type LeadStatus = DashboardLead['status'];
