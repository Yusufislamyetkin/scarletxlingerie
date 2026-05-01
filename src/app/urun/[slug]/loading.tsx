export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-4 w-48 bg-cream rounded mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Gallery skeleton */}
        <div className="aspect-[3/4] bg-cream rounded" />
        {/* Details skeleton */}
        <div className="space-y-6 pt-2">
          <div className="h-3 w-24 bg-cream rounded" />
          <div className="h-8 w-3/4 bg-cream rounded" />
          <div className="h-6 w-32 bg-cream rounded" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-cream rounded" />
            <div className="h-3 w-5/6 bg-cream rounded" />
            <div className="h-3 w-4/6 bg-cream rounded" />
          </div>
          <div className="h-12 w-full bg-cream rounded" />
        </div>
      </div>
    </div>
  )
}
