function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-soft backdrop-blur">
      <div className="text-sm font-medium uppercase tracking-[0.24em] text-slate">{label}</div>
      <div className="mt-2 text-3xl font-bold text-ink">{value}</div>
      <div className="mt-2 text-sm leading-6 text-slate">{hint}</div>
    </div>
  );
}

export default StatCard;
