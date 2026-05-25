import { useEffect, useState } from 'react'
import { useDataStore } from '@/stores/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { FileText, Search, Eye } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Invoice } from '@/types'

const statusVariant = (s: Invoice['status']) => {
  const map: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
    paid: 'success', sent: 'warning', overdue: 'error', draft: 'default', cancelled: 'default',
  }
  return map[s] ?? 'default'
}

export function SalesPage() {
  const { invoices, fetchInvoices, loading } = useDataStore()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null)

  useEffect(() => { fetchInvoices() }, [fetchInvoices])

  const salesInvoices = invoices.filter(i => i.type === 'sales')
  const filtered = salesInvoices.filter(i => {
    const matchSearch = i.invoice_number.toLowerCase().includes(search.toLowerCase()) || i.entity_name.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || i.status === typeFilter
    return matchSearch && matchType
  })

  const totalSales = salesInvoices.filter(i => i.status !== 'cancelled').reduce((s, i) => s + i.total_amount, 0)
  const totalPaid = salesInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total_amount, 0)
  const totalOutstanding = totalSales - totalPaid

  return (
    <div>
      <PageHeader title="Sales & Invoices" description="Manage sales invoices and track payments" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><CardContent><div><p className="text-sm text-gray-500">Total Sales</p><p className="text-2xl font-bold">{formatCurrency(totalSales)}</p></div></CardContent></Card>
        <Card className="border-success-200"><CardContent><div><p className="text-sm text-gray-500">Paid</p><p className="text-2xl font-bold text-success-600">{formatCurrency(totalPaid)}</p></div></CardContent></Card>
        <Card className="border-warning-200"><CardContent><div><p className="text-sm text-gray-500">Outstanding</p><p className="text-2xl font-bold text-warning-600">{formatCurrency(totalOutstanding)}</p></div></CardContent></Card>
      </div>

      <Card>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
            <div className="flex gap-2">
              {['all', 'draft', 'sent', 'paid', 'overdue'].map(f => (
                <Button key={f} variant={typeFilter === f ? 'primary' : 'outline'} size="sm" onClick={() => setTypeFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {filtered.length === 0 && !loading.includes('invoices') ? (
            <EmptyState icon={<FileText className="h-8 w-8" />} title="No invoices found" description="Create your first invoice from a sale" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(i => (
                  <TableRow key={i.id}>
                    <TableCell><code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{i.invoice_number}</code></TableCell>
                    <TableCell className="font-medium">{i.entity_name}</TableCell>
                    <TableCell>{formatDate(i.issue_date)}</TableCell>
                    <TableCell>{formatDate(i.due_date)}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(i.total_amount)}</TableCell>
                    <TableCell>{formatCurrency(i.paid_amount)}</TableCell>
                    <TableCell><Badge variant={statusVariant(i.status)}>{i.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <button onClick={() => setViewInvoice(i)} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><Eye className="h-4 w-4" /></button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal open={!!viewInvoice} onClose={() => setViewInvoice(null)} title={`Invoice ${viewInvoice?.invoice_number ?? ''}`} size="lg">
        {viewInvoice && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Customer:</span> <span className="font-medium">{viewInvoice.entity_name}</span></div>
              <div><span className="text-gray-500">Status:</span> <Badge variant={statusVariant(viewInvoice.status)}>{viewInvoice.status}</Badge></div>
              <div><span className="text-gray-500">Issue Date:</span> {formatDate(viewInvoice.issue_date)}</div>
              <div><span className="text-gray-500">Due Date:</span> {formatDate(viewInvoice.due_date)}</div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {viewInvoice.items?.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                      <TableCell>{item.tax_percent}%</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-end border-t pt-4 text-sm">
              <div className="space-y-1 text-right">
                <p>Subtotal: <span className="font-semibold">{formatCurrency(viewInvoice.subtotal)}</span></p>
                <p>Tax: <span className="font-semibold">{formatCurrency(viewInvoice.tax_amount)}</span></p>
                <p className="text-lg font-bold">Total: {formatCurrency(viewInvoice.total_amount)}</p>
                <p className="text-success-600">Paid: {formatCurrency(viewInvoice.paid_amount)}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
