import { cn } from '@/lib/utils/cn'

interface Props {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
}

export default function SectionTitle({ eyebrow, title, subtitle, align = 'center', className }: Props) {
  return (
    <div className={cn('space-y-3', align === 'center' && 'text-center', className)}>
      {eyebrow && (
        <p className="text-xs font-sans font-medium tracking-[0.2em] uppercase text-gold">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-3xl lg:text-5xl text-charcoal text-balance">
        {title}
      </h2>
      <span className={cn('gold-divider', align === 'left' && 'mx-0')} />
      {subtitle && (
        <p className="text-sm font-sans font-light text-stone leading-relaxed max-w-md mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}
