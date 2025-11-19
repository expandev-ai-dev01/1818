import type { SubjectStatistics, SubjectOverviewParams } from '../../types';

export interface UseSubjectOverviewOptions {
  params?: SubjectOverviewParams;
}

export interface UseSubjectOverviewReturn {
  data: SubjectStatistics[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
