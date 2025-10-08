import clientPromise from '@/lib/mongodb';
import { Board, List, Card, KnowledgeBase, Sprint } from '@/types';
import { ObjectId } from 'mongodb';

const DB_NAME = 'default';

// Helper function to convert MongoDB document to app format
const convertId = (doc: Record<string, unknown> & { _id: unknown }) => {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { ...rest, id: _id.toString() };
};

// ========== BOARDS ==========

export const createBoard = async (userId: string, nome: string, descricao?: string, userName?: string) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const boardData = {
      userId,
      nome,
      descricao: descricao || '',
      tags: [],
      membros: [{
        userId,
        nome: userName || 'Usuário',
        papel: 'admin' as const,
        adicionadoEm: new Date(),
      }],
      visibilidade: 'privado' as const,
      arquivado: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('boards').insertOne(boardData);
    return { boardId: result.insertedId.toString(), ...boardData };
  } catch (error) {
    throw error;
  }
};

export const updateBoard = async (boardId: string, data: Partial<Board>) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection('boards').updateOne(
      { _id: new ObjectId(boardId) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        }
      }
    );
  } catch (error) {
    throw error;
  }
};

export const deleteBoard = async (boardId: string) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection('boards').deleteOne({ _id: new ObjectId(boardId) });
  } catch (error) {
    throw error;
  }
};

export const getBoard = async (boardId: string) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const board = await db.collection('boards').findOne({ _id: new ObjectId(boardId) });
    if (board) {
      return { boardId: board._id.toString(), ...board } as Board;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const getUserBoards = async (userId: string) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const boards = await db.collection('boards')
      .find({ userId })
      .sort({ updatedAt: -1 })
      .toArray();

    return boards.map(board => ({ boardId: board._id.toString(), ...board } as Board));
  } catch (error) {
    throw error;
  }
};

// ========== LISTS ==========

export const createList = async (boardId: string, nome: string, ordem: number) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const listData = {
      boardId,
      nome,
      ordem,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('lists').insertOne(listData);
    return { listId: result.insertedId.toString(), ...listData };
  } catch (error) {
    throw error;
  }
};

export const updateList = async (listId: string, data: Partial<List>) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection('lists').updateOne(
      { _id: new ObjectId(listId) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        }
      }
    );
  } catch (error) {
    throw error;
  }
};

export const deleteList = async (listId: string) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection('lists').deleteOne({ _id: new ObjectId(listId) });
  } catch (error) {
    throw error;
  }
};

export const getBoardLists = async (boardId: string) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const lists = await db.collection('lists')
      .find({ boardId })
      .sort({ ordem: 1 })
      .toArray();

    return lists.map(list => ({ listId: list._id.toString(), ...list } as List));
  } catch (error) {
    throw error;
  }
};

// ========== CARDS ==========

export const createCard = async (
  listId: string,
  boardId: string,
  nome: string,
  ordem: number,
  data?: Partial<Card>
) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const cardData = {
      listId,
      boardId,
      nome,
      ordem,
      descricao: data?.descricao || '',
      responsavel: data?.responsavel,
      responsavelNome: data?.responsavelNome,
      prioridade: data?.prioridade || 'media',
      status: data?.status || 'aberto',
      tipo: data?.tipo || 'feature',
      tags: data?.tags || [],
      knowledgeBaseLinks: data?.knowledgeBaseLinks || [],
      checklists: data?.checklists || [],
      comentarios: data?.comentarios || [],
      anexos: data?.anexos || [],
      criadoPor: data?.criadoPor || '',
      criadoPorNome: data?.criadoPorNome || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('cards').insertOne(cardData);
    return { cardId: result.insertedId.toString(), ...cardData };
  } catch (error) {
    throw error;
  }
};

export const updateCard = async (cardId: string, data: Partial<Card>) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection('cards').updateOne(
      { _id: new ObjectId(cardId) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        }
      }
    );
  } catch (error) {
    throw error;
  }
};

export const deleteCard = async (cardId: string) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection('cards').deleteOne({ _id: new ObjectId(cardId) });
  } catch (error) {
    throw error;
  }
};

export const getListCards = async (listId: string) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const cards = await db.collection('cards')
      .find({ listId })
      .sort({ ordem: 1 })
      .toArray();

    return cards.map(card => ({ cardId: card._id.toString(), ...card } as Card));
  } catch (error) {
    throw error;
  }
};

export const getBoardCards = async (boardId: string) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const cards = await db.collection('cards')
      .find({ boardId })
      .sort({ ordem: 1 })
      .toArray();

    return cards.map(card => ({ cardId: card._id.toString(), ...card } as Card));
  } catch (error) {
    throw error;
  }
};

// ========== KNOWLEDGE BASE ==========

export const createKnowledgeBase = async (
  userId: string,
  titulo: string,
  conteudo: string,
  data?: Partial<KnowledgeBase>
) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const kbData = {
      userId,
      titulo,
      conteudo,
      linksRelacionados: data?.linksRelacionados || [],
      tags: data?.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('knowledgeBases').insertOne(kbData);
    return { knowledgeBaseId: result.insertedId.toString(), ...kbData };
  } catch (error) {
    throw error;
  }
};

export const updateKnowledgeBase = async (knowledgeBaseId: string, data: Partial<KnowledgeBase>) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection('knowledgeBases').updateOne(
      { _id: new ObjectId(knowledgeBaseId) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        }
      }
    );
  } catch (error) {
    throw error;
  }
};

export const deleteKnowledgeBase = async (knowledgeBaseId: string) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection('knowledgeBases').deleteOne({ _id: new ObjectId(knowledgeBaseId) });
  } catch (error) {
    throw error;
  }
};

export const getUserKnowledgeBases = async (userId: string) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const knowledgeBases = await db.collection('knowledgeBases')
      .find({ userId })
      .sort({ updatedAt: -1 })
      .toArray();

    return knowledgeBases.map(kb => ({ knowledgeBaseId: kb._id.toString(), ...kb } as KnowledgeBase));
  } catch (error) {
    throw error;
  }
};

// ========== SPRINTS ==========

export const createSprint = async (
  boardId: string,
  nome: string,
  dataInicio: Date,
  dataFim: Date,
  data?: Partial<Sprint>
) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const sprintData = {
      boardId,
      nome,
      numero: data?.numero,
      objetivo: data?.objetivo || '',
      descricao: data?.descricao || '',
      dataInicio: dataInicio,
      dataFim: dataFim,
      status: data?.status || 'planejamento',
      cardsIds: data?.cardsIds || [],
      metaPontos: data?.metaPontos,
      metaCards: data?.metaCards,
      dailyNotes: data?.dailyNotes || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('sprints').insertOne(sprintData);
    return { sprintId: result.insertedId.toString(), ...sprintData };
  } catch (error) {
    throw error;
  }
};

export const updateSprint = async (sprintId: string, data: Partial<Sprint>) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection('sprints').updateOne(
      { _id: new ObjectId(sprintId) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        }
      }
    );
  } catch (error) {
    throw error;
  }
};

export const deleteSprint = async (sprintId: string) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    await db.collection('sprints').deleteOne({ _id: new ObjectId(sprintId) });
  } catch (error) {
    throw error;
  }
};

export const getSprint = async (sprintId: string) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const sprint = await db.collection('sprints').findOne({ _id: new ObjectId(sprintId) });
    if (sprint) {
      return { sprintId: sprint._id.toString(), ...sprint } as Sprint;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const getBoardSprints = async (boardId: string) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const sprints = await db.collection('sprints')
      .find({ boardId })
      .sort({ dataInicio: -1 })
      .toArray();

    return sprints.map(sprint => ({ sprintId: sprint._id.toString(), ...sprint } as Sprint));
  } catch (error) {
    throw error;
  }
};

export const addDailyNote = async (
  sprintId: string,
  noteData: {
    impedimentos: string[];
    notas: string[];
    participantes: string[];
  }
) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const sprint = await getSprint(sprintId);
    if (!sprint) throw new Error('Sprint não encontrado');

    const dailyNote = {
      noteId: `note-${Date.now()}`,
      data: new Date(),
      ...noteData,
    };

    const updatedNotes = [...(sprint.dailyNotes || []), dailyNote];
    await updateSprint(sprintId, { dailyNotes: updatedNotes });
    return dailyNote;
  } catch (error) {
    throw error;
  }
};

export const addRetrospective = async (
  sprintId: string,
  retroData: {
    pontoPositivos: string[];
    pontosNegativos: string[];
    acoesParaMelhoria: string[];
    participantes?: string[];
  }
) => {
  try {
    const retrospectiva = {
      ...retroData,
      realizadaEm: new Date(),
    };

    await updateSprint(sprintId, { retrospectiva });
    return retrospectiva;
  } catch (error) {
    throw error;
  }
};

export const updateSprintMetrics = async (sprintId: string) => {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const sprint = await getSprint(sprintId);
    if (!sprint || !sprint.cardsIds) return;

    // Get all cards in this sprint
    const cardIds = sprint.cardsIds.map(id => new ObjectId(id));
    const cards = await db.collection('cards')
      .find({ _id: { $in: cardIds } })
      .toArray();

    // Calculate metrics
    const totalPontos = cards.reduce((sum, card) => sum + (card.pontosStoryPoints || 0), 0);
    const pontosCompletados = cards
      .filter((card) => card.status === 'concluido')
      .reduce((sum, card) => sum + (card.pontosStoryPoints || 0), 0);

    const totalCards = cards.length;
    const cardsCompletados = cards.filter((card) => card.status === 'concluido').length;

    const metrics = {
      totalPontos,
      pontosCompletados,
      totalCards,
      cardsCompletados,
      velocidade: pontosCompletados,
    };

    await updateSprint(sprintId, { metrics });
    return metrics;
  } catch (error) {
    throw error;
  }
};

// ========== REAL-TIME LISTENERS (Polling implementation) ==========
// Note: MongoDB doesn't have native real-time listeners like Firestore
// These functions use polling instead. For true real-time, consider MongoDB Change Streams

export const subscribeToBoardLists = (boardId: string, callback: (lists: List[]) => void) => {
  const poll = async () => {
    const lists = await getBoardLists(boardId);
    callback(lists);
  };

  poll(); // Initial call
  const intervalId = setInterval(poll, 2000); // Poll every 2 seconds

  return () => clearInterval(intervalId); // Return unsubscribe function
};

export const subscribeToListCards = (listId: string, callback: (cards: Card[]) => void) => {
  const poll = async () => {
    const cards = await getListCards(listId);
    callback(cards);
  };

  poll(); // Initial call
  const intervalId = setInterval(poll, 2000); // Poll every 2 seconds

  return () => clearInterval(intervalId); // Return unsubscribe function
};

export const subscribeToBoardCards = (boardId: string, callback: (cards: Card[]) => void) => {
  const poll = async () => {
    const cards = await getBoardCards(boardId);
    callback(cards);
  };

  poll(); // Initial call
  const intervalId = setInterval(poll, 2000); // Poll every 2 seconds

  return () => clearInterval(intervalId); // Return unsubscribe function
};

export const subscribeToBoardSprints = (boardId: string, callback: (sprints: Sprint[]) => void) => {
  const poll = async () => {
    const sprints = await getBoardSprints(boardId);
    callback(sprints);
  };

  poll(); // Initial call
  const intervalId = setInterval(poll, 2000); // Poll every 2 seconds

  return () => clearInterval(intervalId); // Return unsubscribe function
};


// ========== NOTIFICATIONS ==========

export const createNotification = async (
  userId: string,
  tipo: "atribuicao" | "mencao" | "comentario" | "prazo" | "atualizacao" | "convite",
  titulo: string,
  mensagem: string,
  options: {
    boardId?: string;
    cardId?: string;
    link?: string;
    remetente?: string;
    remetenteNome?: string;
  } = {}
) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const notification = {
    userId,
    tipo,
    titulo,
    mensagem,
    boardId: options.boardId,
    cardId: options.cardId,
    link: options.link,
    remetente: options.remetente,
    remetenteNome: options.remetenteNome,
    lida: false,
    arquivada: false,
    createdAt: new Date(),
    lidaEm: null,
  };

  const result = await db.collection("notifications").insertOne(notification);
  return { ...notification, notificationId: result.insertedId.toString() };
};

export const getUserNotifications = async (userId: string, unreadOnly: boolean = false) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const filter: Record<string, unknown> = { userId, arquivada: false };
  if (unreadOnly) {
    filter.lida = false;
  }

  const notifications = await db
    .collection("notifications")
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();

  return notifications.map((notif) => ({
    ...notif,
    notificationId: notif._id.toString(),
    _id: undefined,
  }));
};

export const markNotificationAsRead = async (notificationId: string, userId: string) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  await db.collection("notifications").updateOne(
    { _id: new ObjectId(notificationId), userId },
    { $set: { lida: true, lidaEm: new Date() } }
  );
};

export const markAllNotificationsAsRead = async (userId: string) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  await db.collection("notifications").updateMany(
    { userId, lida: false },
    { $set: { lida: true, lidaEm: new Date() } }
  );
};

export const deleteNotification = async (notificationId: string, userId: string) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  await db.collection("notifications").updateOne(
    { _id: new ObjectId(notificationId), userId },
    { $set: { arquivada: true } }
  );
};

export const getUnreadNotificationCount = async (userId: string): Promise<number> => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  return await db.collection("notifications").countDocuments({
    userId,
    lida: false,
    arquivada: false,
  });
};
