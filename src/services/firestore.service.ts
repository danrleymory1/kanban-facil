import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Board, List, Card, KnowledgeBase, Task, Sprint } from '@/types';

// ========== BOARDS ==========

export const createBoard = async (userId: string, nome: string, descricao?: string, userName?: string) => {
  try {
    const boardData = {
      userId,
      nome,
      descricao: descricao || '',
      tags: [],
      membros: [{
        userId,
        nome: userName || 'Usuário',
        papel: 'admin' as const,
        adicionadoEm: Timestamp.now(),
      }],
      visibilidade: 'privado' as const,
      arquivado: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'boards'), boardData);
    return { boardId: docRef.id, ...boardData };
  } catch (error) {
    throw error;
  }
};

export const updateBoard = async (boardId: string, data: Partial<Board>) => {
  try {
    const boardRef = doc(db, 'boards', boardId);
    await updateDoc(boardRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    throw error;
  }
};

export const deleteBoard = async (boardId: string) => {
  try {
    await deleteDoc(doc(db, 'boards', boardId));
  } catch (error) {
    throw error;
  }
};

export const getBoard = async (boardId: string) => {
  try {
    const boardDoc = await getDoc(doc(db, 'boards', boardId));
    if (boardDoc.exists()) {
      return { boardId: boardDoc.id, ...boardDoc.data() } as Board;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const getUserBoards = async (userId: string) => {
  try {
    // Query boards where user is the owner or a member
    const q = query(
      collection(db, 'boards'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ boardId: doc.id, ...doc.data() } as Board));
  } catch (error) {
    throw error;
  }
};

// ========== LISTS ==========

export const createList = async (boardId: string, nome: string, ordem: number) => {
  try {
    const listData = {
      boardId,
      nome,
      ordem,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'lists'), listData);
    return { listId: docRef.id, ...listData };
  } catch (error) {
    throw error;
  }
};

export const updateList = async (listId: string, data: Partial<List>) => {
  try {
    const listRef = doc(db, 'lists', listId);
    await updateDoc(listRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    throw error;
  }
};

export const deleteList = async (listId: string) => {
  try {
    await deleteDoc(doc(db, 'lists', listId));
  } catch (error) {
    throw error;
  }
};

export const getBoardLists = async (boardId: string) => {
  try {
    const q = query(
      collection(db, 'lists'),
      where('boardId', '==', boardId),
      orderBy('ordem', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ listId: doc.id, ...doc.data() } as List));
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
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'cards'), cardData);
    return { cardId: docRef.id, ...cardData };
  } catch (error) {
    throw error;
  }
};

export const updateCard = async (cardId: string, data: Partial<Card>) => {
  try {
    const cardRef = doc(db, 'cards', cardId);
    await updateDoc(cardRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    throw error;
  }
};

export const deleteCard = async (cardId: string) => {
  try {
    await deleteDoc(doc(db, 'cards', cardId));
  } catch (error) {
    throw error;
  }
};

export const getListCards = async (listId: string) => {
  try {
    const q = query(
      collection(db, 'cards'),
      where('listId', '==', listId),
      orderBy('ordem', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ cardId: doc.id, ...doc.data() } as Card));
  } catch (error) {
    throw error;
  }
};

export const getBoardCards = async (boardId: string) => {
  try {
    const q = query(
      collection(db, 'cards'),
      where('boardId', '==', boardId),
      orderBy('ordem', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ cardId: doc.id, ...doc.data() } as Card));
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
    const kbData = {
      userId,
      titulo,
      conteudo,
      linksRelacionados: data?.linksRelacionados || [],
      tags: data?.tags || [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'knowledgeBases'), kbData);
    return { knowledgeBaseId: docRef.id, ...kbData };
  } catch (error) {
    throw error;
  }
};

export const updateKnowledgeBase = async (knowledgeBaseId: string, data: Partial<KnowledgeBase>) => {
  try {
    const kbRef = doc(db, 'knowledgeBases', knowledgeBaseId);
    await updateDoc(kbRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    throw error;
  }
};

export const deleteKnowledgeBase = async (knowledgeBaseId: string) => {
  try {
    await deleteDoc(doc(db, 'knowledgeBases', knowledgeBaseId));
  } catch (error) {
    throw error;
  }
};

export const getUserKnowledgeBases = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'knowledgeBases'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ knowledgeBaseId: doc.id, ...doc.data() } as KnowledgeBase));
  } catch (error) {
    throw error;
  }
};

// ========== REAL-TIME LISTENERS ==========

export const subscribeToBoardLists = (boardId: string, callback: (lists: List[]) => void) => {
  const q = query(
    collection(db, 'lists'),
    where('boardId', '==', boardId),
    orderBy('ordem', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const lists = snapshot.docs.map(doc => ({ listId: doc.id, ...doc.data() } as List));
    callback(lists);
  });
};

export const subscribeToListCards = (listId: string, callback: (cards: Card[]) => void) => {
  const q = query(
    collection(db, 'cards'),
    where('listId', '==', listId),
    orderBy('ordem', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const cards = snapshot.docs.map(doc => ({ cardId: doc.id, ...doc.data() } as Card));
    callback(cards);
  });
};

export const subscribeToBoardCards = (boardId: string, callback: (cards: Card[]) => void) => {
  const q = query(
    collection(db, 'cards'),
    where('boardId', '==', boardId),
    orderBy('ordem', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const cards = snapshot.docs.map(doc => ({ cardId: doc.id, ...doc.data() } as Card));
    callback(cards);
  });
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
    const sprintData = {
      boardId,
      nome,
      numero: data?.numero,
      objetivo: data?.objetivo || '',
      descricao: data?.descricao || '',
      dataInicio: Timestamp.fromDate(dataInicio),
      dataFim: Timestamp.fromDate(dataFim),
      status: data?.status || 'planejamento',
      cardsIds: data?.cardsIds || [],
      metaPontos: data?.metaPontos,
      metaCards: data?.metaCards,
      dailyNotes: data?.dailyNotes || [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'sprints'), sprintData);
    return { sprintId: docRef.id, ...sprintData };
  } catch (error) {
    throw error;
  }
};

export const updateSprint = async (sprintId: string, data: Partial<Sprint>) => {
  try {
    const sprintRef = doc(db, 'sprints', sprintId);
    await updateDoc(sprintRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    throw error;
  }
};

export const deleteSprint = async (sprintId: string) => {
  try {
    await deleteDoc(doc(db, 'sprints', sprintId));
  } catch (error) {
    throw error;
  }
};

export const getSprint = async (sprintId: string) => {
  try {
    const sprintDoc = await getDoc(doc(db, 'sprints', sprintId));
    if (sprintDoc.exists()) {
      return { sprintId: sprintDoc.id, ...sprintDoc.data() } as Sprint;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const getBoardSprints = async (boardId: string) => {
  try {
    const q = query(
      collection(db, 'sprints'),
      where('boardId', '==', boardId),
      orderBy('dataInicio', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ sprintId: doc.id, ...doc.data() } as Sprint));
  } catch (error) {
    throw error;
  }
};

export const subscribeToBoardSprints = (boardId: string, callback: (sprints: Sprint[]) => void) => {
  const q = query(
    collection(db, 'sprints'),
    where('boardId', '==', boardId),
    orderBy('dataInicio', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const sprints = snapshot.docs.map(doc => ({ sprintId: doc.id, ...doc.data() } as Sprint));
    callback(sprints);
  });
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
    const sprint = await getSprint(sprintId);
    if (!sprint) throw new Error('Sprint não encontrado');

    const dailyNote = {
      noteId: `note-${Date.now()}`,
      data: Timestamp.now(),
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
      realizadaEm: Timestamp.now(),
    };

    await updateSprint(sprintId, { retrospectiva });
    return retrospectiva;
  } catch (error) {
    throw error;
  }
};

export const updateSprintMetrics = async (sprintId: string) => {
  try {
    const sprint = await getSprint(sprintId);
    if (!sprint || !sprint.cardsIds) return;

    // Get all cards in this sprint
    const cardsPromises = sprint.cardsIds.map(cardId => getDoc(doc(db, 'cards', cardId)));
    const cardsDocs = await Promise.all(cardsPromises);
    const cards = cardsDocs
      .filter(doc => doc.exists())
      .map(doc => ({ cardId: doc.id, ...doc.data() } as Card));

    // Calculate metrics
    const totalPontos = cards.reduce((sum, card) => sum + (card.storyPoints || 0), 0);
    const pontosCompletados = cards
      .filter(card => card.status === 'concluido')
      .reduce((sum, card) => sum + (card.storyPoints || 0), 0);

    const totalCards = cards.length;
    const cardsCompletados = cards.filter(card => card.status === 'concluido').length;

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
