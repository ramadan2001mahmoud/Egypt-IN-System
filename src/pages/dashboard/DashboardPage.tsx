import { useEffect } from 'react'
import { useDataStore } from '@/stores/data'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { DollarSign, Users, Truck, Package, TriangleAlert as AlertTriangle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

export function DashboardPage() {
  const { dashboardStats, revenueChart, fetchDashboardStats, products, fetchProducts, invoices, fetchInvoices, loading } = useDataStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardStats()
    fetchProducts()
    fetchInvoices()
  }, [fetchDashboardStats, fetchProducts, fetchInvoices])

  const stats = dashboardStats
  const lowStockProducts = products.filter(p => p.quantity_on_hand <= p.reorder_level)
  const recentInvoices = invoices.slice(0, 5)
  const isLoading = loading.includes('dashboard')

  const invoiceStatusData = [
    { name: 'Paid', value: invoices.filter(i => i.status === 'paid').length, color: '#22c55e' },
    { name: 'Pending', value: invoices.filter(i => i.status === 'sent').length, color: '#f59e0b' },
    { name: 'Overdue', value: invoices.filter(i => i.status === 'overdue').length, color: '#ef4444' },
    { name: 'Draft', value: invoices.filter(i => i.status === 'draft').length, color: '#6b7280' },
  ].filter(d => d.value > 0)

  if (isLoading && !stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Revenue" value={formatCurrency(stats?.total_revenue ?? 0)} change={stats?.revenue_change} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard title="Total Customers" value={stats?.total_customers ?? 0} icon={<Users className="h-5 w-5" />} />
        <StatCard title="Total Suppliers" value={stats?.total_suppliers ?? 0} icon={<Truck className="h-5 w-5" />} />
        <StatCard title="Low Stock Items" value={stats?.low_stock_products ?? 0} change={-8} icon={<AlertTriangle className="h-5 w-5" />} className={stats?.low_stock_products ? 'border-warning-500/50' : ''} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <div className="flex gap-2">
              <Badge variant="info">Monthly</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {revenueChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-gray-400">No revenue data yet</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Status</CardTitle>
          </CardHeader>
          <CardContent>
            {invoiceStatusData.length > 0 ? (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={invoiceStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {invoiceStatusData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  {invoiceStatusData.map(d => (
                    <div key={d.name} className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-gray-600">{d.name} ({d.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center text-gray-400">No invoices yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <button onClick={() => navigate('/sales')} className="text-sm font-medium text-primary-600 hover:text-primary-700">View all</button>
          </CardHeader>
          <CardContent>
            {recentInvoices.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentInvoices.map(inv => (
                  <div key={inv.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{inv.invoice_number}</p>
                      <p className="text-xs text-gray-500">{inv.entity_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(inv.total_amount)}</p>
                      <Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'overdue' ? 'error' : inv.status === 'sent' ? 'warning' : 'default'}>
                        {inv.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-gray-400">No invoices created yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
            <button onClick={() => navigate('/inventory')} className="text-sm font-medium text-primary-600 hover:text-primary-700">View all</button>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {lowStockProducts.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Package className="h-8 w-8 rounded-lg bg-warning-50 p-1.5 text-warning-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500">SKU: {p.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-error-500">{p.quantity_on_hand} left</p>
                      <p className="text-xs text-gray-400">Reorder at {p.reorder_level}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-gray-400">All stock levels are healthy</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
