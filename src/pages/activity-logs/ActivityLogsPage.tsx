import { useEffect, useState } from 'react'
import { useDataStore } from '@/stores/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Select } from '@/components/ui/Select'
import { Clock, Search } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

export function ActivityLogsPage() {
  const { activityLogs, fetchActivityLogs } = useDataStore()
  const [search, setSearch] = useState('')
  const [entityFilter, setEntityFilter] = useState('all')

  useEffect(() => { fetchActivityLogs() }, [fetchActivityLogs])

  const entityTypes = [...new Set(activityLogs.map(l => l.entity_type))]

  const filtered = activityLogs.filter(l => {
    const matchSearch = l.action.toLowerCase().includes(search.toLowerCase()) || l.user?.full_name?.toLowerCase().includes(search.toLowerCase())
    const matchEntity = entityFilter === 'all' || l.entity_type === entityFilter
    return matchSearch && matchEntity
  })

  const actionBadge = (action: string) => {
    if (action.includes('create') || action.includes('add')) return <Badge variant="success">{action}</Badge>
    if (action.includes('update') || action.includes('edit')) return <Badge variant="info">{action}</Badge>
    if (action.includes('delete') || action.includes('remove')) return <Badge variant="error">{action}</Badge>
    return <Badge variant="default">{action}</Badge>
  }

  return (
    <div>
      <PageHeader title="Activity Logs" description="Track all system activities and user actions" />

      <Card>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
            <Select
              value={entityFilter}
              onChange={e => setEntityFilter(e.target.value)}
              options={[{ value: 'all', label: 'All Entities' }, ...entityTypes.map(t => ({ value: t, label: t }))]}
            />
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={<Clock className="h-8 w-8" />} title="No activity logs" description="User actions will be recorded here" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity Type</TableHead>
                  <TableHead>Entity ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="text-xs text-gray-500">{formatDateTime(log.created_at)}</TableCell>
                    <TableCell className="font-medium">{log.user?.full_name || 'System'}</TableCell>
                    <TableCell>{actionBadge(log.action)}</TableCell>
                    <TableCell><code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{log.entity_type}</code></TableCell>
                    <TableCell className="text-xs text-gray-400 font-mono">{log.entity_id.slice(0, 8)}...</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
