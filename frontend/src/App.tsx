import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { SuppliersPage } from '@/pages/suppliers/SuppliersPage'
import { CustomersPage } from '@/pages/customers/CustomersPage'
import { InventoryPage } from '@/pages/inventory/InventoryPage'
import { AccountingPage } from '@/pages/accounting/AccountingPage'
import { SalesPage } from '@/pages/sales/SalesPage'
import { PurchasesPage } from '@/pages/purchases/PurchasesPage'
import { ReportsPage } from '@/pages/reports/ReportsPage'
import { NotificationsPage } from '@/pages/notifications/NotificationsPage'
import { ActivityLogsPage } from '@/pages/activity-logs/ActivityLogsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/accounting" element={<AccountingPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/purchases" element={<PurchasesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/activity-logs" element={<ActivityLogsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
