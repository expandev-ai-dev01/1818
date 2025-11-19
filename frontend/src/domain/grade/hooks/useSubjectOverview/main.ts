import { useQuery } from '@tanstack/react-query';
import { gradeService } from '../../services/gradeService';
import type { UseSubjectOverviewOptions, UseSubjectOverviewReturn } from './types';

export const useSubjectOverview = (
  options: UseSubjectOverviewOptions = {}
): UseSubjectOverviewReturn => {
  const { params } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['grade-overview', params],
    queryFn: () => gradeService.getOverview(params),
  });

  return {
    data,
    isLoading,
    error: error as Error | null,
    refetch,
  };
};
