export default function ProjectLoading() {
  return (
    <div aria-busy="true" aria-label="Loading project">
      <div className="h-4 w-24 animate-pulse rounded bg-line" />
      <div className="mt-4 h-8 w-72 animate-pulse rounded bg-line" />
      <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded bg-line/70" />
      <div className="mt-8 h-[26rem] animate-pulse rounded-2xl bg-line/60" />
      <div className="mt-8 h-48 animate-pulse rounded-2xl bg-line/60" />
    </div>
  );
}
