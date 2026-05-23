import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCompanyById } from '../api/companyApi';

function CompanyDetailsPage() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isActive = true;

    async function loadCompany() {
      try {
        setLoading(true);
        setErrorMessage('');
        const response = await getCompanyById(id);

        if (isActive) {
          setCompany(response?.data ?? null);
        }
      } catch (error) {
        if (isActive) {
          setErrorMessage(error?.response?.data?.message || 'Unable to load company details.');
          setCompany(null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadCompany();

    return () => {
      isActive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="animate-pulse rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-soft">
          <div className="h-6 w-40 rounded-full bg-slate-200" />
          <div className="mt-6 h-10 w-3/4 rounded-full bg-slate-200" />
          <div className="mt-4 h-4 w-1/2 rounded-full bg-slate-100" />
          <div className="mt-8 space-y-3">
            <div className="h-4 w-full rounded-full bg-slate-100" />
            <div className="h-4 w-11/12 rounded-full bg-slate-100" />
            <div className="h-4 w-10/12 rounded-full bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-red-700 shadow-soft">
          <h1 className="text-2xl font-bold text-red-900">Company not available</h1>
          <p className="mt-3 text-sm leading-6">{errorMessage}</p>
          <Link
            to="/companies"
            className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to companies
          </Link>
        </div>
      </div>
    );
  }

  if (!company) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-soft">
        <div className="bg-gradient-to-r from-ink to-slate px-6 py-8 text-white sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">Company details</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{company.name}</h1>
          <p className="mt-3 text-sm text-white/75">{company.city}</p>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailCard label="Location" value={company.location} />
            <DetailCard label="Founded On" value={formatDate(company.foundedOn)} />
          </div>

          <DetailCard label="Description" value={company.description || 'No description provided.'} fullWidth />

          <div className="flex flex-wrap gap-3">
            <Link
              to="/companies"
              className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Back to companies
            </Link>
            <Link
              to="/add-company"
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-slate-50"
            >
              Add Company
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({ label, value, fullWidth = false }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-slate-50 p-5 ${fullWidth ? 'sm:col-span-2' : ''}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">{label}</p>
      <p className="mt-2 text-sm leading-6 text-ink">{value}</p>
    </div>
  );
}

function formatDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export default CompanyDetailsPage;
