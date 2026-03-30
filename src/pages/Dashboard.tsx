import { useBalance, useTransactions } from '@/hooks/useQueries'
import { formatCurrency, formatShortDate } from '@/lib/utils'
import { txIcon, txCategory } from '@/helpers/transactions'
import { useNavigate } from 'react-router'
import {
  ChevronRight,
  MoreVertical,
  CreditCard,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: balance, isLoading: loadingBalance } = useBalance()
  const { data: transactions, isLoading: loadingTx } = useTransactions()

  const income = transactions?.filter((t) => t.type === 'credit' || t.type === 'transfer_in')
    .reduce((sum, t) => sum + t.amount, 0) ?? 0
  const expenses = transactions?.filter((t) => t.type === 'debit' || t.type === 'transfer_out')
    .reduce((sum, t) => sum + t.amount, 0) ?? 0

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Balance Hero Card ── */}
      <div className="rounded-2xl bg-gradient-to-r from-navy to-navy-light md:p-8 p-6 text-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-brand/10 rounded-full blur-3xl" />

        <p className="text-xs uppercase tracking-widest text-brand-light font-semibold mb-2">Saldo Disponível</p>

        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            {loadingBalance ? (
              <div className="h-10 w-56 bg-white/10 rounded-lg animate-pulse" />
            ) : (
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight" id="balance-display">
                {formatCurrency(balance ?? 0)}
              </h2>
            )}
            <div className="flex items-center gap-3 mt-3 text-sm text-slate-400">
              <span className="flex items-center gap-1.5 bg-white/10 rounded-md px-2 py-0.5 text-xs">
                <CreditCard className="w-3 h-3" /> **** 4482
              </span>
              <span>Próx. fatura: 24 Out</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/transfer')}
              className="flex items-center gap-2 bg-brand text-white font-semibold text-sm rounded-lg px-5 py-2.5 hover:bg-brand-dark transition-colors shadow-lg shadow-brand/30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" /> Transferir
            </button>
            <button className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Income / Expenses Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-surface rounded-xl border border-border p-5 flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success-light flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted font-medium">Receitas Totais</p>
              <p className="text-xl font-bold text-heading">{formatCurrency(income)}</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-success bg-success-light px-2 py-1 rounded-md">↑ 12.5%</span>
        </div>

        <div className="bg-surface rounded-xl border border-border p-5 flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-danger-light flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-danger" />
            </div>
            <div>
              <p className="text-xs text-muted font-medium">Despesas Totais</p>
              <p className="text-xl font-bold text-heading">{formatCurrency(expenses)}</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-danger bg-danger-light px-2 py-1 rounded-md">↑ 4.2%</span>
        </div>
      </div>

      {/* ── Transactions Table ── */}
      <div className="bg-surface rounded-xl border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-bold text-heading">Transações Recentes</h3>
        </div>

        {/* Table header */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] px-6 py-3 text-[11px] uppercase tracking-wider font-semibold text-muted border-b border-border">
          <span>Descrição</span>
          <span>Categoria</span>
          <span>Data</span>
          <span className="text-right">Valor</span>
        </div>

        {/* Rows */}
        {loadingTx ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-background rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div>
            {transactions?.map((tx) => {
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
                    {isPositive ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
