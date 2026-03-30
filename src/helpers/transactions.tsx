import type { Transaction } from '@/types'
import { ArrowDownLeft, ShoppingBag, Send } from 'lucide-react'

export function txIcon(type: Transaction['type']) {
  switch (type) {
    case 'credit': return <ArrowDownLeft className="w-4 h-4 text-success" />
    case 'debit': return <ShoppingBag className="w-4 h-4 text-muted" />
    case 'transfer_in': return <ArrowDownLeft className="w-4 h-4 text-success" />
    case 'transfer_out': return <Send className="w-4 h-4 text-brand" />
  }
}

export function txCategory(tx: Transaction) {
  const d = tx.description.toLowerCase()
  if (d.includes('salário') || d.includes('freelance')) return { label: 'Renda', cls: 'badge-income' }
  if (d.includes('supermercado')) return { label: 'Compras', cls: 'badge-shopping' }
  if (d.includes('aluguel') || d.includes('internet')) return { label: 'Contas', cls: 'badge-bills' }
  if (d.includes('saúde') || d.includes('plano')) return { label: 'Saúde', cls: 'badge-health' }
  if (d.includes('pix') || d.includes('transferência') || d.includes('recebimento')) return { label: 'Transf.', cls: 'badge-transfer' }
  return { label: 'Outros', cls: 'badge-shopping' }
}
