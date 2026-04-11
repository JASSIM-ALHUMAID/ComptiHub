import { cn } from '../../lib/utils/cn'

export default function Textarea({
  className,
  placeholder,
  required = false,
  rows = 3,
  disabled = false,
  ...props
}) {
  return (
    <textarea
      rows={rows}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      className={cn(
        'w-full resize-none rounded-2xl border border-[rgba(77,70,50,0.35)] bg-[rgba(12,14,18,0.78)] px-4 py-3 text-sm text-(--landing-text) placeholder:text-[rgba(226,226,232,0.4)] focus:border-(--landing-gold) focus:outline-none focus:ring-2 focus:ring-[rgba(250,204,21,0.2)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  )
}
