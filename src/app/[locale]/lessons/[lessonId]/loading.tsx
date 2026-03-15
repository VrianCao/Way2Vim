export default function LessonDetailLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-pulse">
      <div
        className="flex flex-col lg:flex-row rounded-lg overflow-hidden border"
        style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--surface-hover)', minHeight: '500px' }}
      >
        {/* Left panel skeleton */}
        <div
          className="lg:w-[35%] w-full p-5 space-y-4 border-b lg:border-b-0 lg:border-r"
          style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--surface-hover)' }}
        >
          <div className="h-5 w-32 rounded" style={{ backgroundColor: 'var(--bg)' }} />
          <div className="h-3 w-20 rounded" style={{ backgroundColor: 'var(--bg)' }} />
          <div className="h-2 w-full rounded" style={{ backgroundColor: 'var(--bg)' }} />
          <div className="mt-6 space-y-2">
            <div className="h-4 w-full rounded" style={{ backgroundColor: 'var(--bg)' }} />
            <div className="h-4 w-3/4 rounded" style={{ backgroundColor: 'var(--bg)' }} />
          </div>
        </div>

        {/* Right panel skeleton */}
        <div className="lg:w-[65%] w-full p-4 space-y-3">
          {[75, 90, 60, 85, 70, 95, 65, 80].map((w, i) => (
            <div key={i} className="h-5 rounded" style={{ backgroundColor: 'var(--surface)', width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
