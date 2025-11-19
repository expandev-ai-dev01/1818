import type { GradeListParams } from '../../types';

export interface GradeFiltersProps {
  filters: GradeListParams;
  onFiltersChange: (filters: GradeListParams) => void;
}
