'use client';

import { useState } from 'react';
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';
import { createList } from '@/services/firestore.service';

interface AddListButtonProps {
  boardId: string;
  listCount: number;
}

export default function AddListButton({ boardId, listCount }: AddListButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [listName, setListName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listName.trim()) return;

    try {
      setLoading(true);
      await createList(boardId, listName, listCount);
      setListName('');
      setIsAdding(false);
    } catch (error) {
      console.error('Erro ao criar lista:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setListName('');
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="bg-white bg-opacity-60 hover:bg-opacity-80 rounded-lg w-72 flex-shrink-0 p-3 flex items-center gap-2 text-gray-700 font-medium transition"
      >
        <AiOutlinePlus />
        Adicionar lista
      </button>
    );
  }

  return (
    <div className="bg-gray-100 rounded-lg w-72 flex-shrink-0 p-3">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          placeholder="Nome da lista..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
          autoFocus
          disabled={loading}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!listName.trim() || loading}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Criando...' : 'Adicionar'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-md transition"
          >
            <AiOutlineClose />
          </button>
        </div>
      </form>
    </div>
  );
}
