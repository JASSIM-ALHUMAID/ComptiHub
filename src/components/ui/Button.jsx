import { cn } from '../../lib/utils/cn'

const variantClasses = {
  primary: 'landing-button-primary',
  secondary: 'landing-button-secondary',
  outline: 'border border-[rgba(77,70,50,0.28)] text-[rgba(226,226,232,0.72)] hover:border-(--landing-gold) hover:text-(--landing-gold-soft) bg-transparent',
  'outline-gold': 'border border-[rgba(250,204,21,0.3)] bg-[rgba(250,204,21,0.06)] text-(--landing-gold) hover:border-(--landing-gold) hover:bg-[rgba(250,204,21,0.12)]',
  'text-only': 'border-0 bg-transparent text-(--landing-gold) hover:text-(--landing-gold-soft)',
}

const sizeClasses = {
  nav: 'min-h-11 px-6 text-[0.78rem] sm:min-h-12 sm:px-8 sm:text-[0.84rem]',
  hero: 'min-h-14 px-8 text-[0.84rem] sm:min-h-16 sm:px-10 sm:text-[0.9rem]',
  sm: 'min-h-9 px-4 text-[0.75rem]',
  md: 'min-h-10 px-5 py-2.5 text-sm',
}

export default function Button({
  children,
  as: Component = 'button',
  type = 'button',
  className,
  variant = 'primary',
  size = 'hero',
  ...props
}) {
  const componentProps = Component === 'button' ? { type } : {}

  return (
    <Component
      className={cn(
        'landing-button inline-flex items-center justify-center whitespace-nowrap border transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--landing-gold)',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...componentProps}
      {...props}
    >
      {children}
    </Component>
  )
}
