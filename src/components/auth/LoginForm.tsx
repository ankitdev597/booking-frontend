import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { extractErrorMessage, extractValidationErrors } from '../../utils/errorHandler'
import { ErrorMessage } from '../common/ErrorMessage'

interface Props {
  onSwitch: () => void
}

export function LoginForm({ onSwitch }: Props) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setFieldErrors({})
    try {
      await login(email, password)
    } catch (err) {
      setFieldErrors(extractValidationErrors(err))
      setError(extractErrorMessage(err, 'Login failed.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <h2 className="text-xl font-bold text-gray-800">Sign In</h2>
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
        {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email[0]}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
        {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password[0]}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
      <p className="text-sm text-center text-gray-500">
        No account?{' '}
        <button type="button" onClick={onSwitch} className="text-blue-600 hover:underline">
          Register
        </button>
      </p>
    </form>
  )
}
