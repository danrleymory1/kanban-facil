# 📋 Kanban Fácil

Um sistema completo de gerenciamento de projetos inspirado no Trello, com funcionalidades do Obsidian e suporte à metodologia Scrum.

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Firebase](https://img.shields.io/badge/Firebase-12.3-orange)

## 🎯 Visão Geral

**Kanban Fácil** é uma aplicação web moderna para gestão visual de projetos que combina:

- 📊 **Kanban Board** - Interface drag & drop similar ao Trello
- 📚 **Knowledge Base** - Sistema de documentação estilo Obsidian
- 🏃 **Scrum** - Ferramentas para metodologia ágil
- 🔄 **Real-time** - Sincronização instantânea com Firebase

## ✨ Funcionalidades Implementadas

### ✅ Etapa 1-2: Configuração e Autenticação
- [x] Projeto Next.js com TypeScript e Tailwind CSS
- [x] Integração completa com Firebase
- [x] Autenticação anônima
- [x] Context API para gerenciamento de estado
- [x] Dashboard de boards

### ✅ Etapa 3: Estrutura do Banco de Dados
- [x] Tipos TypeScript completos (450+ linhas)
- [x] 9 coleções Firestore documentadas
- [x] Regras de segurança robustas (300+ linhas)
- [x] 28 índices compostos otimizados
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
- Conta no Firebase

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
# Edite .env com suas credenciais do Firebase

# Execute em modo de desenvolvimento
npm run dev

# Abra no navegador
# http://localhost:3000
```

### Configuração do Firebase

Siga o guia completo em [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md)

Resumo:
1. Crie um projeto no Firebase Console
2. Habilite Authentication (Anônimo)
3. Crie um banco Firestore
4. Configure as variáveis no `.env`
5. Deploy das regras: `firebase deploy --only firestore:rules`
6. Deploy dos índices: `firebase deploy --only firestore:indexes`

## 📚 Documentação

### Guias de Uso
- [GUIA_DE_USO.md](./GUIA_DE_USO.md) - Como usar a aplicação
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Configuração completa do Firebase

### Documentação Técnica
- [DATABASE_STRUCTURE.md](./DATABASE_STRUCTURE.md) - Estrutura do banco de dados
- [DATABASE_DIAGRAM.md](./DATABASE_DIAGRAM.md) - Diagramas e relacionamentos
- [ETAPA3_RESUMO.md](./ETAPA3_RESUMO.md) - Resumo da estrutura do BD
- [ETAPA4_RESUMO.md](./ETAPA4_RESUMO.md) - Resumo da interface Kanban
- [ETAPA5_RESUMO.md](./ETAPA5_RESUMO.md) - Resumo das funcionalidades Scrum

### Arquivos de Configuração
- `firestore.rules` - Regras de segurança do Firestore
- `firestore.indexes.json` - Índices compostos
- `INSTRUCTIONS.md` - Instruções originais do projeto

## 🏗️ Arquitetura

```
kanban-facil/
├── src/
│   ├── app/                    # Páginas Next.js
│   │   ├── board/[id]/        # Página do board
│   │   ├── dashboard/         # Dashboard de boards
│   │   ├── login/             # Página de login
│   │   └── page.tsx           # Página inicial
│   ├── components/            # Componentes React
│   │   ├── BoardColumn.tsx    # Coluna/Lista
│   │   ├── BoardCard.tsx      # Card/Tarefa
│   │   ├── CardModal.tsx      # Modal de detalhes
│   │   ├── AddListButton.tsx  # Adicionar lista
│   │   └── AddCardForm.tsx    # Formulário de card
│   ├── contexts/              # React Context
│   │   └── AuthContext.tsx    # Contexto de autenticação
│   ├── lib/                   # Configurações
│   │   └── firebase.ts        # Config do Firebase
│   ├── services/              # Serviços
│   │   ├── auth.service.ts    # Autenticação
│   │   └── firestore.service.ts # Firestore
│   └── types/                 # Tipos TypeScript
│       └── index.ts           # Tipos principais
├── firestore.rules            # Regras de segurança
├── firestore.indexes.json     # Índices do Firestore
└── .env                       # Variáveis de ambiente
```

## 🛠️ Tecnologias

### Core
- **[Next.js 15.5](https://nextjs.org/)** - Framework React
- **[TypeScript 5](https://www.typescriptlang.org/)** - Tipagem estática
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS

### Firebase
- **[Firebase Auth](https://firebase.google.com/docs/auth)** - Autenticação
- **[Firestore](https://firebase.google.com/docs/firestore)** - Banco de dados NoSQL
- **[Firebase Hosting](https://firebase.google.com/docs/hosting)** - Hospedagem (futuro)

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

### Real-time Sync
- Mudanças aparecem instantaneamente
- Suporte a múltiplos usuários
- Listeners automáticos com cleanup
- Sem necessidade de refresh

### UI/UX Polida
- Design responsivo
- Indicadores visuais de prioridade
- Badges coloridos de status
- Detecção de tarefas vencidas
- Transições suaves
- Estados de loading

### Estrutura de Dados Completa
- 9 coleções principais
- Relacionamentos bem definidos
- Versionamento de documentos
- Metadata completa
- Histórico de atividades

## 📊 Estrutura do Banco de Dados

### Coleções Principais

```typescript
users          - Usuários do sistema
boards         - Quadros/Projetos
lists          - Listas/Colunas do Kanban
cards          - Cartões/Tarefas
knowledgeBases - Base de conhecimento
sprints        - Sprints Scrum
tasks          - Tarefas detalhadas
notifications  - Notificações
templates      - Templates de boards
```

Veja mais em [DATABASE_STRUCTURE.md](./DATABASE_STRUCTURE.md)

## 🔐 Segurança

- ✅ Autenticação obrigatória
- ✅ Regras de segurança do Firestore
- ✅ Validação de permissões
- ✅ Controle de acesso por papel (admin, editor, visualizador)
- ✅ Sanitização de inputs
- ✅ Confirmação para ações destrutivas

## 📝 Licença

Este projeto está sob a licença MIT.

---

**⭐ Kanban Fácil - Organize seus projetos de forma visual e eficiente!**

Feito com Next.js, TypeScript, Tailwind CSS e Firebase 🚀
