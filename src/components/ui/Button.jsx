import { cn } from '../../lib/utils/cn'

const variantClasses = {
  primary:
    'landing-button-primary rounded-full border border-[var(--landing-gold)] hover:shadow-[0_0_40px_rgba(250,204,21,0.3)]',
  secondary: 'landing-button-secondary rounded-2xl border-2',
}

const sizeClasses = {
  nav: 'px-6 py-3 text-[0.68rem] tracking-[0.24em] sm:px-8 sm:text-xs',
  hero: 'px-8 py-4 text-xs tracking-[0.25em] sm:px-12 sm:py-6 sm:text-sm',
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
        'inline-flex items-center justify-center font-black uppercase transition-all duration-300 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--landing-gold)]',
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
