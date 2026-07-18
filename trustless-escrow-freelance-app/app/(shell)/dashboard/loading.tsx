export default function DashboardLoading() {
  return (
    <div aria-busy="true" aria-label="Loading projects">
      <div className="h-3 w-24 animate-pulse rounded bg-line" />
      <div className="mt-3 h-8 w-44 animate-pulse rounded bg-line" />
      <div className="mt-2 h-4 w-72 animate-pulse rounded bg-line/70" />
      <div className="mt-7 flex gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 w-24 animate-pulse rounded-full bg-line/70" />
        ))}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-36 animate-pulse rounded-2xl bg-line/60" />
        ))}
      </div>
    </div>
  );
}
