import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Transaction } from '@/types'

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'credit',
    description: 'Salário mensal',
    amount: 8500.0,
    date: '2026-03-25T09:00:00',
    recipientOrSender: 'Empresa XYZ',
  },
  {
    id: '2',
    type: 'debit',
    description: 'Aluguel',
    amount: 2200.0,
    date: '2026-03-20T10:30:00',
    recipientOrSender: 'Imobiliária Central',
  },
  {
    id: '3',
    type: 'transfer_out',
    description: 'Transferência PIX',
    amount: 350.0,
    date: '2026-03-18T14:22:00',
    recipientOrSender: 'Maria Silva',
  },
  {
    id: '4',
    type: 'credit',
    description: 'Freelance',
    amount: 1200.0,
    date: '2026-03-15T16:45:00',
    recipientOrSender: 'Cliente ABC',
  },
  {
    id: '5',
    type: 'debit',
    description: 'Supermercado',
    amount: 487.32,
    date: '2026-03-14T19:10:00',
    recipientOrSender: 'Supermercado BomPreço',
  },
  {
    id: '6',
    type: 'transfer_in',
    description: 'Recebimento PIX',
    amount: 150.0,
    date: '2026-03-12T11:05:00',
    recipientOrSender: 'João Souza',
  },
  {
    id: '7',
    type: 'debit',
    description: 'Plano de saúde',
    amount: 650.0,
    date: '2026-03-10T08:00:00',
    recipientOrSender: 'Unimed',
  },
  {
    id: '8',
    type: 'debit',
    description: 'Internet + TV',
    amount: 179.9,
    date: '2026-03-08T07:30:00',
    recipientOrSender: 'Vivo Fibra',
  },
]

const INITIAL_BALANCE = 5982.78

interface FinanceState {
  balance: number
  transactions: Transaction[]
  deductBalance: (amount: number) => void
  addTransaction: (transaction: Transaction) => void
  reset: () => void
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      balance: INITIAL_BALANCE,
      transactions: INITIAL_TRANSACTIONS,
      deductBalance: (amount) =>
        set((state) => ({ balance: state.balance - amount })),
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [transaction, ...state.transactions],
        })),
      reset: () =>
        set({ balance: INITIAL_BALANCE, transactions: INITIAL_TRANSACTIONS }),
    }),
    {
      name: 'onda-finance',
    }
  )
)
