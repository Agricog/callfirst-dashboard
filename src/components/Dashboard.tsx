import { useState, useEffect, useCallback } from 'react';
import type { DashboardLead, ClientSettings } from '../types/index.js';
import { fetchLeads, fetchStats, fetchSettings } from '../utils/api.js';
import LeadCard from './LeadCard.js';
import SettingsPanel from './SettingsPanel.js';

const FILTER_TABS: { value: string; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'won', label: 'Won' },
];

export default function Dashboard() {
  const [leads, setLeads] = useState<DashboardLead[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [settings, setSettings] = useState<ClientSettings | null>(null);
  const [activeFilter, setActiveFilter] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (filter?: string) => {
    try {
      const [leadsData, statsData, settingsData] = await Promise.all([
        fetchLeads(filter || undefined),
        fetchStats(),
        fetchSettings(),
      ]);
      setLeads(leadsData);
      setStats(statsData);
      setSettings(settingsData);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Check your connection.');
      console.error('Dashboard load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(activeFilter);
    }, 30000);
    return () => clearInterval(interval);
  }, [loadData, activeFilter]);

  function handleFilterChange(filter: string) {
    setActiveFilter(filter);
    setIsLoading(true);
    loadData(filter);
  }

  function handleRefresh() {
    setIsLoading(true);
    loadData(activeFilter);
  }

  const totalLeads = Object.values(stats).reduce((a, b) => a + b, 0);
  const newCount = stats['new'] ?? 0;
  const wonCount = stats['won'] ?? 0;

  if (isLoading && leads.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-action border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-navy-700 text-white px-4 py-3 sticky top-0 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-bold text-lg">
              {settings?.businessName ?? 'CallFirst'}
            </h1>
            <p className="text-slate-300 text-xs">Lead Dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Refresh"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-action' : 'hover:bg-white/10'}`}
              aria-label="Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
            {error}
          </div>
        )}

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-slate-200">
            <p className="text-2xl font-bold text-slate-900">{totalLeads}</p>
            <p className="text-xs text-slate-500">Total</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-slate-200">
            <p className="text-2xl font-bold text-action">{newCount}</p>
            <p className="text-xs text-slate-500">New</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center shadow-sm border border-slate-200">
            <p className="text-2xl font-bold text-green-600">{wonCount}</p>
            <p className="text-xs text-slate-500">Won</p>
          </div>
        </div>

        {/* Settings panel (collapsible) */}
        {showSettings && settings && (
          <SettingsPanel settings={settings} onUpdate={handleRefresh} />
        )}

        {/* Filter tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
          {FILTER_TABS.map((tab) => {
            const count = tab.value ? (stats[tab.value] ?? 0) : totalLeads;
            return (
              <button
                key={tab.value}
                onClick={() => handleFilterChange(tab.value)}
                className={`flex-shrink-0 text-sm px-3 py-1.5 rounded-full font-medium transition-colors ${
                  activeFilter === tab.value
                    ? 'bg-navy-700 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className="ml-1 text-xs opacity-70">{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Lead cards */}
        {leads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg mb-1">No leads yet</p>
            <p className="text-slate-400 text-sm">
              {activeFilter ? 'Try a different filter' : 'Leads will appear here as they come in'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onStatusChange={handleRefresh} />
            ))}
          </div>
        )}

        {/* Loading indicator for refresh */}
        {isLoading && leads.length > 0 && (
          <div className="text-center py-2">
            <div className="w-5 h-5 border-2 border-action border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        )}
      </main>
    </div>
  );
}
