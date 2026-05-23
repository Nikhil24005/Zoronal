import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCompany } from '../api/companyApi';

const initialFormState = {
  name: '',
  location: '',
  city: '',
  foundedOn: '',
  description: '',
  logo: '',
};

function AddCompanyPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [logoPreview, setLogoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function handleLogoFileChange(event) {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setLogoPreview('');
      setFormData((currentForm) => ({
        ...currentForm,
        logo: '',
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setLogoPreview(result);
      setFormData((currentForm) => ({
        ...currentForm,
        logo: result,
      }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      await createCompany({
        name: formData.name,
        location: formData.location,
        city: formData.city,
        foundedOn: formData.foundedOn,
        description: formData.description,
        logo: formData.logo.trim(),
      });

      window.alert('Company created successfully.');
      navigate('/companies');
    } catch (error) {
      const apiMessage = error?.response?.data?.message;
      setErrorMessage(apiMessage || 'Unable to create company. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-soft">
        <div className="border-b border-slate-200/80 bg-gradient-to-r from-ink to-slate px-4 py-6 text-white sm:px-8 sm:py-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70 sm:text-sm">Company management</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:mt-3 sm:text-4xl">Add a new company</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
            Capture the core details for a company profile in a polished, consistent format.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-4 sm:space-y-6 sm:p-8">
          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Company Name" htmlFor="name" required>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/15"
                placeholder="Acme Studio"
              />
            </Field>

            <div>
              <span className="mb-2 block text-sm font-semibold text-ink">Logo File</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoFileChange}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-ink outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800 focus:border-accent focus:ring-4 focus:ring-accent/15"
              />
              {logoPreview ? (
                <div className="mt-3 flex items-center gap-3">
                  <img src={logoPreview} alt="Logo preview" className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-200" />
                  <span className="text-xs text-slate-500">Preview ready</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Location" htmlFor="location" required>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/15"
                placeholder="123 Market Street"
              />
            </Field>

            <Field label="City" htmlFor="city" required>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/15"
                placeholder="San Francisco"
              />
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Founded On" htmlFor="foundedOn" required>
              <input
                id="foundedOn"
                name="foundedOn"
                type="date"
                value={formData.foundedOn}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/15"
              />
            </Field>

            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
              Use the form to create a clean company profile with consistent data for downstream review and listing
              pages.
            </div>
          </div>

          <Field label="Description" htmlFor="description">
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:ring-4 focus:ring-accent/15"
              placeholder="Brief company overview, mission, or notes..."
            />
          </Field>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">Fields marked as required must be completed before submission.</p>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Saving company...' : 'Create Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, htmlFor, required = false, children }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">
        {label}
        {required ? <span className="ml-1 text-accent">*</span> : null}
      </span>
      {children}
    </label>
  );
}

export default AddCompanyPage;
