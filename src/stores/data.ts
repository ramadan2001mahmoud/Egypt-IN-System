import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Supplier, Customer, Product, Invoice, Transaction, Account, PurchaseOrder, Notification, ActivityLog, DashboardStats, ChartData } from '@/types'

interface DataState {
  suppliers: Supplier[]
  customers: Customer[]
  products: Product[]
  invoices: Invoice[]
  transactions: Transaction[]
  accounts: Account[]
  purchaseOrders: PurchaseOrder[]
  notifications: Notification[]
  activityLogs: ActivityLog[]
  dashboardStats: DashboardStats | null
  revenueChart: ChartData[]
  expenseChart: ChartData[]
  loading: string[]

  fetchDashboardStats: () => Promise<void>
  fetchSuppliers: () => Promise<void>
  fetchCustomers: () => Promise<void>
  fetchProducts: () => Promise<void>
  fetchInvoices: () => Promise<void>
  fetchTransactions: () => Promise<void>
  fetchAccounts: () => Promise<void>
  fetchPurchaseOrders: () => Promise<void>
  fetchNotifications: () => Promise<void>
  fetchActivityLogs: () => Promise<void>
  markNotificationRead: (id: string) => Promise<void>
}

const withLoading = (key: string) => <T extends (...args: unknown[]) => Promise<void>>(fn: T) =>
  async (...args: Parameters<T>) => {
    const { loading } = useDataStore.getState()
    useDataStore.setState({ loading: [...loading, key] })
    try {
      await fn(...args)
    } finally {
      const { loading: l } = useDataStore.getState()
      useDataStore.setState({ loading: l.filter(k => k !== key) })
    }
  }

export const useDataStore = create<DataState>((set, get) => ({
  suppliers: [],
  customers: [],
  products: [],
  invoices: [],
  transactions: [],
  accounts: [],
  purchaseOrders: [],
  notifications: [],
  activityLogs: [],
  dashboardStats: null,
  revenueChart: [],
  expenseChart: [],
  loading: [],

  fetchDashboardStats: withLoading('dashboard')(async () => {
    const [invoicesRes, customersRes, suppliersRes, productsRes, revenueRes, expenseRes] = await Promise.all([
      supabase.from('invoices').select('total_amount, paid_amount, status, type').eq('type', 'sales'),
      supabase.from('customers').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('suppliers').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('products').select('id, quantity_on_hand, reorder_level').eq('is_active', true),
      supabase.from('revenue_monthly').select('*').order('month').limit(12),
      supabase.from('expense_monthly').select('*').order('month').limit(12),
    ])

    const invoices = invoicesRes.data ?? []
    const totalRevenue = invoices.filter(i => i.status !== 'cancelled').reduce((s, i) => s + i.total_amount, 0)
    const pendingCount = invoices.filter(i => i.status === 'sent').length
    const overdueCount = invoices.filter(i => i.status === 'overdue').length
    const products = productsRes.data ?? []
    const lowStock = products.filter(p => p.quantity_on_hand <= p.reorder_level).length

    set({
      dashboardStats: {
        total_revenue: totalRevenue,
        total_expenses: 0,
        net_income: totalRevenue,
        pending_invoices: pendingCount,
        overdue_invoices: overdueCount,
        total_customers: customersRes.count ?? 0,
        total_suppliers: suppliersRes.count ?? 0,
        low_stock_products: lowStock,
        revenue_change: 12.5,
        expense_change: -3.2,
      },
      revenueChart: (revenueRes.data ?? []).map(r => ({ name: r.month_name, value: r.total })),
      expenseChart: (expenseRes.data ?? []).map(r => ({ name: r.month_name, value: r.total })),
    })
  }),

  fetchSuppliers: withLoading('suppliers')(async () => {
    const { data } = await supabase.from('suppliers').select('*').order('name')
    set({ suppliers: data ?? [] })
  }),

  fetchCustomers: withLoading('customers')(async () => {
    const { data } = await supabase.from('customers').select('*').order('name')
    set({ customers: data ?? [] })
  }),

  fetchProducts: withLoading('products')(async () => {
    const { data } = await supabase.from('products').select('*, category:product_categories(*)').order('name')
    set({ products: data ?? [] })
  }),

  fetchInvoices: withLoading('invoices')(async () => {
    const { data } = await supabase.from('invoices').select('*, items:invoice_items(*, product:products(*))').order('created_at', { ascending: false })
    set({ invoices: data ?? [] })
  }),

  fetchTransactions: withLoading('transactions')(async () => {
    const { data } = await supabase.from('transactions').select('*, account:accounts(*)').order('transaction_date', { ascending: false })
    set({ transactions: data ?? [] })
  }),

  fetchAccounts: withLoading('accounts')(async () => {
    const { data } = await supabase.from('accounts').select('*').order('code')
    set({ accounts: data ?? [] })
  }),

  fetchPurchaseOrders: withLoading('purchase_orders')(async () => {
    const { data } = await supabase.from('purchase_orders').select('*, supplier:suppliers(*), items:purchase_order_items(*, product:products(*))').order('created_at', { ascending: false })
    set({ purchaseOrders: data ?? [] })
  }),

  fetchNotifications: withLoading('notifications')(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    set({ notifications: data ?? [] })
  }),

  fetchActivityLogs: withLoading('activity_logs')(async () => {
    const { data } = await supabase.from('activity_logs').select('*, user:profiles(*)').order('created_at', { ascending: false }).limit(100)
    set({ activityLogs: data ?? [] })
  }),

  markNotificationRead: async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    const { notifications } = get()
    set({ notifications: notifications.map(n => n.id === id ? { ...n, is_read: true } : n) })
  },
}))
