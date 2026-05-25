import { type ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClasses = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }

export function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (open) el.showModal()
    else el.close()
  }, [open])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    el.addEventListener('keydown', handler)
    return () => el.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null

  return createPortal(
    <dialog ref={ref} className="fixed inset-0 z-50 m-auto rounded-xl bg-white p-0 shadow-2xl backdrop:bg-black/50" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className={cn('flex flex-col', sizeClasses[size])}>
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-6 py-4">{footer}</div>}
      </div>
    </dialog>,
    document.body,
  )
}
