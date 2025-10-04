'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sprint, Card } from '@/types';
import {
  getSprint,
  updateSprint,
  updateSprintMetrics,
  getBoardCards,
} from '@/services/firestore.service';
import { AiOutlineArrowLeft, AiOutlineLoading3Quarters, AiOutlineEdit } from 'react-icons/ai';
import { FiCalendar, FiTrendingUp, FiCheckCircle, FiTarget } from 'react-icons/fi';
import { MdSprint } from 'react-icons/md';
import dayjs from 'dayjs';
import Link from 'next/link';
import BurndownChart from '@/components/BurndownChart';
import DailyNotesSection from '@/components/DailyNotesSection';
import RetrospectiveSection from '@/components/RetrospectiveSection';
import SprintCardsSection from '@/components/SprintCardsSection';

export default function SprintDetailPage() {
  const router = useRouter();
  const params = useParams();
  const boardId = params.boardId as string;
  const sprintId = params.sprintId as string;
  const { user } = useAuth();

  const [sprint, setSprint] = useState<Sprint | null>(null);
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'cards' | 'daily' | 'retro'>('overview');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadData();
  }, [user, sprintId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sprintData, cardsData] = await Promise.all([
        getSprint(sprintId),
        getBoardCards(boardId),
      ]);

      if (!sprintData) {
        router.push(`/sprints/${boardId}`);
        return;
      }

      setSprint(sprintData);
      setAllCards(cardsData);

      // Update metrics
      await updateSprintMetrics(sprintId);
    } catch (error) {
      console.error('Erro ao carregar sprint:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!sprint) return;

    try {
      await updateSprint(sprintId, { status: newStatus as any });
      setSprint({ ...sprint, status: newStatus as any });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planejamento':
        return 'bg-gray-100 text-gray-800';
      case 'ativo':
        return 'bg-blue-100 text-blue-800';
      case 'em-revisao':
        return 'bg-purple-100 text-purple-800';
      case 'concluido':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (!sprint) return null;

  const sprintCards = allCards.filter((card) => sprint.cardsIds?.includes(card.cardId));
  const availableCards = allCards.filter((card) => !sprint.cardsIds?.includes(card.cardId));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href={`/sprints/${boardId}`}
              className="p-2 hover:bg-gray-100 rounded-md transition"
            >
              <AiOutlineArrowLeft className="text-xl text-gray-600" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MdSprint className="text-blue-600" />
                {sprint.nome}
                {sprint.numero && (
                  <span className="text-gray-500 text-lg">#{sprint.numero}</span>
                )}
              </h1>
              {sprint.objetivo && (
                <p className="text-sm text-gray-600 mt-1">{sprint.objetivo}</p>
              )}
            </div>

            <select
              value={sprint.status}
              onChange={(e) => handleUpdateStatus(e.target.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                sprint.status
              )}`}
            >
              <option value="planejamento">Planejamento</option>
              <option value="ativo">Ativo</option>
              <option value="em-revisao">Em Revisão</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          {/* Sprint Info Bar */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FiCalendar />
              <span>
                {dayjs(sprint.dataInicio.toDate()).format('DD/MM/YYYY')} -{' '}
                {dayjs(sprint.dataFim.toDate()).format('DD/MM/YYYY')}
              </span>
            </div>

            {sprint.metrics && (
              <>
                <div className="flex items-center gap-2">
                  <FiTrendingUp className="text-blue-600" />
                  <span>
                    {sprint.metrics.pontosCompletados || 0} / {sprint.metrics.totalPontos || 0}{' '}
                    pontos
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-green-600" />
                  <span>
                    {sprint.metrics.cardsCompletados || 0} / {sprint.metrics.totalCards || 0}{' '}
                    cards
                  </span>
                </div>
              </>
            )}

            {sprint.metaPontos && (
              <div className="flex items-center gap-2">
                <FiTarget className="text-purple-600" />
                <span>Meta: {sprint.metaPontos} pontos</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                activeTab === 'cards'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Cards do Sprint
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                activeTab === 'daily'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Daily Notes
            </button>
            <button
              onClick={() => setActiveTab('retro')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                activeTab === 'retro'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Retrospectiva
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Burndown Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Burndown Chart</h2>
              <BurndownChart sprint={sprint} />
            </div>

            {/* Sprint Description */}
            {sprint.descricao && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Descrição</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{sprint.descricao}</p>
              </div>
            )}

            {/* Sprint Progress */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Progresso</h2>
              <div className="space-y-4">
                {/* Story Points Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Story Points</span>
                    <span className="text-sm text-gray-600">
                      {sprint.metrics?.pontosCompletados || 0} /{' '}
                      {sprint.metrics?.totalPontos || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{
                        width: `${
                          sprint.metrics?.totalPontos
                            ? (sprint.metrics.pontosCompletados / sprint.metrics.totalPontos) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>

                {/* Cards Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Cards</span>
                    <span className="text-sm text-gray-600">
                      {sprint.metrics?.cardsCompletados || 0} /{' '}
                      {sprint.metrics?.totalCards || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all"
                      style={{
                        width: `${
                          sprint.metrics?.totalCards
                            ? (sprint.metrics.cardsCompletados / sprint.metrics.totalCards) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cards' && (
          <SprintCardsSection
            sprint={sprint}
            sprintCards={sprintCards}
            availableCards={availableCards}
            onUpdate={loadData}
          />
        )}

        {activeTab === 'daily' && (
          <DailyNotesSection sprint={sprint} onUpdate={loadData} />
        )}

        {activeTab === 'retro' && (
          <RetrospectiveSection sprint={sprint} onUpdate={loadData} />
        )}
      </main>
    </div>
  );
}
