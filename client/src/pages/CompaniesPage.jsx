import { Link } from 'react-router-dom';

function CompaniesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-slate-200/80 bg-white p-8 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent">Companies</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink">Company directory</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          This page is ready for your company listing view. Add your table, cards, or filters here.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/companies/new"
            className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Add another company
          </Link>
          <Link
            to="/"
            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-slate-50"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CompaniesPage;
