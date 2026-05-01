export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-ivory z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        <p className="text-[11px] font-sans font-light tracking-[0.2em] uppercase text-stone">
          Yükleniyor
        </p>
      </div>
    </div>
  )
}
