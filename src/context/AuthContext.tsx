import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/authApi'

interface Customer {
  id: number
  name: string
  email: string
}

interface AuthContextValue {
  customer: Customer | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(() => {
    const stored = localStorage.getItem('customer')
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin(email, password)
    localStorage.setItem('auth_token', res.token)
    localStorage.setItem('customer', JSON.stringify(res.customer))
    setCustomer(res.customer)
  }, [])

  const register = useCallback(
    async (name: string, email: string, password: string, passwordConfirmation: string) => {
      const res = await apiRegister(name, email, password, passwordConfirmation)
      localStorage.setItem('auth_token', res.token)
      localStorage.setItem('customer', JSON.stringify(res.customer))
      setCustomer(res.customer)
    },
    []
  )

  const logout = useCallback(async () => {
    try { await apiLogout() } catch { /* ignore */ }
    localStorage.removeItem('auth_token')
    localStorage.removeItem('customer')
    setCustomer(null)
  }, [])

  return (
    <AuthContext.Provider value={{ customer, isAuthenticated: customer !== null, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
