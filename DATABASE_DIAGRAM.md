# Diagrama da Estrutura do Banco de Dados

## Diagrama de Entidades e Relacionamentos (ER)

```mermaid
erDiagram
    USER ||--o{ BOARD : "cria"
    USER ||--o{ NOTIFICATION : "recebe"
    USER ||--o{ KNOWLEDGE_BASE : "cria"
    USER ||--o{ TEMPLATE : "cria"

    BOARD ||--o{ LIST : "contém"
    BOARD ||--o{ CARD : "possui"
    BOARD ||--o{ SPRINT : "gerencia"
    BOARD ||--o{ KNOWLEDGE_BASE : "documenta"
    BOARD }o--o{ USER : "membros"

    LIST ||--o{ CARD : "organiza"

    CARD ||--o{ TASK : "subdivide"
    CARD ||--o{ COMENTARIO : "recebe"
    CARD ||--o{ ANEXO : "possui"
    CARD ||--o{ CHECKLIST : "contém"
    CARD ||--o{ TEMPO_REGISTRADO : "rastreia"
    CARD ||--o{ ATIVIDADE : "histórico"
    CARD }o--o{ CARD : "relaciona (pai/filho)"
    CARD }o--o{ CARD : "dependências"
    CARD }o--o{ KNOWLEDGE_BASE : "documenta"
    CARD }o--|| SPRINT : "participa"

    SPRINT ||--o{ DAILY_NOTE : "possui"
    SPRINT ||--o| RETROSPECTIVA : "conclui"
    SPRINT ||--o{ SPRINT_METRICS : "mede"

    KNOWLEDGE_BASE ||--o{ KB_VERSAO : "versiona"
    KNOWLEDGE_BASE }o--o{ KNOWLEDGE_BASE : "referencia"

    TEMPLATE ||--o{ TEMPLATE_LIST : "define"
    TEMPLATE ||--o{ TEMPLATE_CARD : "sugere"

    USER {
        string userId PK
        string email
        string nome
        boolean isAnonymous
        object preferences
        timestamp createdAt
        timestamp updatedAt
    }

    BOARD {
        string boardId PK
        string userId FK
        string nome
        string visibilidade
        array membros
        object settings
        boolean arquivado
        number progresso
        timestamp createdAt
        timestamp updatedAt
    }

    LIST {
        string listId PK
        string boardId FK
        string nome
        number ordem
        boolean arquivado
        timestamp createdAt
        timestamp updatedAt
    }

    CARD {
        string cardId PK
        string listId FK
        string boardId FK
        string nome
        string descricao
        string prioridade
        string status
        string tipo
        number ordem
        number progresso
        array checklists
        array comentarios
        array anexos
        timestamp createdAt
        timestamp updatedAt
    }

    SPRINT {
        string sprintId PK
        string boardId FK
        string nome
        string status
        timestamp dataInicio
        timestamp dataFim
        object metrics
        object retrospectiva
        timestamp createdAt
        timestamp updatedAt
    }

    TASK {
        string taskId PK
        string boardId FK
        string cardId FK
        string sprintId FK
        string titulo
        string status
        string prioridade
        timestamp createdAt
        timestamp updatedAt
    }

    KNOWLEDGE_BASE {
        string knowledgeBaseId PK
        string userId FK
        string boardId FK
        string titulo
        string conteudo
        array tags
        array versoes
        boolean publico
        timestamp createdAt
        timestamp updatedAt
    }

    NOTIFICATION {
        string notificationId PK
        string userId FK
        string tipo
        string titulo
        string mensagem
        boolean lida
        timestamp createdAt
    }

    TEMPLATE {
        string templateId PK
        string userId FK
        string nome
        string categoria
        array listas
        boolean publico
        number vezesUtilizado
        timestamp createdAt
    }

    COMENTARIO {
        string comentarioId PK
        string userId
        string texto
        array mencionados
        timestamp createdAt
    }

    ANEXO {
        string anexoId PK
        string nome
        string url
        number tamanho
        timestamp uploadedAt
    }

    CHECKLIST {
        string checklistId PK
        string titulo
        array itens
        timestamp createdAt
    }

    ATIVIDADE {
        string atividadeId PK
        string userId
        string tipo
        string descricao
        timestamp timestamp
    }

    TEMPO_REGISTRADO {
        string registroId PK
        string userId
        number horas
        string descricao
        timestamp data
    }

    KB_VERSAO {
        string versaoId PK
        string conteudo
        string editadoPor
        timestamp timestamp
    }

    DAILY_NOTE {
        string noteId PK
        timestamp data
        array impedimentos
        array notas
    }

    RETROSPECTIVA {
        array pontoPositivos
        array pontosNegativos
        array acoesParaMelhoria
        timestamp realizadaEm
    }

    SPRINT_METRICS {
        number totalPontos
        number pontosCompletados
        number velocidade
        array burndownData
    }

    TEMPLATE_LIST {
        string nome
        number ordem
        string cor
    }

    TEMPLATE_CARD {
        string nome
        number ordem
        string tipo
    }
```

## Diagrama de Fluxo de Dados Principal

```mermaid
flowchart TB
    A[Usuário] -->|Login Anônimo| B[Autenticação]
    B -->|Cria| C[Board]
    C -->|Adiciona| D[Membros]
    C -->|Contém| E[Lists]
    E -->|Organiza| F[Cards]

    F -->|Vincula| G[Knowledge Base]
    F -->|Participa| H[Sprint]
    F -->|Contém| I[Checklists]
    F -->|Recebe| J[Comentários]
    F -->|Anexa| K[Arquivos]

    H -->|Mede| L[Métricas]
    H -->|Registra| M[Daily Notes]
    H -->|Conclui| N[Retrospectiva]

    G -->|Referencia| G
    F -->|Relaciona| F

    style A fill:#e1f5ff
    style B fill:#fff3cd
    style C fill:#d4edda
    style F fill:#f8d7da
    style H fill:#d1ecf1
    style G fill:#e2e3e5
```

## Hierarquia de Dados

```
🌐 Aplicação
│
├── 👤 Usuários
│   ├── Perfil e Preferências
│   ├── Notificações
│   └── Knowledge Base Pessoal
│
├── 📋 Boards (Projetos)
│   │
│   ├── 👥 Membros
│   │   ├── Admin
│   │   ├── Editor
│   │   └── Visualizador
│   │
│   ├── 📝 Lists (Colunas Kanban)
│   │   └── 🎯 Cards (Tarefas)
│   │       ├── Checklists
│   │       ├── Comentários
│   │       ├── Anexos
│   │       ├── Tempo Registrado
│   │       ├── Histórico
│   │       └── Subtarefas
│   │
│   ├── 🏃 Sprints (Scrum)
│   │   ├── Cards da Sprint
│   │   ├── Métricas
│   │   ├── Burndown Chart
│   │   ├── Daily Notes
│   │   └── Retrospectiva
│   │
│   └── 📚 Knowledge Base
│       ├── Documentos
│       ├── Links Bidirecionais
│       └── Versionamento
│
└── 📄 Templates
    ├── Lists Padrão
    └── Cards Exemplo
```

## Fluxo de Criação de Card Completo

```mermaid
sequenceDiagram
    participant U as Usuário
    participant B as Board
    participant L as List
    participant C as Card
    participant KB as Knowledge Base
    participant S as Sprint

    U->>B: Acessa Board
    B->>L: Carrega Lists
    L->>C: Exibe Cards

    U->>C: Cria Novo Card
    C->>C: Adiciona Checklist
    C->>KB: Vincula KB
    C->>S: Adiciona à Sprint

    U->>C: Adiciona Comentário
    U->>C: Registra Tempo
    U->>C: Move para Lista "Done"

    C->>S: Atualiza Métricas
    S->>S: Recalcula Burndown
```

## Índices e Performance

### Índices Principais por Coleção

#### Boards
- `userId + arquivado + updatedAt`
- `membros.userId + arquivado + updatedAt`
- `visibilidade + updatedAt`

#### Cards
- `boardId + listId + ordem`
- `boardId + responsavel + status`
- `boardId + sprintId + status`
- `boardId + dataVencimento`
- `responsavel + status + dataVencimento`

#### Knowledge Base
- `userId + updatedAt`
- `boardId + categoria + updatedAt`
- `tags + updatedAt`

#### Sprints
- `boardId + status + dataInicio`
- `boardId + numero`

## Regras de Segurança - Resumo

```mermaid
flowchart LR
    A[Request] --> B{Autenticado?}
    B -->|Não| C[❌ Negado]
    B -->|Sim| D{É Membro?}
    D -->|Não| C
    D -->|Sim| E{Papel}
    E -->|Admin| F[✅ Todas Operações]
    E -->|Editor| G[✅ Editar]
    E -->|Visualizador| H[✅ Apenas Ler]
```

## Otimizações Implementadas

### 1. Desnormalização Estratégica
- ✅ Nome de usuários em cards
- ✅ Lista de membros em boards
- ✅ Contadores e métricas

### 2. Índices Compostos
- ✅ 28 índices otimizados
- ✅ Queries complexas eficientes
- ✅ Ordenação e filtros rápidos

### 3. Real-time Seletivo
- ✅ Listeners apenas para board ativo
- ✅ Paginação em listas longas
- ✅ Cache local automático

### 4. Batch Operations
- ✅ Múltiplas escritas agrupadas
- ✅ Redução de custos
- ✅ Operações atômicas

## Capacidade e Limites

### Plano Gratuito (Spark)
- **Leituras**: 50.000/dia
- **Escritas**: 20.000/dia
- **Armazenamento**: 1GB
- **Ideal para**: Desenvolvimento e pequenos projetos

### Estimativa de Uso
- **Board pequeno**: ~100 reads/dia
- **Board médio**: ~500 reads/dia
- **Board grande**: ~2000 reads/dia

### Quando Escalar
- Mais de 20 boards ativos
- Mais de 100 usuários simultâneos
- Mais de 1000 cards no total

---

**Visualize este documento no GitHub ou em um visualizador Markdown com suporte a Mermaid para ver os diagramas renderizados.**
