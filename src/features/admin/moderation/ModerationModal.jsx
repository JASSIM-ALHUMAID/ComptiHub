import { AlertTriangle, Gavel, ShieldAlert, X } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import Select from '../../../components/ui/Select'

export default function ModerationModal({ form, isSubmitting = false, open, targetUser, onChange, onClose, onSubmit }) {
  return (
    <Modal
      aria-describedby="moderation-modal-description"
      aria-labelledby="moderation-modal-title"
      open={open}
      onClose={onClose}
      onBackdropClick={onClose}
      className="bg-[rgba(12,14,18,0.76)] backdrop-blur-sm"
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-2xl overflow-hidden rounded-[1.6rem] border border-[rgba(77,70,50,0.24)] bg-[rgba(17,19,23,0.98)] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
          <div className="flex items-start justify-between gap-4 border-b border-[rgba(77,70,50,0.18)] p-6 sm:p-8">
            <div className="space-y-2">
              <p className="app-ui-text inline-flex items-center gap-2 text-[0.66rem] text-[var(--admin-danger)]">
                <AlertTriangle className="h-4 w-4" />
                Disciplinary action
              </p>
              <h2 className="app-title text-2xl text-[var(--admin-text)] sm:text-3xl" id="moderation-modal-title">Moderation protocol</h2>
              <p className="text-sm leading-6 text-[rgba(209,198,171,0.72)]" id="moderation-modal-description">
                Review the evidence and confirm the action before applying any disciplinary change.
              </p>
            </div>
            <button
              aria-label="Close moderation modal"
              className="rounded-full border border-[rgba(77,70,50,0.24)] p-3 text-[rgba(209,198,171,0.76)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.3)] hover:text-[var(--admin-gold-soft)]"
              type="button"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {targetUser ? (
            <form className="space-y-6 p-6 sm:p-8" onSubmit={onSubmit}>
              <div className="flex items-center gap-4 rounded-[1.3rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(12,14,18,0.64)] p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(250,204,21,0.08)] text-[var(--admin-gold)]">
                  <ShieldAlert className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <p className="app-ui-text text-[0.62rem] text-[rgba(209,198,171,0.66)]">Target subject</p>
                  <h3 className="text-xl font-bold text-[var(--admin-text)]">{targetUser.name}</h3>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-[rgba(250,204,21,0.12)] px-3 py-1 text-[var(--admin-gold-soft)]">
                      {targetUser.role}
                    </span>
                    <span className="rounded-full border border-[rgba(77,70,50,0.24)] px-3 py-1 text-[rgba(209,198,171,0.72)]">
                      ID: {targetUser.id}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="app-ui-text text-[0.66rem] text-[rgba(209,198,171,0.76)]">Penalty classification</span>
                  <Select name="penalty" value={form.penalty} onChange={onChange}>
                    <option>Suspend</option>
                    <option>Ban</option>
                    <option>Formal Warning</option>
                  </Select>
                </label>
                <label className="space-y-2">
                  <span className="app-ui-text text-[0.66rem] text-[rgba(209,198,171,0.76)]">Restriction duration</span>
                  <Select name="duration" value={form.duration} onChange={onChange}>
                    <option>1 Day</option>
                    <option>1 Week</option>
                    <option>1 Month</option>
                    <option>Permanent</option>
                  </Select>
                </label>
              </div>

              <label className="space-y-2">
                <span className="app-ui-text text-[0.66rem] text-[rgba(209,198,171,0.76)]">Justification / reason</span>
                <textarea
                  className="min-h-36 w-full rounded-[1.3rem] border border-[rgba(77,70,50,0.35)] bg-[rgba(12,14,18,0.78)] px-4 py-3 text-[var(--admin-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors duration-200 placeholder:text-[rgba(226,226,232,0.45)] focus:border-[var(--admin-gold)] focus:outline-none focus:ring-2 focus:ring-[rgba(250,204,21,0.2)]"
                  name="reason"
                  placeholder="Detail the specific policy violations and evidence..."
                  value={form.reason}
                  onChange={onChange}
                />
              </label>

              <label className="flex items-start gap-3 rounded-[1.2rem] border border-[rgba(77,70,50,0.18)] bg-[rgba(255,255,255,0.02)] p-4">
                <input
                  checked={form.confirmed}
                  className="mt-1"
                  name="confirmed"
                  type="checkbox"
                  onChange={onChange}
                />
                <span className="text-sm leading-6 text-[rgba(209,198,171,0.74)]">
                  I confirm this action adheres to system governance policy and the supporting evidence has
                  been reviewed before execution.
                </span>
              </label>

              <div className="flex flex-col gap-3 border-t border-[rgba(77,70,50,0.18)] pt-6 sm:flex-row sm:justify-end">
                <Button className="min-w-36 justify-center" size="nav" type="button" variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button className="min-w-48 justify-center" disabled={isSubmitting} size="nav" type="submit">
                  <Gavel className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Applying...' : 'Apply penalty'}
                </Button>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </Modal>
  )
}
