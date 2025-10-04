'use client';

import { useState } from 'react';
import { Sprint } from '@/types';
import { addDailyNote } from '@/services/firestore.service';
import { AiOutlinePlus, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiCalendar, FiAlertCircle, FiFileText, FiUsers } from 'react-icons/fi';
import dayjs from 'dayjs';

interface DailyNotesSectionProps {
  sprint: Sprint;
  onUpdate: () => void;
}

export default function DailyNotesSection({ sprint, onUpdate }: DailyNotesSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    impedimentos: [''],
    notas: [''],
    participantes: [''],
  });

  const handleAddField = (field: 'impedimentos' | 'notas' | 'participantes') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ''],
    });
  };

  const handleUpdateField = (
    field: 'impedimentos' | 'notas' | 'participantes',
    index: number,
    value: string
  ) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  const handleRemoveField = (field: 'impedimentos' | 'notas' | 'participantes', index: number) => {
    const updated = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updated.length ? updated : [''] });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const cleanData = {
        impedimentos: formData.impedimentos.filter((i) => i.trim()),
        notas: formData.notas.filter((n) => n.trim()),
        participantes: formData.participantes.filter((p) => p.trim()),
      };

      await addDailyNote(sprint.sprintId, cleanData);

      setFormData({
        impedimentos: [''],
        notas: [''],
        participantes: [''],
      });
      setShowForm(false);
      onUpdate();
    } catch (error) {
      console.error('Erro ao adicionar daily note:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Daily Note Button */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Daily Notes</h2>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <AiOutlinePlus />
              Adicionar Daily Note
            </button>
          )}
        </div>

        {/* Daily Note Form */}
        {showForm && (
          <div className="border-t border-gray-200 pt-4 space-y-4">
            {/* Notas */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FiFileText />
                  O que foi feito?
                </label>
                <button
                  onClick={() => handleAddField('notas')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Adicionar
                </button>
              </div>
              <div className="space-y-2">
                {formData.notas.map((nota, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={nota}
                      onChange={(e) => handleUpdateField('notas', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Descreva o que foi feito hoje"
                    />
                    {formData.notas.length > 1 && (
                      <button
                        onClick={() => handleRemoveField('notas', index)}
                        className="px-3 py-2 text-red-600 hover:text-red-700"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Impedimentos */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FiAlertCircle />
                  Impedimentos
                </label>
                <button
                  onClick={() => handleAddField('impedimentos')}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + Adicionar
                </button>
              </div>
              <div className="space-y-2">
                {formData.impedimentos.map((impedimento, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={impedimento}
                      onChange={(e) => handleUpdateField('impedimentos', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Descreva algum impedimento"
                    />
                    {formData.impedimentos.length > 1 && (
                      <button
                        onClick={() => handleRemoveField('impedimentos', index)}
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
                  <FiUsers />
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
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    impedimentos: [''],
                    notas: [''],
                    participantes: [''],
                  });
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition"
              >
                {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
                Salvar Daily Note
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Daily Notes List */}
      {sprint.dailyNotes && sprint.dailyNotes.length > 0 ? (
        <div className="space-y-4">
          {sprint.dailyNotes
            .sort((a, b) => b.data.toMillis() - a.data.toMillis())
            .map((note) => (
              <div key={note.noteId} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <FiCalendar />
                  <span>{dayjs(note.data.toDate()).format('DD/MM/YYYY HH:mm')}</span>
                </div>

                {/* Notas */}
                {note.notas.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <FiFileText className="text-blue-600" />
                      O que foi feito
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {note.notas.map((nota, index) => (
                        <li key={index}>{nota}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Impedimentos */}
                {note.impedimentos.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <FiAlertCircle className="text-red-600" />
                      Impedimentos
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {note.impedimentos.map((impedimento, index) => (
                        <li key={index}>{impedimento}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Participantes */}
                {note.participantes.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <FiUsers className="text-green-600" />
                      Participantes
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {note.participantes.map((participante, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {participante}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      ) : (
        !showForm && (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <p>Nenhuma daily note registrada ainda</p>
          </div>
        )
      )}
    </div>
  );
}
