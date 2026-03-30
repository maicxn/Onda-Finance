import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchBalance, fetchTransactions, createTransfer, loginApi } from '@/services/api'
import type { TransferPayload, LoginPayload } from '@/types'
import { useAuthStore } from '@/stores/authStore'

export function useBalance() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: fetchBalance,
    select: (data) => data.balance,
    staleTime: 0,
    refetchOnMount: 'always',
  })
}

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
    select: (data) => data.transactions,
    staleTime: 0,
    refetchOnMount: 'always',
  })
}

export function useTransfer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: TransferPayload) => createTransfer(payload),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['balance'] })
      queryClient.refetchQueries({ queryKey: ['transactions'] })
    },
  })
}

export function useLogin() {
  const login = useAuthStore((state) => state.login)

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: (data) => {
      login(data.user, data.token)
    },
  })
}
