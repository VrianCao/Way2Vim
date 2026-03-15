export default function LessonsLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-7 w-32 rounded" style={{ backgroundColor: 'var(--surface)' }} />
        <div className="h-4 w-48 mt-2 rounded" style={{ backgroundColor: 'var(--surface)' }} />
        <div className="h-3 w-full mt-3 rounded" style={{ backgroundColor: 'var(--surface)' }} />
      </div>

      {/* Card skeletons */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="flex gap-4 p-4 rounded-xl"
            style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--surface-hover)' }}
          >
            <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: 'var(--bg)' }} />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 rounded" style={{ backgroundColor: 'var(--bg)' }} />
              <div className="h-3 w-64 rounded" style={{ backgroundColor: 'var(--bg)' }} />
              <div className="h-3 w-24 rounded" style={{ backgroundColor: 'var(--bg)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
