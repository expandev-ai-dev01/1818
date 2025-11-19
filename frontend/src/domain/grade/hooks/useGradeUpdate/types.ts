import type { UpdateGradeDto } from '../../types';

export interface UseGradeUpdateReturn {
  update: (id: number, data: UpdateGradeDto) => Promise<{ success: boolean }>;
  isUpdating: boolean;
}
