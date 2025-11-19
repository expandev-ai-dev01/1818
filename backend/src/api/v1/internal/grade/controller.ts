/**
 * @summary
 * Grade management controller.
 * Handles all CRUD operations for student grades.
 *
 * @module api/v1/internal/grade/controller
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import {
  gradeCreate,
  gradeGet,
  gradeList,
  gradeUpdate,
  gradeDelete,
  gradeListBySubject,
  gradeSubjectOverview,
} from '@/services/grade';

const securable = 'GRADE';

/**
 * @api {post} /api/v1/internal/grade Create Grade
 * @apiName CreateGrade
 * @apiGroup Grade
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new grade record for a student
 *
 * @apiParam {String} studentName Student name (3-100 characters)
 * @apiParam {String} subject Subject name (2-50 characters)
 * @apiParam {Number} gradeValue Grade value (0.0-10.0)
 * @apiParam {String} [observation] Optional observations (max 200 characters)
 *
 * @apiSuccess {Number} id Created grade identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */
export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const bodySchema = z.object({
    studentName: z.string().min(3).max(100),
    subject: z.string().min(2).max(50),
    gradeValue: z.coerce.number().min(0).max(10),
    observation: z.string().max(200).nullable().optional(),
  });

  const [validated, error] = await operation.create(req, bodySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = validated.params;
    const result = await gradeCreate({
      ...validated.credential,
      ...data,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(StatusGeneralError).json(errorResponse('Internal server error'));
    }
  }
}

/**
 * @api {get} /api/v1/internal/grade/:id Get Grade
 * @apiName GetGrade
 * @apiGroup Grade
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves a specific grade by ID
 *
 * @apiParam {Number} id Grade identifier
 *
 * @apiSuccess {Number} id Grade identifier
 * @apiSuccess {String} studentName Student name
 * @apiSuccess {String} subject Subject name
 * @apiSuccess {Number} gradeValue Grade value
 * @apiSuccess {String} observation Observations
 * @apiSuccess {String} createdAt Creation timestamp
 * @apiSuccess {String} updatedAt Last update timestamp
 *
 * @apiError {String} NotFound Grade not found
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  const [validated, error] = await operation.read(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await gradeGet({
      ...validated.credential,
      ...validated.params,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(404).json(errorResponse(error.message));
    } else {
      res.status(StatusGeneralError).json(errorResponse('Internal server error'));
    }
  }
}

/**
 * @api {get} /api/v1/internal/grade List Grades
 * @apiName ListGrades
 * @apiGroup Grade
 * @apiVersion 1.0.0
 *
 * @apiDescription Lists all grades with optional filtering and sorting
 *
 * @apiParam {String} [studentName] Filter by student name
 * @apiParam {String} [subject] Filter by subject
 * @apiParam {Number} [minGrade] Minimum grade value
 * @apiParam {Number} [maxGrade] Maximum grade value
 * @apiParam {String} [sortBy] Sort field (studentName, subject, gradeValue, createdAt)
 * @apiParam {String} [sortDirection] Sort direction (asc, desc)
 *
 * @apiSuccess {Array} data Array of grade records
 *
 * @apiError {String} ServerError Internal server error
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const querySchema = z
    .object({
      studentName: z.string().min(3).optional(),
      subject: z.string().min(2).optional(),
      minGrade: z.coerce.number().min(0).max(10).optional(),
      maxGrade: z.coerce.number().min(0).max(10).optional(),
      sortBy: z.enum(['studentName', 'subject', 'gradeValue', 'createdAt']).optional(),
      sortDirection: z.enum(['asc', 'desc']).optional(),
    })
    .optional();

  const [validated, error] = await operation.list(req, querySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await gradeList({
      ...validated.credential,
      ...validated.params,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    res.status(StatusGeneralError).json(errorResponse('Internal server error'));
  }
}

/**
 * @api {put} /api/v1/internal/grade/:id Update Grade
 * @apiName UpdateGrade
 * @apiGroup Grade
 * @apiVersion 1.0.0
 *
 * @apiDescription Updates an existing grade record
 *
 * @apiParam {Number} id Grade identifier
 * @apiParam {String} studentName Student name (3-100 characters)
 * @apiParam {String} subject Subject name (2-50 characters)
 * @apiParam {Number} gradeValue Grade value (0.0-10.0)
 * @apiParam {String} [observation] Optional observations (max 200 characters)
 *
 * @apiSuccess {Boolean} success Operation success status
 *
 * @apiError {String} NotFound Grade not found
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */
export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);

  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  const bodySchema = z.object({
    studentName: z.string().min(3).max(100),
    subject: z.string().min(2).max(50),
    gradeValue: z.coerce.number().min(0).max(10),
    observation: z.string().max(200).nullable().optional(),
  });

  const [validated, error] = await operation.update(req, paramsSchema, bodySchema);

  if (!validated) {
    return next(error);
  }

  try {
    await gradeUpdate({
      ...validated.credential,
      ...validated.params,
    });

    res.json(successResponse({ success: true }));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      res.status(StatusGeneralError).json(errorResponse('Internal server error'));
    }
  }
}

/**
 * @api {delete} /api/v1/internal/grade/:id Delete Grade
 * @apiName DeleteGrade
 * @apiGroup Grade
 * @apiVersion 1.0.0
 *
 * @apiDescription Permanently deletes a grade record
 *
 * @apiParam {Number} id Grade identifier
 *
 * @apiSuccess {Boolean} success Operation success status
 *
 * @apiError {String} NotFound Grade not found
 * @apiError {String} ServerError Internal server error
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'DELETE' }]);

  const paramsSchema = z.object({
    id: z.coerce.number(),
  });

  const [validated, error] = await operation.delete(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    await gradeDelete({
      ...validated.credential,
      ...validated.params,
    });

    res.json(successResponse({ success: true }));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(404).json(errorResponse(error.message));
    } else {
      res.status(StatusGeneralError).json(errorResponse('Internal server error'));
    }
  }
}

/**
 * @api {get} /api/v1/internal/grade/subject/:subject Get Grades by Subject
 * @apiName GetGradesBySubject
 * @apiGroup Grade
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves all grades for a specific subject with statistics
 *
 * @apiParam {String} subject Subject name
 *
 * @apiSuccess {Array} grades Array of grade records for the subject
 * @apiSuccess {Object} statistics Subject statistics (total, average, min, max)
 *
 * @apiError {String} ServerError Internal server error
 */
export async function listBySubjectHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const paramsSchema = z.object({
    subject: z.string().min(2),
  });

  const [validated, error] = await operation.read(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await gradeListBySubject({
      ...validated.credential,
      ...validated.params,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    res.status(StatusGeneralError).json(errorResponse('Internal server error'));
  }
}

/**
 * @api {get} /api/v1/internal/grade/overview Subject Overview
 * @apiName GetSubjectOverview
 * @apiGroup Grade
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves overview statistics for all subjects
 *
 * @apiParam {String} [sortBy] Sort field (subject, totalGrades, averageGrade)
 * @apiParam {String} [sortDirection] Sort direction (asc, desc)
 *
 * @apiSuccess {Array} data Array of subjects with statistics
 *
 * @apiError {String} ServerError Internal server error
 */
export async function overviewHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const querySchema = z
    .object({
      sortBy: z.enum(['subject', 'totalGrades', 'averageGrade']).optional(),
      sortDirection: z.enum(['asc', 'desc']).optional(),
    })
    .optional();

  const [validated, error] = await operation.list(req, querySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await gradeSubjectOverview({
      ...validated.credential,
      ...validated.params,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    res.status(StatusGeneralError).json(errorResponse('Internal server error'));
  }
}
