// ========================================
// ENUMS E TIPOS AUXILIARES
// ========================================

export type PrioridadeType = 'baixa' | 'media' | 'alta' | 'urgente';
export type StatusCardType = 'aberto' | 'em-progresso' | 'em-revisao' | 'bloqueado' | 'concluido';
export type StatusSprintType = 'planejamento' | 'ativo' | 'em-revisao' | 'concluido' | 'cancelado';
export type TipoAtividadeType = 'feature' | 'bug' | 'melhoria' | 'documentacao' | 'teste' | 'refatoracao';
export type VisibilidadeBoardType = 'privado' | 'publico' | 'equipe';
export type PapelMembroType = 'admin' | 'editor' | 'visualizador';

// ========================================
// USER - Usuário do Sistema
// ========================================

export interface UserPreferences {
  tema?: 'claro' | 'escuro' | 'auto';
  idioma?: string;
  notificacoesEmail?: boolean;
  notificacoesPush?: boolean;
}

export interface User {
  userId: string;
  email: string | null;
  nome: string;
  avatar?: string;
  bio?: string;
  cargo?: string;
  departamento?: string;
  telefone?: string;
  timezone?: string;
  preferences?: UserPreferences;
  isAnonymous: boolean;
  ultimoAcesso?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ========================================
// BOARD - Quadro/Projeto
// ========================================

export interface BoardMembro {
  userId: string;
  nome: string;
  papel: PapelMembroType;
  adicionadoEm: Date;
}

export interface BoardSettings {
  permitirComentarios?: boolean;
  permitirAnexos?: boolean;
  autoArquivarConcluidos?: boolean;
  diasParaArquivar?: number;
  notificarMudancas?: boolean;
  limiteWIP?: number; // Work In Progress limit
}

export interface Board {
  boardId: string;
  userId: string; // Criador do board
  nome: string;
  descricao?: string;
  cor?: string;
  icone?: string;
  tags?: string[];
  membros: BoardMembro[];
  visibilidade: VisibilidadeBoardType;
  settings?: BoardSettings;
  favorito?: boolean;
  arquivado?: boolean;
  dataConclusao?: Date;
  progresso?: number; // 0-100
  sprintAtualId?: string;
  templatesUtilizados?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ========================================
// LIST - Lista/Coluna do Kanban
// ========================================

export interface ListSettings {
  limiteCards?: number;
  corFundo?: string;
  corTexto?: string;
  alertarLimite?: boolean;
}

export interface List {
  listId: string;
  boardId: string;
  nome: string;
  descricao?: string;
  ordem: number;
  cor?: string;
  settings?: ListSettings;
  arquivado?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ========================================
// CARD - Cartão/Tarefa
// ========================================

export interface Comentario {
  comentarioId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  texto: string;
  mencionados?: string[];
  createdAt: Date;
  editadoEm?: Date;
}

export interface Anexo {
  anexoId: string;
  nome: string;
  tipo: string;
  url: string;
  tamanho: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Checklist {
  checklistId: string;
  titulo: string;
  itens: ChecklistItem[];
  createdAt: Date;
}

export interface ChecklistItem {
  itemId: string;
  texto: string;
  concluido: boolean;
  responsavel?: string;
  dataVencimento?: Date;
  ordem: number;
}

export interface Atividade {
  atividadeId: string;
  userId: string;
  userName: string;
  tipo: 'criou' | 'moveu' | 'editou' | 'comentou' | 'anexou' | 'concluiu' | 'atribuiu';
  descricao: string;
  detalhe?: Record<string, unknown>;
  timestamp: Date;
}

export interface TempoRegistrado {
  registroId: string;
  userId: string;
  userName: string;
  horas: number;
  descricao?: string;
  data: Date;
}

export interface Card {
  cardId: string;
  listId: string;
  boardId: string;
  nome: string;
  descricao?: string;
  descricaoMarkdown?: string;
  ordem: number;

  // Atribuição e responsabilidade
  responsavel?: string;
  responsavelNome?: string;
  colaboradores?: string[];

  // Classificação
  prioridade: PrioridadeType;
  status: StatusCardType;
  tipo: TipoAtividadeType;
  tags?: string[];
  cor?: string;

  // Datas e prazos
  dataInicio?: Date;
  dataFim?: Date;
  dataVencimento?: Date;
  dataConclusao?: Date;

  // Estimativas e tracking
  estimativaHoras?: number;
  horasRegistradas?: number;
  pontosStoryPoints?: number;
  progresso?: number; // 0-100

  // Relacionamentos
  sprintId?: string;
  knowledgeBaseLinks?: string[];
  cardsPai?: string[];
  cardsFilhos?: string[];
  dependencias?: string[];
  bloqueadores?: string[];

  // Conteúdo adicional
  checklists?: Checklist[];
  comentarios?: Comentario[];
  anexos?: Anexo[];
  historico?: Atividade[];
  tempoRegistrado?: TempoRegistrado[];

  // Metadata
  numeroCard?: number; // Número sequencial no board
  arquivado?: boolean;
  concluido?: boolean;
  criadoPor: string;
  criadoPorNome?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ========================================
// KNOWLEDGE BASE - Base de Conhecimento
// ========================================

export interface KnowledgeBaseVersao {
  versaoId: string;
  conteudo: string;
  editadoPor: string;
  editadoPorNome: string;
  timestamp: Date;
}

export interface KnowledgeBase {
  knowledgeBaseId: string;
  userId: string;
  boardId?: string;

  // Conteúdo
  titulo: string;
  conteudo: string;
  conteudoMarkdown?: string;
  resumo?: string;

  // Organização
  categoria?: string;
  tags?: string[];
  pasta?: string;

  // Relacionamentos
  linksRelacionados?: string[];
  cardsRelacionados?: string[];
  kbsRelacionados?: string[];

  // Metadados
  autores?: string[];
  versoes?: KnowledgeBaseVersao[];
  versaoAtual?: number;
  favorito?: boolean;
  publico?: boolean;

  // Estatísticas
  visualizacoes?: number;
  ultimaVisualizacao?: Date;

  createdAt: Date;
  updatedAt: Date;
}

// ========================================
// SPRINT - Sprint Scrum
// ========================================

export interface SprintMetrics {
  totalPontos?: number;
  pontosCompletados?: number;
  totalCards?: number;
  cardsCompletados?: number;
  velocidade?: number;
  burndownData?: BurndownPoint[];
}

export interface BurndownPoint {
  data: Date;
  pontosRestantes: number;
  horasRestantes?: number;
}

export interface SprintRetrospectiva {
  pontoPositivos: string[];
  pontosNegativos: string[];
  acoesParaMelhoria: string[];
  realizadaEm?: Date;
  participantes?: string[];
}

export interface Sprint {
  sprintId: string;
  boardId: string;

  // Informações básicas
  nome: string;
  numero?: number;
  objetivo?: string;
  descricao?: string;

  // Datas
  dataInicio: Date;
  dataFim: Date;
  dataInicioReal?: Date;
  dataFimReal?: Date;

  // Status
  status: StatusSprintType;

  // Cards e metas
  cardsIds?: string[];
  metaPontos?: number;
  metaCards?: number;

  // Métricas
  metrics?: SprintMetrics;

  // Cerimônias Scrum
  dailyNotes?: DailyNote[];
  retrospectiva?: SprintRetrospectiva;

  createdAt: Date;
  updatedAt: Date;
}

export interface DailyNote {
  noteId: string;
  data: Date;
  impedimentos: string[];
  notas: string[];
  participantes: string[];
}

// ========================================
// TASK - Tarefa (para Scrum detalhado)
// ========================================

export interface Task {
  taskId: string;
  boardId: string;
  userId: string;
  cardId?: string;
  sprintId?: string;

  // Informações básicas
  titulo: string;
  descricao?: string;
  tipo: TipoAtividadeType;

  // Status e prioridade
  status: StatusCardType;
  prioridade: PrioridadeType;

  // Atribuição
  responsavel?: string;
  responsavelNome?: string;

  // Estimativas
  estimativaHoras?: number;
  horasGastas?: number;
  storyPoints?: number;

  // Datas
  dataVencimento?: Date;
  dataConclusao?: Date;

  // Relacionamentos
  dependencias?: string[];

  createdAt: Date;
  updatedAt: Date;
}

// ========================================
// NOTIFICATION - Notificação
// ========================================

export interface Notification {
  notificationId: string;
  userId: string;

  // Conteúdo
  tipo: 'atribuicao' | 'mencao' | 'comentario' | 'prazo' | 'atualizacao' | 'convite';
  titulo: string;
  mensagem: string;

  // Links
  boardId?: string;
  cardId?: string;
  link?: string;

  // Metadata
  lida: boolean;
  arquivada: boolean;
  remetente?: string;
  remetenteNome?: string;

  createdAt: Date;
  lidaEm?: Date;
}

// ========================================
// TEMPLATE - Template de Board
// ========================================

export interface Template {
  templateId: string;
  userId?: string; // null se for template público

  // Informações
  nome: string;
  descricao: string;
  categoria: string;
  tags?: string[];
  icone?: string;

  // Estrutura
  listas: TemplateList[];
  cardsExemplo?: TemplateCard[];

  // Metadata
  publico: boolean;
  vezesUtilizado: number;
  avaliacao?: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateList {
  nome: string;
  ordem: number;
  cor?: string;
}

export interface TemplateCard {
  nome: string;
  descricao?: string;
  listaIndex: number;
  ordem: number;
  tipo?: TipoAtividadeType;
}
