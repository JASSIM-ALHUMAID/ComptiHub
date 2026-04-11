import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { roleConfig } from '../../features/account/utils/roleConfig'
import { profiles } from '../../data/mocks/profile'
import { userSkills } from '../../data/mocks/skills'
import { routes } from '../../lib/constants/routes'

export default function ProfilePage() {
  const { user } = useAuth()
  const profile = profiles[user?.id]
  const skills = userSkills[user?.id] ?? []

  return (
    <main className="space-y-8">
      <header className="space-y-2">
        <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Account</p>
        <h1 className="landing-title text-3xl text-(--landing-text)">Profile</h1>
      </header>

      <Card className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Username</p>
          <p className="mt-2 text-lg font-semibold">{user?.username}</p>
        </div>

        <div>
          <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Email</p>
          <p className="mt-2 text-lg font-semibold">{user?.email}</p>
        </div>

        <div>
          <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Default Role</p>
          <Badge variant="gold">{roleConfig[user?.defaultRole]?.label ?? 'Competitor'}</Badge>
        </div>

        <div>
          <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Current View</p>
          <Badge variant="gold">{roleConfig[user?.activeRole]?.label ?? 'Competitor'}</Badge>
        </div>
      </Card>

      <Card className="space-y-4">
        <p className="landing-copy max-w-2xl text-sm text-[rgba(226,226,232,0.72)] sm:text-base">
          Your default role decides how ComptiHub opens when you log in. You can still switch views anytime from the in-app role switcher.
        </p>
        <Link
          className="landing-link-accent landing-ui-text inline-flex text-[0.78rem] text-(--landing-gold)"
          to={routes.profileEdit}
        >
          Edit default role →
        </Link>
      </Card>

      {profile ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
          <Card className="space-y-4">
            <div>
              <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Academic Snapshot</p>
              <p className="mt-2 text-lg font-semibold text-(--landing-text)">{profile.university}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Major</p>
                <p className="mt-2 text-sm font-semibold text-(--landing-text)">{profile.major}</p>
              </div>
              <div>
                <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Year</p>
                <p className="mt-2 text-sm font-semibold text-(--landing-text)">{profile.year}</p>
              </div>
            </div>

            <div>
              <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Competition Focus</p>
              <p className="mt-2 text-sm font-semibold text-(--landing-text)">{profile.focus}</p>
            </div>

            <div>
              <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Bio</p>
              <p className="landing-copy mt-2 text-sm text-[rgba(226,226,232,0.72)]">{profile.bio}</p>
            </div>
          </Card>

          <Card className="space-y-4">
            <div>
              <p className="landing-ui-text text-[0.7rem] text-[rgba(226,226,232,0.55)]">Skills</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="default">{skill}</Badge>
                ))}
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </main>
  )
}
