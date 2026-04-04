import { cn } from '../../lib/utils/cn'

export default function Badge({ children, className }) {
  return (
    <span
      className={cn(
        'mt-2 inline-flex items-center rounded-full border border-[rgba(250,204,21,0.24)] bg-[rgba(250,204,21,0.08)] px-3 py-1 text-sm font-semibold text-(--landing-gold-soft)',
        className,
      )}
    >
      {children}
    </span>
  )
}
