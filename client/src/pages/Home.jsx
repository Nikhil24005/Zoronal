import StatCard from '../components/StatCard';
import useFetch from '../hooks/useFetch';
import { formatDate } from '../utils/formatDate';

const features = [
  {
    title: 'Fast frontend workflow',
    copy: 'Vite keeps local development snappy while Tailwind gives you a consistent design system.',
  },
  {
    title: 'Clean backend structure',
    copy: 'Express, Mongoose, and focused folders keep the API layer readable and easy to extend.',
  },
  {
    title: 'Ready for real data',
    copy: 'Axios and reusable hooks make it simple to connect pages to live endpoints later.',
  },
];

function Home() {
  const { data: health, loading, error } = useFetch('/api/health');

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section
        id="top"
        className="overflow-hidden rounded-[2rem] border border-white/70 bg-hero-grid p-8 shadow-soft sm:p-12 lg:p-16"
      >
        <div className="max-w-3xl">
          <p className="inline-flex items-center rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            MERN Stack Starter
          </p>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
            A polished foundation for building modern product experiences.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate">
            This starter pairs a confident React interface with an ES module Express API so you can move from idea to
            implementation without fighting the project layout.
          </p>
        </div>
      </section>

      <section id="features" className="mt-10 grid gap-5 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-soft">
            <h2 className="text-xl font-bold text-ink">{feature.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate">{feature.copy}</p>
          </article>
        ))}
      </section>

      <section id="status" className="mt-10 grid gap-5 lg:grid-cols-[1.4fr,0.9fr]">
        <div className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-ink">Live backend status</h2>
              <p className="mt-2 text-sm text-slate">The frontend calls the API health endpoint through the Axios client.</p>
            </div>
            <span className="rounded-full bg-teal/10 px-4 py-2 text-sm font-semibold text-teal">
              {loading ? 'Checking...' : error ? 'Offline' : 'Online'}
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <StatCard
              label="API"
              value={health?.message ?? 'MERN'}
              hint="Health response from the backend service."
            />
            <StatCard
              label="Last check"
              value={health?.timestamp ? formatDate(health.timestamp) : 'Pending'}
              hint="A human-readable timestamp is generated on each request."
            />
          </div>
        </div>

        <aside id="api" className="rounded-[2rem] border border-ink/10 bg-ink p-6 text-white shadow-soft">
          <h2 className="text-2xl font-bold">API shape</h2>
          <p className="mt-3 text-sm leading-7 text-white/75">
            The backend ships with health and user routes, structured controllers, Mongoose models, and centralized
            middleware for errors.
          </p>

          <div className="mt-6 space-y-3 text-sm">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">GET /api/health</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">GET /api/users</div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">POST /api/users</div>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default Home;
