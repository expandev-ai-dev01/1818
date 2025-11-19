import type { SubjectStatistics } from '../../types';

export interface SubjectOverviewCardProps {
  subject: SubjectStatistics;
  onClick: (subject: string) => void;
}
