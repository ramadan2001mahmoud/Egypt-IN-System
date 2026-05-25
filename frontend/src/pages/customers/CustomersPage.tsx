import { useEffect, useState } from 'react'
import { useDataStore } from '@/stores/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'
import { Plus, Search, Users, CreditCard as Edit2, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import type { Customer } from '@/types'

const emptyCustomer: Omit<Customer, 'id' | 'created_at' | 'updated_at'> = {
  name: '', email: '', phone: '', address: '', city: '', country: '',
  tax_id: '', credit_limit: 10000, current_balance: 0, is_active: true,
}

export function CustomersPage() {
  const { customers, fetchCustomers, loading } = useDataStore()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [form, setForm] = useState(emptyCustomer)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchCustomers() }, [fetchCustomers])

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase()),
  )

  const openCreate = () => { setEditing(null); setForm(emptyCustomer); setModalOpen(true) }
  const openEdit = (c: Customer) => {
    setEditing(c)
    setForm({ name: c.name, email: c.email, phone: c.phone, address: c.address, city: c.city, country: c.country, tax_id: c.tax_id, credit_limit: c.credit_limit, current_balance: c.current_balance, is_active: c.is_active })
    setModalOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editing) {
        await supabase.from('customers').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing.id)
      } else {
        await supabase.from('customers').insert(form)
      }
      setModalOpen(false)
      fetchCustomers()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return
    await supabase.from('customers').delete().eq('id', id)
    fetchCustomers()
  }

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Manage your customer database and credit limits"
        action={<Button icon={<Plus className="h-4 w-4" />} onClick={openCreate}>Add Customer</Button>}
      />

      <Card>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          {filtered.length === 0 && !loading.includes('customers') ? (
            <EmptyState icon={<Users className="h-8 w-8" />} title="No customers found" description="Add your first customer to get started" actionLabel="Add Customer" onAction={openCreate} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Credit Limit</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell>{c.city}</TableCell>
                    <TableCell>{formatCurrency(c.credit_limit)}</TableCell>
                    <TableCell>{formatCurrency(c.current_balance)}</TableCell>
                    <TableCell><Badge variant={c.is_active ? 'success' : 'default'}>{c.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(c)} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><Edit2 className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(c.id)} className="rounded p-1 text-gray-400 hover:bg-error-50 hover:text-error-500"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Customer' : 'Add Customer'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button loading={saving} onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <Input label="Tax ID" value={form.tax_id} onChange={e => setForm({ ...form, tax_id: e.target.value })} />
          <Input label="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="sm:col-span-2" />
          <Input label="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
          <Input label="Country" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
          <Input label="Credit Limit" type="number" value={form.credit_limit} onChange={e => setForm({ ...form, credit_limit: parseFloat(e.target.value) || 0 })} />
          <Select label="Status" value={form.is_active ? 'true' : 'false'} onChange={e => setForm({ ...form, is_active: e.target.value === 'true' })} options={[
            { value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' },
          ]} />
        </div>
      </Modal>
    </div>
  )
}
