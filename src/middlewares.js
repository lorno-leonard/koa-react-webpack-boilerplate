/* globals AppError */
import debug from 'debug';

let logger = debug('http');

let statusCodes = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INVALID_USERNAME: 403,
  INVALID_PASSWORD: 403
};

export default [
  function * httpLogger(next) {
    let request = {
      method: this.request.method,
      url: this.request.originalUrl,
      headers: this.request.headers
    };
    if (this.request.body) {
      request.body = this.request.body;
    }
    logger('request', request);
    yield next;
    let response = {
      method: this.request.method,
      url: this.request.originalUrl,
      headers: this.headers,
      status: this.status
    };
    if (this.body) {
      response.body = this.body;
    }
    logger('response', response);
  },
  function * handleErrors(next) {
    try {
      yield next;
    } catch (err) {
      if (err instanceof AppError) {
        this.body = err.toObject();
        this.status = statusCodes[err.code] || 400;
      } else {
        this.body = {
          code: 'INTERNAL_SERVER_ERROR',
          message: err.message
        };
        this.status = 500;
      }
    }
  },
  function * setBaseUrl(next) {
    this.baseUrl = process.env.BASE_URL;
    yield next;
  }
];
