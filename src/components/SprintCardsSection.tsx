'use client';

import { useState } from 'react';
import { Sprint, Card } from '@/types';
import { updateSprint, updateSprintMetrics } from '@/services/firestore.service';
import { AiOutlinePlus, AiOutlineMinus, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiCheckCircle, FiClock } from 'react-icons/fi';
import dayjs from 'dayjs';

interface SprintCardsSectionProps {
  sprint: Sprint;
  sprintCards: Card[];
  availableCards: Card[];
  onUpdate: () => void;
}

export default function SprintCardsSection({
  sprint,
  sprintCards,
  availableCards,
  onUpdate,
}: SprintCardsSectionProps) {
  const [loading, setLoading] = useState(false);
  const [showAvailableCards, setShowAvailableCards] = useState(false);

  const handleAddCard = async (cardId: string) => {
    try {
      setLoading(true);
      const updatedCardsIds = [...(sprint.cardsIds || []), cardId];
      await updateSprint(sprint.sprintId, { cardsIds: updatedCardsIds });
      await updateSprintMetrics(sprint.sprintId);
      onUpdate();
    } catch (error) {
      console.error('Erro ao adicionar card ao sprint:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCard = async (cardId: string) => {
    try {
      setLoading(true);
      const updatedCardsIds = (sprint.cardsIds || []).filter((id) => id !== cardId);
      await updateSprint(sprint.sprintId, { cardsIds: updatedCardsIds });
      await updateSprintMetrics(sprint.sprintId);
      onUpdate();
    } catch (error) {
      console.error('Erro ao remover card do sprint:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'baixa':
        return 'border-l-4 border-green-500';
      case 'media':
        return 'border-l-4 border-yellow-500';
      case 'alta':
        return 'border-l-4 border-orange-500';
      case 'urgente':
        return 'border-l-4 border-red-500';
      default:
        return 'border-l-4 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aberto':
        return 'bg-gray-100 text-gray-800';
      case 'em-progresso':
        return 'bg-blue-100 text-blue-800';
      case 'em-revisao':
        return 'bg-purple-100 text-purple-800';
      case 'bloqueado':
        return 'bg-red-100 text-red-800';
      case 'concluido':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aberto':
        return 'Aberto';
      case 'em-progresso':
        return 'Em Progresso';
      case 'em-revisao':
        return 'Em Revisão';
      case 'bloqueado':
        return 'Bloqueado';
      case 'concluido':
        return 'Concluído';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sprint Cards */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Cards no Sprint ({sprintCards.length})
          </h2>
          <button
            onClick={() => setShowAvailableCards(!showAvailableCards)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <AiOutlinePlus />
            Adicionar Cards
          </button>
        </div>

        {sprintCards.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum card adicionado ao sprint ainda</p>
            <button
              onClick={() => setShowAvailableCards(true)}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              Adicionar cards agora
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sprintCards.map((card) => (
              <div
                key={card.cardId}
                className={`bg-white rounded-lg shadow-sm hover:shadow-md transition p-4 ${getPriorityColor(
                  card.prioridade
                )}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">{card.nome}</h3>

                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                          card.status
                        )}`}
                      >
                        {getStatusLabel(card.status)}
                      </span>

                      {card.storyPoints && (
                        <span className="text-gray-600 font-medium">
                          {card.storyPoints} pts
                        </span>
                      )}

                      {card.dataVencimento && (
                        <div
                          className={`flex items-center gap-1 ${
                            dayjs(card.dataVencimento.toDate()).isBefore(dayjs()) &&
                            card.status !== 'concluido'
                              ? 'text-red-600'
                              : 'text-gray-600'
                          }`}
                        >
                          <FiClock />
                          <span>{dayjs(card.dataVencimento.toDate()).format('DD/MM/YYYY')}</span>
                        </div>
                      )}

                      {card.responsavelNome && (
                        <span className="text-gray-600">👤 {card.responsavelNome}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveCard(card.cardId)}
                    disabled={loading}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-md transition disabled:opacity-50"
                  >
                    <AiOutlineMinus />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Cards */}
      {showAvailableCards && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Cards Disponíveis ({availableCards.length})
            </h2>
            <button
              onClick={() => setShowAvailableCards(false)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Fechar
            </button>
          </div>

          {availableCards.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Todos os cards já foram adicionados ao sprint</p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableCards.map((card) => (
                <div
                  key={card.cardId}
                  className={`bg-white rounded-lg shadow-sm hover:shadow-md transition p-4 ${getPriorityColor(
                    card.prioridade
                  )}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">{card.nome}</h3>

                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            card.status
                          )}`}
                        >
                          {getStatusLabel(card.status)}
                        </span>

                        {card.storyPoints && (
                          <span className="text-gray-600 font-medium">
                            {card.storyPoints} pts
                          </span>
                        )}

                        {card.dataVencimento && (
                          <div
                            className={`flex items-center gap-1 ${
                              dayjs(card.dataVencimento.toDate()).isBefore(dayjs()) &&
                              card.status !== 'concluido'
                                ? 'text-red-600'
                                : 'text-gray-600'
                            }`}
                          >
                            <FiClock />
                            <span>{dayjs(card.dataVencimento.toDate()).format('DD/MM/YYYY')}</span>
                          </div>
                        )}

                        {card.responsavelNome && (
                          <span className="text-gray-600">👤 {card.responsavelNome}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddCard(card.cardId)}
                      disabled={loading}
                      className="ml-4 p-2 text-green-600 hover:bg-green-50 rounded-md transition disabled:opacity-50"
                    >
                      {loading ? <AiOutlineLoading3Quarters className="animate-spin" /> : <AiOutlinePlus />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
