import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubjectOverview } from '@/domain/grade/hooks/useSubjectOverview';
import { SubjectOverviewCard } from '@/domain/grade/components/SubjectOverviewCard';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { ErrorMessage } from '@/core/components/ErrorMessage';
import type { SubjectOverviewParams } from '@/domain/grade/types';

export const GradeOverviewPage = () => {
  const navigate = useNavigate();
  const [params, setParams] = useState<SubjectOverviewParams>({
    sortBy: 'subject',
    sortDirection: 'asc',
  });

  const { data: subjects, isLoading, error, refetch } = useSubjectOverview({ params });

  const handleSubjectClick = (subject: string) => {
    navigate(`/grades/subject/${encodeURIComponent(subject)}`);
  };

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar visão geral"
        message="Não foi possível carregar a visão geral das matérias. Tente novamente."
        onRetry={refetch}
        onBack={() => navigate('/grades')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Visão Geral de Matérias</h1>
        <button
          onClick={() => navigate('/grades')}
          className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-colors"
        >
          Voltar para Notas
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
              Ordenar por
            </label>
            <select
              id="sortBy"
              value={params.sortBy}
              onChange={(e) => setParams({ ...params, sortBy: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="subject">Matéria</option>
              <option value="totalGrades">Quantidade de Notas</option>
              <option value="averageGrade">Média</option>
            </select>
          </div>

          <div>
            <label htmlFor="sortDirection" className="block text-sm font-medium text-gray-700 mb-1">
              Direção
            </label>
            <select
              id="sortDirection"
              value={params.sortDirection}
              onChange={(e) => setParams({ ...params, sortDirection: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="asc">Crescente</option>
              <option value="desc">Decrescente</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : subjects && subjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <SubjectOverviewCard
              key={subject.subject}
              subject={subject}
              onClick={handleSubjectClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Não há matérias com notas registradas no sistema
        </div>
      )}
    </div>
  );
};

export default GradeOverviewPage;
