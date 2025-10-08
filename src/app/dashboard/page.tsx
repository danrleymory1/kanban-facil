'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserBoards, createBoard, deleteBoard } from '@/services/api.service';
import { logoutUser } from '@/services/auth.service';
import { Board } from '@/types';
import { AiOutlineLoading3Quarters, AiOutlinePlus } from 'react-icons/ai';
import { FiLogOut, FiTrash2 } from 'react-icons/fi';
import { MdDashboard, MdPeople, MdBook } from 'react-icons/md';
import { HiViewBoards } from 'react-icons/hi';
import { AiOutlineRocket } from 'react-icons/ai';
import ThemeToggle from '@/components/ThemeToggle';
import NotificationBell from '@/components/NotificationBell';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDesc, setNewBoardDesc] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadBoards();
    }
  }, [user]);

  const loadBoards = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userBoards = await getUserBoards(user.uid);
      setBoards(userBoards);
    } catch (error) {
      console.error('Erro ao carregar quadros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async () => {
    if (!user || !newBoardName.trim()) return;

    try {
      setCreating(true);
      const userName = user.displayName || user.email || 'Usuário Anônimo';
      await createBoard(user.uid, newBoardName, newBoardDesc, userName);
      setNewBoardName('');
      setNewBoardDesc('');
      setShowCreateModal(false);
      await loadBoards();
    } catch (error) {
      console.error('Erro ao criar quadro:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    if (!confirm('Tem certeza que deseja excluir este quadro?')) return;

    try {
      await deleteBoard(boardId);
      await loadBoards();
    } catch (error) {
      console.error('Erro ao excluir quadro:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface-primary)]">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface-secondary)]">
      {/* Header */}
      <header className="bg-[var(--surface-primary)] shadow-sm border-b border-[var(--border-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <MdDashboard className="text-3xl text-[var(--primary)] mr-3" />
            <h1 className="text-2xl font-bold text-[var(--content-primary)]">Kanban Fácil</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[var(--content-secondary)]">
              Olá, {user?.displayName || user?.email}
            </span>
            <NotificationBell />
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-[var(--error)] hover:bg-[var(--surface-secondary)] rounded-md transition"
            >
              <FiLogOut />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => router.push('/knowledge-base')}
            className="flex items-center gap-4 p-4 bg-[var(--surface-primary)] border-2 border-[var(--border-primary)] rounded-lg hover:border-[var(--primary)] hover:shadow-lg transition-all text-left group"
          >
            <div className="p-3 bg-[var(--primary-light)] rounded-lg">
              <MdBook className="text-3xl text-[var(--primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--content-primary)] group-hover:text-[var(--primary)]">Base de Conhecimento</h3>
              <p className="text-sm text-[var(--content-tertiary)]">Artigos e documentação</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/sprints/' + (boards[0]?.boardId || ''))}
            disabled={boards.length === 0}
            className="flex items-center gap-4 p-4 bg-[var(--surface-primary)] border-2 border-[var(--border-primary)] rounded-lg hover:border-[var(--success)] hover:shadow-lg transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="p-3 bg-[var(--success-light)] rounded-lg">
              <AiOutlineRocket className="text-3xl text-[var(--success)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--content-primary)] group-hover:text-[var(--success)]">Sprints</h3>
              <p className="text-sm text-[var(--content-tertiary)]">Gerenciar sprints Scrum</p>
            </div>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-4 p-4 bg-[var(--surface-primary)] border-2 border-dashed border-[var(--border-secondary)] rounded-lg hover:border-[var(--primary)] hover:bg-[var(--surface-secondary)] transition-all text-left group"
          >
            <div className="p-3 bg-[var(--surface-secondary)] rounded-lg">
              <AiOutlinePlus className="text-3xl text-[var(--content-tertiary)] group-hover:text-[var(--primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--content-primary)] group-hover:text-[var(--primary)]">Novo Quadro</h3>
              <p className="text-sm text-[var(--content-tertiary)]">Criar novo projeto</p>
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <HiViewBoards className="text-3xl text-[var(--primary)]" />
            <h2 className="text-2xl font-bold text-[var(--content-primary)]">Meus Quadros</h2>
          </div>
        </div>

        {/* Boards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <div
              key={board.boardId}
              className="bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div
                onClick={() => router.push(`/board/${board.boardId}`)}
                className="p-6"
              >
                <div className="flex items-start gap-3 mb-3">
                  <MdDashboard className="text-2xl text-[var(--primary)] mt-1" />
                  <h3 className="text-xl font-semibold text-[var(--content-primary)] flex-1">
                    {board.nome}
                  </h3>
                </div>
                {board.descricao && (
                  <p className="text-[var(--content-secondary)] text-sm mb-4">{board.descricao}</p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-[var(--content-tertiary)]">
                    <MdPeople className="text-lg" />
                    <span>{board.membros?.length || 0} membro(s)</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBoard(board.boardId);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-[var(--error)] hover:opacity-80 transition"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {boards.length === 0 && (
          <div className="text-center py-12">
            <HiViewBoards className="text-6xl text-[var(--content-tertiary)] mx-auto mb-4" />
            <p className="text-[var(--content-secondary)] mb-4">
              Você ainda não tem nenhum quadro.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-[var(--primary)] hover:opacity-80 font-medium"
            >
              Criar seu primeiro quadro
            </button>
          </div>
        )}
      </main>

      {/* Create Board Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-[var(--content-primary)] mb-4">
              Criar Novo Quadro
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--content-secondary)] mb-1">
                  Nome do Quadro
                </label>
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] text-[var(--content-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="Ex: Projeto Website"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--content-secondary)] mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  value={newBoardDesc}
                  onChange={(e) => setNewBoardDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] text-[var(--content-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  placeholder="Descrição do quadro..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewBoardName('');
                  setNewBoardDesc('');
                }}
                className="flex-1 px-4 py-2 border border-[var(--border-primary)] text-[var(--content-secondary)] rounded-md hover:bg-[var(--surface-secondary)] transition"
                disabled={creating}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateBoard}
                className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={!newBoardName.trim() || creating}
              >
                {creating ? (
                  <AiOutlineLoading3Quarters className="animate-spin" />
                ) : (
                  'Criar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
