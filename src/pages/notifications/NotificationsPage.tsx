import { useEffect } from 'react'
import { useDataStore } from '@/stores/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Bell, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, CircleAlert as AlertCircle, Info } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import type { Notification } from '@/types'

const typeConfig: Record<string, { variant: 'success' | 'warning' | 'error' | 'info'; icon: typeof Bell }> = {
  success: { variant: 'success', icon: CheckCircle },
  warning: { variant: 'warning', icon: AlertTriangle },
  error: { variant: 'error', icon: AlertCircle },
  info: { variant: 'info', icon: Info },
}

export function NotificationsPage() {
  const { notifications, fetchNotifications, markNotificationRead } = useDataStore()

  useEffect(() => { fetchNotifications() }, [fetchNotifications])

  const unread = notifications.filter(n => !n.is_read)
  const read = notifications.filter(n => n.is_read)

  const renderNotification = (n: Notification) => {
    const config = typeConfig[n.type] || typeConfig.info
    const Icon = config.icon
    return (
      <div
        key={n.id}
        onClick={() => !n.is_read && markNotificationRead(n.id)}
        className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${n.is_read ? 'border-gray-100 bg-white' : 'border-primary-200 bg-primary-50/30 cursor-pointer hover:bg-primary-50/50'}`}
      >
        <div className={`rounded-lg p-2 ${n.is_read ? 'bg-gray-100' : 'bg-primary-100'}`}>
          <Icon className={`h-5 w-5 ${n.is_read ? 'text-gray-400' : 'text-primary-600'}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className={`text-sm font-semibold ${n.is_read ? 'text-gray-600' : 'text-gray-900'}`}>{n.title}</p>
            {!n.is_read && <span className="h-2 w-2 rounded-full bg-primary-500" />}
          </div>
          <p className="mt-0.5 text-sm text-gray-500">{n.message}</p>
          <p className="mt-1 text-xs text-gray-400">{formatDateTime(n.created_at)}</p>
        </div>
        <Badge variant={config.variant}>{n.type}</Badge>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={`${unread.length} unread notification${unread.length !== 1 ? 's' : ''}`}
      />

      {notifications.length === 0 ? (
        <EmptyState icon={<Bell className="h-8 w-8" />} title="No notifications" description="Notifications will appear here when there are system events" />
      ) : (
        <div className="space-y-6">
          {unread.length > 0 && (
            <Card>
              <CardContent>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Unread ({unread.length})</h3>
                <div className="space-y-3">{unread.map(renderNotification)}</div>
              </CardContent>
            </Card>
          )}
          {read.length > 0 && (
            <Card>
              <CardContent>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Read</h3>
                <div className="space-y-3">{read.map(renderNotification)}</div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
