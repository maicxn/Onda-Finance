export interface User {
  id: string
  name: string
  email: string
}

export interface Transaction {
  id: string
  type: 'credit' | 'debit' | 'transfer_in' | 'transfer_out'
  description: string
  amount: number
  date: string
  recipientOrSender?: string
}

export interface TransferPayload {
  recipientName: string
  recipientCpf: string
  amount: number
  description: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface BalanceResponse {
  balance: number
}

export interface TransactionsResponse {
  transactions: Transaction[]
}
