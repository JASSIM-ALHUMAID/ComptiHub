import { cn } from '../../lib/utils/cn'

const variantClasses = {
  default: 'border-[rgba(77,70,50,0.3)] bg-[rgba(12,14,18,0.6)] text-[rgba(226,226,232,0.65)]',
  gold: 'border-[rgba(250,204,21,0.24)] bg-[rgba(250,204,21,0.08)] text-(--landing-gold-soft)',
  success: 'border-green-500/30 bg-green-500/10 text-green-400',
  danger: 'border-[rgba(255,180,171,0.3)] bg-[rgba(255,180,171,0.08)] text-(--landing-danger)',
}

const sizeClasses = {
  sm: 'text-[0.65rem] px-2 py-0.5 rounded-full',
  md: 'text-[0.68rem] px-2.5 py-1 rounded-full',
  lg: 'text-[0.75rem] px-3 py-1.5 rounded-full',
}

export default function Badge({
  children,
  className,
  variant = 'gold',
  size = 'md',
  ...props
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center border font-semibold uppercase',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
