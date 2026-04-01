import { useState } from 'react';
import type { ClientSettings } from '../types/index.js';
import { updateSettings } from '../utils/api.js';

interface SettingsPanelProps {
  settings: ClientSettings;
  onUpdate: () => void;
}

export default function SettingsPanel({ settings, onUpdate }: SettingsPanelProps) {
  const [urgency, setUrgency] = useState(settings.urgencyMode);
  const [discount, setDiscount] = useState(settings.discountPercent);
  const [priceGuide, setPriceGuide] = useState(settings.priceGuidance);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    setSaved(false);
    try {
      await updateSettings({
        urgencyMode: urgency,
        discountPercent: discount,
        priceGuidance: priceGuide,
      });
      setSaved(true);
      onUpdate();
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
      <h2 className="font-semibold text-slate-900">Pipeline Controls</h2>

      {/* Urgency toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-700">Urgency Mode</p>
          <p className="text-xs text-slate-500">AI tells customers you have availability this week</p>
        </div>
        <button
          onClick={() => setUrgency(!urgency)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            urgency ? 'bg-action' : 'bg-slate-300'
          }`}
          role="switch"
          aria-checked={urgency}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
              urgency ? 'translate-x-6' : ''
            }`}
          />
        </button>
      </div>

      {/* Discount slider */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-slate-700">Discount</p>
          <span className="text-sm font-semibold text-action">
            {discount > 0 ? `${discount}% off` : 'None'}
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-2">AI mentions this when giving price estimates</p>
        <input
          type="range"
          min={0}
          max={50}
          step={5}
          value={discount}
          onChange={(e) => setDiscount(parseInt(e.target.value, 10))}
          className="w-full accent-action"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
        </div>
      </div>

      {/* Price guidance editor */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-1">Price Guide</p>
        <p className="text-xs text-slate-500 mb-2">
          The AI uses these to give customers rough estimates. Write them in plain English.
        </p>
        <textarea
          value={priceGuide}
          onChange={(e) => setPriceGuide(e.target.value)}
          rows={4}
          placeholder="e.g. Chimney £450-700, gable end £500-750, full house £1500-3000"
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-action focus:border-transparent resize-none"
        />
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`w-full py-2.5 rounded-lg font-medium text-sm transition-colors ${
          saved
            ? 'bg-green-600 text-white'
            : 'bg-navy-700 hover:bg-navy-800 text-white'
        } ${isSaving ? 'opacity-50' : ''}`}
      >
        {saved ? '✓ Saved' : isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
