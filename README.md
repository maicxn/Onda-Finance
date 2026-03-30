# Onda Finance 🌊

Aplicação web de simulação bancária construída como desafio front-end para **JobZ Talentos**.

![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)

---

## 🔗 Link de Acesso

> **[https://onda-finance.vercel.app](https://onda-finance.vercel.app)** *(atualizar após deploy)*

**Credenciais de acesso (mock):**
- Email: `usuario@onda.com`
- Senha: `123456`

---

## 🚀 Como Rodar o Projeto

```bash
# Clonar repositório
git clone https://github.com/maicxn/Onda-Finance.git
cd JobZ

# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

# Rodar testes
npm test

# Build de produção
npm run build
```

O projeto roda em `http://localhost:5173` por padrão.

---

## 🏗️ Decisões Técnicas

### Stack Utilizada

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| **UI Components** | shadcn/ui + Radix + CVA | Componentes acessíveis com variantes tipadas; design system consistente |
| **Estilos** | Tailwind CSS v4 | Utility-first com tokenização via `@theme`; tema light com paleta teal/navy |
| **Roteamento** | React Router v7 | Rotas protegidas com redirect automático para login |
| **Estado global** | Zustand (persist) | Store minimalista com persistência automática no `localStorage` |
| **Estado servidor** | React Query (TanStack) | Cache, invalidação e refetch automáticos; separação clara de server state |
| **Formulários** | React Hook Form + Zod | Validação schema-first com tipagem inferida; inputs com máscaras (CPF e moeda) |
| **HTTP** | Axios | Interceptors para auth; configuração centralizada |
| **Testes** | Vitest + Testing Library | Testes de integração focados no fluxo do usuário |

### Organização de Pastas

```
src/
├── components/ui/     # Primitivos (Button, Input, Card, Label)
├── helpers/           # Helpers reutilizáveis (txIcon, txCategory)
├── hooks/             # React Query hooks (useBalance, useTransfer...)
├── layouts/           # AppLayout (sidebar responsiva)
├── lib/               # Utilitários (cn, formatCurrency) e validadores (CPF)
├── pages/             # Login, Dashboard, Transfer
├── services/          # Mock API com Axios
├── stores/            # Zustand stores (auth, finance)
├── test/              # Setup e testes
└── types/             # Interfaces TypeScript
```

### Decisões de Destaque

- **Mock API**: Camada de API simula respostas do backend com delays realistas. Trocar por API real requer apenas atualizar `src/services/api.ts`, sem alterar componentes ou hooks.

- **Design responsivo**: Sidebar recolhível em mobile com overlay, layout adaptivo em todas as telas.

- **Animação de cartão 3D**: Flip card com CSS `perspective` e `transform: rotateY()` mostrando frente e verso do cartão.

- **Transações em tempo real**: Cada transferência atualiza imediatamente a tabela de transações e o saldo via `refetchQueries` do React Query.

---

## 🔒 Segurança

### Proteção contra Engenharia Reversa

Em uma aplicação de produção, as seguintes medidas seriam implementadas:

1. **Ofuscação de código** — Ferramentas como Terser (já incluído no Vite build) e SWC minification reduzem a legibilidade do bundle, renomeando variáveis e removendo código morto.

2. **Source maps privados** — Desabilitar source maps em produção ou servi-los apenas via serviços de error tracking (Sentry), nunca expondo-os publicamente.

3. **Content Security Policy (CSP)** — Headers HTTP restritivos que impedem injeção de scripts maliciosos e limitam as origens de recursos carregados.

4. **Code splitting** — Lazy loading de rotas dificulta a análise estática do bundle completo, pois o código é carregado sob demanda.

### Proteção contra Vazamento de Dados

1. **Tokens em memória** — Em produção, tokens JWT seriam armazenados preferencialmente em memória (variáveis de estado) com refresh tokens em cookies HttpOnly + Secure + SameSite=Strict. Nunca em `localStorage` em produção.

2. **Criptografia em trânsito** — Toda comunicação via HTTPS/TLS 1.3 com HSTS habilitado.

3. **Sanitização de inputs** — Validação com Zod no cliente E no servidor para prevenir XSS e injection attacks.

4. **Rate limiting** — Proteção no backend contra brute-force em endpoints de autenticação e transferência.

5. **Logs e auditoria** — Registro de todas as operações financeiras com timestamps, IPs e fingerprints do dispositivo para rastreabilidade.

6. **Sessão com expiração** — Tokens com TTL curto (15min access + 7d refresh), logout automático por inatividade, e invalidação no backend.

7. **Mascaramento de dados sensíveis** — CPFs, números de conta e valores parcialmente mascarados na interface e nos logs de API.

---

## 🔮 Melhorias Futuras

- [ ] API real com autenticação JWT (refresh tokens em HttpOnly cookies)
- [ ] Histórico de transferências com filtros e paginação
- [ ] Notificações em tempo real (WebSocket)
- [ ] Internacionalização (i18n) com suporte a múltiplos idiomas
- [ ] Tema claro/escuro customizável
- [ ] PWA com suporte offline
- [ ] Gráficos de gastos e receitas (Recharts)
- [ ] Comprovante de transferência em PDF
- [ ] Autenticação biométrica (WebAuthn)
- [ ] CI/CD com GitHub Actions + deploy automático
- [ ] Testes E2E com Playwright

---

## 🧪 Testes

O fluxo de transferência é testado com **Vitest + React Testing Library**, cobrindo:

- Renderização do formulário e campos
- Validação de campos obrigatórios
- Exibição do saldo
- Fluxo completo: preencher → submeter → tela de sucesso → atualização de saldo

```bash
npm test
```

---

## 📄 Licença

Projeto desenvolvido como desafio técnico para **Onda Finance / JobZ Talentos**.
