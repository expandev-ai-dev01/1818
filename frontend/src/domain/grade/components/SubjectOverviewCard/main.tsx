import type { SubjectOverviewCardProps } from './types';

export const SubjectOverviewCard = ({ subject, onClick }: SubjectOverviewCardProps) => {
  return (
    <div
      onClick={() => onClick(subject.subject)}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{subject.subject}</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Total de Notas:</span>
          <span className="text-sm font-medium text-gray-900">{subject.totalGrades}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Média:</span>
          <span className="text-sm font-medium text-gray-900">
            {subject.averageGrade.toFixed(1)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Maior Nota:</span>
          <span className="text-sm font-medium text-green-600">{subject.maxGrade.toFixed(1)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Menor Nota:</span>
          <span className="text-sm font-medium text-red-600">{subject.minGrade.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};
