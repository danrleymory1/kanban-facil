import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

// Criar novo usuário com email e senha
export const registerUser = async (email: string, password: string, nome: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Atualizar o perfil do usuário com o nome
    await updateProfile(user, { displayName: nome });

    // Criar documento do usuário no MongoDB via API
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.uid,
        email: user.email,
        nome,
        isAnonymous: false,
      }),
    });

    return user;
  } catch (error) {
    throw error;
  }
};

// Login com email e senha
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Recuperação de senha
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Obter usuário atual
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Obter dados do usuário do MongoDB
export const getUserData = async (userId: string) => {
  try {
    const response = await fetch(`/api/users?userId=${userId}`);
    if (!response.ok) {
      // Retornar null ao invés de erro - o usuário será criado automaticamente
      return null;
    }
    return response.json();
  } catch (error) {
    console.warn('Erro ao buscar dados do usuário (será criado automaticamente):', error);
    return null;
  }
};
