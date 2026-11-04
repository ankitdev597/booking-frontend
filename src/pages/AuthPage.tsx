import { useState } from 'react'
import { LoginForm } from '../components/auth/LoginForm'
import { RegisterForm } from '../components/auth/RegisterForm'

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        {mode === 'login' ? (
          <LoginForm onSwitch={() => setMode('register')} />
        ) : (
          <RegisterForm onSwitch={() => setMode('login')} />
        )}
      </div>
    </div>
  )
}
