'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { loginUser, registerUser } from '@/services/auth.service';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { MdDashboard } from 'react-icons/md';
import Link from 'next/link';

interface LoginFormData {
  email: string;
  password: string;
  nome?: string;
}

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        if (!data.nome) {
          setError('Nome é obrigatório para registro');
          setLoading(false);
          return;
        }
        await registerUser(data.email, data.password, data.nome);
      } else {
        await loginUser(data.email, data.password);
      }
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      const errorMessage = error.code === 'auth/user-not-found'
        ? 'Usuário não encontrado'
        : error.code === 'auth/wrong-password'
        ? 'Senha incorreta'
        : error.code === 'auth/email-already-in-use'
        ? 'Email já está em uso'
        : error.code === 'auth/weak-password'
        ? 'Senha deve ter pelo menos 6 caracteres'
        : error.code === 'auth/invalid-email'
        ? 'Email inválido'
        : 'Erro ao fazer login/registro';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <MdDashboard className="text-6xl text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Kanban Fácil
          </h1>
          <p className="text-gray-600">
            {isRegister ? 'Criar uma nova conta' : 'Entre na sua conta'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                {...register('nome', {
                  required: isRegister ? 'Nome é obrigatório' : false,
                })}
                type="text"
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Seu nome completo"
              />
              {errors.nome && (
                <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido',
                },
              })}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="seu@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              {...register('password', {
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'Senha deve ter no mínimo 6 caracteres',
                },
              })}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin mr-2" />
            ) : null}
            {isRegister ? 'Criar Conta' : 'Entrar'}
          </button>
        </form>

        {!isRegister && (
          <div className="mt-4 text-center">
            <Link
              href="/reset-password"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Esqueceu sua senha?
            </Link>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {isRegister
              ? 'Já tem uma conta? Entre aqui'
              : 'Não tem uma conta? Crie agora'}
          </button>
        </div>
      </div>
    </div>
  );
}
