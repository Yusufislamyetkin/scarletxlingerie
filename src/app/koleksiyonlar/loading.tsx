export default function CollectionsLoading() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="h-8 w-48 bg-cream rounded mx-auto mb-10" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[3/4] bg-cream rounded" />
            <div className="h-3 w-2/3 bg-cream rounded" />
            <div className="h-3 w-1/3 bg-cream rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
