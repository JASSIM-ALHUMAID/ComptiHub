import { cn } from '../../lib/utils/cn'

const variantClasses = {
  primary: 'landing-button-primary',
  secondary: 'landing-button-secondary',
}

const sizeClasses = {
  nav: 'min-h-11 px-6 text-[0.78rem] sm:min-h-12 sm:px-8 sm:text-[0.84rem]',
  hero: 'min-h-14 px-8 text-[0.84rem] sm:min-h-16 sm:px-10 sm:text-[0.9rem]',
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
