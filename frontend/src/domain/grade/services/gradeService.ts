import { authenticatedClient } from '@/core/lib/api';
import type {
  Grade,
  GradeListParams,
  CreateGradeDto,
  UpdateGradeDto,
  SubjectStatistics,
  SubjectGradesResponse,
  SubjectOverviewParams,
} from '../types';

export const gradeService = {
  async list(params?: GradeListParams): Promise<Grade[]> {
    const response = await authenticatedClient.get('/grade', { params });
    return response.data.data;
  },

  async getById(id: number): Promise<Grade> {
    const response = await authenticatedClient.get(`/grade/${id}`);
    return response.data.data;
  },

  async create(data: CreateGradeDto): Promise<{ id: number }> {
    const response = await authenticatedClient.post('/grade', data);
    return response.data.data;
  },

  async update(id: number, data: UpdateGradeDto): Promise<{ success: boolean }> {
    const response = await authenticatedClient.put(`/grade/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<{ success: boolean }> {
    const response = await authenticatedClient.delete(`/grade/${id}`);
    return response.data.data;
  },

  async listBySubject(subject: string): Promise<SubjectGradesResponse> {
    const response = await authenticatedClient.get(`/grade/subject/${subject}`);
    return response.data.data;
  },

  async getOverview(params?: SubjectOverviewParams): Promise<SubjectStatistics[]> {
    const response = await authenticatedClient.get('/grade/overview', { params });
    return response.data.data;
  },
};
