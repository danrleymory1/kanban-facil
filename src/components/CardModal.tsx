'use client';

import { useState, useEffect } from 'react';
import { Card, StatusCardType, PrioridadeType, TipoAtividadeType } from '@/types';
import { updateCard, deleteCard } from '@/services/api.service';
import { useAuth } from '@/contexts/AuthContext';
import CommentSection from '@/components/comments/CommentSection';
import {
  AiOutlineClose,
  AiOutlineCheckSquare,
  AiOutlineClockCircle,
  AiOutlineUser,
  AiOutlineTag,
  AiOutlineFileText,
  AiOutlineSave,
} from 'react-icons/ai';
import { FiTrash2, FiEdit2, FiAlertTriangle, FiArrowUp, FiMinus, FiArrowDown } from 'react-icons/fi';
import { MdPlayCircleOutline, MdCheckCircle, MdRemoveRedEye, MdBlock, MdPerson, MdAccessTime } from 'react-icons/md';
import dayjs from 'dayjs';

interface CardModalProps {
  card: Card;
  onClose: () => void;
  boardId: string;
}

export default function CardModal({ card, onClose, boardId }: CardModalProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [cardData, setCardData] = useState({
    nome: card.nome,
    descricao: card.descricao || '',
    prioridade: card.prioridade,
    status: card.status,
    tipo: card.tipo,
    storyPoints: card.storyPoints,
  });
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    // Prevent scrolling quando modal está aberto
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateCard(card.cardId, cardData);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar card:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este cartão?')) return;

    try {
      await deleteCard(card.cardId);
      onClose();
    } catch (error) {
      console.error('Erro ao excluir card:', error);
    }
  };

  const handleQuickUpdate = async (field: string, value: string | number | boolean | Date | string[]) => {
    try {
      await updateCard(card.cardId, { [field]: value });
    } catch (error) {
      console.error('Erro ao atualizar card:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border-primary)] flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={cardData.nome}
                onChange={(e) => setCardData({ ...cardData, nome: e.target.value })}
                className="text-2xl font-bold text-[var(--content-primary)] bg-[var(--surface-secondary)] border-b-2 border-[var(--primary)] focus:outline-none w-full px-2 py-1"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-3">
                {getPriorityIcon(card.prioridade)}
                <h2 className="text-2xl font-bold text-[var(--content-primary)]">{card.nome}</h2>
              </div>
            )}
            <p className="text-sm text-[var(--content-secondary)] mt-1">
              na lista{' '}
              <span className="font-medium">Lista</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--surface-secondary)] rounded-md transition"
          >
            <AiOutlineClose className="text-xl text-[var(--content-secondary)]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status, Prioridade, Tipo */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--content-secondary)] mb-2">
                <MdPlayCircleOutline />
                Status
              </label>
              <select
                value={cardData.status}
                onChange={(e) => {
                  const newStatus = e.target.value as StatusCardType;
                  setCardData({ ...cardData, status: newStatus });
                  handleQuickUpdate('status', newStatus);
                }}
                className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] text-[var(--content-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="aberto">Aberto</option>
                <option value="em-progresso">Em Progresso</option>
                <option value="em-revisao">Em Revisão</option>
                <option value="bloqueado">Bloqueado</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--content-secondary)] mb-2">
                {getPriorityIcon(cardData.prioridade)}
                Prioridade
              </label>
              <select
                value={cardData.prioridade}
                onChange={(e) => {
                  const newPrioridade = e.target.value as PrioridadeType;
                  setCardData({ ...cardData, prioridade: newPrioridade });
                  handleQuickUpdate('prioridade', newPrioridade);
                }}
                className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] text-[var(--content-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--content-secondary)] mb-2">
                <AiOutlineTag />
                Tipo
              </label>
              <select
                value={cardData.tipo}
                onChange={(e) => {
                  const newTipo = e.target.value as TipoAtividadeType;
                  setCardData({ ...cardData, tipo: newTipo });
                  handleQuickUpdate('tipo', newTipo);
                }}
                className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] text-[var(--content-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="feature">Feature</option>
                <option value="bug">Bug</option>
                <option value="melhoria">Melhoria</option>
                <option value="documentacao">Documentação</option>
                <option value="teste">Teste</option>
                <option value="refatoracao">Refatoração</option>
              </select>
            </div>
          </div>

          {/* Story Points */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-[var(--content-secondary)] mb-2">
              <AiOutlineCheckSquare />
              Story Points
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={cardData.storyPoints || ''}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : undefined;
                setCardData({ ...cardData, storyPoints: value });
                handleQuickUpdate('storyPoints', value);
              }}
              className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] text-[var(--content-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="Pontos de história (Scrum)"
            />
          </div>

          {/* Descrição */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--content-secondary)]">
                <AiOutlineFileText />
                Descrição
              </label>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 text-sm text-[var(--primary)] hover:opacity-80"
                >
                  <FiEdit2 />
                  Editar
                </button>
              )}
            </div>
            {isEditing ? (
              <div>
                <textarea
                  value={cardData.descricao}
                  onChange={(e) => setCardData({ ...cardData, descricao: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] text-[var(--content-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                  rows={6}
                  placeholder="Adicione uma descrição mais detalhada..."
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:opacity-90 disabled:opacity-50"
                  >
                    <AiOutlineSave />
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setCardData({
                        nome: card.nome,
                        descricao: card.descricao || '',
                        prioridade: card.prioridade,
                        status: card.status,
                        tipo: card.tipo,
                        storyPoints: card.storyPoints,
                      });
                    }}
                    className="px-4 py-2 text-[var(--content-secondary)] hover:bg-[var(--surface-secondary)] rounded-md"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-[var(--content-primary)] whitespace-pre-wrap bg-[var(--surface-secondary)] p-4 rounded-md min-h-[100px] border border-[var(--border-secondary)]">
                {card.descricao || 'Nenhuma descrição fornecida.'}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-[var(--surface-secondary)] border border-[var(--border-secondary)] rounded-lg">
            <div>
              <p className="flex items-center gap-2 text-sm text-[var(--content-tertiary)] mb-1">
                <MdPerson />
                Criado por
              </p>
              <p className="font-medium text-[var(--content-primary)]">{card.criadoPorNome || 'Desconhecido'}</p>
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm text-[var(--content-tertiary)] mb-1">
                <MdAccessTime />
                Criado em
              </p>
              <p className="font-medium text-[var(--content-primary)]">
                {dayjs(card.createdAt).format('DD/MM/YYYY HH:mm')}
              </p>
            </div>
            {card.dataVencimento && (
              <div>
                <p className="flex items-center gap-2 text-sm text-[var(--content-tertiary)] mb-1">
                  <AiOutlineClockCircle />
                  Vencimento
                </p>
                <p className="font-medium text-[var(--content-primary)]">
                  {dayjs(card.dataVencimento).format('DD/MM/YYYY')}
                </p>
              </div>
            )}
            {card.responsavelNome && (
              <div>
                <p className="flex items-center gap-2 text-sm text-[var(--content-tertiary)] mb-1">
                  <AiOutlineUser />
                  Responsável
                </p>
                <p className="font-medium text-[var(--content-primary)]">{card.responsavelNome}</p>
              </div>
            )}
          </div>

          {/* Checklists */}
          {card.checklists && card.checklists.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium text-[var(--content-secondary)] mb-3">
                <AiOutlineCheckSquare />
                Checklists
              </h3>
              <div className="space-y-4">
                {card.checklists.map((checklist) => {
                  const total = checklist.itens.length;
                  const completed = checklist.itens.filter((item) => item.concluido).length;
                  const percentage = total > 0 ? (completed / total) * 100 : 0;

                  return (
                    <div key={checklist.checklistId} className="border border-[var(--border-primary)] bg-[var(--surface-secondary)] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-[var(--content-primary)]">{checklist.titulo}</h4>
                        <span className="text-sm text-[var(--content-tertiary)]">
                          {completed}/{total}
                        </span>
                      </div>
                      <div className="w-full bg-[var(--surface-tertiary)] rounded-full h-2 mb-3">
                        <div
                          className="bg-[var(--primary)] h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="space-y-2">
                        {checklist.itens.map((item) => (
                          <div key={item.itemId} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={item.concluido}
                              readOnly
                              className="w-4 h-4 accent-[var(--primary)] rounded"
                            />
                            <span
                              className={`text-sm ${
                                item.concluido ? 'line-through text-[var(--content-tertiary)]' : 'text-[var(--content-primary)]'
                              }`}
                            >
                              {item.texto}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium text-[var(--content-secondary)] mb-3">
                <AiOutlineTag />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-[var(--primary)] bg-opacity-10 text-[var(--primary)] border border-[var(--primary)] border-opacity-20 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="p-6 border-t border-[var(--border-primary)]">
          <CommentSection cardId={card.cardId} />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--border-primary)] flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-[var(--error)] hover:bg-[var(--error)] hover:bg-opacity-10 rounded-md transition"
          >
            <FiTrash2 />
            Excluir cartão
          </button>
          <div className="flex items-center gap-2 text-sm text-[var(--content-tertiary)]">
            <MdAccessTime />
            <span>Última atualização: {dayjs(card.updatedAt).format('DD/MM/YYYY HH:mm')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
