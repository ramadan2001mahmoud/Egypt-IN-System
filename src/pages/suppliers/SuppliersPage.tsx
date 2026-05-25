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
import { Plus, Search, Truck, Star, CreditCard as Edit2, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Supplier } from '@/types'

const emptySupplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'> = {
  name: '', email: '', phone: '', address: '', city: '', country: '',
  tax_id: '', payment_terms: 'Net 30', rating: 5, is_active: true,
}

export function SuppliersPage() {
  const { suppliers, fetchSuppliers, loading } = useDataStore()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Supplier | null>(null)
  const [form, setForm] = useState(emptySupplier)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchSuppliers() }, [fetchSuppliers])

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.city.toLowerCase().includes(search.toLowerCase()),
  )

  const openCreate = () => { setEditing(null); setForm(emptySupplier); setModalOpen(true) }
  const openEdit = (s: Supplier) => { setEditing(s); setForm({ name: s.name, email: s.email, phone: s.phone, address: s.address, city: s.city, country: s.country, tax_id: s.tax_id, payment_terms: s.payment_terms, rating: s.rating, is_active: s.is_active }); setModalOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editing) {
        await supabase.from('suppliers').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing.id)
      } else {
        await supabase.from('suppliers').insert(form)
      }
      setModalOpen(false)
      fetchSuppliers()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this supplier?')) return
    await supabase.from('suppliers').delete().eq('id', id)
    fetchSuppliers()
  }

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= rating ? 'fill-warning-500 text-warning-500' : 'text-gray-300'}`} />
      ))}
    </div>
  )

  return (
    <div>
      <PageHeader
        title="Suppliers"
        description="Manage your supplier relationships and contact information"
        action={<Button icon={<Plus className="h-4 w-4" />} onClick={openCreate}>Add Supplier</Button>}
      />

      <Card>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search suppliers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          {filtered.length === 0 && !loading.includes('suppliers') ? (
            <EmptyState icon={<Truck className="h-8 w-8" />} title="No suppliers found" description="Add your first supplier to get started" actionLabel="Add Supplier" onAction={openCreate} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Terms</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.phone}</TableCell>
                    <TableCell>{s.city}</TableCell>
                    <TableCell>{renderStars(s.rating)}</TableCell>
                    <TableCell>{s.payment_terms}</TableCell>
                    <TableCell><Badge variant={s.is_active ? 'success' : 'default'}>{s.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(s)} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><Edit2 className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(s.id)} className="rounded p-1 text-gray-400 hover:bg-error-50 hover:text-error-500"><Trash2 className="h-4 w-4" /></button>
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
        title={editing ? 'Edit Supplier' : 'Add Supplier'}
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
          <Select label="Payment Terms" value={form.payment_terms} onChange={e => setForm({ ...form, payment_terms: e.target.value })} options={[
            { value: 'Net 15', label: 'Net 15' }, { value: 'Net 30', label: 'Net 30' },
            { value: 'Net 45', label: 'Net 45' }, { value: 'Net 60', label: 'Net 60' },
            { value: 'Due on Receipt', label: 'Due on Receipt' },
          ]} />
          <Select label="Status" value={form.is_active ? 'true' : 'false'} onChange={e => setForm({ ...form, is_active: e.target.value === 'true' })} options={[
            { value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' },
          ]} />
        </div>
      </Modal>
    </div>
  )
}
