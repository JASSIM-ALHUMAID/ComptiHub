import { X } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Modal from '../../../components/ui/Modal'
import Select from '../../../components/ui/Select'

export default function CompetitionEditorModal({
  form,
  formError,
  isEditing,
  onChange,
  onClose,
  onSubmit,
  open,
}) {
  return (
    <Modal
      aria-describedby="competition-editor-description"
      aria-labelledby="competition-editor-title"
      open={open}
      onClose={onClose}
      onBackdropClick={onClose}
      className="bg-[rgba(12,14,18,0.74)] backdrop-blur-sm"
    >
      <div className="flex min-h-screen items-stretch justify-end">
        <section className="flex h-screen w-full max-w-3xl flex-col border-l border-[rgba(77,70,50,0.24)] bg-[rgba(17,19,23,0.98)] shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
          <div className="flex items-start justify-between gap-4 border-b border-[rgba(77,70,50,0.18)] p-6 sm:p-8">
            <div className="space-y-2">
              <p className="app-ui-text text-[0.68rem] text-[rgba(250,204,21,0.78)]">Action editor</p>
              <h2 className="app-title text-2xl text-[var(--admin-text)] sm:text-3xl" id="competition-editor-title">
                {isEditing ? 'Edit Competition' : 'Create Competition'}
              </h2>
              <p className="text-sm leading-6 text-[rgba(209,198,171,0.72)]" id="competition-editor-description">
                Review the required fields, then publish changes from the same admin workspace.
              </p>
            </div>
            <button
              aria-label="Close competition editor"
              className="rounded-full border border-[rgba(77,70,50,0.24)] p-3 text-[rgba(209,198,171,0.76)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.3)] hover:text-[var(--admin-gold-soft)]"
              type="button"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form className="flex min-h-0 flex-1 flex-col" onSubmit={onSubmit}>
            <div className="grid flex-1 gap-6 overflow-y-auto p-6 sm:p-8">
              <label className="space-y-2">
                <span className="app-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">Competition title</span>
                <Input
                  name="title"
                  placeholder="e.g. Global Cyber-Strike 2027"
                  value={form.title}
                  onChange={onChange}
                />
              </label>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="app-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">Organizer</span>
                  <Input
                    name="organizer"
                    placeholder="KFUPM, ACM, Ministry, Club..."
                    value={form.organizer}
                    onChange={onChange}
                  />
                </label>

                <label className="space-y-2">
                  <span className="app-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">Status</span>
                  <Select name="status" value={form.status} onChange={onChange}>
                    <option value="draft">Draft</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="open">Open</option>
                    <option value="ended">Ended</option>
                    <option value="closed">Closed</option>
                  </Select>
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="app-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">Category</span>
                  <Input
                    name="category"
                    placeholder="Hackathon, Robotics, Business..."
                    value={form.category}
                    onChange={onChange}
                  />
                </label>

                <label className="space-y-2">
                  <span className="app-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">Mode</span>
                  <Input
                    name="mode"
                    placeholder="Onsite, Hybrid, Online..."
                    value={form.mode}
                    onChange={onChange}
                  />
                </label>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="app-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">Team size</span>
                  <Input
                    name="teamSize"
                    placeholder="e.g. 2-4"
                    value={form.teamSize}
                    onChange={onChange}
                  />
                </label>

                <label className="space-y-2">
                  <span className="app-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">Participation type</span>
                  <Select name="participationType" value={form.participationType} onChange={onChange}>
                    <option value="team">Team</option>
                    <option value="solo">Solo</option>
                  </Select>
                </label>
              </div>

              <label className="space-y-2">
                <span className="app-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">External link</span>
                <Input
                  name="links"
                  placeholder="https://compitihub.local/resources"
                  type="url"
                  value={form.links}
                  onChange={onChange}
                />
              </label>

              <div className="grid gap-6 md:grid-cols-3">
                <label className="space-y-2">
                  <span className="app-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">Start date</span>
                  <Input name="startDate" type="date" value={form.startDate} onChange={onChange} />
                </label>

                <label className="space-y-2">
                  <span className="app-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">End date</span>
                  <Input name="endDate" type="date" value={form.endDate} onChange={onChange} />
                </label>

                <label className="space-y-2">
                  <span className="app-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">Registration deadline</span>
                  <Input
                    name="registrationDeadline"
                    type="date"
                    value={form.registrationDeadline}
                    onChange={onChange}
                  />
                </label>
              </div>

              <label className="space-y-2">
                <span className="app-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">Prize pool</span>
                <Input
                  name="prizePool"
                  placeholder="SAR 25,000"
                  value={form.prizePool}
                  onChange={onChange}
                />
              </label>

              <div className="grid gap-6 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="app-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">Requirements</span>
                  <textarea
                    className="min-h-36 w-full rounded-[1.4rem] border border-[rgba(77,70,50,0.35)] bg-[rgba(12,14,18,0.78)] px-4 py-3 text-[var(--admin-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors duration-200 placeholder:text-[rgba(226,226,232,0.45)] focus:border-[var(--admin-gold)] focus:outline-none focus:ring-2 focus:ring-[rgba(250,204,21,0.2)]"
                    name="requirements"
                    placeholder="One requirement per line"
                    value={form.requirements}
                    onChange={onChange}
                  />
                </label>

                <label className="space-y-2">
                  <span className="app-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">Tags</span>
                  <textarea
                    className="min-h-36 w-full rounded-[1.4rem] border border-[rgba(77,70,50,0.35)] bg-[rgba(12,14,18,0.78)] px-4 py-3 text-[var(--admin-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors duration-200 placeholder:text-[rgba(226,226,232,0.45)] focus:border-[var(--admin-gold)] focus:outline-none focus:ring-2 focus:ring-[rgba(250,204,21,0.2)]"
                    name="tags"
                    placeholder="Comma-separated tags"
                    value={form.tags}
                    onChange={onChange}
                  />
                </label>
              </div>

              <label className="space-y-2">
                <span className="app-ui-text text-[0.68rem] text-[rgba(209,198,171,0.76)]">Description</span>
                <textarea
                  className="min-h-44 w-full rounded-[1.4rem] border border-[rgba(77,70,50,0.35)] bg-[rgba(12,14,18,0.78)] px-4 py-3 text-[var(--admin-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-colors duration-200 placeholder:text-[rgba(226,226,232,0.45)] focus:border-[var(--admin-gold)] focus:outline-none focus:ring-2 focus:ring-[rgba(250,204,21,0.2)]"
                  maxLength={2000}
                  name="description"
                  placeholder="Detailed competition summary, requirements, and operational notes..."
                  value={form.description}
                  onChange={onChange}
                />
                <div className="flex items-center justify-between gap-4 text-xs text-[rgba(209,198,171,0.62)]">
                  <span>{formError || 'Fill enough metadata so admins can publish or revise confidently.'}</span>
                  <span>{form.description.length} / 2000</span>
                </div>
              </label>
            </div>

            <div className="flex flex-col gap-3 border-t border-[rgba(77,70,50,0.18)] bg-[rgba(12,14,18,0.84)] p-6 sm:flex-row sm:justify-end sm:p-8">
              <Button
                className="min-w-40 justify-center"
                size="nav"
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button className="min-w-52 justify-center" size="nav" type="submit">
                {isEditing ? 'Publish Updates' : 'Create Competition'}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </Modal>
  )
}
