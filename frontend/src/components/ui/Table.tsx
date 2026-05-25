import { type ReactNode, type TdHTMLAttributes, type ThHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return <table className={cn('w-full text-sm', className)}>{children}</table>
}

export function TableHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <thead className={cn('border-b border-gray-200', className)}>{children}</thead>
}

export function TableBody({ children, className }: { children: ReactNode; className?: string }) {
  return <tbody className={cn('divide-y divide-gray-100', className)}>{children}</tbody>
}

export function TableHead({ children, className, ...props }: ThHTMLAttributes<HTMLTableCellElement> & { children: ReactNode }) {
  return <th className={cn('px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500', className)} {...props}>{children}</th>
}

export function TableRow({ children, className, ...props }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return <tr className={cn('hover:bg-gray-50 transition-colors', className)} {...props}>{children}</tr>
}

export function TableCell({ children, className, ...props }: TdHTMLAttributes<HTMLTableCellElement> & { children: ReactNode }) {
  return <td className={cn('px-4 py-3 text-gray-700', className)} {...props}>{children}</td>
}
