import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { NODE_ENV } from '../config';

// 404 not found handler
export const notFoundHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next(createHttpError(404, "Your requested content was not found!"));
};

// default error handler
export const errorHandler = (
  err: createHttpError.HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.locals.error = NODE_ENV === "development" ? err : { message: err.message };

  res.status(err.status || 500);

  if (err.status === 404) {
    // Serve static 404.html for 404 errors
    res.sendFile('404.html', { root: './public' });
  } else {
    // json response
    res.json(res.locals.error);
  }
};
