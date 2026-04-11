import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import { cn } from '../../lib/utils/cn'

export default function EmptyState({
  title,
  message,
  action = null,
  actionLabel = null,
  actionTo = null,
  className,
}) {
  return (
    <section
      className={cn(
        'space-y-4 rounded-[1.5rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.48)] p-8 text-center',
        className,
      )}
      role="status"
    >
      <div className="space-y-2">
        <h2 className="landing-title text-xl text-(--landing-text)">{title}</h2>
        <p className="landing-copy mx-auto max-w-xl text-sm text-[rgba(226,226,232,0.6)] sm:text-base">
          {message}
        </p>
      </div>

      {action ??
        (actionLabel && actionTo ? (
          <Button as={Link} to={actionTo} size="nav">
            {actionLabel}
          </Button>
        ) : null)}
    </section>
  )
}
