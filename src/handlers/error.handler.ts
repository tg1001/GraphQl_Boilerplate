import { APIError } from '@/utils/APIError.js';
import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export const errorHandler = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  let err = error;
  let apiError: APIError;
  if (!(err instanceof APIError)) {
    const statusCode = 400;
    const message = err.message || 'An error occurred';
    apiError = new APIError(statusCode, message);
  } else {
    apiError = err;
  }

  const statusCode = apiError.statusCode || 500;
  const message = apiError.message || statusCode.toString();

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  reply.status(statusCode).send(response);
};