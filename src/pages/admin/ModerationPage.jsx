import { useEffect, useMemo, useState } from 'react'
import Alert from '../../components/ui/Alert'
import LoadingState from '../../components/feedback/LoadingState'
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
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [actionForm, setActionForm] = useState(initialActionForm)

  useEffect(() => {
    let isCancelled = false

    async function loadUsers() {
      try {
        setIsLoading(true)
        setLoadError(null)
        const nextUsers = await adminModerationService.listUsers()
        if (!isCancelled) {
          setUsers(nextUsers)
        }
      } catch (loadError) {
        if (!isCancelled) {
          setLoadError(loadError.message || 'Failed to load moderation users.')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    loadUsers()

    return () => {
      isCancelled = true
    }
  }, [])

  const filteredUsers = useMemo(() => filterModerationUsers(users, search), [search, users])

  const selectedUser = users.find((user) => user.id === selectedUserId) || null
  const flaggedCount = users.filter((user) => user.status === 'Flagged').length

  function openModerationModal(user) {
    setSelectedUserId(user.id)
    setActionForm(initialActionForm)
    setIsModalOpen(true)
  }

  function closeModerationModal() {
    if (isSubmitting) {
      return
    }

    setIsModalOpen(false)
  }

  function handleActionChange(event) {
    const { name, type, value, checked } = event.target
    setActionForm((currentForm) => ({
      ...currentForm,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleModerationSubmit(event) {
    event.preventDefault()

    if (isSubmitting || !selectedUser || !actionForm.reason.trim() || !actionForm.confirmed) {
      return
    }

    setIsSubmitting(true)
    setActionError(null)

    try {
      await adminModerationService.createModerationAction(selectedUser.id, actionForm)
      setUsers((currentUsers) => applyModerationAction(currentUsers, selectedUser, actionForm))

      setIsModalOpen(false)
    } catch (submitError) {
      setActionError(submitError.message || 'Failed to apply moderation action.')
      setIsModalOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <main className="app-page space-y-8">
        {isLoading && <LoadingState title="Loading moderation users..." />}

        {loadError && (
          <Alert
            variant="error"
            title="Moderation error"
            message={loadError}
          />
        )}

        {actionError && (
          <Alert
            variant="error"
            title="Moderation action failed"
            message={actionError}
          />
        )}

        {!isLoading && !loadError && (
          <>
            <ModerationHeader flaggedCount={flaggedCount} />

            <ModerationUserList
              filteredUsers={filteredUsers}
              flaggedCount={flaggedCount}
              search={search}
              onOpenModerationModal={openModerationModal}
              onSearchChange={(event) => setSearch(event.target.value)}
            />
          </>
        )}
      </main>

      <ModerationModal
        form={actionForm}
        isSubmitting={isSubmitting}
        open={isModalOpen}
        targetUser={selectedUser}
        onChange={handleActionChange}
        onClose={closeModerationModal}
        onSubmit={handleModerationSubmit}
      />
    </>
  )
}
