import { useEffect, useState } from 'react';
import { createCompany } from '../api/companyApi';

export default function AddCompanyModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', location: '', city: '', foundedOn: '', description: '', logo: '' });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens to avoid autofill from previous entry
  useEffect(() => {
    if (open) {
      setForm({ name: '', location: '', city: '', foundedOn: '', description: '', logo: '' });
      setLogoFile(null);
      setLogoPreview('');
      setError('');
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  function updateField(key, value) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  function handleLogoFile(file) {
    setLogoFile(file || null);

    if (!file) {
      setLogoPreview('');
      updateField('logo', '');
      return;
    }

    // Limit logo file size to 10MB
    const MAX_BYTES = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_BYTES) {
      setError('Logo file exceeds 10MB limit. Please choose a smaller image.');
      setLogoFile(null);
      setLogoPreview('');
      updateField('logo', '');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setLogoPreview(result);
      updateField('logo', result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSave(e) {
    e.preventDefault();
    setError('');

    if (!form.name || !form.location || !form.city || !form.foundedOn) {
      setError('Please fill required fields.');
      return;
    }

    // Re-check logo file size before submitting
    const MAX_BYTES = 10 * 1024 * 1024; // 10MB
    if (logoFile && logoFile.size > MAX_BYTES) {
      setError('Logo file exceeds 10MB limit. Please choose a smaller image.');
      return;
    }

    try {
      setLoading(true);

      if (logoFile && !form.logo) {
        setError('Logo file is still loading. Please try again in a moment.');
        setLoading(false);
        return;
      }

      await createCompany({ ...form });

      setLoading(false);
      onCreated && onCreated();
      onClose && onClose();
    } catch (err) {
      setLoading(false);
      setError(err?.response?.data?.message || err?.message || 'Failed to create company');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-2 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative max-h-[calc(100vh-1rem)] w-full max-w-md overflow-y-auto rounded-t-[1.5rem] bg-white p-5 shadow-xl sm:max-h-[90vh] sm:rounded-2xl sm:p-6">
        <button className="absolute right-3 top-3 text-slate-500" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="mb-4 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 sm:h-20 sm:w-20" />
        </div>

        <h3 className="mb-4 text-center text-lg font-semibold sm:text-xl">Add Company</h3>

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Company name</label>
            <input value={form.name} onChange={(e) => updateField('name', e.target.value)} className="w-full rounded-2xl border px-3 py-3 text-sm" placeholder="Enter..." />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
            <input value={form.location} onChange={(e) => updateField('location', e.target.value)} className="w-full rounded-2xl border px-3 py-3 text-sm" placeholder="Select Location" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Founded on</label>
              <input value={form.foundedOn} onChange={(e) => updateField('foundedOn', e.target.value)} type="date" className="w-full rounded-2xl border px-3 py-3 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">City</label>
              <input value={form.city} onChange={(e) => updateField('city', e.target.value)} className="w-full rounded-2xl border px-3 py-3 text-sm" placeholder="City" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
            <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} className="w-full rounded-2xl border px-3 py-3 text-sm" rows={3} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Logo (file)</label>
            <input type="file" accept="image/*" onChange={(e) => handleLogoFile(e.target.files?.[0] || null)} className="w-full rounded-2xl border px-3 py-3 text-sm" />
            {logoPreview ? (
              <div className="mt-2 flex items-center gap-3">
                <img src={logoPreview} alt="Logo preview" className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-200" />
                <span className="text-xs text-slate-500">Preview ready</span>
              </div>
            ) : null}
          </div>

          {error ? <div className="text-sm text-red-600">{error}</div> : null}

          <div className="flex justify-center">
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-2 text-sm font-semibold text-white">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
