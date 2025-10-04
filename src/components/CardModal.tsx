'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/types';
import { updateCard, deleteCard } from '@/services/firestore.service';
import { useAuth } from '@/contexts/AuthContext';
import {
  AiOutlineClose,
  AiOutlineCheckSquare,
  AiOutlineClockCircle,
  AiOutlineUser,
  AiOutlineTag,
  AiOutlineFileText,
} from 'react-icons/ai';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';
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

  const handleQuickUpdate = async (field: string, value: any) => {
    try {
      await updateCard(card.cardId, { [field]: value });
    } catch (error) {
      console.error('Erro ao atualizar card:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={cardData.nome}
                onChange={(e) => setCardData({ ...cardData, nome: e.target.value })}
                className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none w-full"
                autoFocus
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900">{card.nome}</h2>
            )}
            <p className="text-sm text-gray-500 mt-1">
              na lista{' '}
              <span className="font-medium">Lista</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition"
          >
            <AiOutlineClose className="text-xl text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status, Prioridade, Tipo */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={cardData.status}
                onChange={(e) => {
                  const newStatus = e.target.value as any;
                  setCardData({ ...cardData, status: newStatus });
                  handleQuickUpdate('status', newStatus);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="aberto">Aberto</option>
                <option value="em-progresso">Em Progresso</option>
                <option value="em-revisao">Em Revisão</option>
                <option value="bloqueado">Bloqueado</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <select
                value={cardData.prioridade}
                onChange={(e) => {
                  const newPrioridade = e.target.value as any;
                  setCardData({ ...cardData, prioridade: newPrioridade });
                  handleQuickUpdate('prioridade', newPrioridade);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo
              </label>
              <select
                value={cardData.tipo}
                onChange={(e) => {
                  const newTipo = e.target.value as any;
                  setCardData({ ...cardData, tipo: newTipo });
                  handleQuickUpdate('tipo', newTipo);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Pontos de história (Scrum)"
            />
          </div>

          {/* Descrição */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <AiOutlineFileText />
                Descrição
              </label>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Editar
                </button>
              )}
            </div>
            {isEditing ? (
              <div>
                <textarea
                  value={cardData.descricao}
                  onChange={(e) => setCardData({ ...cardData, descricao: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={6}
                  placeholder="Adicione uma descrição mais detalhada..."
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
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
                      });
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-md min-h-[100px]">
                {card.descricao || 'Nenhuma descrição fornecida.'}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 mb-1">Criado por</p>
              <p className="font-medium">{card.criadoPorNome || 'Desconhecido'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Criado em</p>
              <p className="font-medium">
                {dayjs(card.createdAt.toDate()).format('DD/MM/YYYY HH:mm')}
              </p>
            </div>
            {card.dataVencimento && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Vencimento</p>
                <p className="font-medium">
                  {dayjs(card.dataVencimento.toDate()).format('DD/MM/YYYY')}
                </p>
              </div>
            )}
            {card.responsavelNome && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Responsável</p>
                <p className="font-medium">{card.responsavelNome}</p>
              </div>
            )}
          </div>

          {/* Checklists */}
          {card.checklists && card.checklists.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <AiOutlineCheckSquare />
                Checklists
              </h3>
              <div className="space-y-4">
                {card.checklists.map((checklist) => {
                  const total = checklist.itens.length;
                  const completed = checklist.itens.filter((item) => item.concluido).length;
                  const percentage = total > 0 ? (completed / total) * 100 : 0;

                  return (
                    <div key={checklist.checklistId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{checklist.titulo}</h4>
                        <span className="text-sm text-gray-600">
                          {completed}/{total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
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
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span
                              className={`text-sm ${
                                item.concluido ? 'line-through text-gray-500' : 'text-gray-900'
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
              <h3 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <AiOutlineTag />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {card.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition"
          >
            <FiTrash2 />
            Excluir cartão
          </button>
          <div className="text-sm text-gray-500">
            Última atualização: {dayjs(card.updatedAt.toDate()).format('DD/MM/YYYY HH:mm')}
          </div>
        </div>
      </div>
    </div>
  );
}
