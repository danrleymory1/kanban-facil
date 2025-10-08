'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ThemeToggle from '@/components/ThemeToggle';
import BackButton from '@/components/BackButton';
import {
  AiOutlineArrowLeft,
  AiOutlineSave,
  AiOutlineTag,
  AiOutlineLink,
  AiOutlineEye,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineClockCircle,
  AiOutlinePlus
} from 'react-icons/ai';
import { MdArticle } from 'react-icons/md';

// Importar editor Markdown dinamicamente (somente no cliente)
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false }
);

interface KnowledgeBase {
  knowledgeBaseId: string;
  userId: string;
  titulo: string;
  conteudo: string;
  tags: string[];
  linksRelacionados: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface RelatedArticle {
  knowledgeBaseId: string;
  titulo: string;
}

export default function KnowledgeBaseEditPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [article, setArticle] = useState<KnowledgeBase | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [availableArticles, setAvailableArticles] = useState<RelatedArticle[]>([]);
  const [newTag, setNewTag] = useState('');

  // Estados editáveis
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [linksRelacionados, setLinksRelacionados] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user && id) {
      loadArticle();
      loadAvailableArticles();
    }
  }, [user, authLoading, router, id]);

  const loadArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/knowledge-base?knowledgeBaseId=${id}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data);
        setTitulo(data.titulo);
        setConteudo(data.conteudo);
        setTags(data.tags || []);
        setLinksRelacionados(data.linksRelacionados || []);
      }
    } catch (error) {
      console.error('Erro ao carregar artigo:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableArticles = async () => {
    try {
      const response = await fetch(`/api/knowledge-base?userId=${user?.uid}`);
      if (response.ok) {
        const articles = await response.json();
        setAvailableArticles(articles.filter((a: RelatedArticle) => a.knowledgeBaseId !== id));
      }
    } catch (error) {
      console.error('Erro ao carregar artigos:', error);
    }
  };

  const saveArticle = async () => {
    try {
      setSaving(true);
      await fetch('/api/knowledge-base', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          knowledgeBaseId: id,
          titulo,
          conteudo,
          tags,
          linksRelacionados,
        }),
      });
      await loadArticle();
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar artigo:', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteArticle = async () => {
    if (!confirm('Deseja realmente excluir este artigo? Esta ação não pode ser desfeita.')) return;

    try {
      await fetch(`/api/knowledge-base?knowledgeBaseId=${id}`, {
        method: 'DELETE',
      });
      router.push('/knowledge-base');
    } catch (error) {
      console.error('Erro ao deletar artigo:', error);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const toggleLink = (articleId: string) => {
    if (linksRelacionados.includes(articleId)) {
      setLinksRelacionados(linksRelacionados.filter(id => id !== articleId));
    } else {
      setLinksRelacionados([...linksRelacionados, articleId]);
    }
  };

  const getLinkedArticles = () => {
    return availableArticles.filter(a => linksRelacionados.includes(a.knowledgeBaseId));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface-primary)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto"></div>
          <p className="mt-4 text-[var(--content-secondary)]">Carregando artigo...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--surface-primary)]">
        <div className="text-center">
          <MdArticle className="mx-auto text-6xl text-[var(--content-tertiary)] mb-4" />
          <h2 className="text-xl font-semibold text-[var(--content-primary)] mb-2">
            Artigo não encontrado
          </h2>
          <Link
            href="/knowledge-base"
            className="text-[var(--primary)] hover:underline"
          >
            Voltar para Knowledge Base
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--surface-primary)]">
      {/* Header */}
      <header className="bg-[var(--surface-elevated)] border-b border-[var(--border-primary)] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BackButton href="/knowledge-base" label="Base de Conhecimento" />
              <Link
                href="/knowledge-base"
                className="p-2 hover:bg-[var(--surface-secondary)] rounded-lg transition hidden"
                title="Voltar para Knowledge Base"
              >
                <AiOutlineArrowLeft className="text-xl text-[var(--content-primary)]" />
              </Link>
              <MdArticle className="text-2xl text-[var(--primary)]" />
              {isEditing ? (
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="text-xl font-bold bg-transparent border-b-2 border-[var(--border-focus)] text-[var(--content-primary)] focus:outline-none px-2"
                  placeholder="Título do artigo"
                />
              ) : (
                <h1 className="text-xl font-bold text-[var(--content-primary)]">
                  {article.titulo}
                </h1>
              )}
            </div>

            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setTitulo(article.titulo);
                      setConteudo(article.conteudo);
                      setTags(article.tags);
                      setLinksRelacionados(article.linksRelacionados);
                    }}
                    className="px-4 py-2 text-[var(--content-secondary)] hover:text-[var(--content-primary)] transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveArticle}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition disabled:opacity-50"
                  >
                    <AiOutlineSave />
                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition"
                  >
                    <AiOutlineEdit />
                    Editar
                  </button>
                  <button
                    onClick={deleteArticle}
                    className="p-2 text-[var(--error)] hover:bg-[var(--error-light)] rounded-lg transition"
                    title="Excluir artigo"
                  >
                    <AiOutlineDelete className="text-xl" />
                  </button>
                </>
              )}
              <ThemeToggle />
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 mt-3 text-sm text-[var(--content-tertiary)]">
            <div className="flex items-center gap-1">
              <AiOutlineClockCircle />
              <span>Criado em {new Date(article.createdAt).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex items-center gap-1">
              <AiOutlineClockCircle />
              <span>Atualizado em {new Date(article.updatedAt).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-[var(--surface-elevated)] border border-[var(--border-primary)] rounded-lg p-6">
              {isEditing ? (
                <div data-color-mode={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}>
                  <MDEditor
                    value={conteudo}
                    onChange={(val) => setConteudo(val || '')}
                    height={600}
                    preview="live"
                    hideToolbar={false}
                  />
                </div>
              ) : (
                <div className="prose prose-slate dark:prose-invert max-w-none p-6 bg-[var(--surface-primary)] rounded-lg border border-[var(--border-primary)]">
                  <MarkdownPreview
                    source={conteudo || '*Sem conteúdo. Clique em Editar para começar a escrever.*'}
                    style={{ backgroundColor: 'var(--surface-primary)', color: 'var(--content-primary)' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            <div className="bg-[var(--surface-elevated)] border border-[var(--border-primary)] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <AiOutlineTag className="text-[var(--primary)]" />
                <h3 className="font-semibold text-[var(--content-primary)]">Tags</h3>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-[var(--surface-tertiary)] text-[var(--content-primary)] text-sm rounded"
                  >
                    {tag}
                    {isEditing && (
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-[var(--error)] hover:text-[var(--error-hover)]"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    placeholder="Nova tag"
                    className="flex-1 px-2 py-1 text-sm bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded text-[var(--content-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)]"
                  />
                  <button
                    onClick={addTag}
                    className="px-2 py-1 bg-[var(--primary)] text-white text-sm rounded hover:bg-[var(--primary-hover)]"
                  >
                    <AiOutlinePlus />
                  </button>
                </div>
              )}
            </div>

            {/* Links Relacionados */}
            <div className="bg-[var(--surface-elevated)] border border-[var(--border-primary)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AiOutlineLink className="text-[var(--primary)]" />
                  <h3 className="font-semibold text-[var(--content-primary)]">Links Relacionados</h3>
                </div>
                {isEditing && (
                  <button
                    onClick={() => setShowLinkModal(true)}
                    className="text-[var(--primary)] hover:text-[var(--primary-hover)]"
                  >
                    <AiOutlinePlus />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {getLinkedArticles().length === 0 ? (
                  <p className="text-sm text-[var(--content-tertiary)] italic">
                    Nenhum artigo relacionado
                  </p>
                ) : (
                  getLinkedArticles().map((linkedArticle) => (
                    <Link
                      key={linkedArticle.knowledgeBaseId}
                      href={`/knowledge-base/${linkedArticle.knowledgeBaseId}`}
                      className="block p-2 bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] rounded text-sm text-[var(--content-primary)] transition"
                    >
                      {linkedArticle.titulo}
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Links */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--surface-primary)] rounded-lg max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[var(--content-primary)] mb-4">
              Adicionar Links Relacionados
            </h2>

            <div className="space-y-2 mb-6">
              {availableArticles.map((article) => (
                <label
                  key={article.knowledgeBaseId}
                  className="flex items-center gap-3 p-3 bg-[var(--surface-secondary)] hover:bg-[var(--surface-tertiary)] rounded cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={linksRelacionados.includes(article.knowledgeBaseId)}
                    onChange={() => toggleLink(article.knowledgeBaseId)}
                    className="w-4 h-4 text-[var(--primary)] border-[var(--border-primary)] rounded focus:ring-[var(--border-focus)]"
                  />
                  <span className="text-sm text-[var(--content-primary)]">{article.titulo}</span>
                </label>
              ))}
            </div>

            <button
              onClick={() => setShowLinkModal(false)}
              className="w-full px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
