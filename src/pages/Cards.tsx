import { useState } from 'react'
import {
  CreditCard,
  Smartphone,
  ShieldAlert,
  Settings2,
  Copy,
  Plus,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react'

export default function Cards() {
  const [activeTab, setActiveTab] = useState<'physical' | 'virtual'>('physical')
  const [cardFlipped, setCardFlipped] = useState(false)
  const [showVirtualData, setShowVirtualData] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('4482 1928 3391 0021')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="animate-fade-in pb-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">Meus Cartões</h1>
          <p className="text-sm text-muted mt-1">Gerencie seus cartões físicos e virtuais de forma segura.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand text-white font-semibold text-sm rounded-lg px-4 py-2 hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20 cursor-pointer">
          <Plus className="w-4 h-4" />
          Novo Cartão Virtual
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        <div className="space-y-6">
          <div className="bg-surface rounded-xl border border-border p-6 overflow-hidden relative">
            <div className="flex items-center gap-1 bg-background p-1 rounded-lg w-fit mb-8 relative z-10">
              <button
                onClick={() => {
                  setActiveTab('physical')
                  setCardFlipped(false)
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer ${activeTab === 'physical' ? 'bg-surface shadow-sm text-heading' : 'text-muted hover:text-heading'
                  }`}
              >
                <CreditCard className="w-4 h-4" />
                Cartão Físico
              </button>
              <button
                onClick={() => {
                  setActiveTab('virtual')
                  setCardFlipped(false)
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all cursor-pointer ${activeTab === 'virtual' ? 'bg-surface shadow-sm text-heading' : 'text-muted hover:text-heading'
                  }`}
              >
                <Smartphone className="w-4 h-4" />
                Cartão Virtual
              </button>
            </div>

            <div className="flex flex-col items-center justify-center py-4 mb-4">
              <div
                className={`flip-card w-full max-w-[340px] h-[210px] ${cardFlipped ? 'flipped' : ''}`}
                onClick={() => setCardFlipped(!cardFlipped)}
                title="Clique para virar o cartão"
              >
                <div className="flip-card-inner h-full w-full">
                  {/* Front */}
                  <div className={`flip-card-front h-full w-full rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between shadow-xl ${activeTab === 'physical'
                      ? 'bg-gradient-to-br from-brand to-brand-dark shadow-brand/20'
                      : 'bg-gradient-to-br from-slate-800 to-black shadow-slate-900/20'
                    }`}>
                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center justify-center w-10 h-8 bg-white/20 rounded border border-white/30 backdrop-blur-sm">
                        <div className="w-6 h-4 border border-white/40 rounded-sm opacity-50" />
                      </div>
                      <svg width="36" height="22" viewBox="0 0 32 20" fill="none">
                        <circle cx="12" cy="10" r="9" fill="#eb001b" opacity="0.8" />
                        <circle cx="20" cy="10" r="9" fill="#f79e1b" opacity="0.8" />
                      </svg>
                    </div>

                    <div className="relative z-10 mt-auto">
                      <div className="flex items-center gap-2 text-xl tracking-widest font-mono mb-4 text-white/90">
                        {activeTab === 'physical' ? (
                          <><span>••••</span> <span>••••</span> <span>••••</span> <span className="font-bold">8829</span></>
                        ) : (
                          showVirtualData ? (
                            <span className="font-bold">4482 1928 3391 0021</span>
                          ) : (
                            <><span>••••</span> <span>••••</span> <span>••••</span> <span className="font-bold">0021</span></>
                          )
                        )}
                      </div>

                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-white/60 mb-0.5">Titular</p>
                          <p className="font-bold text-sm tracking-wide">USUÁRIO ONDA</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase tracking-widest text-white/60 mb-0.5">Validade</p>
                          <p className="font-medium text-sm">
                            {activeTab === 'physical' ? '05/28' : (showVirtualData ? '12/29' : '••/••')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Back */}
                  <div className={`flip-card-back h-full w-full rounded-2xl text-white relative overflow-hidden shadow-xl ${activeTab === 'physical'
                      ? 'bg-gradient-to-r from-brand-dark to-brand shadow-brand/20'
                      : 'bg-gradient-to-r from-slate-900 to-black shadow-slate-900/20'
                    }`}>
                    <div className="w-full h-12 bg-black/40 mt-6" />
                    <div className="px-6 mt-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-8 bg-white/20 rounded-md flex items-center px-3">
                          <span className="text-xs text-white/60 italic font-serif">Assinatura autorizada</span>
                        </div>
                        <div className="bg-white/90 rounded-md px-3 py-1 flex flex-col items-center">
                          <p className="text-[9px] text-black/50 font-medium">CVV</p>
                          <p className="text-sm font-bold text-black tracking-widest font-mono">
                            {activeTab === 'physical' ? '123' : '842'}
                          </p>
                        </div>
                      </div>
                      <p className="text-[9px] text-white/50 mt-4 leading-relaxed max-w-[85%]">
                        Este cartão é de uso exclusivo do titular. Em caso de perda ou roubo,
                        entre em contato imediatamente através do app ou 0800 123 4567.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {activeTab === 'virtual' && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                <button
                  onClick={() => setShowVirtualData(!showVirtualData)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-background border border-border rounded-lg text-sm font-semibold text-heading hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  {showVirtualData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showVirtualData ? 'Ocultar dados' : 'Mostrar dados'}
                </button>
                <button
                  onClick={handleCopy}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-brand/10 border border-brand/20 rounded-lg text-sm font-semibold text-brand hover:bg-brand/20 transition-colors cursor-pointer"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copiado!' : 'Copiar número'}
                </button>
              </div>
            )}

            <p className="text-center text-xs text-muted mt-4">Clique no cartão para ver o CVV</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button className="flex flex-col items-center justify-center gap-3 bg-surface border border-border p-4 rounded-xl hover:shadow-md transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Settings2 className="w-5 h-5 text-brand" />
              </div>
              <span className="text-xs font-semibold text-heading text-center">Ajustar<br />Limite</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 bg-surface border border-border p-4 rounded-xl hover:shadow-md transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5 text-heading" />
              </div>
              <span className="text-xs font-semibold text-heading text-center">Pedir<br />2ª Via</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 bg-surface border border-border p-4 rounded-xl hover:shadow-md transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center group-hover:scale-110 transition-transform">
                <Smartphone className="w-5 h-5 text-heading" />
              </div>
              <span className="text-xs font-semibold text-heading text-center">Carteira<br />Digital</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-3 bg-surface border border-border p-4 rounded-xl hover:shadow-md transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-5 h-5 text-danger" />
              </div>
              <span className="text-xs font-semibold text-danger text-center">Bloquear<br />Cartão</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-brand to-brand-dark rounded-xl p-6 relative overflow-hidden shadow-xl shadow-brand/20">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 relative z-10">Fatura Atual</h3>

            <div className="mb-6 relative z-10">
              <p className="text-xs text-white/70 font-medium mb-1">Fechamento em 24 Out</p>
              <h4 className="text-3xl font-extrabold text-white">R$ 1.842,50</h4>
            </div>

            <div className="space-y-2 mb-6 relative z-10">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white/70">Limite Disponível</span>
                <span className="text-success-light">R$ 3.157,50</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '35%' }} />
              </div>
              <div className="flex justify-between text-xs text-white/50">
                <span>R$ 0</span>
                <span>R$ 5.000 (Total)</span>
              </div>
            </div>

            <button className="w-full py-2.5 bg-white text-brand-dark font-bold text-sm rounded-lg hover:bg-white/90 transition-colors shadow-lg cursor-pointer relative z-10">
              Pagar Fatura
            </button>
          </div>

          <div className="bg-surface rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-heading uppercase tracking-wider">Últimas Compras</h3>
              <button className="text-xs font-semibold text-brand hover:underline cursor-pointer">Ver todas</button>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Uber *Trip', date: 'Hoje, 08:42', amount: 'R$ 24,90', icon: '🚗' },
                { name: 'iFood *Burger', date: 'Ontem, 20:15', amount: 'R$ 78,50', icon: '🍔' },
                { name: 'Amazon Prime', date: '12 Out, 10:00', amount: 'R$ 14,90', icon: '📦' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center text-lg">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-heading">{item.name}</p>
                      <p className="text-xs text-muted">{item.date}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-heading">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
