import { cn } from '../../lib/utils/cn'

export default function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full rounded-2xl border border-[rgba(77,70,50,0.35)] bg-[rgba(12,14,18,0.78)] px-4 py-3 text-(--landing-text) shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors duration-200 placeholder:text-[rgba(226,226,232,0.45)] focus:border-(--landing-gold) focus:outline-none focus:ring-2 focus:ring-[rgba(250,204,21,0.2)] disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  )
}
