'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AiOutlineClose } from 'react-icons/ai';
import { createCard } from '@/services/firestore.service';

interface AddCardFormProps {
  listId: string;
  boardId: string;
  ordem: number;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function AddCardForm({
  listId,
  boardId,
  ordem,
  onCancel,
  onSuccess,
}: AddCardFormProps) {
  const { user } = useAuth();
  const [cardName, setCardName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName.trim() || !user) return;

    try {
      setLoading(true);
      await createCard(listId, boardId, cardName, ordem, {
        criadoPor: user.uid,
        criadoPorNome: user.displayName || user.email || 'Usuário Anônimo',
      });
      setCardName('');
      onSuccess();
    } catch (error) {
      console.error('Erro ao criar card:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-md shadow-sm p-2">
      <textarea
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
        placeholder="Título do cartão..."
        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows={3}
        autoFocus
        disabled={loading}
      />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          disabled={!cardName.trim() || loading}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Criando...' : 'Adicionar'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded transition"
        >
          <AiOutlineClose />
        </button>
      </div>
    </form>
  );
}
