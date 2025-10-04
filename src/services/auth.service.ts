import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// Criar novo usuário com email e senha
export const registerUser = async (email: string, password: string, nome: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Atualizar o perfil do usuário com o nome
    await updateProfile(user, { displayName: nome });

    // Criar documento do usuário no Firestore
    await setDoc(doc(db, 'users', user.uid), {
      userId: user.uid,
      email: user.email,
      nome,
      isAnonymous: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
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

// Obter dados do usuário do Firestore
export const getUserData = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    throw error;
  }
};
