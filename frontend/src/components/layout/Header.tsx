import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, Bell, Search, LogOut, User, Settings } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import { useDataStore } from '@/stores/data'

const routeTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/suppliers': 'Suppliers',
  '/customers': 'Customers',
  '/inventory': 'Inventory',
  '/accounting': 'Accounting',
  '/sales': 'Sales & Invoices',
  '/purchases': 'Purchases',
  '/reports': 'Reports & Analytics',
  '/notifications': 'Notifications',
  '/activity-logs': 'Activity Logs',
}

interface HeaderProps {
  onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { profile, signOut } = useAuthStore()
  const { notifications } = useDataStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const title = routeTitles[location.pathname] || 'NexusERP'
  const unreadCount = notifications.filter(n => !n.is_read).length

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6">
      <button onClick={onMenuToggle} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden">
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>

      <div className="flex-1" />

      <div className="relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="h-9 w-64 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <button
        onClick={() => navigate('/notifications')}
        className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-error-500 text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
            {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span className="hidden text-sm font-medium text-gray-700 md:block">
            {profile?.full_name || 'User'}
          </span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            <button
              onClick={() => { setDropdownOpen(false) }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <User className="h-4 w-4" /> Profile
            </button>
            <button
              onClick={() => { setDropdownOpen(false) }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Settings className="h-4 w-4" /> Settings
            </button>
            <hr className="my-1 border-gray-100" />
            <button
              onClick={async () => { setDropdownOpen(false); await signOut() }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-error-500 hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
