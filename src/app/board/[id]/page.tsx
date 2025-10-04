'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { getBoard, getBoardLists, getBoardCards, updateList, updateCard, subscribeToBoardLists, subscribeToBoardCards } from '@/services/firestore.service';
import { Board, List, Card } from '@/types';
import { AiOutlineLoading3Quarters, AiOutlinePlus, AiOutlineArrowLeft } from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
import { MdSprint } from 'react-icons/md';
import Link from 'next/link';
import BoardColumn from '@/components/BoardColumn';
import AddListButton from '@/components/AddListButton';
import CardModal from '@/components/CardModal';

export default function BoardPage() {
  const { id } = useParams();
  const boardId = id as string;
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [board, setBoard] = useState<Board | null>(null);
  const [lists, setLists] = useState<List[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || !boardId) return;

    loadBoardData();

    // Subscribe to real-time updates
    const unsubscribeLists = subscribeToBoardLists(boardId, (updatedLists) => {
      setLists(updatedLists);
    });

    const unsubscribeCards = subscribeToBoardCards(boardId, (updatedCards) => {
      setCards(updatedCards);
    });

    return () => {
      unsubscribeLists();
      unsubscribeCards();
    };
  }, [user, boardId]);

  const loadBoardData = async () => {
    try {
      setLoading(true);
      const [boardData, listsData, cardsData] = await Promise.all([
        getBoard(boardId),
        getBoardLists(boardId),
        getBoardCards(boardId),
      ]);

      if (!boardData) {
        router.push('/dashboard');
        return;
      }

      setBoard(boardData);
      setLists(listsData);
      setCards(cardsData);
    } catch (error) {
      console.error('Erro ao carregar board:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Drag de lista
    if (type === 'list') {
      const newLists = Array.from(lists);
      const [movedList] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, movedList);

      // Atualizar ordem localmente
      const updatedLists = newLists.map((list, index) => ({
        ...list,
        ordem: index,
      }));
      setLists(updatedLists);

      // Atualizar no Firestore
      try {
        await Promise.all(
          updatedLists.map((list) =>
            updateList(list.listId, { ordem: list.ordem })
          )
        );
      } catch (error) {
        console.error('Erro ao atualizar ordem das listas:', error);
        setLists(lists); // Reverter em caso de erro
      }

      return;
    }

    // Drag de card
    const sourceListId = source.droppableId;
    const destListId = destination.droppableId;

    const sourceCards = cards.filter((c) => c.listId === sourceListId);
    const destCards = cards.filter((c) => c.listId === destListId);

    if (sourceListId === destListId) {
      // Mover dentro da mesma lista
      const newCards = Array.from(sourceCards);
      const [movedCard] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, movedCard);

      const updatedCards = newCards.map((card, index) => ({
        ...card,
        ordem: index,
      }));

      const otherCards = cards.filter((c) => c.listId !== sourceListId);
      setCards([...otherCards, ...updatedCards]);

      // Atualizar no Firestore
      try {
        await Promise.all(
          updatedCards.map((card) =>
            updateCard(card.cardId, { ordem: card.ordem })
          )
        );
      } catch (error) {
        console.error('Erro ao atualizar ordem dos cards:', error);
        setCards(cards); // Reverter
      }
    } else {
      // Mover para outra lista
      const newSourceCards = Array.from(sourceCards);
      const [movedCard] = newSourceCards.splice(source.index, 1);

      const newDestCards = Array.from(destCards);
      newDestCards.splice(destination.index, 0, {
        ...movedCard,
        listId: destListId,
      });

      const updatedSourceCards = newSourceCards.map((card, index) => ({
        ...card,
        ordem: index,
      }));

      const updatedDestCards = newDestCards.map((card, index) => ({
        ...card,
        ordem: index,
        listId: destListId,
      }));

      const otherCards = cards.filter(
        (c) => c.listId !== sourceListId && c.listId !== destListId
      );
      setCards([...otherCards, ...updatedSourceCards, ...updatedDestCards]);

      // Atualizar no Firestore
      try {
        await updateCard(movedCard.cardId, {
          listId: destListId,
          ordem: destination.index,
        });

        await Promise.all([
          ...updatedSourceCards.map((card) =>
            updateCard(card.cardId, { ordem: card.ordem })
          ),
          ...updatedDestCards
            .filter((c) => c.cardId !== movedCard.cardId)
            .map((card) => updateCard(card.cardId, { ordem: card.ordem })),
        ]);
      } catch (error) {
        console.error('Erro ao mover card:', error);
        setCards(cards); // Reverter
      }
    }
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setShowCardModal(true);
  };

  const handleCloseModal = () => {
    setShowCardModal(false);
    setSelectedCard(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (!board) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-md transition"
            >
              <AiOutlineArrowLeft className="text-xl text-gray-700" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{board.nome}</h1>
              {board.descricao && (
                <p className="text-sm text-gray-600">{board.descricao}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/sprints/${boardId}`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              <MdSprint />
              <span>Sprints</span>
            </Link>
            <button className="p-2 hover:bg-gray-100 rounded-md transition">
              <FiSettings className="text-xl text-gray-700" />
            </button>
          </div>
        </div>
      </header>

      {/* Board Content */}
      <div className="p-4 h-[calc(100vh-73px)] overflow-x-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="board" type="list" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex gap-4 h-full"
              >
                {lists.map((list, index) => {
                  const listCards = cards
                    .filter((card) => card.listId === list.listId)
                    .sort((a, b) => a.ordem - b.ordem);

                  return (
                    <BoardColumn
                      key={list.listId}
                      list={list}
                      cards={listCards}
                      index={index}
                      onCardClick={handleCardClick}
                    />
                  );
                })}
                {provided.placeholder}
                <AddListButton boardId={boardId} listCount={lists.length} />
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Card Modal */}
      {showCardModal && selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={handleCloseModal}
          boardId={boardId}
        />
      )}
    </div>
  );
}
