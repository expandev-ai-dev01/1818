import { useMutation, useQueryClient } from '@tanstack/react-query';
import { gradeService } from '../../services/gradeService';
import type { UseGradeUpdateReturn } from './types';

export const useGradeUpdate = (): UseGradeUpdateReturn => {
  const queryClient = useQueryClient();

  const { mutateAsync: update, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => gradeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      queryClient.invalidateQueries({ queryKey: ['grade-overview'] });
    },
  });

  return {
    update: (id, data) => update({ id, data }),
    isUpdating,
  };
};
