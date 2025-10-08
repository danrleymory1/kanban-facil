import { Board, List, Card, KnowledgeBase, Sprint } from '@/types';
import { auth } from '@/lib/firebase';

const API_BASE = '/api';

/**
 * Obtém o token do Firebase Auth do usuário atual
 */
async function getAuthToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) {
    return null;
  }

  try {
    const token = await user.getIdToken();
    return token;
  } catch (error) {
    console.error('Erro ao obter token:', error);
    return null;
  }
}

/**
 * Helper function for authenticated fetch requests
 * Adiciona automaticamente o token JWT do Firebase
 */
const fetchAPI = async (url: string, options?: RequestInit) => {
  const token = await getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  // Adicionar token de autenticação se disponível
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Tratamento de erros de autenticação
  if (response.status === 401) {
    // Token expirado ou inválido - tentar renovar
    const user = auth.currentUser;
    if (user) {
      try {
        const newToken = await user.getIdToken(true); // Forçar renovação
        headers['Authorization'] = `Bearer ${newToken}`;

        // Tentar novamente com novo token
        const retryResponse = await fetch(url, {
          ...options,
          headers,
        });

        if (retryResponse.ok) {
          return retryResponse.json();
        }
      } catch (error) {
        console.error('Erro ao renovar token:', error);
      }
    }

    // Se chegou aqui, autenticação falhou
    throw new Error('Sessão expirada. Por favor, faça login novamente.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
};

// ========== BOARDS ==========

export const createBoard = async (userId: string, nome: string, descricao?: string, userName?: string) => {
  return fetchAPI(`${API_BASE}/boards`, {
    method: 'POST',
    body: JSON.stringify({ userId, nome, descricao, userName }),
  });
};

export const updateBoard = async (boardId: string, data: Partial<Board>) => {
  return fetchAPI(`${API_BASE}/boards`, {
    method: 'PUT',
    body: JSON.stringify({ boardId, ...data }),
  });
};

export const deleteBoard = async (boardId: string) => {
  return fetchAPI(`${API_BASE}/boards?boardId=${boardId}`, {
    method: 'DELETE',
  });
};

export const getBoard = async (boardId: string) => {
  return fetchAPI(`${API_BASE}/boards?boardId=${boardId}`);
};

export const getUserBoards = async (userId: string) => {
  return fetchAPI(`${API_BASE}/boards?userId=${userId}`);
};

// ========== LISTS ==========

export const createList = async (boardId: string, nome: string, ordem: number) => {
  return fetchAPI(`${API_BASE}/lists`, {
    method: 'POST',
    body: JSON.stringify({ boardId, nome, ordem }),
  });
};

export const updateList = async (listId: string, data: Partial<List>) => {
  return fetchAPI(`${API_BASE}/lists`, {
    method: 'PUT',
    body: JSON.stringify({ listId, ...data }),
  });
};

export const deleteList = async (listId: string) => {
  return fetchAPI(`${API_BASE}/lists?listId=${listId}`, {
    method: 'DELETE',
  });
};

export const getBoardLists = async (boardId: string) => {
  return fetchAPI(`${API_BASE}/lists?boardId=${boardId}`);
};

// ========== CARDS ==========

export const createCard = async (
  listId: string,
  boardId: string,
  nome: string,
  ordem: number,
  data?: Partial<Card>
) => {
  return fetchAPI(`${API_BASE}/cards`, {
    method: 'POST',
    body: JSON.stringify({ listId, boardId, nome, ordem, ...data }),
  });
};

export const updateCard = async (cardId: string, data: Partial<Card>) => {
  return fetchAPI(`${API_BASE}/cards`, {
    method: 'PUT',
    body: JSON.stringify({ cardId, ...data }),
  });
};

export const deleteCard = async (cardId: string) => {
  return fetchAPI(`${API_BASE}/cards?cardId=${cardId}`, {
    method: 'DELETE',
  });
};

export const getListCards = async (listId: string) => {
  return fetchAPI(`${API_BASE}/cards?listId=${listId}`);
};

export const getBoardCards = async (boardId: string) => {
  return fetchAPI(`${API_BASE}/cards?boardId=${boardId}`);
};

// ========== KNOWLEDGE BASE ==========

export const createKnowledgeBase = async (
  userId: string,
  titulo: string,
  conteudo: string,
  data?: Partial<KnowledgeBase>
) => {
  return fetchAPI(`${API_BASE}/knowledge-base`, {
    method: 'POST',
    body: JSON.stringify({ userId, titulo, conteudo, ...data }),
  });
};

export const updateKnowledgeBase = async (knowledgeBaseId: string, data: Partial<KnowledgeBase>) => {
  return fetchAPI(`${API_BASE}/knowledge-base`, {
    method: 'PUT',
    body: JSON.stringify({ knowledgeBaseId, ...data }),
  });
};

export const deleteKnowledgeBase = async (knowledgeBaseId: string) => {
  return fetchAPI(`${API_BASE}/knowledge-base?knowledgeBaseId=${knowledgeBaseId}`, {
    method: 'DELETE',
  });
};

export const getUserKnowledgeBases = async (userId: string) => {
  return fetchAPI(`${API_BASE}/knowledge-base?userId=${userId}`);
};

// ========== SPRINTS ==========

export const createSprint = async (
  boardId: string,
  nome: string,
  dataInicio: Date,
  dataFim: Date,
  data?: Partial<Sprint>
) => {
  return fetchAPI(`${API_BASE}/sprints`, {
    method: 'POST',
    body: JSON.stringify({
      boardId,
      nome,
      dataInicio: dataInicio.toISOString(),
      dataFim: dataFim.toISOString(),
      ...data,
    }),
  });
};

export const updateSprint = async (sprintId: string, data: Partial<Sprint>) => {
  return fetchAPI(`${API_BASE}/sprints`, {
    method: 'PUT',
    body: JSON.stringify({ sprintId, ...data }),
  });
};

export const deleteSprint = async (sprintId: string) => {
  return fetchAPI(`${API_BASE}/sprints?sprintId=${sprintId}`, {
    method: 'DELETE',
  });
};

export const getSprint = async (sprintId: string) => {
  return fetchAPI(`${API_BASE}/sprints?sprintId=${sprintId}`);
};

export const getBoardSprints = async (boardId: string) => {
  return fetchAPI(`${API_BASE}/sprints?boardId=${boardId}`);
};

export const addDailyNote = async (
  sprintId: string,
  noteData: {
    impedimentos: string[];
    notas: string[];
    participantes: string[];
  }
) => {
  return fetchAPI(`${API_BASE}/sprints/daily-notes`, {
    method: 'POST',
    body: JSON.stringify({ sprintId, ...noteData }),
  });
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
  return fetchAPI(`${API_BASE}/sprints/retrospective`, {
    method: 'POST',
    body: JSON.stringify({ sprintId, ...retroData }),
  });
};

export const updateSprintMetrics = async (sprintId: string) => {
  return fetchAPI(`${API_BASE}/sprints/metrics`, {
    method: 'POST',
    body: JSON.stringify({ sprintId }),
  });
};

// ========== REAL-TIME LISTENERS (Polling implementation) ==========

export const subscribeToBoardLists = (boardId: string, callback: (lists: List[]) => void) => {
  const poll = async () => {
    try {
      const lists = await getBoardLists(boardId);
      callback(lists);
    } catch (error) {
      console.error('Error polling board lists:', error);
    }
  };

  poll(); // Initial call
  const intervalId = setInterval(poll, 2000); // Poll every 2 seconds

  return () => clearInterval(intervalId); // Return unsubscribe function
};

export const subscribeToListCards = (listId: string, callback: (cards: Card[]) => void) => {
  const poll = async () => {
    try {
      const cards = await getListCards(listId);
      callback(cards);
    } catch (error) {
      console.error('Error polling list cards:', error);
    }
  };

  poll(); // Initial call
  const intervalId = setInterval(poll, 2000); // Poll every 2 seconds

  return () => clearInterval(intervalId); // Return unsubscribe function
};

export const subscribeToBoardCards = (boardId: string, callback: (cards: Card[]) => void) => {
  const poll = async () => {
    try {
      const cards = await getBoardCards(boardId);
      callback(cards);
    } catch (error) {
      console.error('Error polling board cards:', error);
    }
  };

  poll(); // Initial call
  const intervalId = setInterval(poll, 2000); // Poll every 2 seconds

  return () => clearInterval(intervalId); // Return unsubscribe function
};

export const subscribeToBoardSprints = (boardId: string, callback: (sprints: Sprint[]) => void) => {
  const poll = async () => {
    try {
      const sprints = await getBoardSprints(boardId);
      callback(sprints);
    } catch (error) {
      console.error('Error polling board sprints:', error);
    }
  };

  poll(); // Initial call
  const intervalId = setInterval(poll, 2000); // Poll every 2 seconds

  return () => clearInterval(intervalId); // Return unsubscribe function
};

// ========== NOTIFICATIONS ==========

export const getUserNotifications = async (unreadOnly: boolean = false) => {
  const params = new URLSearchParams();
  if (unreadOnly) params.append("unreadOnly", "true");
  
  return fetchAPI(`/api/notifications?${params.toString()}`);
};

export const markNotificationAsRead = async (notificationId: string) => {
  return fetchAPI("/api/notifications", {
    method: "POST",
    body: JSON.stringify({ notificationId, action: "markAsRead" }),
  });
};

export const markAllNotificationsAsRead = async () => {
  return fetchAPI("/api/notifications", {
    method: "POST",
    body: JSON.stringify({ action: "markAllAsRead" }),
  });
};

export const deleteNotification = async (notificationId: string) => {
  return fetchAPI(`/api/notifications?notificationId=${notificationId}`, {
    method: "DELETE",
  });
};

export const getUnreadNotificationCount = async (): Promise<number> => {
  const data = await getUserNotifications(true);
  return data.notifications?.length || 0;
};
