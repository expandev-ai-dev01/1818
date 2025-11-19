import type { Grade } from '../../types';

export interface GradeFormProps {
  grade?: Grade;
  onSubmit: (data: GradeFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export interface GradeFormData {
  studentName: string;
  subject: string;
  gradeValue: number;
  observation?: string;
}
