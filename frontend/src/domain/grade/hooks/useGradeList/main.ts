import { useQuery } from '@tanstack/react-query';
import { gradeService } from '../../services/gradeService';
import type { UseGradeListOptions, UseGradeListReturn } from './types';

export const useGradeList = (options: UseGradeListOptions = {}): UseGradeListReturn => {
  const { filters } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['grades', filters],
    queryFn: () => gradeService.list(filters),
  });

  return {
    data,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
