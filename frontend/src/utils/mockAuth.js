export async function injectMockAuth(username, password) {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/dev/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      console.error('[mockAuth FL] Login gagal')
      return false
    }

    const data = await response.json()
    localStorage.setItem('fl_token', data.access_token)
    localStorage.setItem('fl_user', JSON.stringify(data.user))

    console.log('[mockAuth FL] Login berhasil sebagai:', username)
    return true
  } catch (e) {
    console.error('[mockAuth FL] Error:', e.message)
    return false
  }
}

export async function autoInjectMockAuth() {
  const username = import.meta.env.VITE_MOCK_USERNAME ?? 'user'
  const password = import.meta.env.VITE_MOCK_PASSWORD ?? 'password'
  return injectMockAuth(username, password)
}

export function isMockAuthEnabled() {
  return import.meta.env.VITE_MOCK_AUTH === 'true'
}

export function clearMockAuth() {
  localStorage.removeItem('fl_token')
  localStorage.removeItem('fl_user')
}