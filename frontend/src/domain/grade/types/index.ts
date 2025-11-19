export interface Grade {
  id: number;
  studentName: string;
  subject: string;
  gradeValue: number;
  observation?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface GradeListParams {
  studentName?: string;
  subject?: string;
  minGrade?: number;
  maxGrade?: number;
  sortBy?: 'studentName' | 'subject' | 'gradeValue' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
}

export interface CreateGradeDto {
  studentName: string;
  subject: string;
  gradeValue: number;
  observation?: string;
}

export interface UpdateGradeDto {
  studentName: string;
  subject: string;
  gradeValue: number;
  observation?: string;
}

export interface SubjectStatistics {
  subject: string;
  totalGrades: number;
  averageGrade: number;
  minGrade: number;
  maxGrade: number;
}

export interface SubjectGradesResponse {
  grades: Grade[];
  statistics: {
    total: number;
    average: number;
    min: number;
    max: number;
  };
}

export interface SubjectOverviewParams {
  sortBy?: 'subject' | 'totalGrades' | 'averageGrade';
  sortDirection?: 'asc' | 'desc';
}
