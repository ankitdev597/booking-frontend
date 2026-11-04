import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { extractErrorMessage, extractValidationErrors } from '../../utils/errorHandler'
import { ErrorMessage } from '../common/ErrorMessage'

interface Props {
  onSwitch: () => void
}

export function RegisterForm({ onSwitch }: Props) {
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setFieldErrors({})
    try {
      await register(form.name, form.email, form.password, form.password_confirmation)
    } catch (err) {
      setFieldErrors(extractValidationErrors(err))
      setError(extractErrorMessage(err, 'Registration failed.'))
    } finally {
      setLoading(false)
    }
  }

  const field = (label: string, key: string, type = 'text') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[key as keyof typeof form]}
        onChange={set(key)}
        required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
      />
      {fieldErrors[key] && <p className="text-red-500 text-xs mt-1">{fieldErrors[key][0]}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <h2 className="text-xl font-bold text-gray-800">Create Account</h2>
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      {field('Name', 'name')}
      {field('Email', 'email', 'email')}
      {field('Password', 'password', 'password')}
      {field('Confirm Password', 'password_confirmation', 'password')}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating account…' : 'Register'}
      </button>
      <p className="text-sm text-center text-gray-500">
        Have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-blue-600 hover:underline">
          Sign In
        </button>
      </p>
    </form>
  )
}
