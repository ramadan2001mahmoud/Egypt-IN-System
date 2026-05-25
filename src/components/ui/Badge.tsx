import { cn } from '@/lib/utils'

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'default'
type BadgeStyle = 'solid' | 'outline'

interface BadgeProps {
  variant?: BadgeVariant
  style?: BadgeStyle
  children: React.ReactNode
  className?: string
}

const colorMap: Record<BadgeVariant, { solid: string; outline: string }> = {
  success: { solid: 'bg-success-50 text-success-700', outline: 'border-success-500 text-success-600' },
  warning: { solid: 'bg-warning-50 text-warning-600', outline: 'border-warning-500 text-warning-600' },
  error: { solid: 'bg-error-50 text-error-600', outline: 'border-error-500 text-error-600' },
  info: { solid: 'bg-primary-50 text-primary-700', outline: 'border-primary-500 text-primary-600' },
  default: { solid: 'bg-gray-100 text-gray-700', outline: 'border-gray-400 text-gray-600' },
}

export function Badge({ variant = 'default', style = 'solid', children, className }: BadgeProps) {
  const colors = colorMap[variant]
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      style === 'outline' ? `border ${colors.outline}` : colors.solid,
      className,
    )}>
      {children}
    </span>
  )
}
