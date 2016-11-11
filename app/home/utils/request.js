import request from 'superagent';

export default {
  call: function (method, api, data, callback) {
    method = method.toLowerCase();

    if (method === 'get') {
      request[method](api).end(callback);
    } else {
      request[method](api).send(data).end(callback);
    }
  }
};
