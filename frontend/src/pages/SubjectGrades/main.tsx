import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { gradeService } from '@/domain/grade/services/gradeService';
import { GradeList } from '@/domain/grade/components/GradeList';
import { useGradeDelete } from '@/domain/grade/hooks/useGradeDelete';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { ErrorMessage } from '@/core/components/ErrorMessage';
import type { Grade } from '@/domain/grade/types';

export const SubjectGradesPage = () => {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const { remove, isDeleting } = useGradeDelete();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['subject-grades', subject],
    queryFn: () => gradeService.listBySubject(subject!),
    enabled: !!subject,
  });

  const handleEdit = (grade: Grade) => {
    navigate('/grades', { state: { editGrade: grade } });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta nota?')) {
      try {
        await remove(id);
        refetch();
      } catch (error: unknown) {
        console.error('Erro ao excluir nota:', error);
      }
    }
  };

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar notas da matéria"
        message="Não foi possível carregar as notas desta matéria. Tente novamente."
        onRetry={refetch}
        onBack={() => navigate('/grades/overview')}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const { grades, statistics } = data || {
    grades: [],
    statistics: { total: 0, average: 0, min: 0, max: 0 },
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{subject}</h1>
        <button
          onClick={() => navigate('/grades/overview')}
          className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-colors"
        >
          Voltar para Visão Geral
        </button>
      </div>

      {statistics.total > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Estatísticas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total de Notas</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Média</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.average.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Maior Nota</p>
              <p className="text-2xl font-bold text-green-600">{statistics.max.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Menor Nota</p>
              <p className="text-2xl font-bold text-red-600">{statistics.min.toFixed(1)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <GradeList
          grades={grades}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
};

export default SubjectGradesPage;
