import { useState, type ChangeEvent } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTransfer, useBalance } from '@/hooks/useQueries'
import { formatCurrency } from '@/lib/utils'

function maskCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

function maskCurrency(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  const num = parseInt(digits, 10)
  return (num / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function currencyToNumber(masked: string): number {
  if (!masked) return 0
  const cleaned = masked.replace(/\./g, '').replace(',', '.')
  return parseFloat(cleaned) || 0
}
import { isValidCpf } from '@/lib/validators'
import {
  Send,
  CheckCircle,
  ChevronDown,
  UserPlus,
  CreditCard,
  ShieldCheck,
  FileText,
} from 'lucide-react'

const transferSchema = z.object({
  recipientName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  recipientCpf: z
    .string()
    .min(11, 'CPF deve ter 11 dígitos')
    .max(14, 'CPF inválido')
    .regex(/^[\d.\-]+$/, 'Formato de CPF inválido')
    .refine(isValidCpf, 'CPF inválido — dígitos verificadores incorretos'),
  amount: z.number().positive('Valor deve ser maior que zero'),
  description: z.string().default(''),
})

type TransferForm = z.input<typeof transferSchema>

const recentRecipients = [
  { name: 'Maria da Silva', cpf: '529.982.247-25' },
  { name: 'José Santos', cpf: '276.154.380-06' },
  { name: 'Ana Oliveira', cpf: '831.674.520-87' },
]

export default function Transfer() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [lastTransfer, setLastTransfer] = useState<TransferForm | null>(null)
  const [cardFlipped, setCardFlipped] = useState(false)
  const transferMutation = useTransfer()
  const { data: balance } = useBalance()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<TransferForm>({
    resolver: zodResolver(transferSchema),
    defaultValues: { recipientName: '', recipientCpf: '', amount: 0, description: '' },
  })

  const watchedAmount = watch('amount') || 0
  const balanceAfter = (balance ?? 0) - (watchedAmount > 0 ? watchedAmount : 0)

  const onSubmit = (data: TransferForm) => {
    if (balance !== undefined && data.amount > balance) return

    transferMutation.mutate(
      {
        recipientName: data.recipientName,
        recipientCpf: data.recipientCpf,
        amount: data.amount,
        description: data.description || 'Transferência PIX',
      },
      {
        onSuccess: () => {
          setLastTransfer(data)
          setShowSuccess(true)
          reset()
        },
      }
    )
  }

  if (showSuccess && lastTransfer) {
    return (
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="bg-surface rounded-2xl border border-border p-8 text-center shadow-lg">
          <div className="w-20 h-20 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-heading">Transferência realizada!</h2>
          <p className="text-muted mt-2 text-sm">
            Você enviou <strong className="text-success">{formatCurrency(lastTransfer.amount)}</strong>{' '}
            para <strong className="text-heading">{lastTransfer.recipientName}</strong>
          </p>

          <div className="bg-background rounded-xl p-4 mt-6 text-left space-y-3">
            {[
              ['Destinatário', lastTransfer.recipientName],
              ['CPF', lastTransfer.recipientCpf],
              ['Valor', formatCurrency(lastTransfer.amount)],
              ...(lastTransfer.description ? [['Descrição', lastTransfer.description]] : []),
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-muted">{label}</span>
                <span className="font-medium text-heading">{value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => { setShowSuccess(false); setLastTransfer(null) }}
            className="mt-6 w-full h-12 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors cursor-pointer"
          >
            Nova transferência
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-heading">Enviar Dinheiro</h1>
        <p className="text-sm text-muted mt-1">Transfira fundos instantaneamente para qualquer conta ou chave PIX.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        <div className="bg-surface rounded-xl border border-border p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" id="transfer-form">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                Conta de Origem
              </label>
              <div className="flex items-center justify-between border border-border rounded-lg px-4 py-3 bg-background">
                <div className="flex items-center gap-2 text-sm text-heading font-medium">
                  <CreditCard className="w-4 h-4 text-muted" />
                  Conta Corrente Principal (**** 8829)
                </div>
                <ChevronDown className="w-4 h-4 text-muted" />
              </div>
              <p className="text-right text-xs text-muted mt-1.5">
                Saldo disponível <span className="font-semibold text-brand" id="transfer-balance">{formatCurrency(balance ?? 0)}</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2" htmlFor="recipientName">
                Destinatário
              </label>
              <div className="relative">
                <input
                  id="recipientName"
                  placeholder="Nome, chave PIX ou número da conta"
                  className="w-full h-11 pl-4 pr-11 rounded-lg border border-border bg-surface text-heading text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                  {...register('recipientName')}
                />
                <UserPlus className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand" />
              </div>
              {errors.recipientName && <p className="text-xs text-danger mt-1.5">{errors.recipientName.message}</p>}

              <div className="mt-3">
                <Controller
                  name="recipientCpf"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="recipientCpf"
                      placeholder="000.000.000-00"
                      inputMode="numeric"
                      maxLength={14}
                      className="w-full h-11 pl-4 pr-4 rounded-lg border border-border bg-surface text-heading text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                      value={field.value}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(maskCpf(e.target.value))}
                    />
                  )}
                />
                {errors.recipientCpf && <p className="text-xs text-danger mt-1.5">{errors.recipientCpf.message}</p>}
              </div>

              <div className="flex gap-2 mt-2 flex-wrap">
                {recentRecipients.map((r) => (
                  <button
                    key={r.cpf}
                    type="button"
                    onClick={() => { setValue('recipientName', r.name); setValue('recipientCpf', r.cpf) }}
                    className="badge badge-transfer text-[10px] hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    {r.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2" htmlFor="amount">
                Valor
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-heading">R$</span>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <input
                      id="amount"
                      type="text"
                      inputMode="numeric"
                      placeholder="0,00"
                      className="w-full h-14 pl-14 pr-4 rounded-lg border border-border bg-surface text-heading text-2xl font-bold placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                      value={field.value ? maskCurrency(String(Math.round(field.value * 100))) : ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => field.onChange(currencyToNumber(maskCurrency(e.target.value)))}
                    />
                  )}
                />
              </div>
              {errors.amount && <p className="text-xs text-danger mt-1.5">{errors.amount.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2" htmlFor="description">
                Descrição (Opcional)
              </label>
              <input
                id="description"
                placeholder="Ex: Pagamento de aluguel"
                className="w-full h-11 pl-4 pr-4 rounded-lg border border-border bg-surface text-heading text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                {...register('description')}
              />
            </div>

            {transferMutation.isError && (
              <div className="bg-danger-light border border-danger/20 rounded-lg p-3 text-sm text-danger">
                {transferMutation.error instanceof Error ? transferMutation.error.message : 'Erro ao realizar transferência'}
              </div>
            )}

            <button
              type="submit"
              disabled={transferMutation.isPending}
              className="w-full h-12 bg-navy text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-navy-light transition-colors disabled:opacity-60 shadow-lg shadow-navy/20 cursor-pointer"
            >
              {transferMutation.isPending ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                'Confirmar Transferência'
              )}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-surface rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-5">
              <FileText className="w-5 h-5 text-brand" />
              <h3 className="font-bold text-heading">Resumo da Transferência</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Saldo Atual</span>
                <span className="font-medium text-heading">{formatCurrency(balance ?? 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Valor da Transferência</span>
                <span className="font-medium text-danger">
                  - {formatCurrency(watchedAmount > 0 ? watchedAmount : 0)}
                </span>
              </div>
              <hr className="border-border" />
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-heading">Saldo Após</span>
                <span className={`text-xl font-bold ${balanceAfter >= 0 ? 'text-heading' : 'text-danger'}`}>
                  {formatCurrency(balanceAfter)}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 bg-success-light/60 rounded-lg px-3 py-2">
              <ShieldCheck className="w-4 h-4 text-success" />
              <div>
                <p className="text-xs font-semibold text-success">Transferência Instantânea Verificada</p>
                <p className="text-[10px] text-success/70">Os fundos chegarão ao destinatário imediatamente pela rede Onda Real-Time.</p>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-border p-6 text-center">
            <div className="w-16 h-16 bg-background rounded-full mx-auto flex items-center justify-center mb-3">
              <Send className="w-7 h-7 text-muted" />
            </div>
            <p className="text-sm font-semibold text-heading">Status da Transação</p>
            <p className="text-xs text-muted mt-1">Preencha o formulário para ver os detalhes da sua transferência confirmados aqui.</p>
          </div>

          <div
            className={`flip-card ${cardFlipped ? 'flipped' : ''}`}
            onClick={() => setCardFlipped(!cardFlipped)}
            title="Clique para virar o cartão"
          >
            <div className="flip-card-inner">
              {/* Front */}
              <div className="flip-card-front bg-gradient-to-r from-brand to-brand-light rounded-xl p-5 text-white relative overflow-hidden">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] uppercase tracking-widest text-white/70">Titular</p>
                  <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                    <circle cx="12" cy="10" r="9" fill="#eb001b" opacity="0.8" />
                    <circle cx="20" cy="10" r="9" fill="#f79e1b" opacity="0.8" />
                  </svg>
                </div>
                <p className="font-bold text-sm">USUÁRIO ONDA</p>
                <div className="flex items-center gap-1 mt-4 text-lg tracking-widest font-mono">
                  <span className="text-white/50">•••• •••• ••••</span> <span className="font-bold">8829</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-[10px] text-white/50">EXP 05/28</p>
                  <p className="text-[10px] text-white/50">Clique para virar ↻</p>
                </div>
              </div>

              {/* Back */}
              <div className="flip-card-back bg-gradient-to-r from-brand-dark to-brand rounded-xl text-white relative overflow-hidden">
                <div className="w-full h-10 bg-black/40 mt-5" />
                <div className="px-5 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-8 bg-white/20 rounded-md" />
                    <div className="bg-white/90 rounded-md px-3 py-1">
                      <p className="text-[10px] text-black/50 font-medium">CVV</p>
                      <p className="text-sm font-bold text-black tracking-widest font-mono">***</p>
                    </div>
                  </div>
                  <p className="text-[9px] text-white/40 mt-4 leading-relaxed">
                    Este cartão é de uso exclusivo do titular. Em caso de perda ou roubo,
                    entre em contato com a Onda Finance imediatamente.
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-[10px] text-white/50 font-mono">ONDA FINANCE S.A.</p>
                    <p className="text-[10px] text-white/50">Clique para virar ↻</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
