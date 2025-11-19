/**
 * @summary
 * Internal (authenticated) API routes configuration for V1.
 * Handles authenticated endpoints for grade management.
 *
 * @module routes/v1/internalRoutes
 */

import { Router } from 'express';
import * as gradeController from '@/api/v1/internal/grade/controller';

const router = Router();

// Grade management routes
router.get('/grade', gradeController.listHandler);
router.post('/grade', gradeController.createHandler);
router.get('/grade/overview', gradeController.overviewHandler);
router.get('/grade/subject/:subject', gradeController.listBySubjectHandler);
router.get('/grade/:id', gradeController.getHandler);
router.put('/grade/:id', gradeController.updateHandler);
router.delete('/grade/:id', gradeController.deleteHandler);

export default router;
