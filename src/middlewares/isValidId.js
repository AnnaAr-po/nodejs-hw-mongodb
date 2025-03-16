import { isValidObjectId } from 'mongoose';
import createError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { studentId } = req.params;
  if (!isValidObjectId(studentId)) {
    throw createError(400, 'Bad Request');
  }

  next();
};