# Configuração do Firebase - Kanban Fácil

Este documento descreve como configurar completamente o Firebase para o projeto Kanban Fácil.

## Pré-requisitos

- Conta no Firebase (https://console.firebase.google.com/)
- Firebase CLI instalada: `npm install -g firebase-tools`

## 1. Criar Projeto no Firebase Console

1. Acesse https://console.firebase.google.com/
2. Clique em "Adicionar projeto"
3. Nome do projeto: `kanban-facil`
4. Siga os passos de criação

## 2. Habilitar Autenticação Anônima

1. No Firebase Console, vá em **Authentication**
2. Clique na aba **Sign-in method**
3. Habilite **Anônimo** (Anonymous)
4. Salve as alterações

### (Opcional) Habilitar outros métodos de autenticação

Se desejar adicionar mais métodos de login no futuro:
- **Google**: Habilite e configure o OAuth
- **Email/Password**: Habilite para cadastro tradicional

## 3. Criar Banco de Dados Firestore

1. No Firebase Console, vá em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Selecione o modo: **Produção**
4. Escolha a localização: **southamerica-east1** (São Paulo)
5. Clique em **Ativar**

## 4. Implantar Regras de Segurança

### Via Firebase Console (Interface Web)

1. No Firebase Console, vá em **Firestore Database**
2. Clique na aba **Regras**
3. Copie o conteúdo do arquivo `firestore.rules` deste projeto
4. Cole na interface
5. Clique em **Publicar**

### Via Firebase CLI (Recomendado)

```bash
# 1. Fazer login no Firebase
firebase login

# 2. Inicializar o projeto (se ainda não foi feito)
firebase init firestore

# 3. Quando perguntado sobre o arquivo de regras, confirme que é firestore.rules

# 4. Deploy das regras
firebase deploy --only firestore:rules
```

## 5. Criar Índices Compostos

Os índices compostos são necessários para queries complexas funcionarem corretamente.

### Método 1: Via Firebase Console (Manual)

1. No Firebase Console, vá em **Firestore Database**
2. Clique na aba **Índices**
3. Para cada índice listado em `firestore.indexes.json`:
   - Clique em **Adicionar índice**
   - Preencha os campos conforme o JSON
   - Salve

### Método 2: Via Firebase CLI (Recomendado)

```bash
# Deploy dos índices automaticamente
firebase deploy --only firestore:indexes
```

O arquivo `firestore.indexes.json` já contém todos os índices necessários.

### Método 3: Criar sob demanda

Quando você executar uma query que precisa de um índice, o Firestore mostrará um erro com um link direto para criar o índice. Basta clicar no link.

## 6. Configurar Variáveis de Ambiente

As variáveis já estão no arquivo `.env`, mas verifique se estão corretas:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kanban-facil.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kanban-facil
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kanban-facil.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=seu-app-id
```

Para encontrar essas informações:
1. No Firebase Console
2. Clique no ícone de engrenagem > Configurações do projeto
3. Role até "Seus apps" > Configuração do SDK

## 7. (Opcional) Habilitar Storage para Anexos

Se quiser permitir upload de arquivos:

1. No Firebase Console, vá em **Storage**
2. Clique em **Começar**
3. Configure as regras de segurança:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Anexos de cards
    match /cards/{cardId}/attachments/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && request.resource.size < 5 * 1024 * 1024  // Max 5MB
        && request.resource.contentType.matches('image/.*|application/pdf|text/.*');
    }

    // Avatares de usuários
    match /users/{userId}/avatar {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && request.auth.uid == userId
        && request.resource.size < 1 * 1024 * 1024  // Max 1MB
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 8. Verificar Configuração

### Testar Autenticação

```bash
# Rode o projeto
npm run dev

# Acesse http://localhost:3000
# Clique em "Começar Agora"
# Verifique no Firebase Console > Authentication se o usuário anônimo foi criado
```

### Testar Firestore

```bash
# Crie um board
# Verifique no Firebase Console > Firestore Database se o documento foi criado
```

## 9. Monitoramento e Limites

### Configurar Alertas de Cota

1. No Firebase Console, vá em **Uso e Faturamento**
2. Configure alertas para:
   - Leituras do Firestore
   - Escritas do Firestore
   - Armazenamento

### Plano Spark (Gratuito) - Limites

- **Firestore**: 50K reads/day, 20K writes/day, 1GB storage
- **Authentication**: Ilimitado
- **Hosting**: 10GB transfer/month

### Upgrade para Blaze (Pay as you go)

Se os limites gratuitos não forem suficientes:

```bash
firebase projects:list
firebase use kanban-facil
# Upgrade no console: https://console.firebase.google.com/project/kanban-facil/usage
```

## 10. Comandos Úteis

```bash
# Login no Firebase
firebase login

# Selecionar projeto
firebase use kanban-facil

# Deploy completo (regras + índices)
firebase deploy --only firestore

# Deploy apenas regras
firebase deploy --only firestore:rules

# Deploy apenas índices
firebase deploy --only firestore:indexes

# Ver logs em tempo real
firebase firestore:logging

# Backup do banco (requer Blaze plan)
gcloud firestore export gs://[BUCKET_NAME]
```

## 11. Estrutura de Pastas do Firebase

```
kanban-facil/
├── .env                      # Variáveis de ambiente
├── firestore.rules           # Regras de segurança
├── firestore.indexes.json    # Índices compostos
├── firebase.json             # Configuração do Firebase
└── .firebaserc              # Aliases de projetos
```

## 12. Troubleshooting

### Erro: "Missing or insufficient permissions"

- Verifique se as regras de segurança foram publicadas
- Verifique se o usuário está autenticado
- Verifique os logs no Console > Firestore > Regras

### Erro: "The query requires an index"

- Clique no link do erro para criar o índice automaticamente
- Ou use `firebase deploy --only firestore:indexes`

### Autenticação anônima não funciona

- Verifique se está habilitada em Authentication > Sign-in method
- Verifique se as credenciais no `.env` estão corretas

## 13. Segurança em Produção

### Boas Práticas

1. **Nunca exponha credenciais privadas**: As variáveis `NEXT_PUBLIC_*` são públicas
2. **Use regras de segurança robustas**: Sempre valide no servidor (Firestore rules)
3. **Monitore uso**: Configure alertas de quota
4. **Backup regular**: Configure exports automáticos (Blaze plan)
5. **Rate limiting**: Implemente no lado do cliente para evitar spam

### Proteção Adicional

```typescript
// Exemplo de rate limiting no cliente
import { debounce } from 'lodash';

const saveCard = debounce(async (data) => {
  await updateCard(cardId, data);
}, 1000);
```

## 14. Próximos Passos

Após configurar o Firebase:

1. ✅ Testar autenticação anônima
2. ✅ Criar um board de teste
3. ✅ Criar listas e cards
4. ✅ Verificar sincronização em tempo real
5. ✅ Testar em diferentes navegadores
6. ✅ Testar regras de segurança

## Recursos Adicionais

- [Documentação do Firestore](https://firebase.google.com/docs/firestore)
- [Regras de Segurança](https://firebase.google.com/docs/firestore/security/get-started)
- [Índices do Firestore](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
