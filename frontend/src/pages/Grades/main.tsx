import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGradeList } from '@/domain/grade/hooks/useGradeList';
import { useGradeCreate } from '@/domain/grade/hooks/useGradeCreate';
import { useGradeUpdate } from '@/domain/grade/hooks/useGradeUpdate';
import { useGradeDelete } from '@/domain/grade/hooks/useGradeDelete';
import { GradeList } from '@/domain/grade/components/GradeList';
import { GradeForm } from '@/domain/grade/components/GradeForm';
import { GradeFilters } from '@/domain/grade/components/GradeFilters';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import { ErrorMessage } from '@/core/components/ErrorMessage';
import type { Grade, GradeListParams } from '@/domain/grade/types';
import type { GradeFormData } from '@/domain/grade/components/GradeForm/types';

export const GradesPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<GradeListParams>({});
  const [showForm, setShowForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | undefined>();

  const { data: grades, isLoading, error, refetch } = useGradeList({ filters });
  const { create, isCreating } = useGradeCreate();
  const { update, isUpdating } = useGradeUpdate();
  const { remove, isDeleting } = useGradeDelete();

  const handleSubmit = async (data: GradeFormData) => {
    try {
      if (editingGrade) {
        await update(editingGrade.id, data);
      } else {
        await create(data);
      }
      setShowForm(false);
      setEditingGrade(undefined);
      refetch();
    } catch (error: unknown) {
      console.error('Erro ao salvar nota:', error);
    }
  };

  const handleEdit = (grade: Grade) => {
    setEditingGrade(grade);
    setShowForm(true);
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

  const handleCancel = () => {
    setShowForm(false);
    setEditingGrade(undefined);
  };

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao carregar notas"
        message="Não foi possível carregar as notas. Tente novamente."
        onRetry={refetch}
        onBack={() => navigate('/')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Notas</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/grades/overview')}
            className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-colors"
          >
            Visão Geral
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Nova Nota
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingGrade ? 'Editar Nota' : 'Nova Nota'}
          </h2>
          <GradeForm
            grade={editingGrade}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isCreating || isUpdating}
          />
        </div>
      )}

      <GradeFilters filters={filters} onFiltersChange={setFilters} />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <GradeList
            grades={grades || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </div>
      )}
    </div>
  );
};

export default GradesPage;
