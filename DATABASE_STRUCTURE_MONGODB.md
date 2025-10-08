# Estrutura do Banco de Dados MongoDB - Kanban Fácil

Este documento descreve a estrutura do banco de dados MongoDB para o sistema Kanban Fácil após a migração do Firestore.

## 🎯 Visão Geral

O sistema utiliza **MongoDB** como banco de dados NoSQL. A estrutura é organizada em collections com documentos que referenciam outros documentos por IDs.

### Database
- **Nome**: `default`
- **Collections**: 6 principais

## 📦 Collections

### 1. **users** - Usuários do Sistema

Armazena informações dos usuários cadastrados via Firebase Auth.

**Collection**: `users`

**Estrutura**:
```typescript
{
  _id: ObjectId,              // ID do MongoDB
  userId: string,             // ID do Firebase Auth
  email: string,              // Email do usuário
  nome: string,               // Nome completo
  isAnonymous: boolean,       // Se é usuário anônimo
  createdAt: Date,            // Data de criação
  updatedAt: Date             // Última atualização
}
```

**Índices Recomendados**:
```javascript
db.users.createIndex({ userId: 1 }, { unique: true })
db.users.createIndex({ email: 1 })
```

---

### 2. **boards** - Quadros Kanban

Representa os quadros/projetos onde as listas e cards são organizados.

**Collection**: `boards`

**Estrutura**:
```typescript
{
  _id: ObjectId,              // ID do MongoDB
  userId: string,             // ID do dono do board
  nome: string,               // Nome do board
  descricao: string,          // Descrição do board
  tags: string[],             // Tags do board

  membros: [{                 // Membros do board
    userId: string,
    nome: string,
    papel: 'admin' | 'editor' | 'visualizador',
    adicionadoEm: Date
  }],

  visibilidade: 'privado' | 'publico' | 'equipe',
  arquivado: boolean,         // Se o board está arquivado

  createdAt: Date,
  updatedAt: Date
}
```

**Índices Recomendados**:
```javascript
db.boards.createIndex({ userId: 1, updatedAt: -1 })
db.boards.createIndex({ 'membros.userId': 1 })
db.boards.createIndex({ arquivado: 1, updatedAt: -1 })
```

---

### 3. **lists** - Listas/Colunas

Representam as colunas do quadro Kanban (ex: "A Fazer", "Em Progresso", "Concluído").

**Collection**: `lists`

**Estrutura**:
```typescript
{
  _id: ObjectId,
  boardId: string,            // Referência ao board (_id como string)
  nome: string,               // Nome da lista
  ordem: number,              // Ordem de exibição (0, 1, 2...)

  createdAt: Date,
  updatedAt: Date
}
```

**Índices Recomendados**:
```javascript
db.lists.createIndex({ boardId: 1, ordem: 1 })
```

---

### 4. **cards** - Cards/Tarefas

Representam as tarefas dentro das listas.

**Collection**: `cards`

**Estrutura**:
```typescript
{
  _id: ObjectId,
  listId: string,             // Referência à lista
  boardId: string,            // Referência ao board
  nome: string,               // Título do card
  descricao: string,          // Descrição detalhada
  ordem: number,              // Ordem dentro da lista

  // Atribuição
  responsavel?: string,       // userId do responsável
  responsavelNome?: string,   // Nome do responsável

  // Classificação
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente',
  status: 'aberto' | 'em_progresso' | 'concluido' | 'bloqueado',
  tipo: 'feature' | 'bug' | 'melhoria' | 'documentacao',

  // Organização
  tags: string[],
  knowledgeBaseLinks: string[],  // IDs de artigos da KB

  // Subtarefas
  checklists: [{
    checklistId: string,
    nome: string,
    itens: [{
      itemId: string,
      texto: string,
      concluido: boolean,
      concluidoEm?: Date,
      concluidoPor?: string
    }]
  }],

  // Interação
  comentarios: [{
    comentarioId: string,
    autorId: string,
    autorNome: string,
    texto: string,
    createdAt: Date
  }],

  // Anexos
  anexos: [{
    anexoId: string,
    nome: string,
    url: string,
    tipo: string,
    tamanho: number,
    uploadPor: string,
    uploadEm: Date
  }],

  // Metadados
  criadoPor: string,
  criadoPorNome: string,
  createdAt: Date,
  updatedAt: Date
}
```

**Índices Recomendados**:
```javascript
db.cards.createIndex({ listId: 1, ordem: 1 })
db.cards.createIndex({ boardId: 1, ordem: 1 })
db.cards.createIndex({ boardId: 1, status: 1 })
db.cards.createIndex({ responsavel: 1 })
db.cards.createIndex({ tags: 1 })
```

---

### 5. **sprints** - Sprints Scrum

Gerencia os sprints do método Scrum.

**Collection**: `sprints`

**Estrutura**:
```typescript
{
  _id: ObjectId,
  boardId: string,            // Referência ao board
  nome: string,               // Nome do sprint
  numero?: number,            // Número do sprint
  objetivo: string,           // Objetivo/meta do sprint
  descricao: string,          // Descrição detalhada

  // Datas
  dataInicio: Date,
  dataFim: Date,

  // Status
  status: 'planejamento' | 'em_andamento' | 'concluido' | 'cancelado',

  // Cards do sprint
  cardsIds: string[],         // IDs dos cards incluídos

  // Metas
  metaPontos?: number,        // Meta de story points
  metaCards?: number,         // Meta de cards a completar

  // Métricas (calculadas automaticamente)
  metrics?: {
    totalPontos: number,
    pontosCompletados: number,
    totalCards: number,
    cardsCompletados: number,
    velocidade: number        // Story points completados
  },

  // Daily Notes
  dailyNotes: [{
    noteId: string,
    data: Date,
    impedimentos: string[],
    notas: string[],
    participantes: string[]
  }],

  // Retrospectiva
  retrospectiva?: {
    pontoPositivos: string[],
    pontosNegativos: string[],
    acoesParaMelhoria: string[],
    participantes: string[],
    realizadaEm: Date
  },

  createdAt: Date,
  updatedAt: Date
}
```

**Índices Recomendados**:
```javascript
db.sprints.createIndex({ boardId: 1, dataInicio: -1 })
db.sprints.createIndex({ boardId: 1, status: 1 })
db.sprints.createIndex({ cardsIds: 1 })
```

---

### 6. **knowledgeBases** - Base de Conhecimento

Documentação e artigos vinculáveis aos cards.

**Collection**: `knowledgeBases`

**Estrutura**:
```typescript
{
  _id: ObjectId,
  userId: string,             // Dono do artigo
  titulo: string,             // Título do artigo
  conteudo: string,           // Conteúdo em Markdown

  // Links
  linksRelacionados: string[], // IDs de outros artigos

  // Organização
  tags: string[],

  createdAt: Date,
  updatedAt: Date
}
```

**Índices Recomendados**:
```javascript
db.knowledgeBases.createIndex({ userId: 1, updatedAt: -1 })
db.knowledgeBases.createIndex({ tags: 1 })
db.knowledgeBases.createIndex({ titulo: 'text', conteudo: 'text' })
```

---

## 🔗 Relacionamentos

### Hierarquia Principal
```
User (users)
  └── Board (boards)
        ├── Lists (lists)
        │     └── Cards (cards)
        └── Sprints (sprints)
              └── Cards (referenciados por cardsIds)
```

### Referências entre Collections

1. **boards → users**
   - `boards.userId` → `users.userId`
   - `boards.membros[].userId` → `users.userId`

2. **lists → boards**
   - `lists.boardId` → `boards._id` (como string)

3. **cards → lists & boards**
   - `cards.listId` → `lists._id` (como string)
   - `cards.boardId` → `boards._id` (como string)

4. **cards → knowledgeBases**
   - `cards.knowledgeBaseLinks[]` → `knowledgeBases._id` (como string)

5. **sprints → boards & cards**
   - `sprints.boardId` → `boards._id` (como string)
   - `sprints.cardsIds[]` → `cards._id` (como string)

---

## 🔄 Padrões de ID

- **MongoDB**: Usa `ObjectId` como `_id` nativo
- **Retorno da API**: Converte `_id` para `boardId`, `cardId`, etc. como string
- **Referências**: Sempre armazenadas como strings

### Exemplo de Conversão
```javascript
// Documento MongoDB
{ _id: ObjectId("507f1f77bcf86cd799439011"), nome: "Meu Board" }

// Retorno da API
{ boardId: "507f1f77bcf86cd799439011", nome: "Meu Board" }
```

---

## 📊 Diagrama de Relacionamentos

```
┌──────────┐
│  users   │
└────┬─────┘
     │
     │ userId
     │
┌────▼─────┐
│  boards  │
└────┬─────┘
     │
     ├─────────────┬──────────────┐
     │             │              │
boardId        boardId        boardId
     │             │              │
┌────▼─────┐  ┌───▼──────┐  ┌───▼──────┐
│  lists   │  │  sprints │  │knowledge │
└────┬─────┘  └───┬──────┘  │  Bases   │
     │            │          └──────────┘
   listId      cardsIds[]         ▲
     │            │                │
┌────▼────────────▼────────────────┘
│         cards
│  (knowledgeBaseLinks[])
└──────────────────────────────────┘
```

---

## 🚀 Queries Comuns

### Buscar boards de um usuário
```javascript
db.boards.find({ userId: "user123" }).sort({ updatedAt: -1 })
```

### Buscar listas de um board (ordenadas)
```javascript
db.lists.find({ boardId: "board456" }).sort({ ordem: 1 })
```

### Buscar cards de uma lista (ordenados)
```javascript
db.cards.find({ listId: "list789" }).sort({ ordem: 1 })
```

### Buscar todos os cards de um board
```javascript
db.cards.find({ boardId: "board456" }).sort({ ordem: 1 })
```

### Buscar sprints ativos de um board
```javascript
db.sprints.find({
  boardId: "board456",
  status: "em_andamento"
}).sort({ dataInicio: -1 })
```

### Buscar cards de um sprint
```javascript
const sprint = db.sprints.findOne({ _id: ObjectId("sprint123") })
const cardIds = sprint.cardsIds.map(id => ObjectId(id))
db.cards.find({ _id: { $in: cardIds } })
```

---

## 📝 Observações Importantes

1. **Timestamps**: Todos os documentos têm `createdAt` e `updatedAt` como `Date`
2. **IDs como Strings**: Referências são sempre strings, não ObjectIds
3. **Arrays Vazios**: Arrays opcionais são inicializados como `[]` se não fornecidos
4. **Soft Delete**: Boards têm campo `arquivado` em vez de deletar
5. **Polling**: Atualizações em tempo real via polling a cada 2 segundos
6. **API Routes**: Toda comunicação com MongoDB passa por `/api/*`

---

## 🔐 Segurança

- ✅ API Routes executam no servidor
- ✅ MongoDB driver não exposto ao cliente
- 🔜 Validação de permissões por usuário
- 🔜 Rate limiting nos endpoints
- 🔜 Validação de tokens Firebase

---

**Última atualização**: Migração para MongoDB concluída
