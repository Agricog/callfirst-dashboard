import type { DashboardLead, ClientSettings, LeadStatus } from '../types/index.js';

const API_URL = import.meta.env.VITE_API_URL as string;
const API_KEY = import.meta.env.VITE_API_KEY as string;

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

export async function fetchLeads(status?: string): Promise<DashboardLead[]> {
  const query = status ? `?status=${status}` : '';
  const data = await apiFetch<{ leads: DashboardLead[] }>(`/api/dashboard/leads${query}`);
  return data.leads;
}

export async function fetchStats(): Promise<Record<string, number>> {
  const data = await apiFetch<{ stats: Record<string, number> }>('/api/dashboard/stats');
  return data.stats;
}

export async function updateLeadStatus(leadId: string, status: LeadStatus): Promise<void> {
  await apiFetch(`/api/dashboard/leads/${leadId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function fetchSettings(): Promise<ClientSettings> {
  return apiFetch<ClientSettings>('/api/dashboard/settings');
}

export async function updateSettings(settings: Partial<Pick<ClientSettings, 'urgencyMode' | 'discountPercent' | 'priceGuidance'>>): Promise<void> {
  await apiFetch('/api/dashboard/settings', {
    method: 'PATCH',
    body: JSON.stringify(settings),
  });
}
