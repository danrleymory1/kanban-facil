# Guia de Uso - Kanban Fácil

## 🚀 Como Começar

### 1. Acesse a Aplicação
```
http://localhost:3000
```

### 2. Faça Login
- Clique em **"Começar Agora"**
- Login anônimo será feito automaticamente
- Você será redirecionado para o Dashboard

---

## 📋 Dashboard

### Criar um Novo Board
1. Clique no botão **"+ Novo Quadro"**
2. Digite o nome do quadro (ex: "Projeto Website")
3. (Opcional) Adicione uma descrição
4. Clique em **"Criar"**

### Acessar um Board Existente
- Clique no card do board desejado

### Excluir um Board
1. Passe o mouse sobre o card do board
2. Clique no ícone de lixeira (aparece no hover)
3. Confirme a exclusão

---

## 📊 Interface do Board

### Criar uma Lista (Coluna)
1. No board, clique em **"Adicionar lista"** (à direita)
2. Digite o nome da lista (ex: "To Do", "In Progress", "Done")
3. Clique em **"Adicionar"** ou pressione **Enter**

### Renomear uma Lista
1. Clique no ícone **⋯** no cabeçalho da lista
2. Selecione **"Renomear lista"**
3. Digite o novo nome
4. Pressione **Enter** ou clique fora para salvar

### Excluir uma Lista
1. Clique no ícone **⋯** no cabeçalho da lista
2. Selecione **"Excluir lista"**
3. Confirme a exclusão

### Reordenar Listas
- Clique e arraste o cabeçalho da lista para a posição desejada

---

## 🎯 Trabalhando com Cards

### Criar um Card
1. Na lista desejada, clique em **"+ Adicionar cartão"**
2. Digite o título do card
3. Clique em **"Adicionar"** ou pressione **Enter**

### Visualizar Detalhes do Card
- Clique em qualquer card

### Mover um Card
**Entre Listas:**
1. Clique e segure o card
2. Arraste para outra lista
3. Solte na posição desejada

**Dentro da Mesma Lista:**
1. Clique e segure o card
2. Arraste para cima ou para baixo
3. Solte na posição desejada

---

## 🔧 Editando um Card

### No Modal do Card

#### Alterar Status
- Use o dropdown **Status**
- Opções: Aberto, Em Progresso, Em Revisão, Bloqueado, Concluído

#### Alterar Prioridade
- Use o dropdown **Prioridade**
- Opções: Baixa, Média, Alta, Urgente
- A cor da borda do card reflete a prioridade

#### Alterar Tipo
- Use o dropdown **Tipo**
- Opções: Feature, Bug, Melhoria, Documentação, Teste, Refatoração

#### Editar Título
1. Clique no título no topo do modal
2. Digite o novo título
3. As mudanças são salvas automaticamente

#### Editar Descrição
1. Clique em **"Editar"** ao lado de "Descrição"
2. Digite ou edite o texto
3. Clique em **"Salvar"**
4. Ou clique em **"Cancelar"** para descartar

#### Excluir Card
1. No rodapé do modal, clique em **"Excluir cartão"**
2. Confirme a exclusão

---

## 🎨 Recursos Visuais

### Cores de Prioridade (Borda Esquerda do Card)
- 🟢 **Verde**: Baixa
- 🟡 **Amarelo**: Média
- 🟠 **Laranja**: Alta
- 🔴 **Vermelho**: Urgente

### Badges de Status
- Cinza: Aberto
- Azul: Em Progresso
- Roxo: Em Revisão
- Vermelho: Bloqueado
- Verde: Concluído

### Indicadores no Card
- 🕐 **Relógio**: Data de vencimento
- ☑️ **Checklist**: Progresso das tarefas (2/5)
- 💬 **Balão**: Número de comentários
- 📎 **Clipe**: Número de anexos
- 👤 **Avatar**: Responsável pelo card

### Cards Vencidos
- Data de vencimento aparece em **vermelho** quando atrasada
- Apenas para cards não concluídos

---

## 📊 Informações no Modal

### Metadata Exibida
- **Criado por**: Nome do usuário que criou
- **Criado em**: Data e hora de criação
- **Vencimento**: Data limite (se definida)
- **Responsável**: Pessoa atribuída (se definido)
- **Última atualização**: Rodapé do modal

### Checklists
- Visualização de todas as checklists
- Barra de progresso por checklist
- Contador de itens concluídos

### Tags
- Exibidas como badges azuis
- Fácil visualização de categorias

---

## ⌨️ Atalhos de Teclado

### Ao Criar Lista/Card
- **Enter**: Salvar
- **Esc**: Cancelar

### Ao Editar Nome da Lista
- **Enter**: Salvar
- **Esc**: Cancelar

---

## 🔄 Sincronização em Tempo Real

### Funciona Automaticamente
- Abra o mesmo board em duas abas
- Mudanças em uma aba aparecem instantaneamente na outra
- Funciona para:
  - Criação de listas e cards
  - Movimentação de cards
  - Edição de conteúdo
  - Exclusão de itens

---

## 💡 Dicas de Uso

### Organize seu Workflow
```
Lista 1: "Backlog" - Tarefas a fazer
Lista 2: "To Do" - Próximas tarefas
Lista 3: "In Progress" - Em andamento
Lista 4: "Review" - Aguardando revisão
Lista 5: "Done" - Concluídas
```

### Use Prioridades
- **Urgente**: Problemas críticos, bugs graves
- **Alta**: Funcionalidades importantes
- **Média**: Tarefas regulares
- **Baixa**: Melhorias futuras

### Use Tipos
- **Feature**: Nova funcionalidade
- **Bug**: Correção de erro
- **Melhoria**: Otimização de funcionalidade existente
- **Documentação**: Criar/atualizar docs
- **Teste**: Escrever ou atualizar testes
- **Refatoração**: Melhorar código sem mudar comportamento

### Use Status
- **Aberto**: Tarefa criada mas não iniciada
- **Em Progresso**: Trabalho ativo
- **Em Revisão**: Aguardando code review ou aprovação
- **Bloqueado**: Impedido por dependências
- **Concluído**: Tarefa finalizada

---

## 🐛 Solução de Problemas

### Board não carrega
- Verifique se você está autenticado
- Recarregue a página (F5)
- Verifique o console do navegador

### Cards não aparecem
- Verifique se há erros no console
- Certifique-se de que o Firebase está configurado
- Recarregue a página

### Drag & Drop não funciona
- Certifique-se de clicar e segurar
- Tente em outro navegador
- Verifique se há erros de JavaScript

### Mudanças não salvam
- Verifique sua conexão com internet
- Verifique se as regras do Firestore estão corretas
- Veja erros no console do navegador

---

## 📱 Navegação

### Voltar ao Dashboard
- Clique na seta **←** no canto superior esquerdo do board

### Sair da Aplicação
- No dashboard, clique em **"Sair"**

---

## 🎯 Fluxo de Trabalho Recomendado

### 1. Planejamento
1. Crie um board para o projeto
2. Crie listas para cada etapa do processo
3. Adicione todos os cards necessários

### 2. Organização
1. Defina prioridades para cada card
2. Atribua tipos apropriados
3. Adicione descrições detalhadas

### 3. Execução
1. Mova cards para "In Progress"
2. Atualize status conforme avança
3. Use modal para anotações detalhadas

### 4. Finalização
1. Marque cards como concluídos
2. Mova para lista "Done"
3. Revise progresso do projeto

---

## 🏃 Funcionalidades Scrum

### Acessar Gestão de Sprints
1. No board, clique em **"Sprints"** no header
2. Você será levado à página de gerenciamento de sprints

### Criar um Sprint
1. Na página de sprints, clique em **"Novo Sprint"**
2. Preencha as informações:
   - **Nome** (obrigatório): Ex: "Sprint 1"
   - **Número**: Ex: 1
   - **Objetivo**: Meta principal do sprint
   - **Descrição**: Detalhes adicionais
   - **Data de Início** (obrigatório)
   - **Data de Fim** (obrigatório)
   - **Status**: Planejamento, Ativo, Em Revisão, Concluído, Cancelado
   - **Meta de Story Points**: Ex: 50
   - **Meta de Cards**: Ex: 20
3. Clique em **"Criar Sprint"**

### Adicionar Story Points aos Cards
1. Abra qualquer card
2. No modal, localize o campo **"Story Points"**
3. Digite o valor (0-100)
4. As mudanças são salvas automaticamente

### Adicionar Cards ao Sprint
1. Acesse o sprint desejado
2. Vá para a aba **"Cards do Sprint"**
3. Clique em **"Adicionar Cards"**
4. Na lista de cards disponíveis, clique no ícone **+** para adicionar
5. Para remover, clique no ícone **-**
6. As métricas são atualizadas automaticamente

### Visualizar Burndown Chart
1. Acesse o sprint
2. Na aba **"Visão Geral"**
3. Veja o gráfico de burndown que mostra:
   - Linha ideal (tracejada cinza)
   - Progresso real (azul)
   - Dia atual (tracejada vermelha)

### Registrar Daily Notes
1. Acesse o sprint
2. Vá para a aba **"Daily Notes"**
3. Clique em **"Adicionar Daily Note"**
4. Preencha:
   - **O que foi feito?**: Conquistas do dia
   - **Impedimentos**: Bloqueios encontrados
   - **Participantes**: Quem participou da daily
5. Use **"+ Adicionar"** para mais campos
6. Clique em **"Salvar Daily Note"**

### Realizar Retrospectiva
1. Acesse o sprint
2. Vá para a aba **"Retrospectiva"**
3. Preencha as seções:
   - **Pontos Positivos**: O que funcionou bem
   - **Pontos Negativos**: O que pode melhorar
   - **Ações para Melhoria**: O que faremos diferente
   - **Participantes**: Quem participou
4. Use **"+ Adicionar"** para mais itens
5. Clique em **"Salvar Retrospectiva"**
6. Edite depois clicando em **"Editar Retrospectiva"**

### Atualizar Status do Sprint
1. Acesse o sprint
2. No topo da página, use o dropdown de status
3. Selecione o novo status:
   - **Planejamento**: Sprint sendo planejado
   - **Ativo**: Sprint em andamento
   - **Em Revisão**: Sprint sendo revisado
   - **Concluído**: Sprint finalizado
   - **Cancelado**: Sprint cancelado
4. O status é salvo automaticamente

### Métricas do Sprint

**Visão Geral:**
- Total de Story Points
- Story Points Completados
- Total de Cards
- Cards Completados
- Barras de progresso

**Burndown Chart:**
- Acompanhamento diário do progresso
- Comparação com linha ideal
- Identificação de desvios

---

## 🚀 Recursos Avançados (Em Breve)

### Knowledge Base (Etapa 6)
- Documentação vinculada
- Markdown support
- Links bidirecionais

### Colaboração (Etapa 7)
- Comentários
- Menções (@user)
- Notificações
- Histórico de atividades

---

## 📞 Suporte

### Problemas ou Dúvidas?
- Verifique este guia primeiro
- Consulte a documentação técnica
- Verifique os logs do console
- Reporte bugs no repositório

---

**Aproveite o Kanban Fácil! 🎉**

Comece criando seu primeiro board e organize seus projetos de forma visual e eficiente!
