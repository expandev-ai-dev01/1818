import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gradeService } from '../../services/gradeService';
import type { UseGradeCreateReturn } from './types';

export const useGradeCreate = (): UseGradeCreateReturn => {
  const queryClient = useQueryClient();

  const { mutateAsync: create, isPending: isCreating } = useMutation({
    mutationFn: gradeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      queryClient.invalidateQueries({ queryKey: ['grade-overview'] });
    },
  });

  return {
    create,
    isCreating,
  };
};
