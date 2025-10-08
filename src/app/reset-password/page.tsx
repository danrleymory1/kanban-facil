'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { resetPassword } from '@/services/auth.service';
import { AiOutlineLoading3Quarters, AiOutlineArrowLeft } from 'react-icons/ai';
import { MdDashboard } from 'react-icons/md';
import { FiMail, FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';

interface ResetFormData {
  email: string;
}

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>();

  const onSubmit = async (data: ResetFormData) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await resetPassword(data.email);
      setSuccess(true);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      const errorMessage = error.code === 'auth/user-not-found'
        ? 'Nenhum usuário encontrado com este email'
        : error.code === 'auth/invalid-email'
        ? 'Email inválido'
        : error.code === 'auth/too-many-requests'
        ? 'Muitas tentativas. Tente novamente mais tarde'
        : 'Erro ao enviar email de recuperação';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <MdDashboard className="text-6xl text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Recuperar Senha
          </h1>
          <p className="text-gray-600">
            Digite seu email para receber o link de recuperação
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-start gap-3">
            <FiCheckCircle className="text-xl flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Email enviado com sucesso!</p>
              <p className="text-sm mt-1">
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!success ? (
          <>
            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    {...register('email', {
                      required: 'Email é obrigatório',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email inválido',
                      },
                    })}
                    type="email"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="seu@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Link de Recuperação'
                )}
              </button>
            </form>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Dica:</strong> Verifique também a pasta de spam se não receber o email em alguns minutos.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Success Actions */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setSuccess(false);
                  setError('');
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
              >
                Enviar Novamente
              </button>

              <Link
                href="/login"
                className="block w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 text-center"
              >
                Voltar para Login
              </Link>
            </div>
          </>
        )}

        {/* Back to Login */}
        {!success && (
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
            >
              <AiOutlineArrowLeft />
              Voltar para Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
