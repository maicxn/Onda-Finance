import { Outlet, NavLink, useNavigate, useLocation } from 'react-router'
import { useAuthStore } from '@/stores/authStore'
import { useFinanceStore } from '@/stores/financeStore'
import { LayoutDashboard, ArrowLeftRight, CreditCard, Settings, Plus, HelpCircle, LogOut, Bell, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transfer', label: 'Transferências', icon: ArrowLeftRight },
  { to: '/cards', label: 'Cartões', icon: CreditCard },
  { to: '#', label: 'Configurações', icon: Settings },
]

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const resetFinance = useFinanceStore((s) => s.reset)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    resetFinance()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={cn(
          'fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50 w-56 h-screen bg-white flex flex-col transition-transform duration-300 overflow-y-auto shrink-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="px-5 pt-7 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand rounded-md flex items-center justify-center">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2.5">
                <path d="M3 17c3-4 6 0 9-4s6 0 9-4" strokeLinecap="round" />
                <path d="M3 12c3-4 6 0 9-4s6 0 9-4" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-brand">Onda Finance</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">Premium Banking</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1.5 mt-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={() =>
                  cn(
                    'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'text-brand bg-brand/10 border-l-[3px] border-brand'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  )
                }
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="px-3 pb-5 space-y-2">
          <button
            onClick={() => navigate('/transfer')}
            className="w-full flex items-center gap-2 bg-brand text-white font-semibold text-sm rounded-lg px-3 py-2.5 mb-3 hover:bg-brand-dark transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nova Transação
          </button>
          <button className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-slate-200 w-full rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
            <HelpCircle className="w-[18px] h-[18px]" /> Suporte
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-red-400 w-full rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <LogOut className="w-[18px] h-[18px]" /> Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-background transition-colors cursor-pointer"
            >
              {sidebarOpen ? <X className="w-5 h-5 text-heading" /> : <Menu className="w-5 h-5 text-heading" />}
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-background rounded-lg px-3 h-9 w-64">
              <Search className="w-4 h-4 text-muted" />
              <input
                placeholder="Buscar transações..."
                className="bg-transparent text-sm text-heading placeholder:text-muted outline-none w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-background transition-colors relative cursor-pointer">
              <Bell className="w-[18px] h-[18px] text-muted" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full" />
            </button>
            <button className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-background transition-colors cursor-pointer">
              <HelpCircle className="w-[18px] h-[18px] text-muted" />
            </button>
            <div className="h-7 w-px bg-border mx-1" />
            <div className="flex items-center gap-2.5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-heading leading-tight">{user?.name ?? 'Usuário'}</p>
                <p className="text-[11px] text-brand font-medium">Membro Premium</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand to-brand-dark text-white flex items-center justify-center text-sm font-bold">
                {user?.name?.charAt(0) ?? 'U'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
