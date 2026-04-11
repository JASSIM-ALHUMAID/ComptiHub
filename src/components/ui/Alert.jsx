import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { cn } from '../../lib/utils/cn'

const variants = {
  success: {
    icon: CheckCircle2,
    border: 'border-green-500/30',
    background: 'bg-green-500/10',
    text: 'text-green-400',
  },
  error: {
    icon: AlertCircle,
    border: 'border-[rgba(255,180,171,0.25)]',
    background: 'bg-[rgba(255,180,171,0.08)]',
    text: 'text-(--landing-danger)',
  },
  info: {
    icon: Info,
    border: 'border-[rgba(250,204,21,0.25)]',
    background: 'bg-[rgba(250,204,21,0.08)]',
    text: 'text-[rgba(250,204,21,0.75)]',
  },
  warning: {
    icon: AlertCircle,
    border: 'border-[rgba(255,193,7,0.3)]',
    background: 'bg-[rgba(255,193,7,0.08)]',
    text: 'text-[rgba(255,193,7,0.75)]',
  },
}

export default function Alert({
  variant = 'info',
  title,
  message,
  children,
  className,
  showIcon = true,
  ...props
}) {
  const config = variants[variant]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'rounded-2xl border px-4 py-3 flex gap-3',
        config.border,
        config.background,
        config.text,
        className,
      )}
      role="alert"
      {...props}
    >
      {showIcon && <Icon size={20} className="shrink-0 mt-0.5" />}
      <div className="flex-1">
        {title && <p className="font-semibold text-sm">{title}</p>}
        {message && <p className="text-sm">{message}</p>}
        {children}
      </div>
    </div>
  )
}
