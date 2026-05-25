import { useEffect, useState } from 'react'
import { useDataStore } from '@/stores/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { StatCard } from '@/components/ui/StatCard'
import { Plus, DollarSign, TrendingUp, TrendingDown, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Transaction } from '@/types'

const emptyTx: Omit<Transaction, 'id' | 'created_at' | 'account'> = {
  transaction_number: '', description: '', amount: 0, type: 'expense',
  status: 'pending', reference: '', account_id: '', transaction_date: new Date().toISOString().split('T')[0], created_by: '',
}

export function AccountingPage() {
  const { transactions, accounts, fetchTransactions, fetchAccounts } = useDataStore()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyTx)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchTransactions(); fetchAccounts() }, [fetchTransactions, fetchAccounts])

  const totalIncome = transactions.filter(t => t.type === 'income' && t.status === 'completed').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense' && t.status === 'completed').reduce((s, t) => s + t.amount, 0)

  const filtered = transactions.filter(t => {
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) || t.transaction_number.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || t.type === typeFilter
    return matchSearch && matchType
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const txNum = `TXN-${Date.now().toString().slice(-6)}`
      const { data: { user } } = await supabase.auth.getUser()
      await supabase.from('transactions').insert({ ...form, transaction_number: txNum, created_by: user?.id })
      setModalOpen(false)
      fetchTransactions()
    } finally {
      setSaving(false)
    }
  }

  const typeBadge = (type: string) => {
    if (type === 'income') return <Badge variant="success">Income</Badge>
    if (type === 'expense') return <Badge variant="error">Expense</Badge>
    return <Badge variant="info">Transfer</Badge>
  }

  const statusBadge = (status: string) => {
    if (status === 'completed') return <Badge variant="success">Completed</Badge>
    if (status === 'pending') return <Badge variant="warning">Pending</Badge>
    return <Badge variant="default">Cancelled</Badge>
  }

  return (
    <div>
      <PageHeader
        title="Accounting"
        description="Track income, expenses, and manage chart of accounts"
        action={<Button icon={<Plus className="h-4 w-4" />} onClick={() => { setForm(emptyTx); setModalOpen(true) }}>New Transaction</Button>}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Income" value={formatCurrency(totalIncome)} icon={<TrendingUp className="h-5 w-5" />} />
        <StatCard title="Total Expenses" value={formatCurrency(totalExpense)} icon={<TrendingDown className="h-5 w-5" />} />
        <StatCard title="Net Balance" value={formatCurrency(totalIncome - totalExpense)} icon={<DollarSign className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text" placeholder="Search transactions..." value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'income', 'expense', 'transfer'].map(t => (
                  <Button key={t} variant={typeFilter === t ? 'primary' : 'outline'} size="sm" onClick={() => setTypeFilter(t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">No transactions found</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ref</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(t => (
                    <TableRow key={t.id}>
                      <TableCell><code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{t.transaction_number}</code></TableCell>
                      <TableCell className="font-medium">{t.description}</TableCell>
                      <TableCell>{t.account?.name || '-'}</TableCell>
                      <TableCell>{typeBadge(t.type)}</TableCell>
                      <TableCell className={t.type === 'income' ? 'text-success-600' : t.type === 'expense' ? 'text-error-500' : ''}>
                        {t.type === 'income' ? '+' : t.type === 'expense' ? '-' : ''}{formatCurrency(t.amount)}
                      </TableCell>
                      <TableCell>{formatDate(t.transaction_date)}</TableCell>
                      <TableCell>{statusBadge(t.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chart of Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            {accounts.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">No accounts configured</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {accounts.map(a => (
                  <div key={a.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900"><span className="text-gray-400 mr-2">{a.code}</span>{a.name}</p>
                      <Badge variant={a.type === 'asset' ? 'info' : a.type === 'income' ? 'success' : a.type === 'expense' ? 'error' : 'default'}>
                        {a.type}
                      </Badge>
                    </div>
                    <p className="text-sm font-semibold">{formatCurrency(a.balance)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Transaction" size="md" footer={
        <>
          <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button loading={saving} onClick={handleSave}>Create</Button>
        </>
      }>
        <div className="space-y-4">
          <Input label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Amount" type="number" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })} required />
            <Select label="Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Transaction['type'] })} options={[
              { value: 'income', label: 'Income' }, { value: 'expense', label: 'Expense' }, { value: 'transfer', label: 'Transfer' },
            ]} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Account" value={form.account_id} onChange={e => setForm({ ...form, account_id: e.target.value })} options={accounts.map(a => ({ value: a.id, label: `${a.code} - ${a.name}` }))} placeholder="Select account" />
            <Input label="Date" type="date" value={form.transaction_date} onChange={e => setForm({ ...form, transaction_date: e.target.value })} />
          </div>
          <Input label="Reference" value={form.reference ?? ''} onChange={e => setForm({ ...form, reference: e.target.value })} />
        </div>
      </Modal>
    </div>
  )
}
