import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { GradeFormProps, GradeFormData } from './types';

const gradeSchema = z.object({
  studentName: z
    .string()
    .min(3, 'O nome do aluno deve ter pelo menos 3 caracteres')
    .max(100, 'O nome do aluno deve ter no máximo 100 caracteres'),
  subject: z
    .string()
    .min(2, 'A matéria deve ter pelo menos 2 caracteres')
    .max(50, 'A matéria deve ter no máximo 50 caracteres'),
  gradeValue: z
    .number()
    .min(0, 'O valor da nota deve ser maior ou igual a 0')
    .max(10, 'O valor da nota deve ser menor ou igual a 10'),
  observation: z.string().max(200, 'A observação deve ter no máximo 200 caracteres').optional(),
});

export const GradeForm = ({ grade, onSubmit, onCancel, isSubmitting }: GradeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GradeFormData>({
    resolver: zodResolver(gradeSchema),
    defaultValues: grade
      ? {
          studentName: grade.studentName,
          subject: grade.subject,
          gradeValue: grade.gradeValue,
          observation: grade.observation || '',
        }
      : {
          studentName: '',
          subject: '',
          gradeValue: 0,
          observation: '',
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Aluno *
        </label>
        <input
          id="studentName"
          type="text"
          {...register('studentName')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.studentName && (
          <p className="mt-1 text-sm text-red-600">{errors.studentName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Matéria *
        </label>
        <input
          id="subject"
          type="text"
          {...register('subject')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>}
      </div>

      <div>
        <label htmlFor="gradeValue" className="block text-sm font-medium text-gray-700 mb-1">
          Nota (0.0 a 10.0) *
        </label>
        <input
          id="gradeValue"
          type="number"
          step="0.1"
          {...register('gradeValue', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.gradeValue && (
          <p className="mt-1 text-sm text-red-600">{errors.gradeValue.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="observation" className="block text-sm font-medium text-gray-700 mb-1">
          Observação
        </label>
        <textarea
          id="observation"
          rows={3}
          {...register('observation')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.observation && (
          <p className="mt-1 text-sm text-red-600">{errors.observation.message}</p>
        )}
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 bg-gray-200 text-gray-900 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : grade ? 'Atualizar' : 'Cadastrar'}
        </button>
      </div>
    </form>
  );
};
