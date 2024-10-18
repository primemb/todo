import { Request, Response, NextFunction } from "express";
import { ValidationError, validationResult } from "express-validator";
import HttpException from "../models/HttpException";

function validateRequest(req: Request, _res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors: { [key: string]: string }[] = [];

    const errorArray: ValidationError[] = errors.array();

    errorArray.map((err) => {
      if (err.type === "field") {
        extractedErrors.push({ [err.path]: err.msg });
      } else {
        extractedErrors.push({ [err.type]: err.msg });
      }
    });

    next(new HttpException(422, "Validation failed", extractedErrors));
  } else {
    next();
  }
}

export default validateRequest;
