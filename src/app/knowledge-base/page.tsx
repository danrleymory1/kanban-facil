'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import {
  AiOutlineBook,
  AiOutlinePlus,
  AiOutlineSearch,
  AiOutlineTag,
  AiOutlineClockCircle,
  AiOutlineEdit,
  AiOutlineDelete
} from 'react-icons/ai';
import { MdArticle } from 'react-icons/md';

interface KnowledgeBase {
  knowledgeBaseId: string;
  titulo: string;
  conteudo: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default function KnowledgeBasePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [articles, setArticles] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newArticle, setNewArticle] = useState({ titulo: '', tags: '' });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadArticles();
    }
  }, [user, authLoading, router]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/knowledge-base?userId=${user?.uid}`);
      if (response.ok) {
        const data = await response.json();
        setArticles(data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar artigos:', error);
    } finally {
      setLoading(false);
    }
  };

  const createArticle = async () => {
    if (!newArticle.titulo.trim()) return;

    try {
      const response = await fetch('/api/knowledge-base', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid,
          titulo: newArticle.titulo,
          conteudo: '',
          tags: newArticle.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        const article = await response.json();
        router.push(`/knowledge-base/${article.knowledgeBaseId}`);
      }
    } catch (error) {
      console.error('Erro ao criar artigo:', error);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!confirm('Deseja realmente excluir este artigo?')) return;

    try {
      await fetch(`/api/knowledge-base?knowledgeBaseId=${id}`, {
        method: 'DELETE',
      });
      loadArticles();
    } catch (error) {
      console.error('Erro ao deletar artigo:', error);
    }
  };

  const filteredArticles = articles.filter(article =>
    article.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface-primary)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
          <p className="mt-4 text-[var(--content-secondary)]">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface-primary)]">
      {/* Header */}
      <header className="bg-[var(--surface-elevated)] border-b border-[var(--border-primary)] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AiOutlineBook className="text-3xl text-[var(--primary)]" />
            <h1 className="text-2xl font-bold text-[var(--content-primary)]">
              Base de Conhecimento
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-[var(--content-secondary)] hover:text-[var(--content-primary)] transition"
            >
              Dashboard
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Create */}
        <div className="mb-8 flex gap-4">
          <div className="flex-1 relative">
            <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--content-tertiary)]" />
            <input
              type="text"
              placeholder="Buscar artigos ou tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--content-primary)] placeholder-[var(--content-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition"
          >
            <AiOutlinePlus />
            Novo Artigo
          </button>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-[var(--surface-secondary)] rounded-lg">
            <MdArticle className="mx-auto text-6xl text-[var(--content-tertiary)] mb-4" />
            <h3 className="text-lg font-medium text-[var(--content-primary)] mb-2">
              {searchTerm ? 'Nenhum artigo encontrado' : 'Nenhum artigo criado'}
            </h3>
            <p className="text-[var(--content-secondary)] mb-6">
              {searchTerm
                ? 'Tente buscar por outros termos'
                : 'Comece criando seu primeiro artigo de conhecimento'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition"
              >
                <AiOutlinePlus />
                Criar Primeiro Artigo
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article.knowledgeBaseId}
                className="bg-[var(--surface-elevated)] border border-[var(--border-primary)] rounded-lg p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <Link
                    href={`/knowledge-base/${article.knowledgeBaseId}`}
                    className="flex-1"
                  >
                    <h3 className="text-lg font-semibold text-[var(--content-primary)] hover:text-[var(--primary)] line-clamp-2">
                      {article.titulo}
                    </h3>
                  </Link>
                  <div className="flex gap-2 ml-2">
                    <Link
                      href={`/knowledge-base/${article.knowledgeBaseId}`}
                      className="p-2 text-[var(--content-secondary)] hover:text-[var(--primary)] transition"
                    >
                      <AiOutlineEdit />
                    </Link>
                    <button
                      onClick={() => deleteArticle(article.knowledgeBaseId)}
                      className="p-2 text-[var(--content-secondary)] hover:text-[var(--error)] transition"
                    >
                      <AiOutlineDelete />
                    </button>
                  </div>
                </div>

                <p className="text-[var(--content-secondary)] text-sm line-clamp-3 mb-4">
                  {article.conteudo || 'Sem conteúdo'}
                </p>

                {article.tags.length > 0 && (
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <AiOutlineTag className="text-[var(--content-tertiary)]" />
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-[var(--surface-tertiary)] text-[var(--content-secondary)] rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {article.tags.length > 3 && (
                      <span className="text-xs text-[var(--content-tertiary)]">
                        +{article.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-[var(--content-tertiary)]">
                  <AiOutlineClockCircle />
                  {new Date(article.updatedAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--surface-primary)] rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-[var(--content-primary)] mb-4">
              Novo Artigo
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--content-primary)] mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={newArticle.titulo}
                  onChange={(e) => setNewArticle({ ...newArticle, titulo: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--content-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]"
                  placeholder="Digite o título do artigo"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--content-primary)] mb-2">
                  Tags (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={newArticle.tags}
                  onChange={(e) => setNewArticle({ ...newArticle, tags: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--content-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]"
                  placeholder="React, TypeScript, Tutorial"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-[var(--surface-secondary)] text-[var(--content-primary)] rounded-lg hover:bg-[var(--surface-tertiary)] transition"
              >
                Cancelar
              </button>
              <button
                onClick={createArticle}
                disabled={!newArticle.titulo.trim()}
                className="flex-1 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
