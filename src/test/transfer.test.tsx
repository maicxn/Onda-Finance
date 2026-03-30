import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Transfer from '@/pages/Transfer'
import { useAuthStore } from '@/stores/authStore'
import { useFinanceStore } from '@/stores/financeStore'

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  )
}

describe('Transfer Flow', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: { id: '1', name: 'Test User', email: 'test@test.com' },
      token: 'test-token',
      isAuthenticated: true,
    })
    useFinanceStore.setState({
      balance: 5000,
      transactions: [],
    })
  })

  it('should render the transfer form', () => {
    renderWithProviders(<Transfer />)

    expect(screen.getByText('Enviar Dinheiro')).toBeInTheDocument()
    expect(screen.getByLabelText('Destinatário')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('000.000.000-00')).toBeInTheDocument()
    expect(screen.getByText('Selecione o banco de destino')).toBeInTheDocument()
    expect(screen.getByLabelText('Valor')).toBeInTheDocument()
  })

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Transfer />)

    const submitButton = screen.getByRole('button', { name: /confirmar transferência/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Nome deve ter pelo menos 2 caracteres')).toBeInTheDocument()
    })
  })

  it('should display current balance', async () => {
    renderWithProviders(<Transfer />)

    await waitFor(() => {
      const balanceEl = document.getElementById('transfer-balance')
      expect(balanceEl).toBeInTheDocument()
      expect(balanceEl?.textContent).toContain('5.000')
    })
  })

  it('should complete a transfer successfully', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Transfer />)

    // Fill basic fields
    await user.type(screen.getByLabelText('Destinatário'), 'Maria Silva')
    await user.type(screen.getByPlaceholderText('000.000.000-00'), '12345678901')

    // Select bank
    await user.click(screen.getByRole('combobox'))
    const bankOption = await screen.findByRole('option', { name: 'Nubank' })
    await user.click(bankOption)

    await user.type(screen.getByLabelText('Valor'), '10000')
    await user.type(screen.getByLabelText('Descrição (Opcional)'), 'Pagamento teste')

    const submitButton = screen.getByRole('button', { name: /confirmar transferência/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Transferência Concluída!')).toBeInTheDocument()
    }, { timeout: 6000 })

    const financeState = useFinanceStore.getState()
    expect(financeState.balance).toBe(4900)
    expect(financeState.transactions).toHaveLength(1)
    expect(financeState.transactions[0].recipientOrSender).toBe('Maria Silva')
  }, 10000)
})
