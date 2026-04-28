import Card from '../../../components/ui/Card'

export default function ProfileBioCard({ isLeaderProfile, roleProfile, renderProfileValue }) {
  return (
    <Card className="space-y-6">
      <div>
        <p className="landing-ui-text text-[0.7rem] text-[rgba(250,204,21,0.82)]">Summary / Objective</p>
        <div className="mt-3">
          {renderProfileValue(roleProfile?.bio, {
            emptyLabel: 'No summary added yet. Add one to help teams understand your goals.',
            filledClassName: 'landing-copy text-sm leading-relaxed text-[rgba(226,226,232,0.85)] sm:text-base',
          })}
        </div>
      </div>

      <div className="grid gap-4 border-t border-[rgba(226,226,232,0.1)] pt-5 sm:grid-cols-2">
        <div>
          <p className="landing-ui-text text-[0.65rem] text-[rgba(226,226,232,0.55)]">
            {isLeaderProfile ? 'Recruiting Focus' : 'Competition Focus'}
          </p>
          {renderProfileValue(roleProfile?.focus, {
            filledClassName: 'mt-1 text-sm font-medium text-(--landing-text)',
          })}
        </div>
        <div>
          <p className="landing-ui-text text-[0.65rem] text-[rgba(226,226,232,0.55)]">
            {isLeaderProfile ? 'Team Setup' : 'Preferred Role'}
          </p>
          {renderProfileValue(isLeaderProfile ? roleProfile?.preferredTeamSetup : roleProfile?.preferredRole, {
            filledClassName: 'mt-1 text-sm font-medium text-(--landing-text)',
          })}
        </div>
      </div>

      <div className="grid gap-4 border-t border-[rgba(226,226,232,0.1)] pt-5 sm:grid-cols-2">
        <div>
          <p className="landing-ui-text text-[0.65rem] text-[rgba(226,226,232,0.55)]">Strengths</p>
          {renderProfileValue(roleProfile?.strengths, {
            emptyLabel: 'Not added yet',
            filledClassName: 'mt-1 text-sm font-medium text-(--landing-text)',
          })}
        </div>
        <div>
          <p className="landing-ui-text text-[0.65rem] text-[rgba(226,226,232,0.55)]">Availability</p>
          {renderProfileValue(roleProfile?.availability, {
            emptyLabel: 'Not added yet',
            filledClassName: 'mt-1 text-sm font-medium text-(--landing-text)',
          })}
        </div>
      </div>
    </Card>
  )
}
