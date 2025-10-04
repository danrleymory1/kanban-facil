'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getUserBoards, createBoard, deleteBoard } from '@/services/firestore.service';
import { logoutUser } from '@/services/auth.service';
import { Board } from '@/types';
import { AiOutlineLoading3Quarters, AiOutlinePlus } from 'react-icons/ai';
import { FiLogOut, FiTrash2 } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';

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
      <div className="min-h-screen flex items-center justify-center">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <MdDashboard className="text-3xl text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Kanban Fácil</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              Olá, {user?.displayName || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition"
            >
              <FiLogOut />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Meus Quadros</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <AiOutlinePlus />
            Novo Quadro
          </button>
        </div>

        {/* Boards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <div
              key={board.boardId}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div
                onClick={() => router.push(`/board/${board.boardId}`)}
                className="p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {board.nome}
                </h3>
                {board.descricao && (
                  <p className="text-gray-600 text-sm mb-4">{board.descricao}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {board.membros?.length || 0} membro(s)
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBoard(board.boardId);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 transition"
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
            <p className="text-gray-600 mb-4">
              Você ainda não tem nenhum quadro.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Criar seu primeiro quadro
            </button>
          </div>
        )}
      </main>

      {/* Create Board Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Criar Novo Quadro
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Quadro
                </label>
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Projeto Website"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  value={newBoardDesc}
                  onChange={(e) => setNewBoardDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                disabled={creating}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateBoard}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
