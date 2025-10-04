'use client';

import { useState } from 'react';
import { Sprint } from '@/types';
import { addRetrospective } from '@/services/firestore.service';
import { AiOutlinePlus, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiThumbsUp, FiThumbsDown, FiTrendingUp, FiUsers, FiCalendar } from 'react-icons/fi';
import dayjs from 'dayjs';

interface RetrospectiveSectionProps {
  sprint: Sprint;
  onUpdate: () => void;
}

export default function RetrospectiveSection({ sprint, onUpdate }: RetrospectiveSectionProps) {
  const [showForm, setShowForm] = useState(!sprint.retrospectiva);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pontoPositivos: [''],
    pontosNegativos: [''],
    acoesParaMelhoria: [''],
    participantes: [''],
  });

  const handleAddField = (
    field: 'pontoPositivos' | 'pontosNegativos' | 'acoesParaMelhoria' | 'participantes'
  ) => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    });
  };

  const handleUpdateField = (
    field: 'pontoPositivos' | 'pontosNegativos' | 'acoesParaMelhoria' | 'participantes',
    index: number,
    value: string
  ) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const handleRemoveField = (
    field: 'pontoPositivos' | 'pontosNegativos' | 'acoesParaMelhoria' | 'participantes',
    index: number
  ) => {
    const updated = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updated.length ? updated : [''] });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const cleanData = {
        pontoPositivos: formData.pontoPositivos.filter((p) => p.trim()),
        pontosNegativos: formData.pontosNegativos.filter((p) => p.trim()),
        acoesParaMelhoria: formData.acoesParaMelhoria.filter((a) => a.trim()),
        participantes: formData.participantes.filter((p) => p.trim()),
      };

      await addRetrospective(sprint.sprintId, cleanData);

      setShowForm(false);
      onUpdate();
    } catch (error) {
      console.error('Erro ao adicionar retrospectiva:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Retrospectiva do Sprint</h2>
          {sprint.retrospectiva && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
            >
              <AiOutlinePlus />
              Editar Retrospectiva
            </button>
          )}
        </div>

        {showForm ? (
          <div className="space-y-6">
            {/* Pontos Positivos */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FiThumbsUp className="text-green-600" />
                  Pontos Positivos (O que funcionou bem?)
                </label>
                <button
                  onClick={() => handleAddField('pontoPositivos')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Adicionar
                </button>
              </div>
              <div className="space-y-2">
                {formData.pontoPositivos.map((ponto, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={ponto}
                      onChange={(e) => handleUpdateField('pontoPositivos', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Algo que funcionou bem no sprint"
                    />
                    {formData.pontoPositivos.length > 1 && (
                      <button
                        onClick={() => handleRemoveField('pontoPositivos', index)}
                        className="px-3 py-2 text-red-600 hover:text-red-700"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Pontos Negativos */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FiThumbsDown className="text-red-600" />
                  Pontos Negativos (O que pode melhorar?)
                </label>
                <button
                  onClick={() => handleAddField('pontosNegativos')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Adicionar
                </button>
              </div>
              <div className="space-y-2">
                {formData.pontosNegativos.map((ponto, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={ponto}
                      onChange={(e) => handleUpdateField('pontosNegativos', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Algo que não funcionou bem"
                    />
                    {formData.pontosNegativos.length > 1 && (
                      <button
                        onClick={() => handleRemoveField('pontosNegativos', index)}
                        className="px-3 py-2 text-red-600 hover:text-red-700"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Ações para Melhoria */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FiTrendingUp className="text-blue-600" />
                  Ações para Melhoria (O que vamos fazer diferente?)
                </label>
                <button
                  onClick={() => handleAddField('acoesParaMelhoria')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Adicionar
                </button>
              </div>
              <div className="space-y-2">
                {formData.acoesParaMelhoria.map((acao, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={acao}
                      onChange={(e) =>
                        handleUpdateField('acoesParaMelhoria', index, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ação concreta para melhorar"
                    />
                    {formData.acoesParaMelhoria.length > 1 && (
                      <button
                        onClick={() => handleRemoveField('acoesParaMelhoria', index)}
                        className="px-3 py-2 text-red-600 hover:text-red-700"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Participantes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FiUsers className="text-purple-600" />
                  Participantes
                </label>
                <button
                  onClick={() => handleAddField('participantes')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Adicionar
                </button>
              </div>
              <div className="space-y-2">
                {formData.participantes.map((participante, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={participante}
                      onChange={(e) => handleUpdateField('participantes', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nome do participante"
                    />
                    {formData.participantes.length > 1 && (
                      <button
                        onClick={() => handleRemoveField('participantes', index)}
                        className="px-3 py-2 text-red-600 hover:text-red-700"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              {sprint.retrospectiva && (
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                >
                  Cancelar
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition"
              >
                {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
                Salvar Retrospectiva
              </button>
            </div>
          </div>
        ) : sprint.retrospectiva ? (
          <div className="space-y-6">
            {/* Data da Retrospectiva */}
            {sprint.retrospectiva.realizadaEm && (
              <div className="flex items-center gap-2 text-sm text-gray-600 pb-4 border-b border-gray-200">
                <FiCalendar />
                <span>
                  Realizada em:{' '}
                  {dayjs(sprint.retrospectiva.realizadaEm.toDate()).format('DD/MM/YYYY HH:mm')}
                </span>
              </div>
            )}

            {/* Pontos Positivos */}
            {sprint.retrospectiva.pontoPositivos.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiThumbsUp className="text-green-600" />
                  Pontos Positivos
                </h3>
                <ul className="space-y-2">
                  {sprint.retrospectiva.pontoPositivos.map((ponto, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-md"
                    >
                      <span className="text-green-600 mt-0.5">✓</span>
                      <span className="text-gray-700">{ponto}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pontos Negativos */}
            {sprint.retrospectiva.pontosNegativos.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiThumbsDown className="text-red-600" />
                  Pontos Negativos
                </h3>
                <ul className="space-y-2">
                  {sprint.retrospectiva.pontosNegativos.map((ponto, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-md"
                    >
                      <span className="text-red-600 mt-0.5">✗</span>
                      <span className="text-gray-700">{ponto}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ações para Melhoria */}
            {sprint.retrospectiva.acoesParaMelhoria.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiTrendingUp className="text-blue-600" />
                  Ações para Melhoria
                </h3>
                <ul className="space-y-2">
                  {sprint.retrospectiva.acoesParaMelhoria.map((acao, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-md"
                    >
                      <span className="text-blue-600 mt-0.5">→</span>
                      <span className="text-gray-700">{acao}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Participantes */}
            {sprint.retrospectiva.participantes && sprint.retrospectiva.participantes.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiUsers className="text-purple-600" />
                  Participantes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sprint.retrospectiva.participantes.map((participante, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {participante}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma retrospectiva realizada ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}
