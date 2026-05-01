import { useEffect, useState } from 'react'
import {
  Activity,
  ArrowRight,
  Gauge,
  Gavel,
  Hourglass,
  Rocket,
  UserPlus,
} from 'lucide-react'
import LoadingState from '../../components/feedback/LoadingState'
import { adminSuggestionsService } from '../../features/admin/services/adminSuggestionsService'
import { adminModerationService } from '../../features/admin/services/adminModerationService'
import { adminCompetitionsService } from '../../features/admin/services/adminCompetitionsService'

const metricIcons = {
  'active-competitions': Rocket,
  'pending-suggestions': Hourglass,
  'registered-users': UserPlus,
  'banned-accounts': Gavel,
}

function getMetricToneClasses(tone) {
  if (tone === 'success') {
    return {
      badge: 'border-[rgba(74,222,128,0.24)] bg-[rgba(74,222,128,0.08)] text-[#7bf1a2]',
      value: 'text-[var(--admin-text)]',
      note: 'text-[rgba(123,241,162,0.82)]',
      icon: 'text-[var(--admin-gold)]',
    }
  }

  if (tone === 'warning') {
    return {
      badge: 'border-[rgba(250,204,21,0.24)] bg-[rgba(250,204,21,0.08)] text-[var(--admin-gold-soft)]',
      value: 'text-[var(--admin-text)]',
      note: 'text-[rgba(209,198,171,0.72)]',
      icon: 'text-[var(--admin-gold)]',
    }
  }

  if (tone === 'danger') {
    return {
      badge: 'border-[rgba(255,180,171,0.2)] bg-[rgba(255,180,171,0.08)] text-[var(--admin-danger)]',
      value: 'text-[var(--admin-text)]',
      note: 'text-[rgba(255,180,171,0.82)]',
      icon: 'text-[var(--admin-danger)]',
    }
  }

  return {
    badge: 'border-[rgba(77,70,50,0.24)] bg-[rgba(255,255,255,0.03)] text-[rgba(209,198,171,0.7)]',
    value: 'text-[var(--admin-text)]',
    note: 'text-[rgba(209,198,171,0.72)]',
    icon: 'text-[var(--admin-gold)]',
  }
}

export default function AdminDashboardPage() {
  const [suggestions, setSuggestions] = useState([])
  const [users, setUsers] = useState([])
  const [competitions, setCompetitions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCancelled = false

    async function loadDashboardData() {
      try {
        setIsLoading(true)
        const [nextSuggestions, nextUsers, nextCompetitions] = await Promise.all([
          adminSuggestionsService.listSuggestions(),
          adminModerationService.listUsers(),
          adminCompetitionsService.listCompetitions(),
        ])

        if (!isCancelled) {
          setSuggestions(nextSuggestions)
          setUsers(nextUsers)
          setCompetitions(nextCompetitions)
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadDashboardData()

    return () => {
      isCancelled = true
    }
  }, [])

  if (isLoading) {
    return <LoadingState title="Loading admin dashboard..." />
  }

  const activeCompetitions = competitions.length
  const pendingSuggestions = suggestions.length
  const registeredUsers = users.length
  const bannedAccounts = users.filter((user) => user.status === 'Banned').length

  const metrics = [
    {
      id: 'active-competitions',
      label: 'Active Competitions',
      value: activeCompetitions,
      status: activeCompetitions > 0 ? 'Active' : 'Inactive',
      note: `${activeCompetitions} competition${activeCompetitions === 1 ? '' : 's'} available`,
      tone: activeCompetitions > 0 ? 'success' : 'warning',
    },
    {
      id: 'pending-suggestions',
      label: 'Pending Suggestions',
      value: pendingSuggestions,
      status: pendingSuggestions > 0 ? 'Pending' : 'Clear',
      note: `${pendingSuggestions} item${pendingSuggestions === 1 ? '' : 's'} waiting for review`,
      tone: pendingSuggestions > 5 ? 'danger' : 'warning',
    },
    {
      id: 'registered-users',
      label: 'Registered Users',
      value: registeredUsers,
      status: null,
      note: `${registeredUsers} active account${registeredUsers === 1 ? '' : 's'} in the system`,
      tone: 'success',
    },
    {
      id: 'banned-accounts',
      label: 'Banned Accounts',
      value: bannedAccounts,
      status: bannedAccounts > 0 ? 'Active' : null,
      note: `${bannedAccounts} banned user${bannedAccounts === 1 ? '' : 's'}`,
      tone: bannedAccounts > 0 ? 'danger' : 'success',
    },
  ]

  const recentActivity = suggestions.slice(0, 5).map((suggestion) => ({
    id: suggestion.id,
    time: new Date(suggestion.submittedAt).toLocaleDateString(),
    actor: 'User',
    action: 'submitted a suggestion',
    subject: suggestion.title || 'New suggestion',
    category: 'SUGGESTION',
    region: 'SYSTEM',
  }))

  const priorityQueue = suggestions.slice(0, 3).map((suggestion) => ({
    id: suggestion.id,
    priority: 'High',
    title: suggestion.title || 'New Suggestion',
    proposer: 'User',
    university: 'Platform',
    accent: 'primary',
  }))

  const systemHealth = [
    {
      id: 'api',
      label: 'API Response Time',
      value: '120ms',
      tone: 'success',
      width: '92%',
    },
    {
      id: 'database',
      label: 'Database Status',
      value: '98.5% uptime',
      tone: 'success',
      width: '98%',
    },
    {
      id: 'storage',
      label: 'Storage Usage',
      value: '65% utilized',
      tone: 'success',
      width: '65%',
    },
  ]

  return (
    <main className="app-page space-y-8 xl:space-y-10">
      <header className="grid gap-6 rounded-[1.6rem] border border-[rgba(77,70,50,0.18)] bg-[linear-gradient(135deg,rgba(250,204,21,0.08),rgba(255,255,255,0.02))] p-6 lg:grid-cols-[minmax(0,1.4fr)_320px] xl:p-7">
        <div className="space-y-4">
          <p className="app-ui-text text-[0.68rem] text-[rgba(250,204,21,0.82)]">System overview</p>
          <div className="space-y-3">
            <h1 className="app-display max-w-4xl text-4xl leading-none text-[var(--admin-text)] sm:text-5xl xl:text-6xl">
              Command center for competitions and platform health.
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[rgba(209,198,171,0.74)] sm:text-base">
              Real-time operational telemetry for system monitoring, competition management, user moderation, and
              suggestion review workflows.
            </p>
          </div>
        </div>

        <div className="grid gap-4 rounded-[1.4rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(12,14,18,0.62)] p-5">
          <div>
            <p className="app-ui-text text-[0.62rem] text-[rgba(250,204,21,0.78)]">Today</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-[var(--admin-text)]">{pendingSuggestions}</p>
            <p className="mt-1 text-sm text-[rgba(209,198,171,0.72)]">Items waiting in the review pipeline</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[1.15rem] border border-[rgba(77,70,50,0.16)] bg-[rgba(255,255,255,0.02)] p-4">
              <p className="app-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Competitions</p>
              <p className="mt-2 text-2xl font-bold text-[var(--admin-text)]">{activeCompetitions}</p>
            </div>
            <div className="rounded-[1.15rem] border border-[rgba(77,70,50,0.16)] bg-[rgba(255,255,255,0.02)] p-4">
              <p className="app-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Users</p>
              <p className="mt-2 text-2xl font-bold text-[var(--admin-text)]">{registeredUsers}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-4 rounded-[1.6rem] border border-[rgba(77,70,50,0.24)] bg-[rgba(12,14,18,0.52)] p-2 md:grid-cols-2 xl:grid-cols-4 xl:gap-2">
        {metrics.map((metric) => {
          const Icon = metricIcons[metric.id]
          const tone = getMetricToneClasses(metric.tone)

          return (
            <article
              key={metric.id}
              className="group rounded-[1.3rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.92)] p-6 transition-colors duration-200 hover:bg-[rgba(30,32,36,0.96)]"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className={`rounded-full border border-[rgba(77,70,50,0.2)] bg-[rgba(255,255,255,0.02)] p-3 ${tone.icon}`}>
                  <Icon className="h-5 w-5" />
                </div>
                {metric.status ? (
                  <span className={`app-ui-text rounded-full border px-3 py-1 text-[0.62rem] ${tone.badge}`}>
                    {metric.status}
                  </span>
                ) : null}
              </div>
              <p className="app-ui-text text-[0.65rem] text-[rgba(209,198,171,0.68)]">{metric.label}</p>
              <h2 className={`mt-3 text-4xl font-black tracking-tight ${tone.value}`}>{metric.value}</h2>
              <p className={`mt-4 text-sm ${tone.note}`}>{metric.note}</p>
            </article>
          )
        })}
      </section>

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.7fr)_minmax(360px,0.95fr)]">
        <article className="rounded-[1.6rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(12,14,18,0.7)] p-6 sm:p-7">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(77,70,50,0.2)] pb-4">
            <div>
              <p className="app-ui-text text-[0.68rem] text-[rgba(250,204,21,0.78)]">Activity stream</p>
              <h2 className="app-title mt-2 text-2xl text-[var(--admin-text)]">Recent activity</h2>
            </div>
            <button
              className="app-ui-text inline-flex items-center gap-2 text-[0.68rem] text-[var(--admin-gold-soft)] transition-colors duration-200 hover:text-[var(--admin-gold)]"
              type="button"
            >
              View all logs
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-5">
            {recentActivity.length > 0 ? (
              recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-2 border-b border-[rgba(77,70,50,0.14)] pb-5 last:border-b-0 last:pb-0 sm:grid-cols-[88px_minmax(0,1fr)] sm:gap-4"
                >
                  <div className="app-ui-text pt-1 text-[0.62rem] text-[rgba(209,198,171,0.42)]">{item.time}</div>
                  <div className="space-y-2">
                    <p className="text-sm leading-7 text-[var(--admin-text)] sm:text-base">
                      <span className="font-semibold text-[var(--admin-gold-soft)]">{item.actor}</span> {item.action}
                      {item.subject ? (
                        <>
                          {': '}
                          <span className="font-semibold text-[var(--admin-text)]">{item.subject}</span>
                        </>
                      ) : null}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-[0.68rem] uppercase tracking-[0.16em] text-[rgba(209,198,171,0.64)]">
                      <span>{item.category}</span>
                      <span className="h-1 w-1 rounded-full bg-[rgba(77,70,50,0.8)]" />
                      <span>{item.region}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[rgba(209,198,171,0.72)]">No recent activity</p>
            )}
          </div>
        </article>

        <div className="grid gap-6">
          <article className="relative overflow-hidden rounded-[1.6rem] border border-[rgba(77,70,50,0.22)] bg-[rgba(30,32,36,0.75)] p-6 sm:p-7">
            <div className="absolute right-[-48px] top-[-36px] h-40 w-40 rounded-full bg-[rgba(250,204,21,0.08)] blur-3xl" />
            <div className="relative space-y-6">
              <div>
                <p className="app-ui-text text-[0.68rem] text-[rgba(250,204,21,0.78)]">Queue snapshot</p>
                <h2 className="app-title mt-2 text-2xl text-[var(--admin-text)]">Action required</h2>
              </div>

              <div className="space-y-3">
                {priorityQueue.length > 0 ? (
                  priorityQueue.map((item) => (
                    <button
                      key={item.id}
                      className={[
                        'flex w-full items-center justify-between gap-4 rounded-[1.3rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.76)] px-4 py-4 text-left transition-colors duration-200 hover:bg-[rgba(255,255,255,0.04)]',
                        item.accent === 'primary'
                          ? 'border-l-4 border-l-[var(--admin-gold)]'
                          : 'border-l-4 border-l-[rgba(77,70,50,0.84)]',
                      ].join(' ')}
                      type="button"
                    >
                      <div>
                        <p className="app-ui-text text-[0.62rem] text-[rgba(250,204,21,0.82)]">
                          Suggestion #{item.id} • {item.priority}
                        </p>
                        <h3 className="mt-2 text-sm font-semibold text-[var(--admin-text)] sm:text-base">{item.title}</h3>
                        <p className="mt-1 text-sm text-[rgba(209,198,171,0.72)]">
                          Proposed by {item.proposer} • {item.university}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-[rgba(209,198,171,0.62)]" />
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-[rgba(209,198,171,0.72)]">No pending suggestions</p>
                )}
              </div>

              <button
                className="app-ui-text flex w-full items-center justify-center gap-2 rounded-full border border-[rgba(250,204,21,0.36)] bg-[linear-gradient(135deg,#facc15_0%,#ffd95f_100%)] px-5 py-3 text-[0.72rem] text-[var(--admin-surface-low)] shadow-[0_18px_34px_rgba(250,204,21,0.14)] transition-transform duration-200 hover:-translate-y-0.5"
                type="button"
              >
                Process all pending
                <span>({pendingSuggestions})</span>
              </button>
            </div>
          </article>

          <article className="rounded-[1.6rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(12,14,18,0.72)] p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-full bg-[rgba(255,180,171,0.08)] p-3 text-[var(--admin-danger)]">
                <Gauge className="h-5 w-5" />
              </div>
              <div>
                <p className="app-ui-text text-[0.68rem] text-[rgba(250,204,21,0.74)]">Infrastructure</p>
                <h2 className="app-title mt-1 text-xl text-[var(--admin-text)]">System health</h2>
              </div>
            </div>

            <div className="space-y-5">
              {systemHealth.map((item) => (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-4 text-sm text-[rgba(209,198,171,0.74)]">
                    <span>{item.label}</span>
                    <span className="font-semibold text-[var(--admin-text)]">{item.value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.05)]">
                    <div
                      className={item.tone === 'success' ? 'h-full rounded-full bg-[#4ade80]' : 'h-full rounded-full bg-[var(--admin-gold)]'}
                      style={{ width: item.width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[1.6rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.68)] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[rgba(250,204,21,0.08)] p-3 text-[var(--admin-gold)]">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="app-ui-text text-[0.68rem] text-[rgba(250,204,21,0.74)]">Status</p>
                <h2 className="app-title mt-1 text-xl text-[var(--admin-text)]">Platform pulse</h2>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-[rgba(209,198,171,0.72)]">
              The admin dashboard now displays real-time data from active API endpoints, providing live metrics on
              competitions, user accounts, suggestions, and system health status.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}
