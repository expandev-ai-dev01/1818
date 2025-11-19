import type { Grade, GradeListParams } from '../../types';

export interface UseGradeListOptions {
  filters?: GradeListParams;
}

export interface UseGradeListReturn {
  data: Grade[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
