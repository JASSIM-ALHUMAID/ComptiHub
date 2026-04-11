import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Textarea from '../../components/ui/Textarea'
import Alert from '../../components/ui/Alert'
import { competitions } from '../../data/mocks/competitions'
import { teams } from '../../data/mocks/teams'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { routes } from '../../lib/constants/routes'

function TeamCard({ team, competitionTitle }) {
  const { addApplication, hasApplied } = useAuth()
  const alreadyApplied = hasApplied(team.id)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')

  function handleApply(e) {
    e.preventDefault()
    addApplication(team.id, team.name, competitionTitle, message)
    setShowForm(false)
  }

  return (
    <Card className="space-y-3 transition-all duration-200 hover:border-(--landing-gold)">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="landing-title text-base text-(--landing-text)">{team.name}</h3>
          <p className="text-xs text-[rgba(226,226,232,0.45)] mt-0.5">Led by {team.leaderName}</p>
        </div>
        <span className="shrink-0 text-xs text-green-400">
          {team.openSlots} slot{team.openSlots !== 1 ? 's' : ''} open
        </span>
      </div>

      <p className="landing-copy text-sm text-[rgba(226,226,232,0.7)]">{team.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {team.requiredSkills.map((skill) => (
          <Badge key={skill} variant="default" size="sm">
            {skill}
          </Badge>
        ))}
      </div>

      <div className="text-xs text-[rgba(226,226,232,0.45)]">
        👥 {team.members.length}/{team.totalSlots} members
      </div>

      {alreadyApplied ? (
        <Alert variant="success" title="✓ Application submitted!" showIcon={false} />
      ) : showForm ? (
        <form onSubmit={handleApply} className="space-y-3 pt-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={3}
            placeholder="Tell the team why you'd be a great fit…"
          />
          <div className="flex gap-3">
            <Button type="submit" variant="outline-gold" size="md">
              Submit
            </Button>
            <Button
              type="button"
              onClick={() => setShowForm(false)}
              variant="outline"
              size="md"
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button
          type="button"
          onClick={() => setShowForm(true)}
          variant="outline-gold"
          size="md"
          fullWidth
        >
          Apply to Join
        </Button>
      )}
    </Card>
  )
}

export default function CompetitionDetailsPage() {
  const { competitionId } = useParams()
  const competition = competitions.find((c) => c.id === competitionId)
  const recruitingTeams = teams.filter(
    (t) => t.competitionId === competitionId && t.status === 'recruiting'
  )

  if (!competition) {
    return (
      <main className="space-y-4">
        <Alert
          variant="error"
          title="Not found"
          message="Competition not found."
        />
        <Link className="text-sm text-(--landing-gold) hover:text-(--landing-gold-soft)" to={routes.competitions}>
          ← Back to competitions
        </Link>
      </main>
    )
  }

  return (
    <main className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          className="landing-ui-text text-[0.72rem] text-[rgba(226,226,232,0.55)] transition-colors duration-200 hover:text-(--landing-gold)"
          to={routes.competitions}
        >
          Competitions
        </Link>
        <span className="text-[rgba(226,226,232,0.3)]">/</span>
        <span className="landing-ui-text text-[0.72rem] text-(--landing-gold-soft)">{competition.title}</span>
      </div>

      <header className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <h1 className="landing-title text-2xl sm:text-3xl text-(--landing-text)">
            {competition.title}
          </h1>
          <Badge
            variant={competition.status === 'open' ? 'success' : 'danger'}
            size="lg"
            className="shrink-0"
          >
            {competition.status}
          </Badge>
        </div>
        <p className="landing-copy text-sm text-[rgba(226,226,232,0.55)]">
          Organized by {competition.organizer}
        </p>
        <div className="flex flex-wrap gap-2">
          {competition.tags.map((tag) => (
            <Badge key={tag} variant="default" size="sm">
              {tag}
            </Badge>
          ))}
        </div>
      </header>

      <Card className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Prize', value: competition.prize },
          { label: 'Team Size', value: competition.teamSize + ' members' },
          { label: 'Mode', value: competition.mode },
          { label: 'Deadline', value: competition.deadline },
        ].map((item) => (
          <div key={item.label}>
            <p className="landing-ui-text text-[0.65rem] text-[rgba(226,226,232,0.45)]">{item.label}</p>
            <p className="mt-1 text-sm font-semibold text-(--landing-text)">{item.value}</p>
          </div>
        ))}
      </Card>

      <Card className="space-y-3">
        <h2 className="landing-ui-text text-[0.78rem] text-(--landing-gold)">About</h2>
        <p className="landing-copy text-sm leading-relaxed text-[rgba(226,226,232,0.75)]">
          {competition.description}
        </p>
      </Card>

      <Card className="space-y-3">
        <h2 className="landing-ui-text text-[0.78rem] text-(--landing-gold)">Requirements</h2>
        <ul className="space-y-2">
          {competition.requirements.map((req) => (
            <li key={req} className="flex items-center gap-2 text-sm text-[rgba(226,226,232,0.72)]">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-(--landing-gold)" />
              {req}
            </li>
          ))}
        </ul>
      </Card>

      {competition.status === 'open' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="landing-ui-text text-[0.78rem] text-(--landing-gold)">Teams Recruiting</h2>
            <span className="text-xs text-[rgba(226,226,232,0.45)]">
              {recruitingTeams.length} team{recruitingTeams.length !== 1 ? 's' : ''} looking for members
            </span>
          </div>

          {recruitingTeams.length === 0 ? (
            <Alert
              variant="info"
              title="No teams recruiting"
              message="No teams are recruiting for this competition yet."
            />
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              {recruitingTeams.map((team) => (
                <TeamCard key={team.id} team={team} competitionTitle={competition.title} />
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  )
}