export interface UseGradeDeleteReturn {
  remove: (id: number) => Promise<{ success: boolean }>;
  isDeleting: boolean;
}
