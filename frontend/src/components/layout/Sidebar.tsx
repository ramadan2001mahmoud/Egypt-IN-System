import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Truck, Users, Package, Calculator, FileText, ShoppingCart, ChartBar as BarChart3, Bell, Clock, ChevronLeft, ChevronRight, Building2 } from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navGroups = [
  {
    label: 'Main',
    items: [
      { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Management',
    items: [
      { path: '/suppliers', label: 'Suppliers', icon: Truck },
      { path: '/customers', label: 'Customers', icon: Users },
      { path: '/inventory', label: 'Inventory', icon: Package },
    ],
  },
  {
    label: 'Finance',
    items: [
      { path: '/accounting', label: 'Accounting', icon: Calculator },
      { path: '/sales', label: 'Sales & Invoices', icon: FileText },
      { path: '/purchases', label: 'Purchases', icon: ShoppingCart },
    ],
  },
  {
    label: 'System',
    items: [
      { path: '/reports', label: 'Reports', icon: BarChart3 },
      { path: '/notifications', label: 'Notifications', icon: Bell },
      { path: '/activity-logs', label: 'Activity Logs', icon: Clock },
    ],
  },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()

  return (
    <aside className={cn(
      'fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar text-white transition-all duration-300',
      collapsed ? 'w-16' : 'w-64',
    )}>
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
        <Building2 className="h-8 w-8 shrink-0 text-primary-400" />
        {!collapsed && <span className="text-lg font-bold tracking-tight">NexusERP</span>}
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {navGroups.map(group => (
          <div key={group.label} className="mb-4">
            {!collapsed && (
              <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {group.label}
              </p>
            )}
            {group.items.map(item => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-active text-white'
                      : 'text-gray-300 hover:bg-sidebar-hover hover:text-white',
                    collapsed && 'justify-center',
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <button
        onClick={onToggle}
        className="flex h-12 items-center justify-center border-t border-white/10 text-gray-400 hover:bg-sidebar-hover hover:text-white"
      >
        {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>
    </aside>
  )
}
