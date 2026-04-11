import { cn } from '../../lib/utils/cn'

export default function FilterButton({
  isActive,
  onClick,
  children,
  className,
  ...props
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-2 text-xs sm:text-sm font-semibold transition-colors duration-200 min-h-10 lg:min-h-auto',
        isActive
          ? 'border-(--landing-gold) bg-[rgba(250,204,21,0.12)] text-(--landing-gold-soft)'
          : 'border-[rgba(77,70,50,0.3)] text-[rgba(226,226,232,0.6)] hover:border-(--landing-gold) hover:text-(--landing-gold-soft)',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
