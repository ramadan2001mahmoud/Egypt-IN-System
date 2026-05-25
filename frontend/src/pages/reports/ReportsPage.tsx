import { useEffect, useState } from 'react'
import { useDataStore } from '@/stores/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import type { DateRange } from '@/types'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#1e40af']

export function ReportsPage() {
  const { transactions, invoices, fetchTransactions, fetchInvoices, dashboardStats, fetchDashboardStats } = useDataStore()
  const [dateRange, setDateRange] = useState<DateRange>('12m')

  useEffect(() => { fetchTransactions(); fetchInvoices(); fetchDashboardStats() }, [fetchTransactions, fetchInvoices, fetchDashboardStats])

  const completedTx = transactions.filter(t => t.status === 'completed')
  const incomeByType = completedTx.filter(t => t.type === 'income').reduce((acc, t) => {
    const key = t.account?.name || 'Other'
    acc[key] = (acc[key] || 0) + t.amount
    return acc
  }, {} as Record<string, number>)

  const incomePieData = Object.entries(incomeByType).map(([name, value]) => ({ name, value }))

  const topCustomers = invoices.reduce((acc, inv) => {
    if (inv.type !== 'sales') return acc
    acc[inv.entity_name] = (acc[inv.entity_name] || 0) + inv.total_amount
    return acc
  }, {} as Record<string, number>)

  const topCustomersData = Object.entries(topCustomers).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, value]) => ({ name, value }))

  const monthlyData = completedTx.reduce((acc, t) => {
    const month = t.transaction_date?.slice(0, 7) || 'Unknown'
    if (!acc[month]) acc[month] = { month, income: 0, expense: 0 }
    if (t.type === 'income') acc[month].income += t.amount
    if (t.type === 'expense') acc[month].expense += t.amount
    return acc
  }, {} as Record<string, { month: string; income: number; expense: number }>)

  const monthlyChartData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month))

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        description="Comprehensive financial insights and business intelligence"
        action={
          <Select
            value={dateRange}
            onChange={e => setDateRange(e.target.value as DateRange)}
            options={[
              { value: '7d', label: 'Last 7 days' },
              { value: '30d', label: 'Last 30 days' },
              { value: '90d', label: 'Last 90 days' },
              { value: '12m', label: 'Last 12 months' },
            ]}
          />
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card><CardContent>
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-success-600" />
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(dashboardStats?.total_revenue ?? 0)}</p>
            </div>
          </div>
        </CardContent></Card>
        <Card><CardContent>
          <div className="flex items-center gap-3">
            <TrendingDown className="h-8 w-8 text-error-500" />
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold">{formatCurrency(dashboardStats?.total_expenses ?? 0)}</p>
            </div>
          </div>
        </CardContent></Card>
        <Card><CardContent>
          <div className="flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-primary-600" />
            <div>
              <p className="text-sm text-gray-500">Net Income</p>
              <p className="text-2xl font-bold">{formatCurrency(dashboardStats?.net_income ?? 0)}</p>
            </div>
          </div>
        </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Income vs Expenses</CardTitle></CardHeader>
          <CardContent>
            {monthlyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} name="Income" />
                  <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Expense" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-gray-400">No transaction data yet</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Revenue by Category</CardTitle></CardHeader>
          <CardContent>
            {incomePieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={incomePieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name }) => name}>
                    {incomePieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[250px] items-center justify-center text-sm text-gray-400">No income data</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top Customers</CardTitle></CardHeader>
          <CardContent>
            {topCustomersData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topCustomersData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} stroke="#9ca3af" />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="value" fill="#2563eb" radius={[0, 4, 4, 0]} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[250px] items-center justify-center text-sm text-gray-400">No customer data</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
