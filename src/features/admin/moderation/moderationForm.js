export const initialActionForm = {
  penalty: 'Suspend',
  duration: '1 Week',
  reason: '',
  confirmed: false,
}

export function getStatusClasses(status) {
  if (status === 'Flagged') {
    return 'border-[rgba(255,180,171,0.22)] bg-[rgba(255,180,171,0.08)] text-[var(--admin-danger)]'
  }

  if (status === 'Monitored') {
    return 'border-[rgba(250,204,21,0.24)] bg-[rgba(250,204,21,0.08)] text-[var(--admin-gold-soft)]'
  }

  return 'border-[rgba(74,222,128,0.24)] bg-[rgba(74,222,128,0.08)] text-[#7bf1a2]'
}

export function filterModerationUsers(users, search) {
  const normalizedSearch = search.trim().toLowerCase()

  return users.filter((user) => {
    if (!normalizedSearch) {
      return true
    }

    return (
      user.name.toLowerCase().includes(normalizedSearch) ||
      user.email.toLowerCase().includes(normalizedSearch) ||
      user.id.toLowerCase().includes(normalizedSearch)
    )
  })
}

export function applyModerationAction(users, selectedUser, actionForm) {
  return users.map((user) =>
    user.id === selectedUser.id
      ? {
          ...user,
          status: actionForm.penalty === 'Formal Warning' ? 'Monitored' : 'Flagged',
          lastActive: 'Action applied just now',
        }
      : user,
  )
}
