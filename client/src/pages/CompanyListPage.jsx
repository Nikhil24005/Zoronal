import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AddCompanyModal from '../components/AddCompanyModal';
import { getAllCompanies } from '../api/companyApi';

const skeletonCards = Array.from({ length: 6 }, (_, index) => index);

function CompanyListPage() {
  const [companies, setCompanies] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [addOpen, setAddOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const debounceTimer = window.setTimeout(() => {
      setSearchTerm(searchInput.trim());
    }, 500);

    return () => {
      window.clearTimeout(debounceTimer);
    };
  }, [searchInput]);

  useEffect(() => {
    let isActive = true;

    async function loadCompanies() {
      try {
        setLoading(true);
        setErrorMessage('');
        const response = await getAllCompanies(searchTerm, page, limit);
        const companyList = Array.isArray(response?.data) ? response.data : [];

        if (isActive) {
          setCompanies(companyList);
          setTotal(response?.meta?.total || 0);
          setTotalPages(response?.meta?.totalPages || 1);
        }
      } catch (error) {
        if (isActive) {
          setErrorMessage('Unable to load companies. Please try again.');
          setCompanies([]);
          setTotal(0);
          setTotalPages(1);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadCompanies();

    return () => {
      isActive = false;
    };
  }, [searchTerm, page, limit, refreshKey]);

  const emptyStateMessage = useMemo(() => {
    if (searchTerm) {
      return `No companies found for "${searchTerm}".`;
    }

    return 'No companies found yet. Add the first company to get started.';
  }, [searchTerm]);

  const sortedCompanies = useMemo(() => {
    const companyList = [...companies];

    switch (sortBy) {
      case 'location':
        return companyList.sort((left, right) => (left.location || '').localeCompare(right.location || ''));
      case 'foundedOn':
        return companyList.sort((left, right) => new Date(left.foundedOn || 0) - new Date(right.foundedOn || 0));
      case 'name':
      default:
        return companyList.sort((left, right) => (left.name || '').localeCompare(right.name || ''));
    }
  }, [companies, sortBy]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchInput.trim());
  }

  return (
    <div className="relative mx-auto max-w-[1400px] px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
      <form
        onSubmit={handleSearchSubmit}
        className="mb-8 rounded-[1.5rem] border-t border-slate-200/80 bg-white px-4 pb-5 pt-6 shadow-[0_16px_40px_-26px_rgba(15,23,42,0.18)] sm:mb-10 sm:px-8 sm:pt-8"
      >
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_180px] lg:items-end">
          <div className="lg:max-w-[620px]">
            <label htmlFor="company-search" className="mb-2 block text-sm font-medium text-slate-600 sm:mb-3 sm:text-[0.95rem]">
              Select City
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <input
                  id="company-search"
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Indore, Madhya Pradesh, India"
                  className="h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 pr-12 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-violet-600">
                  <LocationIcon />
                </span>
              </div>

              <button
                type="submit"
                className="h-11 shrink-0 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 text-sm font-semibold text-white shadow-[0_16px_28px_-18px_rgba(124,58,237,0.9)] transition hover:translate-y-[-1px] hover:from-violet-700 hover:to-fuchsia-600 sm:w-auto"
              >
                Find Company
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex h-11 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 text-sm font-semibold text-white shadow-[0_16px_28px_-18px_rgba(124,58,237,0.9)] transition hover:translate-y-[-1px] hover:from-violet-700 hover:to-fuchsia-600 sm:w-auto"
          >
            + Add Company
          </button>

          <div className="justify-self-stretch lg:w-[180px] lg:justify-self-end">
            <label htmlFor="sort-companies" className="mb-2 block text-sm font-medium text-slate-600 sm:mb-3 sm:text-[0.95rem]">
              Sort:
            </label>
            <div className="relative">
              <select
                id="sort-companies"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="h-11 w-full appearance-none rounded-2xl border border-slate-300 bg-white px-4 pr-10 text-sm font-medium text-slate-800 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
              >
                <option value="name">Name</option>
                <option value="location">Location</option>
                <option value="foundedOn">Founded</option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
                <ChevronIcon />
              </span>
            </div>
          </div>
        </div>
      </form>

      <div className="border-t border-slate-200/70 pt-8 sm:pt-12">
        <div className="mb-6 text-sm text-slate-500">Result Found: {total}</div>
        {errorMessage ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {skeletonCards.map((card) => (
              <CompanySkeletonCard key={card} />
            ))}
          </div>
        ) : sortedCompanies.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-soft">
            <h2 className="text-2xl font-bold text-ink">No results found</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">{emptyStateMessage}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/add-company"
                className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Add Company
              </Link>
              {searchTerm ? (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-slate-50"
                >
                  Clear search
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:gap-6">
            {sortedCompanies.map((company) => (
              <Link
                key={company._id}
                to={`/companies/${company._id}`}
                className="group flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_28px_60px_-32px_rgba(2,6,23,0.06)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_36px_80px_-36px_rgba(2,6,23,0.08)] md:flex-row md:items-stretch"
              >
                <div className="flex w-full flex-col gap-4 p-4 sm:p-6 md:grid md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-6 md:p-6 lg:px-8">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-slate-400 sm:h-20 sm:w-20 md:h-24 md:w-24">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <BuildingIcon />
                    )}
                  </div>

                  <div className="min-w-0 text-center md:text-left">
                    <h2 className="truncate text-xl font-semibold text-slate-900 transition group-hover:text-violet-600 sm:text-[1.5rem]">
                      {company.name}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">{company.location || company.city}</p>

                    <div className="mt-4 flex items-center justify-center gap-3 text-sm text-slate-700 md:justify-start">
                      <span className="font-semibold text-slate-900">{Number(company.averageRating || 0).toFixed(1)}</span>
                      <RatingStars />
                      <span className="font-semibold text-slate-900">{company.reviewCount || 0} Reviews</span>
                    </div>
                  </div>

                  <div className="flex w-full flex-col items-stretch justify-center text-xs text-slate-500 md:w-48 md:items-end md:text-right">
                    <div className="text-slate-400 uppercase tracking-wide">{company.createdAt ? 'Founded on' : 'Reg. Date'}</div>
                    <div className="mt-1 mb-2 text-sm text-slate-500">{formatFoundedYear(company.foundedOn)}</div>
                    <button className="inline-flex w-full justify-center rounded-xl bg-[#2b2b2b] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_-10px_rgba(43,43,43,0.45)] transition hover:bg-[#1f1f1f] md:w-auto">
                      Detail Review
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                      <span className="font-semibold text-slate-900">Location:</span> {company.location}
                    </div>
                    <div className="text-sm text-slate-500 sm:hidden">{formatFoundedYear(company.foundedOn)}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {totalPages > 1 ? (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <div className="text-sm text-slate-600">Page {page} of {totalPages}</div>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-md border border-slate-200 px-4 py-2 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
      <AddCompanyModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={() => {
          setPage(1);
          setRefreshKey((k) => k + 1);
        }}
      />
    </div>
  );
}

function formatFoundedYear(value) {
  if (!value) {
    return 'Unknown';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }

  return new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(date);
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M10 18s5-4.5 5-9a5 5 0 1 0-10 0c0 4.5 5 9 5 9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="currentColor" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="m5 7 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RatingStars() {
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="m10 1.5 2.56 5.19 5.74.84-4.15 4.05.98 5.71L10 14.76l-5.13 2.53.98-5.71L1.7 7.53l5.74-.84L10 1.5Z" />
        </svg>
      ))}
    </span>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M8.5 14a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11Zm0 0L13 18.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
      <path
        d="M5 21V4.8c0-.8.6-1.3 1.3-1.3h8.4c.7 0 1.3.6 1.3 1.3V21M5 21h15M8 7h2M8 11h2M8 15h2M13 11h2M13 15h2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CompanySkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[1.1rem] border border-slate-200/80 bg-white shadow-[0_16px_36px_-24px_rgba(15,23,42,0.25)]">
      <div className="flex items-center gap-4 px-5 py-5 sm:px-6">
        <div className="h-24 w-24 animate-pulse rounded-md bg-slate-200 sm:h-28 sm:w-28" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200" />
          <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-100" />
          <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-100" />
        </div>
      </div>
      <div className="space-y-4 border-t border-slate-100 px-5 py-5 sm:px-6">
        <div className="h-3 w-11/12 animate-pulse rounded-full bg-slate-100" />
        <div className="h-3 w-4/5 animate-pulse rounded-full bg-slate-100" />
        <div className="h-10 w-36 animate-pulse rounded-md bg-slate-200" />
      </div>
    </div>
  );
}

export default CompanyListPage;