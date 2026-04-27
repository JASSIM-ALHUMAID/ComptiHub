import { useNavigate } from 'react-router-dom'
import { useStudentRole } from '../hooks/useStudentRole'
import { roleConfig } from '../utils/roleConfig'
import { routes } from '../../../lib/constants/routes'

const switchableRoles = ['competitor', 'teamLeader']

export default function StudentRoleSwitcher() {
  const navigate = useNavigate()
  const { activeRole, setActiveRole } = useStudentRole()

  async function handleRoleChange(nextRole) {
    if (nextRole === activeRole) {
      return
    }

    const updatedUser = await setActiveRole(nextRole)

    if (updatedUser) {
      navigate(routes.dashboard, { replace: true })
    }
  }

  function handleKeyDown(role, event) {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      return
    }

    event.preventDefault()

    const currentIndex = switchableRoles.indexOf(role)
    const direction = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1
    const nextIndex = (currentIndex + direction + switchableRoles.length) % switchableRoles.length
    void handleRoleChange(switchableRoles[nextIndex])
  }

  return (
    <section className="rounded-[1.4rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(12,14,18,0.72)] p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="app-ui-text text-[0.66rem] text-[rgba(250,204,21,0.82)]" id="workspace-mode-label">Workspace mode</p>
          <p className="mt-2 text-sm leading-6 text-[rgba(209,198,171,0.74)]">
            Switch between the two student experiences without leaving the authenticated workspace.
          </p>
        </div>

        <div
          aria-labelledby="workspace-mode-label"
          className="inline-flex rounded-full border border-[rgba(77,70,50,0.24)] bg-[rgba(255,255,255,0.02)] p-1"
          role="radiogroup"
        >
          {switchableRoles.map((role) => {
            const isActive = activeRole === role

            return (
              <button
                aria-checked={isActive}
                key={role}
                role="radio"
                type="button"
                onClick={() => {
                  void handleRoleChange(role)
                }}
                onKeyDown={(event) => handleKeyDown(role, event)}
                className={[
                  'rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--landing-gold)',
                  isActive
                    ? 'bg-[rgba(250,204,21,0.98)] text-[var(--admin-surface-low)] shadow-[0_14px_28px_rgba(250,204,21,0.16)]'
                    : 'text-[rgba(209,198,171,0.76)] hover:text-[var(--admin-gold-soft)]',
                ].join(' ')}
              >
                {roleConfig[role].label}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
