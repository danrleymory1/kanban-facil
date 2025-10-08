'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  AiOutlineMessage,
  AiOutlineSend,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineUser,
  AiOutlineClockCircle,
} from 'react-icons/ai';
import { MdAlternateEmail } from 'react-icons/md';

interface Comment {
  commentId: string;
  cardId: string;
  autorId: string;
  autorNome: string;
  texto: string;
  mencoes: string[];
  editado: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CommentSectionProps {
  cardId: string;
}

export default function CommentSection({ cardId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadComments();
  }, [cardId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/comments?cardId=${cardId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data || []);
      }
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const matches = text.match(mentionRegex);
    return matches ? matches.map(m => m.substring(1)) : [];
  };

  const sendComment = async () => {
    if (!newComment.trim() || !user) return;

    try {
      setSending(true);
      const mencoes = extractMentions(newComment);

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId,
          autorId: user.uid,
          autorNome: user.displayName || user.email || 'Usuário',
          texto: newComment,
          mencoes,
        }),
      });

      if (response.ok) {
        setNewComment('');
        await loadComments();
      }
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
    } finally {
      setSending(false);
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment.commentId);
    setEditText(comment.texto);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (commentId: string) => {
    try {
      await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentId,
          texto: editText,
        }),
      });

      cancelEdit();
      await loadComments();
    } catch (error) {
      console.error('Erro ao editar comentário:', error);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm('Deseja realmente excluir este comentário?')) return;

    try {
      await fetch(`/api/comments?commentId=${commentId}`, {
        method: 'DELETE',
      });
      await loadComments();
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
    }
  };

  const highlightMentions = (text: string) => {
    return text.replace(
      /@(\w+)/g,
      '<span class="text-[var(--primary)] font-semibold">@$1</span>'
    );
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffInHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes} min atrás`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `${hours}h atrás`;
    } else if (diffInHours < 48) {
      return 'Ontem';
    } else {
      return d.toLocaleDateString('pt-BR');
    }
  };

  return (
    <div className="bg-[var(--surface-elevated)] border border-[var(--border-primary)] rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <AiOutlineMessage className="text-xl text-[var(--primary)]" />
        <h3 className="font-semibold text-[var(--content-primary)]">
          Comentários ({comments.length})
        </h3>
      </div>

      {/* New Comment Input */}
      <div className="mb-4">
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                sendComment();
              }
            }}
            placeholder="Adicione um comentário... (use @usuario para mencionar)"
            className="w-full px-3 py-2 pr-12 bg-[var(--surface-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--content-primary)] placeholder-[var(--content-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] resize-none"
            rows={3}
          />
          <button
            onClick={sendComment}
            disabled={!newComment.trim() || sending}
            className="absolute bottom-2 right-2 p-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Enviar comentário (Ctrl+Enter)"
          >
            <AiOutlineSend />
          </button>
        </div>
        <p className="text-xs text-[var(--content-tertiary)] mt-1">
          <MdAlternateEmail className="inline" /> Use @usuario para mencionar alguém • Ctrl+Enter para enviar
        </p>
      </div>

      {/* Comments List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)] mx-auto"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-[var(--content-tertiary)]">
            <AiOutlineMessage className="mx-auto text-4xl mb-2 opacity-50" />
            <p className="text-sm">Nenhum comentário ainda</p>
            <p className="text-xs mt-1">Seja o primeiro a comentar!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.commentId}
              className="p-3 bg-[var(--surface-secondary)] rounded-lg hover:bg-[var(--surface-tertiary)] transition"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {comment.autorNome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[var(--content-primary)]">
                      {comment.autorNome}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[var(--content-tertiary)]">
                      <AiOutlineClockCircle className="inline" />
                      <span>{formatDate(comment.createdAt)}</span>
                      {comment.editado && <span className="italic">(editado)</span>}
                    </div>
                  </div>
                </div>

                {user && user.uid === comment.autorId && (
                  <div className="flex gap-1">
                    {editingId === comment.commentId ? (
                      <>
                        <button
                          onClick={() => saveEdit(comment.commentId)}
                          className="p-1 text-[var(--success)] hover:bg-[var(--success-light)] rounded transition"
                          title="Salvar"
                        >
                          ✓
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1 text-[var(--error)] hover:bg-[var(--error-light)] rounded transition"
                          title="Cancelar"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(comment)}
                          className="p-1 text-[var(--content-secondary)] hover:text-[var(--primary)] transition"
                          title="Editar"
                        >
                          <AiOutlineEdit />
                        </button>
                        <button
                          onClick={() => deleteComment(comment.commentId)}
                          className="p-1 text-[var(--content-secondary)] hover:text-[var(--error)] transition"
                          title="Excluir"
                        >
                          <AiOutlineDelete />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {editingId === comment.commentId ? (
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full px-2 py-1 bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded text-[var(--content-primary)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--border-focus)] resize-none"
                  rows={3}
                  autoFocus
                />
              ) : (
                <p
                  className="text-sm text-[var(--content-primary)] whitespace-pre-wrap break-words"
                  dangerouslySetInnerHTML={{ __html: highlightMentions(comment.texto) }}
                />
              )}

              {comment.mencoes.length > 0 && (
                <div className="mt-2 flex items-center gap-1 text-xs text-[var(--content-tertiary)]">
                  <MdAlternateEmail />
                  <span>Mencionou: {comment.mencoes.map(m => `@${m}`).join(', ')}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
