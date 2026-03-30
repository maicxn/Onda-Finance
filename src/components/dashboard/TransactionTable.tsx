import { useState } from 'react'
import { useTransactions } from '@/hooks/useQueries'
import { useFinanceStore } from '@/stores/financeStore'
import { formatCurrency, formatShortDate } from '@/lib/utils'
import { txIcon, txCategory } from '@/helpers/transactions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function TransactionTable() {
  const { data: transactions, isLoading: loadingTx } = useTransactions()
  const isBalanceVisible = useFinanceStore(state => state.isBalanceVisible)
  const [filter, setFilter] = useState<'all' | 'in' | 'out'>('all')
  const [categoryFilter, setCategoryFilter] = useState('Todas')

  const filteredTransactions = transactions?.filter(tx => {
    if (filter === 'all') return true
    if (filter === 'in') return tx.type === 'credit' || tx.type === 'transfer_in'
    if (filter === 'out') return tx.type === 'debit' || tx.type === 'transfer_out'
    return true
  }).filter(tx => {
    if (categoryFilter === 'Todas') return true
    return txCategory(tx).label === categoryFilter
  })

  return (
    <div className="bg-surface rounded-xl border border-border">
      <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 border-b border-border gap-4">
        <h3 className="font-bold text-heading">Transações Recentes</h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full md:w-auto gap-3">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[160px] h-10 sm:h-8 text-xs font-medium">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas categorias</SelectItem>
              <SelectItem value="Renda">Renda</SelectItem>
              <SelectItem value="Compras">Compras</SelectItem>
              <SelectItem value="Contas">Contas</SelectItem>
              <SelectItem value="Saúde">Saúde</SelectItem>
              <SelectItem value="Transf.">Transferências</SelectItem>
              <SelectItem value="Outros">Outros</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 sm:flex-none text-xs transition-colors cursor-pointer ${filter === 'all' ? 'text-brand font-bold' : 'text-muted hover:text-heading font-medium'}`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('in')}
              className={`flex-1 sm:flex-none text-xs transition-colors cursor-pointer ${filter === 'in' ? 'text-brand font-bold' : 'text-muted hover:text-heading font-medium'}`}
            >
              Entradas
            </button>
            <button
              onClick={() => setFilter('out')}
              className={`flex-1 sm:flex-none text-xs transition-colors cursor-pointer ${filter === 'out' ? 'text-brand font-bold' : 'text-muted hover:text-heading font-medium'}`}
            >
              Saídas
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] px-6 py-3 text-[11px] uppercase tracking-wider font-semibold text-muted border-b border-border">
        <span>Descrição</span>
        <span>Categoria</span>
        <span>Data</span>
        <span className="text-right">Valor</span>
      </div>

      {loadingTx ? (
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-background rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div>
          {filteredTransactions?.map((tx) => {
            const cat = txCategory(tx)
            const isPositive = tx.type === 'credit' || tx.type === 'transfer_in'
            return (
              <div
                key={tx.id}
                className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] items-center px-6 py-4 border-b border-border last:border-b-0 hover:bg-background/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center shrink-0">
                    {txIcon(tx.type)}
                  </div>
                  <span className="font-medium text-heading text-sm">{tx.description}</span>
                </div>
                <div className="mt-1 md:mt-0">
                  <span className={`badge ${cat.cls}`}>{cat.label}</span>
                </div>
                <span className="text-sm text-muted">{formatShortDate(tx.date)}</span>
                <span className={`text-sm font-semibold text-right ${isPositive ? 'text-success' : 'text-danger'}`}>
                   {isBalanceVisible ? `${isPositive ? '+' : '-'}${formatCurrency(tx.amount)}` : 'R$ ••••,••'}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
