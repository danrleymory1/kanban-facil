# Configuração do MongoDB

Este documento descreve a configuração do MongoDB para o projeto Kanban Fácil.

## 🔧 Configuração Realizada

### 1. Instalação de Dependências

```bash
npm install mongodb
```

### 2. Variável de Ambiente

Adicione a seguinte variável no arquivo `.env`:

```env
MONGODB_URI=mongodb://io-default:sj-VlDXolSguVqWHzQ3PxUUmVX_Jc-9vggHlTfhC611Zy8D6@0b98b96f-eb4a-4df3-8a48-ce91ba472996.southamerica-east1.firestore.goog:443/default?loadBalanced=true&tls=true&authMechanism=SCRAM-SHA-256&retryWrites=false
```

### 3. Arquitetura da Solução

A aplicação usa uma arquitetura de 3 camadas para separar o código do cliente do servidor:

```
┌─────────────────────┐
│  Client Components  │  (Navegador)
│   - Pages           │
│   - Components      │
└──────────┬──────────┘
           │ HTTP (fetch)
           ↓
┌─────────────────────┐
│    API Routes       │  (Servidor Next.js)
│   /api/boards       │
│   /api/lists        │
│   /api/cards        │
│   /api/sprints      │
└──────────┬──────────┘
           │ Direct import
           ↓
┌─────────────────────┐
│  MongoDB Service    │  (Servidor)
│   - Conexão         │
│   - Operações CRUD  │
└─────────────────────┘
```

### 4. Arquivos Criados

#### Camada de Conexão
- **`src/lib/mongodb.ts`** - Cliente MongoDB com suporte a desenvolvimento e produção

#### Camada de Serviço (Servidor)
- **`src/services/mongodb.service.ts`** - Operações CRUD no MongoDB (executa apenas no servidor)

#### Camada de API (Servidor)
- **`src/app/api/boards/route.ts`** - Endpoints para boards
- **`src/app/api/lists/route.ts`** - Endpoints para listas
- **`src/app/api/cards/route.ts`** - Endpoints para cards
- **`src/app/api/sprints/route.ts`** - Endpoints para sprints
- **`src/app/api/sprints/daily-notes/route.ts`** - Endpoints para daily notes
- **`src/app/api/sprints/retrospective/route.ts`** - Endpoints para retrospectivas
- **`src/app/api/sprints/metrics/route.ts`** - Endpoints para métricas
- **`src/app/api/knowledge-base/route.ts`** - Endpoints para base de conhecimento

#### Camada de Cliente
- **`src/services/api.service.ts`** - Cliente HTTP para consumir as APIs (executa no navegador)

## 📊 Estrutura do Banco de Dados

O MongoDB usa o banco de dados `default` com as seguintes collections:

### Collections

1. **boards**
   - Armazena os quadros Kanban
   - Campos: userId, nome, descricao, tags, membros, visibilidade, arquivado, createdAt, updatedAt

2. **lists**
   - Armazena as listas/colunas de cada board
   - Campos: boardId, nome, ordem, createdAt, updatedAt

3. **cards**
   - Armazena os cards de cada lista
   - Campos: listId, boardId, nome, descricao, responsavel, prioridade, status, tipo, tags, etc.

4. **sprints**
   - Armazena os sprints de cada board
   - Campos: boardId, nome, numero, objetivo, dataInicio, dataFim, status, cardsIds, metrics, etc.

5. **knowledgeBases**
   - Armazena a base de conhecimento dos usuários
   - Campos: userId, titulo, conteudo, linksRelacionados, tags, createdAt, updatedAt

## 🔄 Real-time vs Polling

### Firestore (Anterior)
- Usava listeners em tempo real nativos (`onSnapshot`)
- Atualizações instantâneas quando dados mudavam

### MongoDB (Atual)
- Implementação com **polling** (consultas a cada 2 segundos)
- Alternativa: MongoDB Change Streams (requer configuração adicional)

### Funções de Polling

```typescript
// Exemplo de uso
const unsubscribe = subscribeToBoardLists(boardId, (lists) => {
  console.log('Listas atualizadas:', lists);
});

// Quando não precisar mais das atualizações
unsubscribe();
```

## 🚀 Como Usar

### No Cliente (Componentes)

```typescript
import * as apiService from '@/services/api.service';

// Criar um board
const board = await apiService.createBoard(userId, 'Meu Board', 'Descrição');

// Buscar boards do usuário
const boards = await apiService.getUserBoards(userId);

// Atualizar board
await apiService.updateBoard(boardId, { nome: 'Novo Nome' });

// Deletar board
await apiService.deleteBoard(boardId);

// Subscrever a mudanças (polling)
const unsubscribe = apiService.subscribeToBoardLists(boardId, (lists) => {
  setLists(lists);
});
```

### No Servidor (API Routes)

```typescript
import * as mongoService from '@/services/mongodb.service';

// Operações diretas com MongoDB
const board = await mongoService.getBoard(boardId);
const boards = await mongoService.getUserBoards(userId);
```

## ⚠️ Importante

1. **Nunca importe `mongodb.service` em componentes do cliente**
   - Isso causará erro "Module not found: Can't resolve 'child_process'"
   - Sempre use `api.service` no cliente

2. **API Routes executam no servidor**
   - Podem importar e usar `mongodb.service` diretamente
   - Têm acesso ao driver MongoDB completo

3. **Autenticação ainda usa Firebase**
   - Firebase Auth continua gerenciando usuários
   - Apenas o armazenamento de dados foi migrado para MongoDB

## 🔍 Troubleshooting

### Erro: Can't resolve 'child_process'
- **Causa**: Tentativa de importar `mongodb.service` em componente do cliente
- **Solução**: Use `api.service` em vez de `mongodb.service`

### Erro: Connection refused
- **Causa**: String de conexão MongoDB incorreta
- **Solução**: Verifique a variável `MONGODB_URI` no `.env`

### Dados não atualizam em tempo real
- **Causa**: Polling pode ter delay de até 2 segundos
- **Solução**: Para atualizações mais rápidas, reduza o intervalo de polling ou implemente MongoDB Change Streams

## 📝 Próximos Passos (Opcional)

Para melhorar a performance e experiência:

1. **Implementar MongoDB Change Streams** para atualizações em tempo real
2. **Adicionar índices** nas collections para queries mais rápidas
3. **Implementar cache** com Redis ou similar
4. **Adicionar paginação** para boards e cards
5. **Implementar busca full-text** usando MongoDB Atlas Search
