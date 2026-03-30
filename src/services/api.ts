import axios from 'axios'
import type {
  AuthResponse,
  BalanceResponse,
  LoginPayload,
  TransactionsResponse,
  TransferPayload,
  Transaction,
} from '@/types'
import { useAuthStore } from '@/stores/authStore'
import { useFinanceStore } from '@/stores/financeStore'

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

// Intercept requests to add auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Mock response delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// ─── Mock API Functions ──────────────────────────────────────────────

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  await delay(600)

  if (
    payload.email === 'usuario@onda.com' &&
    payload.password === '123456'
  ) {
    return {
      user: {
        id: '1',
        name: 'Usuário Onda',
        email: payload.email,
      },
      token: 'mock-jwt-token-xyz-123',
    }
  }

  throw new Error('Credenciais inválidas')
}

export async function fetchBalance(): Promise<BalanceResponse> {
  await delay(300)
  return { balance: useFinanceStore.getState().balance }
}

export async function fetchTransactions(): Promise<TransactionsResponse> {
  await delay(400)
  return { transactions: useFinanceStore.getState().transactions }
}

export async function createTransfer(
  payload: TransferPayload
): Promise<Transaction> {
  await delay(800)

  const balance = useFinanceStore.getState().balance

  if (payload.amount > balance) {
    throw new Error('Saldo insuficiente')
  }

  if (payload.amount <= 0) {
    throw new Error('Valor inválido')
  }

  const transaction: Transaction = {
    id: crypto.randomUUID(),
    type: 'transfer_out',
    description: payload.description || 'Transferência PIX',
    amount: payload.amount,
    date: new Date().toISOString(),
    recipientOrSender: payload.recipientName,
  }

  useFinanceStore.getState().deductBalance(payload.amount)
  useFinanceStore.getState().addTransaction(transaction)

  return transaction
}

export default api
