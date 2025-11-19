/**
 * @summary
 * Zod validation utilities.
 * Provides reusable validation schemas and helpers.
 *
 * @module utils/zodValidation
 */

import { z } from 'zod';

// String validators
export const zString = z.string().min(1);
export const zNullableString = (maxLength?: number) => {
  let schema = z.string();
  if (maxLength) {
    schema = schema.max(maxLength);
  }
  return schema.nullable();
};

// Name validators
export const zName = z.string().min(1).max(200);
export const zNullableDescription = z.string().max(500).nullable();

// Number validators
export const zFK = z.number().int().positive();
export const zNullableFK = z.number().int().positive().nullable();

// Boolean validators
export const zBit = z.coerce.number().int().min(0).max(1);

// Date validators
export const zDateString = z.string().datetime();
export const zNullableDate = z.string().datetime().nullable();
