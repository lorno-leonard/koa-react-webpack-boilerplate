import jwt from 'jwt-simple';

export default {
  create: function * (payload) {
    return jwt.encode(payload, process.env.TOKEN_SECRET);
  },
  decode: function * (token) {
    return jwt.decode(token, process.env.TOKEN_SECRET);
  }
};
