import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center gap-3 py-3 sm:gap-4 sm:py-4 lg:gap-8 lg:py-5">
          <Link to="/companies" className="flex shrink-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-[0_12px_24px_-12px_rgba(124,58,237,0.9)] sm:h-10 sm:w-10">
              <StarIcon />
            </div>
            <p className="text-base font-semibold tracking-tight text-slate-800 sm:text-2xl">
              Review<span className="text-violet-600">&amp;</span><span className="font-bold text-slate-900">RATE</span>
            </p>
          </Link>

          <div className="hidden lg:block absolute left-1/2 top-1/2 w-[540px] max-w-[calc(100%-220px)] -translate-x-1/2 -translate-y-1/2">
            <label htmlFor="site-search" className="sr-only">
              Search companies
            </label>
            <div className="relative">
              <input
                id="site-search"
                type="search"
                placeholder="Search..."
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-4 pr-14 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
              />
              <button
                type="button"
                aria-label="Search companies"
                className="absolute inset-y-0 right-2 flex h-8 w-8 items-center justify-center rounded-full text-violet-600 transition hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              >
                <SearchIcon />
              </button>
            </div>
          </div>

          <nav className="ml-auto hidden items-center gap-8 lg:flex">
            <NavLink
              to="/signup"
              className={({ isActive }) =>
                ['text-[1.05rem] font-medium text-slate-900 transition hover:text-violet-600', isActive ? 'text-violet-600' : ''].join(' ')
              }
            >
              SignUp
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                ['text-[1.05rem] font-medium text-slate-900 transition hover:text-violet-600', isActive ? 'text-violet-600' : ''].join(' ')
              }
            >
              Login
            </NavLink>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="ml-auto inline-flex items-center justify-center rounded-full border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition hover:border-slate-300 active:scale-95 lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
              />
              <span
                className={`absolute left-0 top-2 h-0.5 w-5 rounded-full bg-current transition ${menuOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`absolute left-0 top-4 h-0.5 w-5 rounded-full bg-current transition ${menuOpen ? 'translate-y-[-8px] -rotate-45' : ''}`}
              />
            </span>
          </button>
        </div>

        <div id="mobile-navigation" className={`lg:hidden ${menuOpen ? 'block' : 'hidden'}`}>
          <div className="pb-3">
            <div className="mt-2 space-y-3 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-soft">
              <div className="relative">
                <label htmlFor="mobile-site-search" className="sr-only">
                  Search companies
                </label>
                <input
                  id="mobile-site-search"
                  type="search"
                  placeholder="Search companies"
                  className="h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 pr-14 text-base text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                />
                <button
                  type="button"
                  aria-label="Search companies"
                  className="absolute inset-y-0 right-2 flex h-9 w-9 items-center justify-center rounded-full text-violet-600 transition hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                >
                  <SearchIcon />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <NavLink
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                >
                  SignUp
                </NavLink>
                <NavLink
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                >
                  Login
                </NavLink>
              </div>

              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
                Quick access for mobile. Use the search bar to jump to companies faster.
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
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

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="m12 2.5 2.86 5.79 6.39.93-4.62 4.5 1.09 6.36L12 17.98l-5.72 3.0 1.09-6.36-4.62-4.5 6.39-.93L12 2.5Z" />
    </svg>
  );
}

export default Navbar;
