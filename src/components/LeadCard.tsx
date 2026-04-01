import { useState } from 'react';
import type { DashboardLead, LeadStatus } from '../types/index.js';
import { updateLeadStatus } from '../utils/api.js';

const SCORE_STYLES = {
  hot: { bg: 'bg-red-100', text: 'text-red-700', icon: '🔥' },
  warm: { bg: 'bg-amber-100', text: 'text-amber-700', icon: '🟡' },
  cold: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '🔵' },
} as const;

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'won', label: 'Won ✅' },
  { value: 'lost', label: 'Lost' },
  { value: 'dead', label: 'Dead' },
];

interface LeadCardProps {
  lead: DashboardLead;
  onStatusChange: () => void;
}

export default function LeadCard({ lead, onStatusChange }: LeadCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showOpener, setShowOpener] = useState(false);
  const score = SCORE_STYLES[lead.leadScore];

  const timeAgo = getTimeAgo(lead.createdAt);

  async function handleStatusChange(newStatus: LeadStatus) {
    if (newStatus === lead.status) return;
    setIsUpdating(true);
    try {
      await updateLeadStatus(lead.id, newStatus);
      onStatusChange();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-3">
      {/* Header: name + score + time */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-900 text-lg">{lead.customerName}</h3>
          <p className="text-slate-500 text-sm">{timeAgo}</p>
        </div>
        <span className={`${score.bg} ${score.text} text-xs font-medium px-2.5 py-1 rounded-full`}>
          {score.icon} {lead.leadScore}
        </span>
      </div>

      {/* Job details */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">🔧</span>
          <span className="text-slate-700 font-medium">{lead.jobType}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">🏠</span>
          <span className="text-slate-600">{lead.propertyType}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">💷</span>
          <span className="text-slate-600">{lead.estimatedValue}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">⏰</span>
          <span className="text-slate-600">Callback: {lead.callbackTime}</span>
        </div>
      </div>

      {/* Phone + call button */}
      <a
        href={`tel:${lead.customerPhone}`}
        className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        Call {lead.customerName}
      </a>

      {/* Suggested opener */}
      <button
        onClick={() => setShowOpener(!showOpener)}
        className="w-full text-left text-xs text-action font-medium"
      >
        {showOpener ? '▾ Hide opening line' : '▸ Show suggested opening line'}
      </button>
      {showOpener && (
        <p className="text-sm text-slate-600 bg-amber-50 border border-amber-200 rounded-lg p-3 italic">
          "{lead.suggestedOpener}"
        </p>
      )}

      {/* Status selector */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleStatusChange(opt.value)}
            disabled={isUpdating}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              lead.status === opt.value
                ? 'bg-navy-700 text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            } ${isUpdating ? 'opacity-50' : ''}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
