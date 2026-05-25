export type UserRole = 'admin' | 'accountant' | 'manager' | 'viewer'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  tax_id: string
  payment_terms: string
  rating: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  tax_id: string
  credit_limit: number
  current_balance: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductCategory {
  id: string
  name: string
  description: string | null
  parent_id: string | null
}

export interface Product {
  id: string
  name: string
  sku: string
  description: string | null
  category_id: string | null
  unit: string
  cost_price: number
  selling_price: number
  quantity_on_hand: number
  reorder_level: number
  is_active: boolean
  created_at: string
  updated_at: string
  category?: ProductCategory
}

export type TransactionType = 'income' | 'expense' | 'transfer'
export type TransactionStatus = 'pending' | 'completed' | 'cancelled'

export interface Account {
  id: string
  code: string
  name: string
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense'
  parent_id: string | null
  balance: number
  description: string | null
  is_active: boolean
  created_at: string
}

export interface Transaction {
  id: string
  transaction_number: string
  description: string
  amount: number
  type: TransactionType
  status: TransactionStatus
  reference: string | null
  account_id: string
  transaction_date: string
  created_by: string
  created_at: string
  account?: Account
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
export type InvoiceType = 'sales' | 'purchase'

export interface InvoiceItem {
  id: string
  invoice_id: string
  product_id: string
  description: string
  quantity: number
  unit_price: number
  discount_percent: number
  tax_percent: number
  total: number
  product?: Product
}

export interface Invoice {
  id: string
  invoice_number: string
  type: InvoiceType
  status: InvoiceStatus
  entity_id: string
  entity_name: string
  issue_date: string
  due_date: string
  subtotal: number
  tax_amount: number
  discount_amount: number
  total_amount: number
  paid_amount: number
  notes: string | null
  created_by: string
  created_at: string
  updated_at: string
  items?: InvoiceItem[]
}

export interface PurchaseOrder {
  id: string
  order_number: string
  supplier_id: string
  status: 'pending' | 'approved' | 'received' | 'cancelled'
  order_date: string
  expected_date: string
  subtotal: number
  tax_amount: number
  total_amount: number
  notes: string | null
  created_by: string
  created_at: string
  supplier?: Supplier
  items?: PurchaseOrderItem[]
}

export interface PurchaseOrderItem {
  id: string
  purchase_order_id: string
  product_id: string
  description: string
  quantity_ordered: number
  quantity_received: number
  unit_cost: number
  total: number
  product?: Product
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success'
  is_read: boolean
  link: string | null
  created_at: string
}

export interface ActivityLog {
  id: string
  user_id: string
  action: string
  entity_type: string
  entity_id: string
  details: Record<string, unknown> | null
  created_at: string
  user?: Profile
}

export interface DashboardStats {
  total_revenue: number
  total_expenses: number
  net_income: number
  pending_invoices: number
  overdue_invoices: number
  total_customers: number
  total_suppliers: number
  low_stock_products: number
  revenue_change: number
  expense_change: number
}

export interface ChartData {
  name: string
  value: number
}

export type DateRange = '7d' | '30d' | '90d' | '12m'
