import { type ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: ReactNode
  className?: string
}

export function StatCard({ title, value, change, icon, className }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0
  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white p-6 shadow-sm', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className="rounded-lg bg-primary-50 p-2 text-primary-600">{icon}</div>
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      {change !== undefined && (
        <div className={cn('mt-1 flex items-center gap-1 text-sm font-medium', isPositive ? 'text-success-600' : 'text-error-500')}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          <span>{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
          <span className="text-gray-400 font-normal">vs last period</span>
        </div>
      )}
    </div>
  )
}
