import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gradeService } from '../../services/gradeService';
import type { UseGradeDeleteReturn } from './types';

export const useGradeDelete = (): UseGradeDeleteReturn => {
  const queryClient = useQueryClient();

  const { mutateAsync: remove, isPending: isDeleting } = useMutation({
    mutationFn: gradeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      queryClient.invalidateQueries({ queryKey: ['grade-overview'] });
    },
  });

  return {
    remove,
    isDeleting,
  };
};
