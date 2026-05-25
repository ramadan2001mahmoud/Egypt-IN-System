import { useEffect, useState } from 'react'
import { useDataStore } from '@/stores/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { EmptyState } from '@/components/ui/EmptyState'
import { Plus, Search, Package, CreditCard as Edit2, Trash2, TriangleAlert as AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

const emptyProduct: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'category'> = {
  name: '', sku: '', description: '', category_id: null, unit: 'pcs',
  cost_price: 0, selling_price: 0, quantity_on_hand: 0, reorder_level: 10, is_active: true,
}

export function InventoryPage() {
  const { products, fetchProducts, loading } = useDataStore()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyProduct)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchProducts() }, [fetchProducts])

  let filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()),
  )

  if (filter === 'low') filtered = filtered.filter(p => p.quantity_on_hand > 0 && p.quantity_on_hand <= p.reorder_level)
  if (filter === 'out') filtered = filtered.filter(p => p.quantity_on_hand === 0)

  const openCreate = () => { setEditing(null); setForm(emptyProduct); setModalOpen(true) }
  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({ name: p.name, sku: p.sku, description: p.description ?? '', category_id: p.category_id, unit: p.unit, cost_price: p.cost_price, selling_price: p.selling_price, quantity_on_hand: p.quantity_on_hand, reorder_level: p.reorder_level, is_active: p.is_active })
    setModalOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editing) {
        await supabase.from('products').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing.id)
      } else {
        await supabase.from('products').insert(form)
      }
      setModalOpen(false)
      fetchProducts()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  const stockBadge = (p: Product) => {
    if (p.quantity_on_hand === 0) return <Badge variant="error">Out of Stock</Badge>
    if (p.quantity_on_hand <= p.reorder_level) return <Badge variant="warning">Low Stock</Badge>
    return <Badge variant="success">In Stock</Badge>
  }

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Track products, stock levels, and pricing"
        action={<Button icon={<Plus className="h-4 w-4" />} onClick={openCreate}>Add Product</Button>}
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-primary-200 bg-primary-50/50">
          <CardContent>
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary-600" />
              <div>
                <p className="text-2xl font-bold text-primary-700">{products.length}</p>
                <p className="text-sm text-primary-600">Total Products</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning-200 bg-warning-50/50">
          <CardContent>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-warning-600" />
              <div>
                <p className="text-2xl font-bold text-warning-600">{products.filter(p => p.quantity_on_hand > 0 && p.quantity_on_hand <= p.reorder_level).length}</p>
                <p className="text-sm text-warning-600">Low Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-error-200 bg-error-50/50">
          <CardContent>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-error-500" />
              <div>
                <p className="text-2xl font-bold text-error-500">{products.filter(p => p.quantity_on_hand === 0).length}</p>
                <p className="text-sm text-error-500">Out of Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'low', 'out'] as const).map(f => (
                <Button key={f} variant={filter === f ? 'primary' : 'outline'} size="sm" onClick={() => setFilter(f)}>
                  {f === 'all' ? 'All' : f === 'low' ? 'Low Stock' : 'Out of Stock'}
                </Button>
              ))}
            </div>
          </div>

          {filtered.length === 0 && !loading.includes('products') ? (
            <EmptyState icon={<Package className="h-8 w-8" />} title="No products found" description="Add your first product to get started" actionLabel="Add Product" onAction={openCreate} />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>In Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(p => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{p.name}</p>
                          {p.description && <p className="text-xs text-gray-400">{p.description}</p>}
                        </div>
                      </TableCell>
                      <TableCell><code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{p.sku}</code></TableCell>
                      <TableCell>{p.category?.name || '-'}</TableCell>
                      <TableCell>{formatCurrency(p.cost_price)}</TableCell>
                      <TableCell>{formatCurrency(p.selling_price)}</TableCell>
                      <TableCell>{p.quantity_on_hand} {p.unit}</TableCell>
                      <TableCell>{stockBadge(p)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(p)} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><Edit2 className="h-4 w-4" /></button>
                          <button onClick={() => handleDelete(p.id)} className="rounded p-1 text-gray-400 hover:bg-error-50 hover:text-error-500"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Product' : 'Add Product'}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button loading={saving} onClick={handleSave}>{editing ? 'Update' : 'Create'}</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Product Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <Input label="SKU" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} required />
          <Input label="Description" value={form.description ?? ''} onChange={e => setForm({ ...form, description: e.target.value })} className="sm:col-span-2" />
          <Input label="Unit" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} />
          <Input label="Cost Price" type="number" step="0.01" value={form.cost_price} onChange={e => setForm({ ...form, cost_price: parseFloat(e.target.value) || 0 })} />
          <Input label="Selling Price" type="number" step="0.01" value={form.selling_price} onChange={e => setForm({ ...form, selling_price: parseFloat(e.target.value) || 0 })} />
          <Input label="Quantity on Hand" type="number" value={form.quantity_on_hand} onChange={e => setForm({ ...form, quantity_on_hand: parseInt(e.target.value) || 0 })} />
          <Input label="Reorder Level" type="number" value={form.reorder_level} onChange={e => setForm({ ...form, reorder_level: parseInt(e.target.value) || 0 })} />
        </div>
      </Modal>
    </div>
  )
}
