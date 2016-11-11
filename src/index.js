/* globals Policies */
import koa from 'koa';
import json from 'koa-json';
import compose from 'koa-compose';
import bodyParser from 'koa-bodyparser';
import staticCache from 'koa-static-cache';
import render from 'koa-ejs';
import _ from 'lodash';
import co from 'co';
import debug from 'debug';
import * as Util from './utilities';
import routes from './routes';
import config from './config/app';

let logger = debug('boot');
let router = require('koa-router')();

logger('Loading utilities.');
global.Util = Util;

_.merge(global, require('./error'));

let app = koa();

global.app = {};

global.app.started = co(function * () {
  app.use(json({pretty: true, param: 'pretty'}));
  app.use(bodyParser());

  logger('Loading static files.');
  app.use(
    staticCache(
      config.staticCache.path,
      config.staticCache.options
    )
  );

  logger('Loading view engine.');
  render(app, config.render);

  logger('Loading models.');
  Util.dynamicRequire('./models');

  logger('Loading controllers.');
  Util.dynamicRequire('./controllers');

  logger('Loading middlewares.');
  let middlewares = require('./middlewares').default;
  _.each(middlewares, middleware => {
    app.use(middleware);
  });

  logger('Loading policies.');
  Util.dynamicRequire('./policies', 'Policies');
  let policies = require('./policies').default;

  logger('Attaching routes.');
  _.each(routes, (value, key) => {
    logger('route', key);
    let stack = [];
    let handler = _.get(global, value);
    if (!handler) throw new Error(`${value} does not exist.`);
    let policyList = _.get(policies, value);
    if (policyList) {
      _.each(policyList, policy => {
        if (Policies[policy]) {
          stack.push(Policies[policy]);
        }
      });
    }
    let match = key.match(/^(GET|POST|DELETE|PUT|PATCH) (.+)$/);
    let method = match[1].toLowerCase();
    let path = match[2];
    stack.push(function * (next) {
      yield handler.call(this);
      yield next;
    });
    router[method](path, compose(stack));
  });

  app
    .use(router.routes())
    .use(router.allowedMethods());

  yield new Promise(function(resolve) {
    global.app.server = app.listen(process.env.HTTP_PORT, resolve);
  });
  logger(`Server bound to port ${process.env.HTTP_PORT}.`);
});

global.app.started.catch(function(err) {
  console.error(err, err.stack);
});
