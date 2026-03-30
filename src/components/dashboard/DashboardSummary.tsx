import { useBalance, useTransactions } from '@/hooks/useQueries'
import { useFinanceStore } from '@/stores/financeStore'
import { formatCurrency } from '@/lib/utils'
import { useNavigate } from 'react-router'
import {
  ChevronRight,
  MoreVertical,
  CreditCard,
  TrendingDown,
  TrendingUp,
  Eye,
  EyeOff,
} from 'lucide-react'

export function DashboardSummary() {
  const navigate = useNavigate()
  const { data: balance, isLoading: loadingBalance } = useBalance()
  const { data: transactions } = useTransactions()

  const isBalanceVisible = useFinanceStore(state => state.isBalanceVisible)
  const toggleBalanceVisibility = useFinanceStore(state => state.toggleBalanceVisibility)

  const income = transactions?.filter((t) => t.type === 'credit' || t.type === 'transfer_in')
    .reduce((sum, t) => sum + t.amount, 0) ?? 0
  const expenses = transactions?.filter((t) => t.type === 'debit' || t.type === 'transfer_out')
    .reduce((sum, t) => sum + t.amount, 0) ?? 0

  return (
    <>
      <div className="rounded-2xl bg-gradient-to-r from-brand to-brand-dark md:p-8 p-6 text-white relative overflow-hidden shadow-lg shadow-brand/20">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-brand/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-2">
          <p className="text-xs uppercase tracking-widest text-brand-light font-semibold">Saldo Disponível</p>
          <button onClick={toggleBalanceVisibility} className="text-brand-light hover:text-white transition-colors cursor-pointer">
            {isBalanceVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            {loadingBalance ? (
              <div className="h-10 w-56 bg-white/10 rounded-lg animate-pulse" />
            ) : (
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight" id="balance-display">
                {isBalanceVisible ? formatCurrency(balance ?? 0) : 'R$ ••••••'}
              </h2>
            )}
            <div className="flex items-center gap-3 mt-3 text-sm text-brand-light/70">
              <span className="flex items-center gap-1.5 bg-white/10 text-white rounded-md px-2 py-0.5 text-xs">
                <CreditCard className="w-3 h-3" /> **** 8829
              </span>
              <span className="text-white/70">Próx. fatura: 24 Out</span>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-surface rounded-xl border border-border p-5 flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success-light flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted font-medium">Receitas Totais</p>
              <p className="text-xl font-bold text-heading">{isBalanceVisible ? formatCurrency(income) : 'R$ ••••••'}</p>
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
              <p className="text-xl font-bold text-heading">{isBalanceVisible ? formatCurrency(expenses) : 'R$ ••••••'}</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-danger bg-danger-light px-2 py-1 rounded-md">↑ 4.2%</span>
        </div>
      </div>
    </>
  )
}
