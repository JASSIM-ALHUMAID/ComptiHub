import { useMemo, useState } from 'react'
import ModerationHeader from '../../features/admin/moderation/ModerationHeader'
import ModerationModal from '../../features/admin/moderation/ModerationModal'
import ModerationUserList from '../../features/admin/moderation/ModerationUserList'
import {
  applyModerationAction,
  filterModerationUsers,
  initialActionForm,
} from '../../features/admin/moderation/moderationForm'
import { adminModerationService } from '../../features/admin/services/adminModerationService'

export default function ModerationPage() {
  const [users, setUsers] = useState(adminModerationService.listUsers())
  const [search, setSearch] = useState('')
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionForm, setActionForm] = useState(initialActionForm)

  const filteredUsers = useMemo(() => filterModerationUsers(users, search), [search, users])

  const selectedUser = users.find((user) => user.id === selectedUserId) || null
  const flaggedCount = users.filter((user) => user.status === 'Flagged').length

  function openModerationModal(user) {
    setSelectedUserId(user.id)
    setActionForm(initialActionForm)
    setIsModalOpen(true)
  }

  function closeModerationModal() {
    setIsModalOpen(false)
  }

  function handleActionChange(event) {
    const { name, type, value, checked } = event.target
    setActionForm((currentForm) => ({
      ...currentForm,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleModerationSubmit(event) {
    event.preventDefault()

    if (!selectedUser || !actionForm.reason.trim() || !actionForm.confirmed) {
      return
    }

    setUsers((currentUsers) => applyModerationAction(currentUsers, selectedUser, actionForm))

    closeModerationModal()
  }

  return (
    <>
      <main className="admin-page space-y-8">
        <ModerationHeader flaggedCount={flaggedCount} />

        <ModerationUserList
          filteredUsers={filteredUsers}
          flaggedCount={flaggedCount}
          search={search}
          onOpenModerationModal={openModerationModal}
          onSearchChange={(event) => setSearch(event.target.value)}
        />
      </main>

      <ModerationModal
        form={actionForm}
        open={isModalOpen}
        targetUser={selectedUser}
        onChange={handleActionChange}
        onClose={closeModerationModal}
        onSubmit={handleModerationSubmit}
      />
    </>
  )
}
