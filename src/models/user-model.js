/* globals Util */
import _ from 'lodash';

export let UserModel = {
  findByUsername: function * (username) {
    return _.isEqual(username, process.env.ADMIN_USERNAME) ? {
      username: username,
      password: yield Util.bcryptHash(process.env.ADMIN_PASSWORD)
    } : false;
  }
};
