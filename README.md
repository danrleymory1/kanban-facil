# 📋 Kanban Fácil

Um sistema completo de gerenciamento de projetos inspirado no Trello, com funcionalidades do Obsidian e suporte à metodologia Scrum.

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6.20-green)
![Firebase](https://img.shields.io/badge/Firebase%20Auth-12.3-orange)

## 🎯 Visão Geral

**Kanban Fácil** é uma aplicação web moderna para gestão visual de projetos que combina:

- 📊 **Kanban Board** - Interface drag & drop similar ao Trello
- 📚 **Knowledge Base** - Sistema de documentação estilo Obsidian
- 🏃 **Scrum** - Ferramentas para metodologia ágil
- 🔄 **Real-time** - Sincronização com polling (MongoDB)
- 🔐 **Autenticação** - Firebase Authentication

## ✨ Funcionalidades Implementadas

### ✅ Etapa 1-2: Configuração e Autenticação
- [x] Projeto Next.js com TypeScript e Tailwind CSS
- [x] Integração completa com Firebase
- [x] Autenticação anônima
- [x] Context API para gerenciamento de estado
- [x] Dashboard de boards

### ✅ Etapa 3: Estrutura do Banco de Dados
- [x] Tipos TypeScript completos (450+ linhas)
- [x] 6 collections MongoDB implementadas
- [x] API REST completa (9 endpoints)
- [x] Arquitetura em 3 camadas (Cliente → API → MongoDB)
- [x] Documentação completa da estrutura

### ✅ Etapa 4: Interface Kanban Completa
- [x] Página de visualização do board
- [x] Sistema de listas (colunas)
- [x] Sistema de cards (tarefas)
- [x] Drag & drop de listas
- [x] Drag & drop de cards
- [x] Modal de detalhes do card
- [x] Criação e edição inline
- [x] Sincronização em tempo real
- [x] Indicadores visuais de prioridade
- [x] Badges de status
- [x] Detecção de vencimento

### ✅ Etapa 5: Funcionalidades Scrum
- [x] Gestão de sprints
- [x] Story points e estimativas
- [x] Burndown chart
- [x] Daily notes
- [x] Retrospectivas
- [x] Gerenciamento de cards do sprint
- [x] Atualização automática de métricas
- [x] Autenticação email/senha com recuperação

### 🔜 Próximas Etapas

#### Etapa 6: Knowledge Base (Obsidian)
- [ ] Editor Markdown
- [ ] Links bidirecionais
- [ ] Sistema de busca
- [ ] Vinculação com cards
- [ ] Versionamento

#### Etapa 7: Features Avançadas
- [ ] Sistema de comentários
- [ ] Menções de usuários
- [ ] Upload de anexos
- [ ] Notificações
- [ ] Histórico de atividades
- [ ] Colaboração em tempo real

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Firebase (apenas Auth)
- MongoDB ou MongoDB Atlas (para banco de dados)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/kanban-facil.git

# Entre na pasta
cd kanban-facil

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com:
# - Credenciais do Firebase (Auth)
# - String de conexão MongoDB (MONGODB_URI)

# Execute em modo de desenvolvimento
npm run dev

# Abra no navegador
# http://localhost:3000
```

### Configuração

#### Firebase (Autenticação)
Siga o guia em [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md):
1. Crie um projeto no Firebase Console
2. Habilite Authentication (Email/Senha e Anônimo)
3. Configure as variáveis do Firebase no `.env`

#### MongoDB (Banco de Dados)
Siga o guia em [`MONGODB_SETUP.md`](./MONGODB_SETUP.md):
1. Configure sua instância MongoDB ou use MongoDB Atlas
2. Adicione a string de conexão `MONGODB_URI` no `.env`
3. A aplicação criará automaticamente as collections necessárias

## 📚 Documentação

### Guias de Configuração
- [MONGODB_SETUP.md](./MONGODB_SETUP.md) - **⭐ Configuração MongoDB (Principal)**
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Configuração Firebase Auth
- [GUIA_DE_USO.md](./GUIA_DE_USO.md) - Como usar a aplicação

### Documentação Técnica
- [DATABASE_STRUCTURE.md](./DATABASE_STRUCTURE.md) - Estrutura do banco de dados
- [DATABASE_DIAGRAM.md](./DATABASE_DIAGRAM.md) - Diagramas e relacionamentos
- [ETAPA3_RESUMO.md](./ETAPA3_RESUMO.md) - Resumo da estrutura do BD
- [ETAPA4_RESUMO.md](./ETAPA4_RESUMO.md) - Resumo da interface Kanban
- [ETAPA5_RESUMO.md](./ETAPA5_RESUMO.md) - Resumo das funcionalidades Scrum
- `INSTRUCTIONS.md` - Instruções originais do projeto

## 🏗️ Arquitetura

```
kanban-facil/
├── src/
│   ├── app/                    # Páginas Next.js
│   │   ├── api/               # 🆕 API Routes (Server)
│   │   │   ├── boards/        # Endpoints de boards
│   │   │   ├── lists/         # Endpoints de listas
│   │   │   ├── cards/         # Endpoints de cards
│   │   │   ├── sprints/       # Endpoints de sprints
│   │   │   ├── users/         # Endpoints de usuários
│   │   │   └── knowledge-base/ # Endpoints de KB
│   │   ├── board/[id]/        # Página do board
│   │   ├── dashboard/         # Dashboard de boards
│   │   ├── login/             # Página de login
│   │   └── sprints/           # Páginas de sprints
│   ├── components/            # Componentes React
│   │   ├── BoardColumn.tsx    # Coluna/Lista
│   │   ├── BoardCard.tsx      # Card/Tarefa
│   │   ├── CardModal.tsx      # Modal de detalhes
│   │   └── ...               # Outros componentes
│   ├── contexts/              # React Context
│   │   └── AuthContext.tsx    # Contexto de autenticação
│   ├── lib/                   # Configurações
│   │   ├── firebase.ts        # 🔐 Config do Firebase Auth
│   │   └── mongodb.ts         # 🆕 Cliente MongoDB
│   ├── services/              # Serviços
│   │   ├── auth.service.ts    # Autenticação Firebase
│   │   ├── api.service.ts     # 🆕 Cliente HTTP (Browser)
│   │   └── mongodb.service.ts # 🆕 MongoDB CRUD (Server)
│   └── types/                 # Tipos TypeScript
│       └── index.ts           # Tipos principais
└── .env                       # Variáveis de ambiente
```

## 🛠️ Tecnologias

### Core
- **[Next.js 15.5](https://nextjs.org/)** - Framework React
- **[TypeScript 5](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS

### Backend
- **[MongoDB](https://www.mongodb.com/)** - Banco de dados NoSQL
- **[Firebase Auth](https://firebase.google.com/docs/auth)** - Autenticação de usuários
- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - Endpoints REST

### Bibliotecas
- **[@hello-pangea/dnd](https://github.com/hello-pangea/dnd)** - Drag and Drop
- **[React Icons](https://react-icons.github.io/react-icons/)** - Ícones
- **[React Hook Form](https://react-hook-form.com/)** - Formulários
- **[Day.js](https://day.js.org/)** - Manipulação de datas

## 🎨 Features Destacadas

### Drag & Drop Avançado
- Arraste listas para reordenar colunas
- Arraste cards entre listas ou dentro da mesma lista
- Feedback visual durante o arraste
- Atualização otimista da UI
- Persistência automática no Firestore

### Sincronização de Dados
- Polling automático a cada 2 segundos
- Suporte a múltiplos usuários
- Listeners com cleanup automático
- Atualização otimista da UI
- API REST completa

### UI/UX Polida
- Design responsivo
- Indicadores visuais de prioridade
- Badges coloridos de status
- Detecção de tarefas vencidas
- Transições suaves
- Estados de loading

### Estrutura de Dados Completa
- 6 collections MongoDB
- Relacionamentos bem definidos
- Arquitetura Cliente-Servidor
- API REST robusta
- Metadata completa com timestamps

## 📊 Estrutura do Banco de Dados

### Collections MongoDB

```typescript
users          - Usuários do sistema
boards         - Quadros/Projetos
lists          - Listas/Colunas do Kanban
cards          - Cartões/Tarefas
knowledgeBases - Base de conhecimento
sprints        - Sprints Scrum (com métricas)
```

Veja mais em [DATABASE_STRUCTURE.md](./DATABASE_STRUCTURE.md)

## 🔐 Segurança

- ✅ Autenticação Firebase obrigatória
- ✅ API Routes server-side
- ✅ Validação de inputs
- ✅ Controle de acesso por papel (admin, editor, visualizador)
- ✅ Sanitização de dados
- ✅ Confirmação para ações destrutivas
- 🔜 Rate limiting e validação de tokens JWT

## 📝 Licença

Este projeto está sob a licença MIT.

---

**⭐ Kanban Fácil - Organize seus projetos de forma visual e eficiente!**

Feito com Next.js, TypeScript, Tailwind CSS, MongoDB e Firebase Auth 🚀
