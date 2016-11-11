import './theme/_commons.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'react-router/lib/Router';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import Redirect from 'react-router/lib/Redirect';
import hashHistory from 'react-router/lib/hashHistory';
import App from './views/app';
import ViewDashboard from './views/dashboard';
import ViewLogin from './views/login';
import View404 from './views/_404';
import utilAuth from './utils/auth';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path='/' component={App} onEnter={utilAuth.checkAuth} name='Dashboard'>
      <IndexRoute component={ViewDashboard} />
    </Route>
    <Route path='/login' component={ViewLogin} onEnter={utilAuth.checkAuth} />
    <Route path='/404' component={View404} />
    <Redirect from='*' to='/404' />
  </Router>,
  document.getElementById('root')
);