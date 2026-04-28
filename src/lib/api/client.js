const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api/v1').replace(/\/$/, '')

export class ApiClientError extends Error {
  constructor(message, status, details = undefined) {
    super(message)
    this.name = 'ApiClientError'
    this.status = status
    this.details = details
  }
}

export async function apiClient(path, { method = 'GET', body, token, headers } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new ApiClientError(
      payload?.error?.message ?? 'Request failed.',
      response.status,
      payload?.error?.details,
    )
  }

  return payload?.data ?? null
}
