'use client';

import { Draggable } from '@hello-pangea/dnd';
import { Card } from '@/types';
import { FiClock, FiCheckSquare, FiPaperclip, FiMessageSquare, FiAlertTriangle, FiArrowUp, FiMinus, FiArrowDown } from 'react-icons/fi';
import { MdPlayCircleOutline, MdCheckCircle, MdRemoveRedEye, MdBlock } from 'react-icons/md';
import { AiOutlineFileText } from 'react-icons/ai';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br';

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

interface BoardCardProps {
  card: Card;
  index: number;
  onClick: () => void;
}

export default function BoardCard({ card, index, onClick }: BoardCardProps) {
  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente':
        return 'border-l-4 border-[var(--error)]';
      case 'alta':
        return 'border-l-4 border-[var(--warning)]';
      case 'media':
        return 'border-l-4 border-yellow-500';
      case 'baixa':
        return 'border-l-4 border-[var(--success)]';
      default:
        return '';
    }
  };

  const getPriorityIcon = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente':
        return <FiAlertTriangle className="text-[var(--error)]" />;
      case 'alta':
        return <FiArrowUp className="text-[var(--warning)]" />;
      case 'media':
        return <FiMinus className="text-yellow-500" />;
      case 'baixa':
        return <FiArrowDown className="text-[var(--success)]" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'bg-[var(--success)] bg-opacity-10 text-[var(--success)]';
      case 'em-progresso':
        return 'bg-[var(--primary)] bg-opacity-10 text-[var(--primary)]';
      case 'em-revisao':
        return 'bg-purple-500 bg-opacity-10 text-purple-700';
      case 'bloqueado':
        return 'bg-[var(--error)] bg-opacity-10 text-[var(--error)]';
      default:
        return 'bg-[var(--surface-tertiary)] text-[var(--content-secondary)]';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluido':
        return <MdCheckCircle className="text-sm" />;
      case 'em-progresso':
        return <MdPlayCircleOutline className="text-sm" />;
      case 'em-revisao':
        return <MdRemoveRedEye className="text-sm" />;
      case 'bloqueado':
        return <MdBlock className="text-sm" />;
      default:
        return null;
    }
  };

  const totalChecklistItems = card.checklists?.reduce(
    (acc, checklist) => acc + checklist.itens.length,
    0
  ) || 0;

  const completedChecklistItems = card.checklists?.reduce(
    (acc, checklist) => acc + checklist.itens.filter((item) => item.concluido).length,
    0
  ) || 0;

  const isOverdue = card.dataVencimento &&
    new Date(card.dataVencimento) < new Date() &&
    card.status !== 'concluido';

  return (
    <Draggable draggableId={card.cardId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer p-3 ${getPriorityColor(
            card.prioridade
          )} ${snapshot.isDragging ? 'shadow-2xl rotate-3' : ''}`}
        >
          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {card.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-xs bg-[var(--primary)] bg-opacity-10 text-[var(--primary)] rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Título com ícone de prioridade */}
          <div className="flex items-start gap-2 mb-2">
            {getPriorityIcon(card.prioridade)}
            <h4 className="text-sm font-medium text-[var(--content-primary)] flex-1">{card.nome}</h4>
          </div>

          {/* Descrição (preview) */}
          {card.descricao && (
            <div className="flex items-start gap-1 mb-2">
              <AiOutlineFileText className="text-[var(--content-tertiary)] text-xs mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[var(--content-secondary)] line-clamp-2">
                {card.descricao}
              </p>
            </div>
          )}

          {/* Status Badge */}
          <div className="mb-2">
            <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 w-fit ${getStatusColor(card.status)}`}>
              {getStatusIcon(card.status)}
              {card.status}
            </span>
          </div>

          {/* Metadata Icons */}
          <div className="flex items-center gap-3 text-xs text-[var(--content-tertiary)]">
            {/* Data de vencimento */}
            {card.dataVencimento && (
              <div
                className={`flex items-center gap-1 ${
                  isOverdue ? 'text-[var(--error)] font-semibold' : ''
                }`}
              >
                <FiClock />
                <span>{dayjs(card.dataVencimento).format('DD/MM')}</span>
              </div>
            )}

            {/* Checklists */}
            {totalChecklistItems > 0 && (
              <div
                className={`flex items-center gap-1 ${
                  completedChecklistItems === totalChecklistItems
                    ? 'text-[var(--success)]'
                    : ''
                }`}
              >
                <FiCheckSquare />
                <span>
                  {completedChecklistItems}/{totalChecklistItems}
                </span>
              </div>
            )}

            {/* Comentários */}
            {card.comentarios && card.comentarios.length > 0 && (
              <div className="flex items-center gap-1">
                <FiMessageSquare />
                <span>{card.comentarios.length}</span>
              </div>
            )}

            {/* Anexos */}
            {card.anexos && card.anexos.length > 0 && (
              <div className="flex items-center gap-1">
                <FiPaperclip />
                <span>{card.anexos.length}</span>
              </div>
            )}
          </div>

          {/* Responsável */}
          {card.responsavelNome && (
            <div className="mt-2 flex items-center gap-2">
              <div className="w-6 h-6 bg-[var(--primary)] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {card.responsavelNome.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-[var(--content-secondary)]">{card.responsavelNome}</span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
