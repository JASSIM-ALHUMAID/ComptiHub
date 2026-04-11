import { forwardRef } from 'react'
import { cn } from '../../lib/utils/cn'

const Card = forwardRef(({
  children,
  className,
  variant = 'default',
  ...props
}, ref) => {
  const variants = {
    default: 'rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5',
    elevated: 'rounded-[2rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(17,19,23,0.78)] p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.22)]',
    interactive: 'rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-5 transition-all duration-200 hover:border-(--landing-gold) hover:bg-[rgba(250,204,21,0.04)]',
    outline: 'rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.32)] p-5',
  }

  return (
    <div
      ref={ref}
      className={cn(variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'
export default Card
