import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Building2, CircleAlert as AlertCircle } from 'lucide-react'
import type { UserRole } from '@/types'

export function RegisterPage() {
  const { signUp, user, loading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<UserRole>('viewer')
  const [error, setError] = useState('')

  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await signUp(email, password, fullName, role)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Building2 className="mx-auto h-12 w-12 text-primary-600" />
          <h1 className="mt-2 text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-1 text-sm text-gray-500">Join NexusERP to get started</p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-error-50 px-4 py-3 text-sm text-error-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" required />
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@company.com" required />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required minLength={6} />
          <Select
            label="Role"
            value={role}
            onChange={e => setRole(e.target.value as UserRole)}
            options={[
              { value: 'admin', label: 'Administrator' },
              { value: 'accountant', label: 'Accountant' },
              { value: 'manager', label: 'Manager' },
              { value: 'viewer', label: 'Viewer' },
            ]}
          />
          <Button type="submit" className="w-full" loading={loading}>Create Account</Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">Sign In</Link>
        </p>
      </div>
    </div>
  )
}
