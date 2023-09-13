import { Response } from 'express';

export const successResponse = ({
  res,
  statusCode,
  data,
  message,
}: {
  res: Response;
  statusCode: number;
  message?: string;
  data?: any;
}) => {
  res.status(statusCode).json({
    message,
    success: true,
    statusCode,
    data,
  });
};
