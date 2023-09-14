import pino from 'pino';
import pinoHttp from 'pino-http';

export const pinoLogger = pino({
  transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty', options: { colorize: true } } : undefined,
});

export const logger = pinoHttp({
  logger: pinoLogger,
  redact: ['req.headers.authorization', 'req.headers.cookie', 'req.body.password'],
  serializers: {
    res(response) {
      return {
        statusCode: response.statusCode,
        headers: response.headers,
      };
    },
    req(request) {
      return {
        method: request.method,
        url: request.url,
        path: request.path,
        query: request.query,
        params: request.params,
        body: request.raw.body,
        headers: request.headers,
      };
    },
  },
  useLevel: 'info',
});
