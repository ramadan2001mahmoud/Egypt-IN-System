import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Building2, CircleAlert as AlertCircle } from 'lucide-react'

export function LoginPage() {
  const { signIn, user, loading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await signIn(email, password)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials')
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 bg-sidebar lg:flex lg:flex-col lg:items-center lg:justify-center">
        <Building2 className="h-16 w-16 text-primary-400" />
        <h1 className="mt-6 text-3xl font-bold text-white">NexusERP</h1>
        <p className="mt-2 text-gray-400">Enterprise Resource Planning System</p>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:hidden">
            <Building2 className="mx-auto h-12 w-12 text-primary-600" />
            <h1 className="mt-2 text-2xl font-bold text-gray-900">NexusERP</h1>
          </div>

          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-1 text-sm text-gray-500">Sign in to your account to continue</p>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-error-50 px-4 py-3 text-sm text-error-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@nexuserp.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
