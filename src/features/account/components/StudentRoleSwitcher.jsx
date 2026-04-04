import { roleConfig } from '../utils/roleConfig'
import { useStudentRole } from '../hooks/useStudentRole'

const switchableRoles = ['competitor', 'teamLeader']

export default function StudentRoleSwitcher() {
  const { activeRole, setActiveRole } = useStudentRole()

  return (
    <section className="rounded-[1.75rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(17,19,23,0.82)] p-4 text-(--landing-text) shadow-[0_18px_40px_rgba(0,0,0,0.2)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="landing-ui-text text-[0.7rem] text-[rgba(250,204,21,0.82)]">Current View</p>
          <p className="landing-copy mt-1 text-sm text-[rgba(226,226,232,0.72)]">
            Switch between the two student experiences without logging out.
          </p>
        </div>

        <div className="inline-flex rounded-full border border-[rgba(77,70,50,0.24)] bg-[rgba(12,14,18,0.66)] p-1">
          {switchableRoles.map((role) => {
            const isActive = activeRole === role

            return (
              <button
                key={role}
                type="button"
                onClick={() => setActiveRole(role)}
                className={[
                  'rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200',
                  isActive
                    ? 'bg-(--landing-gold) text-(--landing-surface)'
                    : 'text-[rgba(226,226,232,0.7)] hover:text-(--landing-text)',
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
