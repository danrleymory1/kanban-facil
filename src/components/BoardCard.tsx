'use client';

import { Draggable } from '@hello-pangea/dnd';
import { Card } from '@/types';
import { FiClock, FiCheckSquare, FiPaperclip, FiMessageSquare } from 'react-icons/fi';
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
        return 'border-l-4 border-red-500';
      case 'alta':
        return 'border-l-4 border-orange-500';
      case 'media':
        return 'border-l-4 border-yellow-500';
      case 'baixa':
        return 'border-l-4 border-green-500';
      default:
        return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'bg-green-100 text-green-800';
      case 'em-progresso':
        return 'bg-blue-100 text-blue-800';
      case 'em-revisao':
        return 'bg-purple-100 text-purple-800';
      case 'bloqueado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    card.dataVencimento.toDate() < new Date() &&
    card.status !== 'concluido';

  return (
    <Draggable draggableId={card.cardId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`bg-white rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer p-3 ${getPriorityColor(
            card.prioridade
          )} ${snapshot.isDragging ? 'shadow-2xl rotate-3' : ''}`}
        >
          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {card.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Título */}
          <h4 className="text-sm font-medium text-gray-900 mb-2">{card.nome}</h4>

          {/* Descrição (preview) */}
          {card.descricao && (
            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
              {card.descricao}
            </p>
          )}

          {/* Status Badge */}
          <div className="mb-2">
            <span className={`text-xs px-2 py-1 rounded ${getStatusColor(card.status)}`}>
              {card.status}
            </span>
          </div>

          {/* Metadata Icons */}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {/* Data de vencimento */}
            {card.dataVencimento && (
              <div
                className={`flex items-center gap-1 ${
                  isOverdue ? 'text-red-600 font-semibold' : ''
                }`}
              >
                <FiClock />
                <span>{dayjs(card.dataVencimento.toDate()).format('DD/MM')}</span>
              </div>
            )}

            {/* Checklists */}
            {totalChecklistItems > 0 && (
              <div
                className={`flex items-center gap-1 ${
                  completedChecklistItems === totalChecklistItems
                    ? 'text-green-600'
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
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                {card.responsavelNome.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-gray-600">{card.responsavelNome}</span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
