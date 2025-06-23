import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
};

export default errorMiddleware;
