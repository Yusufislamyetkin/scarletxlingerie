export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
        <p className="text-[10px] font-sans font-light tracking-[0.2em] uppercase text-stone">
          Yükleniyor
        </p>
      </div>
    </div>
  )
}
