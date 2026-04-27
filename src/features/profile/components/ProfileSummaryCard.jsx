import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import { roleConfig as defaultRoleConfig } from '../../account/utils/roleConfig'

export default function ProfileSummaryCard({
  user,
  profile,
  roleConfig = defaultRoleConfig,
  renderProfileValue,
}) {
  return (
    <Card className="grid gap-8 md:grid-cols-2">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Username</p>
            <p className="mt-1 text-lg font-semibold">{user?.username}</p>
          </div>
          <div>
            <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Email</p>
            <p className="mt-1 text-lg font-semibold">{user?.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div>
            <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Default Role</p>
            <Badge className="mt-1" variant="gold">{roleConfig[user?.defaultRole]?.label ?? 'Competitor'}</Badge>
          </div>
          <div>
            <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Current View</p>
            <Badge className="mt-1" variant="gold">{roleConfig[user?.activeRole]?.label ?? 'Competitor'}</Badge>
          </div>
        </div>
      </div>

      <div className="space-y-6 border-t border-[rgba(226,226,232,0.1)] pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
        <div>
          <p className="landing-ui-text text-[0.7rem] text-[rgba(250,204,21,0.82)]">Education</p>
          <div className="mt-2 space-y-4">
            <div>
              <p className="landing-ui-text text-[0.6rem] uppercase tracking-wider text-[rgba(226,226,232,0.4)]">University</p>
              {renderProfileValue(profile.university, {
                filledClassName: 'mt-1 text-base font-medium text-(--landing-text)',
              })}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="landing-ui-text text-[0.6rem] uppercase tracking-wider text-[rgba(226,226,232,0.4)]">Major</p>
                {renderProfileValue(profile.major, {
                  filledClassName: 'mt-1 text-base font-medium text-(--landing-text)',
                })}
              </div>
              <div>
                <p className="landing-ui-text text-[0.6rem] uppercase tracking-wider text-[rgba(226,226,232,0.4)]">Year</p>
                {renderProfileValue(profile.year, {
                  filledClassName: 'mt-1 text-base font-medium text-(--landing-text)',
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
