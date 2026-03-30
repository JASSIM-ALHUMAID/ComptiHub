import { cn } from '../../lib/utils/cn'

export default function Card({ children, className, ...props }) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  )
}
