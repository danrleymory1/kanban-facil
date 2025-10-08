'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sprint, Board } from '@/types';
import {
  getBoardSprints,
  subscribeToBoardSprints,
  getBoard,
  deleteSprint,
} from '@/services/api.service';
import { AiOutlineArrowLeft, AiOutlinePlus, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiCalendar, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import { MdDirectionsRun } from 'react-icons/md';
import dayjs from 'dayjs';
import Link from 'next/link';
import CreateSprintModal from '@/components/CreateSprintModal';

export default function SprintsPage() {
  const router = useRouter();
  const params = useParams();
  const boardId = params.boardId as string;
  const { user } = useAuth();

  const [board, setBoard] = useState<Board | null>(null);
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadBoard();
    loadSprints();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToBoardSprints(boardId, (updatedSprints) => {
      setSprints(updatedSprints);
    });

    return () => unsubscribe();
  }, [user, boardId]);

  const loadBoard = async () => {
    try {
      const boardData = await getBoard(boardId);
      setBoard(boardData);
    } catch (error) {
      console.error('Erro ao carregar board:', error);
    }
  };

  const loadSprints = async () => {
    try {
      setLoading(true);
      const sprintsData = await getBoardSprints(boardId);
      setSprints(sprintsData);
    } catch (error) {
      console.error('Erro ao carregar sprints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSprint = async (sprintId: string) => {
    if (!confirm('Tem certeza que deseja excluir este sprint?')) return;

    try {
      await deleteSprint(sprintId);
    } catch (error) {
      console.error('Erro ao excluir sprint:', error);
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planejamento':
        return 'Planejamento';
      case 'ativo':
        return 'Ativo';
      case 'em-revisao':
        return 'Em Revisão';
      case 'concluido':
        return 'Concluído';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/board/${boardId}`}
                className="p-2 hover:bg-gray-100 rounded-md transition"
              >
                <AiOutlineArrowLeft className="text-xl text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <MdDirectionsRun className="text-blue-600" />
                  Sprints - {board?.nome}
                </h1>
                <p className="text-sm text-gray-600">Gerenciamento de Sprints Scrum</p>
              </div>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <AiOutlinePlus />
              Novo Sprint
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-600" />
          </div>
        ) : sprints.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <MdDirectionsRun className="mx-auto text-6xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum sprint encontrado</h3>
            <p className="text-gray-600 mb-6">Comece criando seu primeiro sprint</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              <AiOutlinePlus />
              Criar Primeiro Sprint
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sprints.map((sprint) => (
              <div
                key={sprint.sprintId}
                className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => router.push(`/sprints/${boardId}/${sprint.sprintId}`)}
              >
                <div className="p-6">
                  {/* Sprint Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {sprint.nome}
                      </h3>
                      {sprint.numero && (
                        <p className="text-sm text-gray-500">Sprint #{sprint.numero}</p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        sprint.status
                      )}`}
                    >
                      {getStatusLabel(sprint.status)}
                    </span>
                  </div>

                  {/* Sprint Objetivo */}
                  {sprint.objetivo && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {sprint.objetivo}
                    </p>
                  )}

                  {/* Sprint Dates */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <FiCalendar />
                    <span>
                      {dayjs(sprint.dataInicio).format('DD/MM/YYYY')} -{' '}
                      {dayjs(sprint.dataFim).format('DD/MM/YYYY')}
                    </span>
                  </div>

                  {/* Sprint Metrics */}
                  {sprint.metrics && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <FiTrendingUp className="text-blue-600" />
                            <span>Story Points</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            {sprint.metrics.pontosCompletados || 0} /{' '}
                            {sprint.metrics.totalPontos || 0}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <FiCheckCircle className="text-green-600" />
                            <span>Cards</span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            {sprint.metrics.cardsCompletados || 0} /{' '}
                            {sprint.metrics.totalCards || 0}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-4">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{
                              width: `${
                                sprint.metrics.totalPontos
                                  ? (sprint.metrics.pontosCompletados /
                                      sprint.metrics.totalPontos) *
                                    100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sprint Actions */}
                <div className="border-t border-gray-200 px-6 py-3 flex items-center justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSprint(sprint.sprintId);
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Sprint Modal */}
      {showCreateModal && (
        <CreateSprintModal
          boardId={boardId}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}
