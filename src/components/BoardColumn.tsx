'use client';

import { useState } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { List, Card } from '@/types';
import { FiMoreHorizontal, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { AiOutlinePlus } from 'react-icons/ai';
import BoardCard from './BoardCard';
import AddCardForm from './AddCardForm';
import { deleteList, updateList } from '@/services/api.service';

interface BoardColumnProps {
  list: List;
  cards: Card[];
  index: number;
  onCardClick: (card: Card) => void;
}

export default function BoardColumn({ list, cards, index, onCardClick }: BoardColumnProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [listName, setListName] = useState(list.nome);

  const handleDeleteList = async () => {
    if (!confirm(`Tem certeza que deseja excluir a lista "${list.nome}"?`)) return;

    try {
      await deleteList(list.listId);
      setShowMenu(false);
    } catch (error) {
      console.error('Erro ao excluir lista:', error);
    }
  };

  const handleUpdateName = async () => {
    if (!listName.trim() || listName === list.nome) {
      setIsEditing(false);
      setListName(list.nome);
      return;
    }

    try {
      await updateList(list.listId, { nome: listName });
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar nome da lista:', error);
      setListName(list.nome);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpdateName();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setListName(list.nome);
    }
  };

  return (
    <Draggable draggableId={list.listId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-gray-100 rounded-lg w-72 flex-shrink-0 flex flex-col max-h-full ${
            snapshot.isDragging ? 'shadow-2xl rotate-2' : ''
          }`}
        >
          {/* List Header */}
          <div
            {...provided.dragHandleProps}
            className="p-3 flex items-center justify-between border-b border-gray-200"
          >
            {isEditing ? (
              <input
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                onBlur={handleUpdateName}
                onKeyDown={handleKeyDown}
                className="flex-1 px-2 py-1 text-sm font-semibold text-gray-900 bg-white border border-blue-500 rounded focus:outline-none"
                autoFocus
              />
            ) : (
              <h3 className="flex-1 text-sm font-semibold text-gray-900 cursor-pointer">
                {list.nome}
                <span className="ml-2 text-gray-500">({cards.length})</span>
              </h3>
            )}

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-200 rounded transition"
              >
                <FiMoreHorizontal className="text-gray-600" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FiEdit2 />
                      Renomear lista
                    </button>
                    <button
                      onClick={handleDeleteList}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <FiTrash2 />
                      Excluir lista
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Cards */}
          <Droppable droppableId={list.listId} type="card">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex-1 overflow-y-auto p-2 space-y-2 ${
                  snapshot.isDraggingOver ? 'bg-blue-50' : ''
                }`}
              >
                {cards.map((card, index) => (
                  <BoardCard
                    key={card.cardId}
                    card={card}
                    index={index}
                    onClick={() => onCardClick(card)}
                  />
                ))}
                {provided.placeholder}

                {showAddCard && (
                  <AddCardForm
                    listId={list.listId}
                    boardId={list.boardId}
                    ordem={cards.length}
                    onCancel={() => setShowAddCard(false)}
                    onSuccess={() => setShowAddCard(false)}
                  />
                )}
              </div>
            )}
          </Droppable>

          {/* Add Card Button */}
          {!showAddCard && (
            <button
              onClick={() => setShowAddCard(true)}
              className="p-2 m-2 text-sm text-gray-600 hover:bg-gray-200 rounded flex items-center gap-2 transition"
            >
              <AiOutlinePlus />
              Adicionar cartão
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
}
