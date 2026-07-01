import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
      let statusCode ;
  let message = "Something went wrong";
  let error: any = {};

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = httpStatus.CONFLICT;
        message = `Duplicate value for ${(err.meta?.target as string[])?.join(
          ", "
        )}`;
        break;

      case "P2025":
        statusCode = httpStatus.NOT_FOUND;
        message = "Resource not found";
        break;

      case "P2003":
        statusCode = httpStatus.BAD_REQUEST;
        message = "Foreign key constraint failed";
        break;

      default:
        statusCode = httpStatus.BAD_REQUEST;
        message = err.message;
    }
  }
    // Prisma Validation Error
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Invalid data provided";
  }

   else if (err instanceof Error) {
    statusCode = httpStatus.BAD_REQUEST;
    message = err.message;
  }




    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: err.message,
                error: err.stack
            });

}