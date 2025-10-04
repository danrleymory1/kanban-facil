# Estrutura Completa do Banco de Dados - Kanban Fácil

Este documento descreve a estrutura completa do banco de dados Firestore para o sistema Kanban Fácil.

## Visão Geral

O sistema utiliza o Firebase Firestore como banco de dados NoSQL. A estrutura é organizada em coleções principais com subcoleções para dados relacionados.

## Coleções Principais

### 1. **users** - Usuários do Sistema

Armazena informações dos usuários (anônimos ou autenticados).

**Path**: `/users/{userId}`

**Campos**:
```typescript
{
  userId: string;              // ID único do usuário (Firebase Auth UID)
  email: string | null;        // Email (null para anônimos)
  nome: string;                // Nome do usuário
  avatar?: string;             // URL do avatar
  bio?: string;                // Biografia/descrição
  cargo?: string;              // Cargo profissional
  departamento?: string;       // Departamento/Equipe
  telefone?: string;           // Telefone de contato
  timezone?: string;           // Fuso horário (ex: "America/Sao_Paulo")

  preferences?: {              // Preferências do usuário
    tema?: 'claro' | 'escuro' | 'auto';
    idioma?: string;           // Código do idioma (ex: "pt-BR")
    notificacoesEmail?: boolean;
    notificacoesPush?: boolean;
  };

  isAnonymous: boolean;        // Se é usuário anônimo
  ultimoAcesso?: Timestamp;    // Última vez que acessou o sistema
  createdAt: Timestamp;        // Data de criação
  updatedAt: Timestamp;        // Data de última atualização
}
```

**Índices**:
- `email` (Ascendente)
- `isAnonymous` (Ascendente) + `ultimoAcesso` (Descendente)

---

### 2. **boards** - Quadros/Projetos

Representa os quadros Kanban ou projetos Scrum.

**Path**: `/boards/{boardId}`

**Campos**:
```typescript
{
  boardId: string;             // ID único do quadro
  userId: string;              // ID do criador do quadro
  nome: string;                // Nome do quadro
  descricao?: string;          // Descrição detalhada
  cor?: string;                // Cor do quadro (hex)
  icone?: string;              // Ícone/emoji do quadro
  tags?: string[];             // Tags para organização

  membros: [{                  // Lista de membros do quadro
    userId: string;
    nome: string;
    papel: 'admin' | 'editor' | 'visualizador';
    adicionadoEm: Timestamp;
  }];

  visibilidade: 'privado' | 'publico' | 'equipe';

  settings?: {                 // Configurações do quadro
    permitirComentarios?: boolean;
    permitirAnexos?: boolean;
    autoArquivarConcluidos?: boolean;
    diasParaArquivar?: number;
    notificarMudancas?: boolean;
    limiteWIP?: number;        // Limite de Work In Progress
  };

  favorito?: boolean;          // Se está marcado como favorito
  arquivado?: boolean;         // Se está arquivado
  dataConclusao?: Timestamp;   // Data de conclusão do projeto
  progresso?: number;          // Progresso geral (0-100)
  sprintAtualId?: string;      // ID da sprint ativa
  templatesUtilizados?: string[]; // IDs de templates usados

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Índices Compostos**:
- `userId` (Asc) + `arquivado` (Asc) + `updatedAt` (Desc)
- `membros.userId` (Array) + `arquivado` (Asc) + `updatedAt` (Desc)
- `visibilidade` (Asc) + `updatedAt` (Desc)

---

### 3. **lists** - Listas/Colunas do Kanban

Representa as colunas do quadro Kanban (ex: To Do, In Progress, Done).

**Path**: `/lists/{listId}`

**Campos**:
```typescript
{
  listId: string;              // ID único da lista
  boardId: string;             // ID do quadro pai
  nome: string;                // Nome da lista
  descricao?: string;          // Descrição da lista
  ordem: number;               // Ordem de exibição
  cor?: string;                // Cor da lista (hex)

  settings?: {                 // Configurações da lista
    limiteCards?: number;      // Limite de cards
    corFundo?: string;
    corTexto?: string;
    alertarLimite?: boolean;
  };

  arquivado?: boolean;         // Se está arquivada
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Índices Compostos**:
- `boardId` (Asc) + `arquivado` (Asc) + `ordem` (Asc)

---

### 4. **cards** - Cartões/Tarefas

Representa as tarefas individuais no quadro Kanban.

**Path**: `/cards/{cardId}`

**Campos**:
```typescript
{
  cardId: string;              // ID único do card
  listId: string;              // ID da lista atual
  boardId: string;             // ID do quadro
  nome: string;                // Título do card
  descricao?: string;          // Descrição detalhada
  descricaoMarkdown?: string;  // Descrição em Markdown
  ordem: number;               // Ordem na lista

  // Atribuição e responsabilidade
  responsavel?: string;        // ID do responsável
  responsavelNome?: string;    // Nome do responsável (desnormalizado)
  colaboradores?: string[];    // IDs de colaboradores

  // Classificação
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  status: 'aberto' | 'em-progresso' | 'em-revisao' | 'bloqueado' | 'concluido';
  tipo: 'feature' | 'bug' | 'melhoria' | 'documentacao' | 'teste' | 'refatoracao';
  tags?: string[];
  cor?: string;

  // Datas e prazos
  dataInicio?: Timestamp;
  dataFim?: Timestamp;
  dataVencimento?: Timestamp;
  dataConclusao?: Timestamp;

  // Estimativas e tracking
  estimativaHoras?: number;
  horasRegistradas?: number;
  pontosStoryPoints?: number;
  progresso?: number;          // 0-100

  // Relacionamentos
  sprintId?: string;           // ID da sprint
  knowledgeBaseLinks?: string[]; // IDs de KBs relacionados
  cardsPai?: string[];         // IDs de cards pai
  cardsFilhos?: string[];      // IDs de sub-cards
  dependencias?: string[];     // IDs de cards dependentes
  bloqueadores?: string[];     // IDs de cards bloqueadores

  // Conteúdo adicional
  checklists?: [{
    checklistId: string;
    titulo: string;
    itens: [{
      itemId: string;
      texto: string;
      concluido: boolean;
      responsavel?: string;
      dataVencimento?: Timestamp;
      ordem: number;
    }];
    createdAt: Timestamp;
  }];

  comentarios?: [{
    comentarioId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    texto: string;
    mencionados?: string[];
    createdAt: Timestamp;
    editadoEm?: Timestamp;
  }];

  anexos?: [{
    anexoId: string;
    nome: string;
    tipo: string;
    url: string;
    tamanho: number;
    uploadedBy: string;
    uploadedAt: Timestamp;
  }];

  historico?: [{
    atividadeId: string;
    userId: string;
    userName: string;
    tipo: 'criou' | 'moveu' | 'editou' | 'comentou' | 'anexou' | 'concluiu' | 'atribuiu';
    descricao: string;
    detalhe?: any;
    timestamp: Timestamp;
  }];

  tempoRegistrado?: [{
    registroId: string;
    userId: string;
    userName: string;
    horas: number;
    descricao?: string;
    data: Timestamp;
  }];

  // Metadata
  numeroCard?: number;         // Número sequencial no board (#123)
  arquivado?: boolean;
  concluido?: boolean;
  criadoPor: string;
  criadoPorNome?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Índices Compostos**:
- `boardId` (Asc) + `arquivado` (Asc) + `listId` (Asc) + `ordem` (Asc)
- `boardId` (Asc) + `responsavel` (Asc) + `status` (Asc)
- `boardId` (Asc) + `sprintId` (Asc) + `status` (Asc)
- `boardId` (Asc) + `dataVencimento` (Asc)
- `responsavel` (Asc) + `status` (Asc) + `dataVencimento` (Asc)

---

### 5. **knowledgeBases** - Base de Conhecimento

Documentos de conhecimento estilo Obsidian, vinculados a cards e boards.

**Path**: `/knowledgeBases/{knowledgeBaseId}`

**Campos**:
```typescript
{
  knowledgeBaseId: string;     // ID único
  userId: string;              // ID do criador
  boardId?: string;            // ID do board (se vinculado)

  // Conteúdo
  titulo: string;              // Título do documento
  conteudo: string;            // Conteúdo principal
  conteudoMarkdown?: string;   // Conteúdo em Markdown
  resumo?: string;             // Resumo/preview

  // Organização
  categoria?: string;          // Categoria do documento
  tags?: string[];             // Tags
  pasta?: string;              // Pasta/namespace

  // Relacionamentos
  linksRelacionados?: string[]; // URLs de links externos
  cardsRelacionados?: string[]; // IDs de cards relacionados
  kbsRelacionados?: string[];   // IDs de outros KBs

  // Metadados
  autores?: string[];          // IDs dos autores
  versoes?: [{                 // Histórico de versões
    versaoId: string;
    conteudo: string;
    editadoPor: string;
    editadoPorNome: string;
    timestamp: Timestamp;
  }];
  versaoAtual?: number;
  favorito?: boolean;
  publico?: boolean;           // Visível para todos

  // Estatísticas
  visualizacoes?: number;
  ultimaVisualizacao?: Timestamp;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Índices Compostos**:
- `userId` (Asc) + `updatedAt` (Desc)
- `boardId` (Asc) + `categoria` (Asc) + `updatedAt` (Desc)
- `tags` (Array) + `updatedAt` (Desc)

---

### 6. **sprints** - Sprints Scrum

Gerencia sprints para metodologia Scrum.

**Path**: `/sprints/{sprintId}`

**Campos**:
```typescript
{
  sprintId: string;            // ID único da sprint
  boardId: string;             // ID do quadro

  // Informações básicas
  nome: string;                // Nome da sprint
  numero?: number;             // Número sequencial
  objetivo?: string;           // Objetivo da sprint
  descricao?: string;          // Descrição detalhada

  // Datas
  dataInicio: Timestamp;       // Data de início planejada
  dataFim: Timestamp;          // Data de fim planejada
  dataInicioReal?: Timestamp;  // Data de início real
  dataFimReal?: Timestamp;     // Data de fim real

  // Status
  status: 'planejamento' | 'ativo' | 'em-revisao' | 'concluido' | 'cancelado';

  // Cards e metas
  cardsIds?: string[];         // IDs dos cards na sprint
  metaPontos?: number;         // Meta de story points
  metaCards?: number;          // Meta de cards

  // Métricas
  metrics?: {
    totalPontos?: number;
    pontosCompletados?: number;
    totalCards?: number;
    cardsCompletados?: number;
    velocidade?: number;       // Pontos por dia
    burndownData?: [{          // Dados para gráfico burndown
      data: Timestamp;
      pontosRestantes: number;
      horasRestantes?: number;
    }];
  };

  // Cerimônias Scrum
  dailyNotes?: [{              // Notas das dailies
    noteId: string;
    data: Timestamp;
    impedimentos: string[];
    notas: string[];
    participantes: string[];
  }];

  retrospectiva?: {            // Retrospectiva da sprint
    pontoPositivos: string[];
    pontosNegativos: string[];
    acoesParaMelhoria: string[];
    realizadaEm?: Timestamp;
    participantes?: string[];
  };

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Índices Compostos**:
- `boardId` (Asc) + `status` (Asc) + `dataInicio` (Desc)
- `boardId` (Asc) + `numero` (Desc)

---

### 7. **tasks** - Tarefas Detalhadas

Tarefas individuais, podem estar vinculadas a cards.

**Path**: `/tasks/{taskId}`

**Campos**:
```typescript
{
  taskId: string;              // ID único
  boardId: string;             // ID do quadro
  userId: string;              // ID do criador
  cardId?: string;             // ID do card pai (se houver)
  sprintId?: string;           // ID da sprint

  // Informações básicas
  titulo: string;
  descricao?: string;
  tipo: 'feature' | 'bug' | 'melhoria' | 'documentacao' | 'teste' | 'refatoracao';

  // Status e prioridade
  status: 'aberto' | 'em-progresso' | 'em-revisao' | 'bloqueado' | 'concluido';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';

  // Atribuição
  responsavel?: string;
  responsavelNome?: string;

  // Estimativas
  estimativaHoras?: number;
  horasGastas?: number;
  storyPoints?: number;

  // Datas
  dataVencimento?: Timestamp;
  dataConclusao?: Timestamp;

  // Relacionamentos
  dependencias?: string[];     // IDs de tasks dependentes

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Índices Compostos**:
- `boardId` (Asc) + `status` (Asc) + `dataVencimento` (Asc)
- `cardId` (Asc) + `status` (Asc)
- `sprintId` (Asc) + `status` (Asc)
- `responsavel` (Asc) + `status` (Asc)

---

### 8. **notifications** - Notificações

Sistema de notificações para usuários.

**Path**: `/notifications/{notificationId}`

**Campos**:
```typescript
{
  notificationId: string;      // ID único
  userId: string;              // ID do destinatário

  // Conteúdo
  tipo: 'atribuicao' | 'mencao' | 'comentario' | 'prazo' | 'atualizacao' | 'convite';
  titulo: string;
  mensagem: string;

  // Links
  boardId?: string;
  cardId?: string;
  link?: string;               // URL completa para navegar

  // Metadata
  lida: boolean;
  arquivada: boolean;
  remetente?: string;          // ID do remetente
  remetenteNome?: string;

  createdAt: Timestamp;
  lidaEm?: Timestamp;
}
```

**Índices Compostos**:
- `userId` (Asc) + `lida` (Asc) + `createdAt` (Desc)
- `userId` (Asc) + `tipo` (Asc) + `createdAt` (Desc)

---

### 9. **templates** - Templates de Quadros

Templates pré-configurados para criação rápida de boards.

**Path**: `/templates/{templateId}`

**Campos**:
```typescript
{
  templateId: string;          // ID único
  userId?: string;             // ID do criador (null se público)

  // Informações
  nome: string;
  descricao: string;
  categoria: string;           // ex: "Desenvolvimento", "Marketing", "Pessoal"
  tags?: string[];
  icone?: string;

  // Estrutura
  listas: [{
    nome: string;
    ordem: number;
    cor?: string;
  }];

  cardsExemplo?: [{
    nome: string;
    descricao?: string;
    listaIndex: number;
    ordem: number;
    tipo?: 'feature' | 'bug' | 'melhoria' | 'documentacao' | 'teste' | 'refatoracao';
  }];

  // Metadata
  publico: boolean;
  vezesUtilizado: number;
  avaliacao?: number;          // 0-5

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Índices Compostos**:
- `publico` (Asc) + `categoria` (Asc) + `vezesUtilizado` (Desc)
- `userId` (Asc) + `updatedAt` (Desc)

---

## Relacionamentos entre Coleções

```
users
  └── boards (1:N) - Um usuário pode ter vários boards
        ├── lists (1:N) - Um board tem várias listas
        │     └── cards (1:N) - Uma lista tem vários cards
        ├── cards (1:N) - Um board tem vários cards
        ├── sprints (1:N) - Um board pode ter várias sprints
        │     └── cards (N:M) - Uma sprint tem vários cards
        └── knowledgeBases (1:N) - Um board pode ter várias KBs

cards
  ├── knowledgeBases (N:M) - Cards podem linkar KBs
  ├── tasks (1:N) - Um card pode ter várias tasks
  └── cards (N:M) - Cards podem ter relação pai/filho

knowledgeBases
  └── knowledgeBases (N:M) - KBs podem referenciar outras KBs

users
  └── notifications (1:N) - Um usuário recebe várias notificações
```

## Regras de Desnormalização

Para otimizar leituras, alguns dados são desnormalizados:

1. **Nome de usuários**: Armazenado junto com o ID em cards, comentários, etc.
2. **Contadores**: Total de cards, progresso, etc. armazenados no board
3. **Dados de sprint**: IDs de cards armazenados na sprint e vice-versa
4. **Membros do board**: Lista completa armazenada no board

## Considerações de Performance

1. **Paginação**: Implementar limite de 25-50 itens por query
2. **Cache local**: Usar cache do Firestore para dados frequentes
3. **Listeners em tempo real**: Apenas para board ativo
4. **Batch writes**: Usar para operações múltiplas
5. **Índices**: Todos os índices compostos devem ser criados no console

## Segurança

As regras de segurança devem garantir:
- Usuários só acessam seus próprios dados
- Membros do board podem acessar todos os dados do board
- Templates públicos são lidos por todos
- Apenas criadores podem deletar boards
- Apenas admins podem modificar membros
