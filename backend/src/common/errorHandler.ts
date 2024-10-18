import { NextFunction, Request, Response } from "express";

// error handler
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === "development";

  res.status(500).json({
    message: "Internal Server Error",
    ...(isDevelopment && { error: err.message, stack: err.stack }),
  });
};
