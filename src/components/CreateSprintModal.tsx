'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createSprint } from '@/services/api.service';
import { AiOutlineClose, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { StatusSprintType } from '@/types';

interface CreateSprintModalProps {
  boardId: string;
  onClose: () => void;
}

interface SprintFormData {
  nome: string;
  numero?: number;
  objetivo?: string;
  descricao?: string;
  dataInicio: string;
  dataFim: string;
  status: StatusSprintType;
  metaPontos?: number;
  metaCards?: number;
}

export default function CreateSprintModal({ boardId, onClose }: CreateSprintModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SprintFormData>({
    defaultValues: {
      status: 'planejamento',
      dataInicio: new Date().toISOString().split('T')[0],
      dataFim: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +14 dias
    },
  });

  const onSubmit = async (data: SprintFormData) => {
    setLoading(true);
    setError('');

    try {
      const dataInicio = new Date(data.dataInicio);
      const dataFim = new Date(data.dataFim);

      if (dataFim <= dataInicio) {
        setError('A data de fim deve ser posterior à data de início');
        setLoading(false);
        return;
      }

      await createSprint(boardId, data.nome, dataInicio, dataFim, {
        numero: data.numero,
        objetivo: data.objetivo,
        descricao: data.descricao,
        status: data.status,
        metaPontos: data.metaPontos,
        metaCards: data.metaCards,
      });

      onClose();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError('Erro ao criar sprint: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Criar Novo Sprint</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition"
          >
            <AiOutlineClose className="text-xl text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Sprint *
              </label>
              <input
                {...register('nome', { required: 'Nome é obrigatório' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Sprint 1, Sprint de Planejamento"
              />
              {errors.nome && (
                <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
              )}
            </div>

            {/* Número */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número do Sprint
              </label>
              <input
                {...register('numero', { valueAsNumber: true })}
                type="number"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1"
              />
            </div>

            {/* Objetivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objetivo do Sprint
              </label>
              <textarea
                {...register('objetivo')}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Qual é o objetivo principal deste sprint?"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                {...register('descricao')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detalhes adicionais sobre o sprint"
              />
            </div>

            {/* Datas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Início *
                </label>
                <input
                  {...register('dataInicio', { required: 'Data de início é obrigatória' })}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.dataInicio && (
                  <p className="text-red-500 text-sm mt-1">{errors.dataInicio.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Fim *
                </label>
                <input
                  {...register('dataFim', { required: 'Data de fim é obrigatória' })}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.dataFim && (
                  <p className="text-red-500 text-sm mt-1">{errors.dataFim.message}</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="planejamento">Planejamento</option>
                <option value="ativo">Ativo</option>
                <option value="em-revisao">Em Revisão</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            {/* Metas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta de Story Points
                </label>
                <input
                  {...register('metaPontos', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta de Cards
                </label>
                <input
                  {...register('metaCards', { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 20"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition"
          >
            {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
            Criar Sprint
          </button>
        </div>
      </div>
    </div>
  );
}
