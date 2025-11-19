/**
 * @summary
 * Grade service type definitions.
 * Defines all interfaces and types for grade operations.
 *
 * @module services/grade/gradeTypes
 */

/**
 * @interface GradeEntity
 * @description Represents a grade record in the system
 *
 * @property {number} id - Grade identifier
 * @property {string} studentName - Student name
 * @property {string} subject - Subject name
 * @property {number} gradeValue - Grade value (0.0-10.0)
 * @property {string | null} observation - Optional observations
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
export interface GradeEntity {
  id: number;
  studentName: string;
  subject: string;
  gradeValue: number;
  observation: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface GradeCreateParams
 * @description Parameters for creating a new grade
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {string} studentName - Student name
 * @property {string} subject - Subject name
 * @property {number} gradeValue - Grade value (0.0-10.0)
 * @property {string} [observation] - Optional observations
 */
export interface GradeCreateParams {
  idAccount: number;
  idUser: number;
  studentName: string;
  subject: string;
  gradeValue: number;
  observation?: string | null;
}

/**
 * @interface GradeGetParams
 * @description Parameters for retrieving a specific grade
 *
 * @property {number} idAccount - Account identifier
 * @property {number} id - Grade identifier
 */
export interface GradeGetParams {
  idAccount: number;
  id: number;
}

/**
 * @interface GradeListParams
 * @description Parameters for listing grades with filters
 *
 * @property {number} idAccount - Account identifier
 * @property {string} [studentName] - Filter by student name
 * @property {string} [subject] - Filter by subject
 * @property {number} [minGrade] - Minimum grade value
 * @property {number} [maxGrade] - Maximum grade value
 * @property {string} [sortBy] - Sort field
 * @property {string} [sortDirection] - Sort direction
 */
export interface GradeListParams {
  idAccount: number;
  studentName?: string;
  subject?: string;
  minGrade?: number;
  maxGrade?: number;
  sortBy?: string;
  sortDirection?: string;
}

/**
 * @interface GradeUpdateParams
 * @description Parameters for updating a grade
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} id - Grade identifier
 * @property {string} studentName - Updated student name
 * @property {string} subject - Updated subject name
 * @property {number} gradeValue - Updated grade value
 * @property {string} [observation] - Updated observations
 */
export interface GradeUpdateParams {
  idAccount: number;
  idUser: number;
  id: number;
  studentName: string;
  subject: string;
  gradeValue: number;
  observation?: string | null;
}

/**
 * @interface GradeDeleteParams
 * @description Parameters for deleting a grade
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} id - Grade identifier
 */
export interface GradeDeleteParams {
  idAccount: number;
  idUser: number;
  id: number;
}

/**
 * @interface GradeListBySubjectParams
 * @description Parameters for listing grades by subject
 *
 * @property {number} idAccount - Account identifier
 * @property {string} subject - Subject name
 */
export interface GradeListBySubjectParams {
  idAccount: number;
  subject: string;
}

/**
 * @interface GradeSubjectOverviewParams
 * @description Parameters for subject overview
 *
 * @property {number} idAccount - Account identifier
 * @property {string} [sortBy] - Sort field
 * @property {string} [sortDirection] - Sort direction
 */
export interface GradeSubjectOverviewParams {
  idAccount: number;
  sortBy?: string;
  sortDirection?: string;
}

/**
 * @interface GradeListResult
 * @description Grade list result structure
 *
 * @property {number} id - Grade identifier
 * @property {string} studentName - Student name
 * @property {string} subject - Subject name
 * @property {number} gradeValue - Grade value
 * @property {string | null} observation - Observations
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */
export interface GradeListResult {
  id: number;
  studentName: string;
  subject: string;
  gradeValue: number;
  observation: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @interface GradeSubjectStatistics
 * @description Statistics for a subject
 *
 * @property {number} totalGrades - Total number of grades
 * @property {number | null} averageGrade - Average grade value
 * @property {number | null} minGrade - Minimum grade value
 * @property {number | null} maxGrade - Maximum grade value
 */
export interface GradeSubjectStatistics {
  totalGrades: number;
  averageGrade: number | null;
  minGrade: number | null;
  maxGrade: number | null;
}

/**
 * @interface GradeSubjectResult
 * @description Result structure for subject-specific grades
 *
 * @property {Array} grades - Array of grade records
 * @property {GradeSubjectStatistics} statistics - Subject statistics
 */
export interface GradeSubjectResult {
  grades: any[];
  statistics: GradeSubjectStatistics;
}
