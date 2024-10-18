import { Request, Response, NextFunction } from "express";
import HttpException from "../models/HttpException";

function errorMiddleware(
  error: HttpException,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  const errors = error.errors || null;

  res.status(status).json({
    status,
    message,
    errors,
  });
}

export default errorMiddleware;
