import type { Grade } from '../../types';

export interface GradeListProps {
  grades: Grade[];
  onEdit: (grade: Grade) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}
