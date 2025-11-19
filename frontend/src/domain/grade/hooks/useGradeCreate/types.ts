import type { CreateGradeDto } from '../../types';

export interface UseGradeCreateReturn {
  create: (data: CreateGradeDto) => Promise<{ id: number }>;
  isCreating: boolean;
}
