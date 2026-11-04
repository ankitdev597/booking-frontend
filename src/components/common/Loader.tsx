export function Loader({ text = 'Loading…' }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-500 text-sm py-4">
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      {text}
    </div>
  )
}

export function SlotSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-16 rounded-lg bg-gray-200 animate-pulse" />
      ))}
    </div>
  )
}
