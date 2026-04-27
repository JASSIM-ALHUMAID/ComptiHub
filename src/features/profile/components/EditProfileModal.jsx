import { Plus, X } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Modal from '../../../components/ui/Modal'
import Select from '../../../components/ui/Select'
import Textarea from '../../../components/ui/Textarea'

export default function EditProfileModal({
  draftSkill,
  editableRoles,
  error,
  form,
  isSubmitting,
  onAddSkill,
  onChange,
  onClose,
  onDraftSkillChange,
  onRemoveSkill,
  onSubmit,
  open,
  roleConfig,
  skillsError,
}) {
  return (
    <Modal
      aria-describedby="edit-profile-description"
      aria-labelledby="edit-profile-title"
      open={open}
      onClose={onClose}
      className="bg-[rgba(12,14,18,0.76)] backdrop-blur-sm"
    >
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <section className="max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-y-auto rounded-[1.6rem] border border-[rgba(77,70,50,0.24)] bg-[rgba(17,19,23,0.98)] shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:max-h-[calc(100dvh-3rem)]">
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.95)] p-6 backdrop-blur-md sm:p-8">
            <div className="space-y-2">
              <p className="landing-label text-[0.68rem] text-[rgba(250,204,21,0.82)]">Account setup</p>
              <h2 className="landing-title text-2xl text-(--landing-text) sm:text-3xl" id="edit-profile-title">
                Edit Profile
              </h2>
              <p className="landing-copy text-sm leading-6 text-[rgba(226,226,232,0.72)]" id="edit-profile-description">
                Update your identity, education, and professional snapshot.
              </p>
            </div>
            <button
              aria-label="Close dialog"
              className="rounded-full border border-[rgba(77,70,50,0.24)] p-3 text-[rgba(226,226,232,0.76)] transition-colors duration-200 hover:border-(--landing-gold) hover:text-(--landing-gold-soft)"
              type="button"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form className="space-y-8 p-6 sm:p-8" onSubmit={onSubmit}>
            <div className="space-y-6">
              <div>
                <h3 className="landing-ui-text text-[0.7rem] font-bold uppercase tracking-wider text-(--landing-gold-soft)">Basic Information</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="landing-ui-text text-[0.74rem] text-(--landing-text)">Username</span>
                    <Input
                      value={form.username}
                      onChange={(e) => onChange('username', e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Your username"
                      required
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="landing-ui-text text-[0.74rem] text-(--landing-text)">Email Address</span>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => onChange('email', e.target.value)}
                      disabled={isSubmitting}
                      placeholder="your@email.com"
                      required
                    />
                  </label>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="space-y-2">
                  <span className="landing-ui-text text-[0.74rem] text-(--landing-text)">University</span>
                  <Input
                    value={form.university}
                    onChange={(e) => onChange('university', e.target.value)}
                    disabled={isSubmitting}
                    placeholder="e.g. King Saud University"
                  />
                </label>
                <label className="space-y-2">
                  <span className="landing-ui-text text-[0.74rem] text-(--landing-text)">Major</span>
                  <Input
                    value={form.major}
                    onChange={(e) => onChange('major', e.target.value)}
                    disabled={isSubmitting}
                    placeholder="e.g. Computer Science"
                  />
                </label>
                <label className="space-y-2">
                  <span className="landing-ui-text text-[0.74rem] text-(--landing-text)">Year</span>
                  <Input
                    value={form.year}
                    onChange={(e) => onChange('year', e.target.value)}
                    disabled={isSubmitting}
                    placeholder="e.g. 3rd Year"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="landing-ui-text text-[0.7rem] font-bold uppercase tracking-wider text-(--landing-gold-soft)">Professional Snapshot</h3>
              <label className="block space-y-2">
                <span className="landing-ui-text text-[0.74rem] text-(--landing-text)">Summary / Objective</span>
                <Textarea
                  rows={4}
                  value={form.bio}
                  onChange={(e) => onChange('bio', e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Tell teams about your goals and how you contribute..."
                />
                <p className="landing-copy text-xs text-[rgba(226,226,232,0.6)]">
                  This will appear on your profile card when teams search for participants.
                </p>
              </label>
            </div>

            <div className="space-y-4">
              <h3 className="landing-ui-text text-[0.7rem] font-bold uppercase tracking-wider text-(--landing-gold-soft)">Skills & Expertise</h3>
              <div className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    className="flex-1"
                    placeholder="Add a skill (e.g. Python, UX Design...)"
                    value={draftSkill}
                    onChange={(e) => onDraftSkillChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        onAddSkill()
                      }
                    }}
                    disabled={isSubmitting}
                  />
                  <Button type="button" variant="outline-gold" onClick={onAddSkill} disabled={isSubmitting}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                {skillsError && <p className="text-xs text-(--landing-danger)">{skillsError}</p>}

                <div className="flex flex-wrap gap-2 pt-2">
                  {form.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-2 rounded-full border border-[rgba(77,70,50,0.32)] bg-[rgba(12,14,18,0.7)] px-3 py-1.5 text-sm font-semibold text-(--landing-text)"
                    >
                      {skill}
                      <button
                        type="button"
                        className="hover:text-(--landing-danger) transition-colors"
                        onClick={() => onRemoveSkill(skill)}
                        disabled={isSubmitting}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {form.skills.length === 0 && (
                    <p className="text-sm italic text-[rgba(226,226,232,0.4)]">No skills added yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-[rgba(77,70,50,0.15)] bg-[rgba(255,255,255,0.02)] p-6">
              <h3 className="landing-ui-text text-[0.7rem] font-bold uppercase tracking-wider text-(--landing-gold-soft)">Account Settings</h3>
              <label className="block space-y-2">
                <span className="landing-ui-text text-[0.74rem] text-(--landing-text)">Default Role</span>
                <Select
                  value={form.defaultRole}
                  onChange={(e) => onChange('defaultRole', e.target.value)}
                  disabled={isSubmitting}
                >
                  {editableRoles.map((role) => (
                    <option key={role} value={role}>{roleConfig[role].label}</option>
                  ))}
                </Select>
                <p className="landing-copy text-xs text-[rgba(226,226,232,0.6)]">
                  Determines which view opens automatically when you sign in.
                </p>
              </label>
            </div>

            {error && (
              <p className="rounded-xl border border-[rgba(255,180,171,0.25)] bg-[rgba(255,180,171,0.08)] px-4 py-3 text-sm text-(--landing-danger)">
                {error}
              </p>
            )}

            <div className="sticky bottom-0 z-10 flex flex-col gap-3 border-t border-[rgba(77,70,50,0.18)] bg-[rgba(17,19,23,0.98)] pt-6 sm:flex-row sm:justify-end">
              <Button className="min-w-32" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button className="min-w-40" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </section>
      </div>
    </Modal>
  )
}
