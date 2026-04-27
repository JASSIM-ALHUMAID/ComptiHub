import { Pencil, Settings2, Trash2 } from 'lucide-react'

export default function CompetitionList({ competitions, formatDisplayDate, getStatusClasses, onDelete, onEdit }) {
  return (
    <div className="overflow-hidden rounded-[1.4rem] border border-[rgba(77,70,50,0.18)]">
      <div className="hidden overflow-x-auto xl:block">
        <table className="w-full min-w-[980px] border-collapse">
          <thead className="bg-[rgba(30,32,36,0.86)]">
            <tr className="text-left">
              <th className="px-6 py-5 text-[0.64rem] uppercase tracking-[0.18em] text-[var(--admin-gold-soft)]">
                ID / Title
              </th>
              <th className="px-6 py-5 text-[0.64rem] uppercase tracking-[0.18em] text-[rgba(209,198,171,0.68)]">
                Start / End
              </th>
              <th className="px-6 py-5 text-[0.64rem] uppercase tracking-[0.18em] text-[rgba(209,198,171,0.68)]">
                Teams
              </th>
              <th className="px-6 py-5 text-[0.64rem] uppercase tracking-[0.18em] text-[rgba(209,198,171,0.68)]">
                Deadline
              </th>
              <th className="px-6 py-5 text-[0.64rem] uppercase tracking-[0.18em] text-[rgba(209,198,171,0.68)]">
                Status
              </th>
              <th className="px-6 py-5 text-right text-[0.64rem] uppercase tracking-[0.18em] text-[rgba(209,198,171,0.68)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(77,70,50,0.14)] bg-[rgba(17,19,23,0.9)]">
            {competitions.map((competition) => (
              <tr key={competition.id} className="transition-colors duration-200 hover:bg-[rgba(255,255,255,0.03)]">
                <td className="px-6 py-5">
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-[rgba(209,198,171,0.48)]">{competition.id}</p>
                    <p className="text-sm font-bold uppercase tracking-[0.04em] text-[var(--admin-text)]">
                      {competition.title}
                    </p>
                    <p className="text-sm text-[rgba(209,198,171,0.68)]">{competition.organizer}</p>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-[rgba(209,198,171,0.78)]">
                  <div className="space-y-1">
                    <p>S: {formatDisplayDate(competition.startDate)}</p>
                    <p>E: {formatDisplayDate(competition.endDate)}</p>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex rounded-full border border-[rgba(77,70,50,0.2)] bg-[rgba(255,255,255,0.02)] px-3 py-1 text-xs font-semibold text-[var(--admin-text)]">
                    {String(competition.teamCount).padStart(2, '0')}
                  </span>
                </td>
                <td className="px-6 py-5 text-sm text-[rgba(209,198,171,0.78)]">
                  {formatDisplayDate(competition.registrationDeadline)}
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${getStatusClasses(competition.status)}`}>
                    {competition.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      aria-label={`Edit ${competition.title}`}
                      className="rounded-full border border-[rgba(77,70,50,0.2)] p-2 text-[rgba(209,198,171,0.66)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.3)] hover:text-[var(--admin-gold-soft)]"
                      type="button"
                      onClick={() => onEdit(competition)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      aria-label={`Configure ${competition.title}`}
                      className="rounded-full border border-[rgba(77,70,50,0.2)] p-2 text-[rgba(209,198,171,0.66)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.3)] hover:text-[var(--admin-gold-soft)]"
                      type="button"
                    >
                      <Settings2 className="h-4 w-4" />
                    </button>
                    <button
                      aria-label={`Delete ${competition.title}`}
                      className="rounded-full border border-[rgba(77,70,50,0.2)] p-2 text-[rgba(209,198,171,0.66)] transition-colors duration-200 hover:border-[rgba(255,180,171,0.3)] hover:text-[var(--admin-danger)]"
                      type="button"
                      onClick={() => onDelete(competition.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 p-4 xl:hidden">
        {competitions.map((competition) => (
          <article
            key={competition.id}
            className="space-y-4 rounded-[1.3rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.9)] p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-mono text-[rgba(209,198,171,0.48)]">{competition.id}</p>
                <h3 className="mt-1 text-lg font-bold uppercase tracking-[0.03em] text-[var(--admin-text)]">
                  {competition.title}
                </h3>
                <p className="mt-1 text-sm text-[rgba(209,198,171,0.68)]">{competition.organizer}</p>
              </div>
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${getStatusClasses(competition.status)}`}>
                {competition.status}
              </span>
            </div>

            <div className="grid gap-3 text-sm text-[rgba(209,198,171,0.76)] sm:grid-cols-2">
              <div className="rounded-[1rem] bg-[rgba(255,255,255,0.02)] p-3">
                <p className="app-ui-text text-[0.62rem] text-[rgba(209,198,171,0.64)]">Duration</p>

                <p className="mt-2">{formatDisplayDate(competition.startDate)}</p>
                <p>{formatDisplayDate(competition.endDate)}</p>
              </div>
              <div className="rounded-[1rem] bg-[rgba(255,255,255,0.02)] p-3">
                <p className="app-ui-text text-[0.62rem] text-[rgba(209,198,171,0.64)]">Registration</p>
                <p className="mt-2">{formatDisplayDate(competition.registrationDeadline)}</p>
                <p>{competition.teamCount} teams</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(77,70,50,0.22)] px-4 py-2 text-sm text-[rgba(209,198,171,0.76)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.3)] hover:text-[var(--admin-gold-soft)]"
                type="button"
                onClick={() => onEdit(competition)}
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(77,70,50,0.22)] px-4 py-2 text-sm text-[rgba(209,198,171,0.76)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.3)] hover:text-[var(--admin-gold-soft)]"
                type="button"
              >
                <Settings2 className="h-4 w-4" />
                Configure
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(77,70,50,0.22)] px-4 py-2 text-sm text-[rgba(209,198,171,0.76)] transition-colors duration-200 hover:border-[rgba(255,180,171,0.3)] hover:text-[var(--admin-danger)]"
                type="button"
                onClick={() => onDelete(competition.id)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
