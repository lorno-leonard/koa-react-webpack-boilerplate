/* globals Util, AppError */
import Token from '../lib/token';
import moment from 'moment';

export let validCredentials = function * (next) {
  let token = this.cookies.get('token') || this.query.token;

  // Check token availability
  if (!token) {
    throw new AppError('UNAUTHORIZED', 'Unathorized access.');
  }

  // Validate token
  let payload = yield Token.decode(token);
  let requiredKeys = [
    'username',
    'expire'
  ];
  if (!Util.hasEvery(requiredKeys, payload)) {
    throw new AppError('UNAUTHORIZED', 'Invalid token.');
  }

  // Check if token is expired
  let now = moment().unix();
  if (payload.expire < now) {
    throw new AppError('UNAUTHORIZED', 'Token expired.');
  }

  yield next;
};
