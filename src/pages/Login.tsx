import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router'
import { useLogin } from '@/hooks/useQueries'
import { AtSign, Lock, Eye, EyeOff, ArrowRight, Shield, ShieldCheck } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data, {
      onSuccess: () => navigate('/dashboard'),
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-brand-50 via-white to-brand-100">
      <div className="text-center mb-8 animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.2">
              <path d="M3 17c3-4 6 0 9-4s6 0 9-4" strokeLinecap="round" />
              <path d="M3 12c3-4 6 0 9-4s6 0 9-4" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-brand">Onda Finance</h1>
        </div>
        <p className="text-muted text-sm tracking-wide">Banco Digital Institucional</p>
      </div>

      <div className="w-full max-w-md bg-surface rounded-2xl shadow-xl shadow-black/5 border border-border p-8 animate-slide-up">
        <h2 className="text-xl font-bold text-heading mb-1">Bem-vindo de volta</h2>
        <p className="text-sm text-muted mb-6">Entre com suas credenciais para acessar sua conta.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" id="login-form">
          <div>
            <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2" htmlFor="email">
              Email ou ID da Conta
            </label>
            <div className="relative">
              <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                id="email"
                type="email"
                placeholder="name@company.com"
                className="w-full h-11 pl-10 pr-4 rounded-lg border border-border bg-surface text-heading text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                {...register('email')}
              />
            </div>
            {errors.email && <p className="text-xs text-danger mt-1.5">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-muted uppercase tracking-wider" htmlFor="password">
                Senha
              </label>
              <button type="button" className="text-xs text-brand font-medium hover:underline cursor-pointer">
                Esqueceu a senha?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-11 rounded-lg border border-border bg-surface text-heading text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-heading transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-danger mt-1.5">{errors.password.message}</p>}
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" className="w-4 h-4 rounded border-border accent-brand" />
            <span className="text-sm text-body">Lembrar este dispositivo por 30 dias</span>
          </label>

          {loginMutation.isError && (
            <div className="bg-danger-light border border-danger/20 rounded-lg p-3 text-sm text-danger">
              Credenciais inválidas. Tente novamente.
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full h-12 bg-gradient-to-r from-brand to-brand-light text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 shadow-lg shadow-brand/20 cursor-pointer"
          >
            {loginMutation.isPending ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <>
                Entrar <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Não tem uma conta?{' '}
          <button className="text-brand font-semibold hover:underline cursor-pointer">Criar Conta</button>
        </p>
      </div>

      <div className="mt-8 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-6 text-xs text-muted mb-2">
          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> CRIPTOGRAFIA AES-256</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> GARANTIA FGC</span>
        </div>
        <p className="text-[11px] text-muted/70">
          Ao entrar, você concorda com os{' '}
          <button className="underline hover:text-brand cursor-pointer">Termos de Serviço</button> e{' '}
          <button className="underline hover:text-brand cursor-pointer">Política de Privacidade</button> da Onda Finance.
        </p>
      </div>

      <div className="mt-4 bg-brand-50 border border-brand/20 rounded-lg px-4 py-2 text-xs text-brand-dark animate-fade-in">
        Demo: <strong>usuario@onda.com</strong> / <strong>123456</strong>
      </div>
    </div>
  )
}
