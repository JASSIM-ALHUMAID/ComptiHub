import { roleConfig } from '../../account/utils/roleConfig'

const roleOptions = ['competitor', 'teamLeader']

export default function StudentRoleSelector({ value, onChange, disabled = false }) {
  return (
    <fieldset className="space-y-3">
      <legend className="landing-ui-text text-[0.76rem] text-(--landing-text)">
        Default Role
      </legend>
      <p className="landing-copy text-sm text-[rgba(226,226,232,0.68)]">
        Choose how the app should open by default. You can change this in your profile anytime.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {roleOptions.map((role) => {
          const isSelected = value === role

          return (
            <label
              key={role}
              className={[
                'block cursor-pointer rounded-3xl transition-all duration-200',
                isSelected
                  ? 'text-(--landing-gold-soft)'
                  : 'text-(--landing-text)',
                disabled ? 'cursor-not-allowed opacity-60' : '',
              ].join(' ')}
            >
              <input
                type="radio"
                name="defaultRole"
                value={role}
                checked={isSelected}
                onChange={(event) => onChange(event.target.value)}
                className="peer sr-only"
                disabled={disabled}
              />
              <span
                className={[
                  'block rounded-3xl border px-4 py-4 transition-all duration-200 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-(--landing-gold)',
                  isSelected
                    ? 'border-(--landing-gold) bg-[rgba(250,204,21,0.12)] text-(--landing-gold-soft)'
                    : 'border-[rgba(77,70,50,0.24)] bg-[rgba(12,14,18,0.45)] text-(--landing-text)',
                  disabled ? 'opacity-60' : 'peer-hover:border-(--landing-gold)',
                ].join(' ')}
              >
                <span className="landing-ui-text block text-[0.78rem]">{roleConfig[role].label}</span>
                <span className="landing-copy mt-2 block text-sm text-[rgba(226,226,232,0.7)]">
                  {role === 'competitor'
                    ? 'Start by browsing competitions and tracking applications.'
                    : 'Start by creating teams and reviewing incoming requests.'}
                </span>
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
