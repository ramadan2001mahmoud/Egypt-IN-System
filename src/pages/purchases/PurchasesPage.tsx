import { useEffect, useState } from 'react'
import { useDataStore } from '@/stores/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Modal } from '@/components/ui/Modal'
import { ShoppingCart, Search, Eye } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { PurchaseOrder } from '@/types'

const statusVariant = (s: PurchaseOrder['status']) => {
  const map: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
    received: 'success', approved: 'info', pending: 'warning', cancelled: 'default',
  }
  return map[s] ?? 'default'
}

export function PurchasesPage() {
  const { purchaseOrders, fetchPurchaseOrders, loading } = useDataStore()
  const [search, setSearch] = useState('')
  const [viewPO, setViewPO] = useState<PurchaseOrder | null>(null)

  useEffect(() => { fetchPurchaseOrders() }, [fetchPurchaseOrders])

  const filtered = purchaseOrders.filter(po =>
    po.order_number.toLowerCase().includes(search.toLowerCase()) ||
    po.supplier?.name.toLowerCase().includes(search.toLowerCase()),
  )

  const totalPOValue = purchaseOrders.filter(po => po.status !== 'cancelled').reduce((s, po) => s + po.total_amount, 0)

  return (
    <div>
      <PageHeader title="Purchases" description="Manage purchase orders and track supplier deliveries" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card><CardContent><div><p className="text-sm text-gray-500">Total Purchase Value</p><p className="text-2xl font-bold">{formatCurrency(totalPOValue)}</p></div></CardContent></Card>
        <Card><CardContent><div><p className="text-sm text-gray-500">Open Orders</p><p className="text-2xl font-bold">{purchaseOrders.filter(po => po.status === 'pending' || po.status === 'approved').length}</p></div></CardContent></Card>
      </div>

      <Card>
        <CardContent>
          <div className="mb-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search purchase orders..." value={search} onChange={e => setSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500" />
            </div>
          </div>

          {filtered.length === 0 && !loading.includes('purchase_orders') ? (
            <EmptyState icon={<ShoppingCart className="h-8 w-8" />} title="No purchase orders" description="Purchase orders will appear here when created" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Expected</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(po => (
                  <TableRow key={po.id}>
                    <TableCell><code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{po.order_number}</code></TableCell>
                    <TableCell className="font-medium">{po.supplier?.name ?? '-'}</TableCell>
                    <TableCell>{formatDate(po.order_date)}</TableCell>
                    <TableCell>{formatDate(po.expected_date)}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(po.total_amount)}</TableCell>
                    <TableCell><Badge variant={statusVariant(po.status)}>{po.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <button onClick={() => setViewPO(po)} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><Eye className="h-4 w-4" /></button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal open={!!viewPO} onClose={() => setViewPO(null)} title={`Purchase Order ${viewPO?.order_number ?? ''}`} size="lg">
        {viewPO && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Supplier:</span> <span className="font-medium">{viewPO.supplier?.name}</span></div>
              <div><span className="text-gray-500">Status:</span> <Badge variant={statusVariant(viewPO.status)}>{viewPO.status}</Badge></div>
              <div><span className="text-gray-500">Order Date:</span> {formatDate(viewPO.order_date)}</div>
              <div><span className="text-gray-500">Expected Delivery:</span> {formatDate(viewPO.expected_date)}</div>
            </div>
            {viewPO.items && viewPO.items.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty Ordered</TableHead>
                    <TableHead>Qty Received</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {viewPO.items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product?.name ?? item.description}</TableCell>
                      <TableCell>{item.quantity_ordered}</TableCell>
                      <TableCell>{item.quantity_received}</TableCell>
                      <TableCell>{formatCurrency(item.unit_cost)}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(item.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <div className="flex justify-end border-t pt-4">
              <div className="text-right text-sm">
                <p>Subtotal: <span className="font-semibold">{formatCurrency(viewPO.subtotal)}</span></p>
                <p>Tax: <span className="font-semibold">{formatCurrency(viewPO.tax_amount)}</span></p>
                <p className="text-lg font-bold">Total: {formatCurrency(viewPO.total_amount)}</p>
              </div>
            </div>
            {viewPO.notes && <p className="text-sm text-gray-500"><span className="font-medium">Notes:</span> {viewPO.notes}</p>}
          </div>
        )}
      </Modal>
    </div>
  )
}
