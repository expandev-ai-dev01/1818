/**
 * @summary
 * Grade business logic and database operations.
 * Handles all grade-related database interactions through stored procedures.
 *
 * @module services/grade/gradeRules
 */

import sql from 'mssql';
import { config } from '@/config';
import {
  GradeCreateParams,
  GradeGetParams,
  GradeListParams,
  GradeUpdateParams,
  GradeDeleteParams,
  GradeListBySubjectParams,
  GradeSubjectOverviewParams,
  GradeEntity,
  GradeListResult,
  GradeSubjectResult,
} from './gradeTypes';

const projectSchema = `project_${process.env.PROJECT_ID}`;

const poolConfig: sql.config = {
  server: config.database.server,
  port: config.database.port,
  database: config.database.database,
  user: config.database.user,
  password: config.database.password,
  options: {
    encrypt: config.database.options.encrypt,
    trustServerCertificate: config.database.options.trustServerCertificate,
    enableArithAbort: true,
  },
};

let pool: sql.ConnectionPool | null = null;

async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await sql.connect(poolConfig);
  }
  return pool;
}

/**
 * @summary
 * Creates a new grade record.
 *
 * @function gradeCreate
 * @module grade
 *
 * @param {GradeCreateParams} params - Grade creation parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {string} params.studentName - Student name
 * @param {string} params.subject - Subject name
 * @param {number} params.gradeValue - Grade value (0.0-10.0)
 * @param {string} [params.observation] - Optional observations
 *
 * @returns {Promise<{ id: number }>} Created grade identifier
 *
 * @throws {Error} When validation fails or database operation fails
 */
export async function gradeCreate(params: GradeCreateParams): Promise<{ id: number }> {
  const dbPool = await getPool();
  const result = await dbPool
    .request()
    .input('idAccount', sql.Int, params.idAccount)
    .input('idUser', sql.Int, params.idUser)
    .input('studentName', sql.NVarChar(100), params.studentName)
    .input('subject', sql.NVarChar(50), params.subject)
    .input('gradeValue', sql.Numeric(3, 1), params.gradeValue)
    .input('observation', sql.NVarChar(200), params.observation || null)
    .execute(`[${projectSchema}].[spGradeCreate]`);

  return result.recordset[0];
}

/**
 * @summary
 * Retrieves a specific grade by ID.
 *
 * @function gradeGet
 * @module grade
 *
 * @param {GradeGetParams} params - Grade retrieval parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.id - Grade identifier
 *
 * @returns {Promise<GradeEntity>} Grade record
 *
 * @throws {Error} When grade not found or database operation fails
 */
export async function gradeGet(params: GradeGetParams): Promise<GradeEntity> {
  const dbPool = await getPool();
  const result = await dbPool
    .request()
    .input('idAccount', sql.Int, params.idAccount)
    .input('id', sql.Int, params.id)
    .execute(`[${projectSchema}].[spGradeGet]`);

  return result.recordset[0];
}

/**
 * @summary
 * Lists all grades with optional filtering and sorting.
 *
 * @function gradeList
 * @module grade
 *
 * @param {GradeListParams} params - Grade list parameters
 * @param {number} params.idAccount - Account identifier
 * @param {string} [params.studentName] - Filter by student name
 * @param {string} [params.subject] - Filter by subject
 * @param {number} [params.minGrade] - Minimum grade value
 * @param {number} [params.maxGrade] - Maximum grade value
 * @param {string} [params.sortBy] - Sort field
 * @param {string} [params.sortDirection] - Sort direction
 *
 * @returns {Promise<GradeListResult[]>} Array of grade records
 *
 * @throws {Error} When database operation fails
 */
export async function gradeList(params: GradeListParams): Promise<GradeListResult[]> {
  const dbPool = await getPool();
  const result = await dbPool
    .request()
    .input('idAccount', sql.Int, params.idAccount)
    .input('studentName', sql.NVarChar(100), params.studentName || null)
    .input('subject', sql.NVarChar(50), params.subject || null)
    .input('minGrade', sql.Numeric(3, 1), params.minGrade || null)
    .input('maxGrade', sql.Numeric(3, 1), params.maxGrade || null)
    .input('sortBy', sql.NVarChar(20), params.sortBy || 'createdAt')
    .input('sortDirection', sql.NVarChar(4), params.sortDirection || 'desc')
    .execute(`[${projectSchema}].[spGradeList]`);

  return result.recordset;
}

/**
 * @summary
 * Updates an existing grade record.
 *
 * @function gradeUpdate
 * @module grade
 *
 * @param {GradeUpdateParams} params - Grade update parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.id - Grade identifier
 * @param {string} params.studentName - Updated student name
 * @param {string} params.subject - Updated subject name
 * @param {number} params.gradeValue - Updated grade value
 * @param {string} [params.observation] - Updated observations
 *
 * @returns {Promise<void>}
 *
 * @throws {Error} When grade not found or database operation fails
 */
export async function gradeUpdate(params: GradeUpdateParams): Promise<void> {
  const dbPool = await getPool();
  await dbPool
    .request()
    .input('idAccount', sql.Int, params.idAccount)
    .input('idUser', sql.Int, params.idUser)
    .input('id', sql.Int, params.id)
    .input('studentName', sql.NVarChar(100), params.studentName)
    .input('subject', sql.NVarChar(50), params.subject)
    .input('gradeValue', sql.Numeric(3, 1), params.gradeValue)
    .input('observation', sql.NVarChar(200), params.observation || null)
    .execute(`[${projectSchema}].[spGradeUpdate]`);
}

/**
 * @summary
 * Deletes a grade record permanently.
 *
 * @function gradeDelete
 * @module grade
 *
 * @param {GradeDeleteParams} params - Grade deletion parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.id - Grade identifier
 *
 * @returns {Promise<void>}
 *
 * @throws {Error} When grade not found or database operation fails
 */
export async function gradeDelete(params: GradeDeleteParams): Promise<void> {
  const dbPool = await getPool();
  await dbPool
    .request()
    .input('idAccount', sql.Int, params.idAccount)
    .input('idUser', sql.Int, params.idUser)
    .input('id', sql.Int, params.id)
    .execute(`[${projectSchema}].[spGradeDelete]`);
}

/**
 * @summary
 * Retrieves all grades for a specific subject with statistics.
 *
 * @function gradeListBySubject
 * @module grade
 *
 * @param {GradeListBySubjectParams} params - Subject filter parameters
 * @param {number} params.idAccount - Account identifier
 * @param {string} params.subject - Subject name
 *
 * @returns {Promise<GradeSubjectResult>} Grades and statistics for subject
 *
 * @throws {Error} When database operation fails
 */
export async function gradeListBySubject(
  params: GradeListBySubjectParams
): Promise<GradeSubjectResult> {
  const dbPool = await getPool();
  const result = await dbPool
    .request()
    .input('idAccount', sql.Int, params.idAccount)
    .input('subject', sql.NVarChar(50), params.subject)
    .execute(`[${projectSchema}].[spGradeListBySubject]`);

  const recordsets = result.recordsets as sql.IRecordSet<any>[];

  return {
    grades: recordsets[0] || [],
    statistics: recordsets[1] ? recordsets[1][0] : null,
  };
}

/**
 * @summary
 * Retrieves overview statistics for all subjects.
 *
 * @function gradeSubjectOverview
 * @module grade
 *
 * @param {GradeSubjectOverviewParams} params - Overview parameters
 * @param {number} params.idAccount - Account identifier
 * @param {string} [params.sortBy] - Sort field
 * @param {string} [params.sortDirection] - Sort direction
 *
 * @returns {Promise<any[]>} Array of subjects with statistics
 *
 * @throws {Error} When database operation fails
 */
export async function gradeSubjectOverview(params: GradeSubjectOverviewParams): Promise<any[]> {
  const dbPool = await getPool();
  const result = await dbPool
    .request()
    .input('idAccount', sql.Int, params.idAccount)
    .input('sortBy', sql.NVarChar(20), params.sortBy || 'subject')
    .input('sortDirection', sql.NVarChar(4), params.sortDirection || 'asc')
    .execute(`[${projectSchema}].[spGradeSubjectOverview]`);

  return result.recordset;
}
