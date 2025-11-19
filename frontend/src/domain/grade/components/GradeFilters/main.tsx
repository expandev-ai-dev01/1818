import { useState } from 'react';
import type { GradeFiltersProps } from './types';
import type { GradeListParams } from '../../types';

export const GradeFilters = ({ filters, onFiltersChange }: GradeFiltersProps) => {
  const [localFilters, setLocalFilters] = useState<GradeListParams>(filters);

  const handleChange = (field: keyof GradeListParams, value: any) => {
    const newFilters = { ...localFilters, [field]: value || undefined };
    setLocalFilters(newFilters);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleClear = () => {
    const emptyFilters: GradeListParams = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Aluno
          </label>
          <input
            id="studentName"
            type="text"
            value={localFilters.studentName || ''}
            onChange={(e) => handleChange('studentName', e.target.value)}
            placeholder="Mínimo 3 caracteres"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Matéria
          </label>
          <input
            id="subject"
            type="text"
            value={localFilters.subject || ''}
            onChange={(e) => handleChange('subject', e.target.value)}
            placeholder="Mínimo 2 caracteres"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="minGrade" className="block text-sm font-medium text-gray-700 mb-1">
            Nota Mínima
          </label>
          <input
            id="minGrade"
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={localFilters.minGrade || ''}
            onChange={(e) =>
              handleChange('minGrade', e.target.value ? parseFloat(e.target.value) : undefined)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="maxGrade" className="block text-sm font-medium text-gray-700 mb-1">
            Nota Máxima
          </label>
          <input
            id="maxGrade"
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={localFilters.maxGrade || ''}
            onChange={(e) =>
              handleChange('maxGrade', e.target.value ? parseFloat(e.target.value) : undefined)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
            Ordenar por
          </label>
          <select
            id="sortBy"
            value={localFilters.sortBy || 'createdAt'}
            onChange={(e) => handleChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt">Data de Registro</option>
            <option value="studentName">Nome do Aluno</option>
            <option value="subject">Matéria</option>
            <option value="gradeValue">Nota</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortDirection" className="block text-sm font-medium text-gray-700 mb-1">
            Direção
          </label>
          <select
            id="sortDirection"
            value={localFilters.sortDirection || 'desc'}
            onChange={(e) => handleChange('sortDirection', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="asc">Crescente</option>
            <option value="desc">Decrescente</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-colors"
        >
          Limpar
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
};
