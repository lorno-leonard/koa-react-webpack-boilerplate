/* globals UserModel, AppError, Util */
import _ from 'lodash';
import Token from '../lib/token';
import moment from 'moment';

export let AuthController = {
  login: function * () {
    let params = _.pick(this.request.body, [
      'username',
      'password'
    ]);

    // Check if there is a username and a password
    if (!_.has(params, 'username') || !_.has(params, 'password')) {
      throw new AppError('FORBIDDEN', 'Username and Password required.');
    }

    // Check uf username exists
    let user = yield UserModel.findByUsername(params.username);
    if (!user) {
      throw new AppError('INVALID_USERNAME', 'Username does not exist.');
    }

    // Check password validity
    let compare = yield Util.bcryptCompare(params.password, user.password);
    if (!compare) {
      throw new AppError('INVALID_PASSWORD', 'Invalid password.');
    }

    // Generate token
    let payload = _.pick(user, [
      'username'
    ]);
    payload.expire = moment().add(1, 'd').unix();
    let token = yield Token.create(payload);
    this.cookies.set('token', token);
    this.body = {token};
    this.status = 200;
  },
  logout: function * () {
    // Remove token
    this.cookies.set('token', '');
    this.status = 200;
  }
};
