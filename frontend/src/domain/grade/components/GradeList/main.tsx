import { format } from 'date-fns';
import type { GradeListProps } from './types';

export const GradeList = ({ grades, onEdit, onDelete, isDeleting }: GradeListProps) => {
  if (grades.length === 0) {
    return <div className="text-center py-12 text-gray-500">Nenhuma nota encontrada</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aluno
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Matéria
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nota
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Observação
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {grades.map((grade) => (
            <tr key={grade.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {grade.studentName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.subject}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                {grade.gradeValue.toFixed(1)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(grade.createdAt), 'dd/MM/yyyy')}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{grade.observation || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(grade)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(grade.id)}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
