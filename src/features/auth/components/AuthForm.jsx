import { cn } from '../../../lib/utils/cn'
import Button from '../../../components/ui/Button'

export default function AuthForm({
  title,
  description,
  onSubmit,
  submitLabel,
  isSubmitting = false,
  error = null,
  footer = null,
  align = 'left',
  children,
}) {
  const isCentered = align === 'center'

  return (
    <div className="w-full max-w-xl rounded-[2rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(17,19,23,0.92)] p-6 text-(--landing-text) shadow-[0_32px_80px_rgba(0,0,0,0.34)] backdrop-blur xl:p-8">
      <div className={cn('space-y-3', isCentered && 'text-center')}>
        <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Student Access</p>
        <h1 className="landing-title text-3xl sm:text-4xl">{title}</h1>
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.7)] sm:text-base">{description}</p>
      </div>

      <form className="mt-8 space-y-5" onSubmit={onSubmit}>
        {children}

        {error ? (
          <p className="rounded-2xl border border-[rgba(255,180,171,0.25)] bg-[rgba(255,180,171,0.08)] px-4 py-3 text-sm text-(--landing-danger)">
            {error}
          </p>
        ) : null}

        <Button type="submit" size="nav" className="w-full justify-center" disabled={isSubmitting}>
          {isSubmitting ? 'Please wait' : submitLabel}
        </Button>
      </form>

      {footer ? (
        <div className={cn('mt-6 text-sm text-[rgba(226,226,232,0.72)]', isCentered && 'text-center')}>
          {footer}
        </div>
      ) : null}
    </div>
  )
}
