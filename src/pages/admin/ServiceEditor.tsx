import React, { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import type { Service, ServiceOption } from '../../types';

const CATEGORIES: Service['category'][] = [
  'Treatment',
  'Consultation',
  'Injection',
  'IV Therapy',
  'Skincare',
  'Other',
  'Threading & Waxing',
  'Medical',
  'Injectables',
];

function emptyService(): Service {
  return {
    id: '',
    name: '',
    category: 'Treatment',
    price: '',
    duration: '',
    description: '',
    longDescription: '',
    heroTitle: '',
    heroSubtitle: '',
    image: '',
    benefits: [],
    options: [],
    metaTitle: '',
    metaDescription: '',
    active: true,
    sortOrder: 0,
  };
}

export interface ServiceEditorProps {
  /** null = creating a brand-new service (empty id, backend generates a slug). */
  initial: Service | null;
  onSave: (service: Service) => Promise<void>;
  onCancel: () => void;
  uploadImage: (file: File) => Promise<string>;
}

const inputCls =
  'w-full bg-[#1A1A1A] border border-spa-border py-3 px-4 rounded-xl text-spa-ink focus:outline-none focus:border-emerald-500';
const labelCls = 'block text-[10px] uppercase tracking-widest font-bold text-spa-ink/50 mb-2';

const ServiceEditor: React.FC<ServiceEditorProps> = ({ initial, onSave, onCancel, uploadImage }) => {
  const [service, setService] = useState<Service>(() => (initial ? { ...initial } : emptyService()));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const isNew = !initial;

  const update = <K extends keyof Service>(key: K, value: Service[K]) => {
    setService(prev => ({ ...prev, [key]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file);
      if (url) {
        update('image', url);
      } else {
        setError('Image upload failed. Please try again.');
      }
    } catch {
      setError('Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const benefits = service.benefits || [];
  const updateBenefit = (idx: number, value: string) => {
    const next = [...benefits];
    next[idx] = value;
    update('benefits', next);
  };
  const addBenefit = () => update('benefits', [...benefits, '']);
  const removeBenefit = (idx: number) => {
    const next = [...benefits];
    next.splice(idx, 1);
    update('benefits', next);
  };

  const options = service.options || [];
  const updateOption = (idx: number, patch: Partial<ServiceOption>) => {
    const next = [...options];
    next[idx] = { ...next[idx], ...patch };
    update('options', next);
  };
  const addOption = () =>
    update('options', [
      ...options,
      { id: `opt-${Date.now()}`, name: '', price: '', duration: '', description: '' },
    ]);
  const removeOption = (idx: number) => {
    const next = [...options];
    next.splice(idx, 1);
    update('options', next);
  };

  const handleSave = async () => {
    if (!service.name.trim()) {
      setError('Name is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      // Belt-and-suspenders: `service` is already seeded from `initial` and
      // only ever updated via immutable spreads, so it already carries every
      // field `initial` had. This explicit merge guarantees fields this form
      // doesn't expose (idealFor, stepFlow, postCare, faqs, technology,
      // results, downtime, frequency, recovery, testimonials, precautions,
      // skinConcern, experience, productsUsed, ...) are never dropped even if
      // that invariant changes later.
      const merged: Service = initial ? { ...initial, ...service } : service;
      await onSave(merged);
    } catch {
      setError('Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-8">
      <div className="bg-[#111111] p-8 rounded-3xl w-full max-w-3xl border border-spa-border max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-serif text-spa-ink">{isNew ? 'New Service' : `Edit: ${initial?.name}`}</h2>
          <button type="button" onClick={onCancel} className="text-spa-ink/40 hover:text-spa-ink p-1">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-6 text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Name *</label>
              <input required className={inputCls} value={service.name} onChange={e => update('name', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select
                className={inputCls}
                value={service.category}
                onChange={e => update('category', e.target.value as Service['category'])}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c} className="bg-[#111111]">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Price</label>
              <input className={inputCls} placeholder="$150" value={service.price} onChange={e => update('price', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Duration</label>
              <input
                className={inputCls}
                placeholder="45 mins"
                value={service.duration}
                onChange={e => update('duration', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Short Description</label>
            <textarea
              rows={3}
              className={`${inputCls} resize-none`}
              value={service.description || ''}
              onChange={e => update('description', e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>Long Description</label>
            <textarea
              rows={5}
              className={`${inputCls} resize-none`}
              value={service.longDescription || ''}
              onChange={e => update('longDescription', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Hero Title</label>
              <input className={inputCls} value={service.heroTitle || ''} onChange={e => update('heroTitle', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Hero Subtitle</label>
              <input
                className={inputCls}
                value={service.heroSubtitle || ''}
                onChange={e => update('heroSubtitle', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Image</label>
            <div className="flex items-start gap-4">
              {service.image && (
                <img src={service.image} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-spa-border shrink-0" />
              )}
              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  className="block w-full text-xs text-spa-ink/60 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 file:cursor-pointer disabled:opacity-50"
                />
                {uploading && <p className="text-xs text-emerald-500">Uploading…</p>}
                <input
                  className={inputCls}
                  placeholder="Or paste an image URL"
                  value={service.image || ''}
                  onChange={e => update('image', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={`${labelCls} mb-0`}>Benefits</label>
              <button
                type="button"
                onClick={addBenefit}
                className="text-[10px] uppercase tracking-widest font-bold text-emerald-500 hover:text-emerald-400 flex items-center gap-1"
              >
                <Plus size={12} /> Add
              </button>
            </div>
            <div className="space-y-2">
              {benefits.map((b, idx) => (
                <div key={idx} className="flex gap-2">
                  <input className={inputCls} value={b} onChange={e => updateBenefit(idx, e.target.value)} />
                  <button type="button" onClick={() => removeBenefit(idx)} className="text-red-500/80 hover:text-red-500 px-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {benefits.length === 0 && <p className="text-spa-ink/40 italic text-xs">No benefits added.</p>}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={`${labelCls} mb-0`}>Options / Tiers</label>
              <button
                type="button"
                onClick={addOption}
                className="text-[10px] uppercase tracking-widest font-bold text-emerald-500 hover:text-emerald-400 flex items-center gap-1"
              >
                <Plus size={12} /> Add
              </button>
            </div>
            <div className="space-y-3">
              {options.map((opt, idx) => (
                <div key={opt.id || idx} className="border border-spa-border rounded-xl p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Name"
                      className={inputCls}
                      value={opt.name}
                      onChange={e => updateOption(idx, { name: e.target.value })}
                    />
                    <input
                      placeholder="Price"
                      className={inputCls}
                      value={opt.price}
                      onChange={e => updateOption(idx, { price: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      placeholder="Duration"
                      className={inputCls}
                      value={opt.duration || ''}
                      onChange={e => updateOption(idx, { duration: e.target.value })}
                    />
                    <input
                      placeholder="Description"
                      className={inputCls}
                      value={opt.description || ''}
                      onChange={e => updateOption(idx, { description: e.target.value })}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    className="text-[10px] uppercase tracking-widest font-bold text-red-500/80 hover:text-red-500 flex items-center gap-1"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              ))}
              {options.length === 0 && <p className="text-spa-ink/40 italic text-xs">No options added.</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <label className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-spa-ink/60 cursor-pointer">
              <input
                type="checkbox"
                checked={service.active !== false}
                onChange={e => update('active', e.target.checked)}
                className="accent-emerald-500"
              />
              Active
            </label>
            <div>
              <label className={labelCls}>Sort Order</label>
              <input
                type="number"
                className={inputCls}
                value={service.sortOrder ?? 0}
                onChange={e => update('sortOrder', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="border-t border-spa-border pt-6 space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-spa-ink/40 font-bold">SEO</h3>
            <div>
              <label className={labelCls}>Meta Title</label>
              <input className={inputCls} value={service.metaTitle || ''} onChange={e => update('metaTitle', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Meta Description</label>
              <textarea
                rows={2}
                className={`${inputCls} resize-none`}
                value={service.metaDescription || ''}
                onChange={e => update('metaDescription', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-8">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-spa-border py-3 rounded-xl font-bold text-spa-ink/60 hover:text-spa-ink"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white py-3 rounded-xl font-bold"
          >
            {saving ? 'Saving…' : 'Save Service'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceEditor;
