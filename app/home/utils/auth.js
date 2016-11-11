import request from './request';

export default {
  checkAuth: function(nextState, replace) {
    if (nextState.location.pathname === '/login') {
      if(!!localStorage.token) replace('/');
    } else {
      if(!localStorage.token) replace('/login');
    }
  },

  signOut: function(router) {
    request.call('POST', 'logout', {}, function(err, res) {
      if (err) {
        console.log(err);
        return;
      }

      delete localStorage.token;
      router.replace('/login');
    });
  },

  signIn: function(credentials, self, callback) {
    request.call('POST', '/login', credentials, function(err, res) {
      callback(err, res);

      if (!err) {
        localStorage.token = res.body.token;

        // Redirect
        let {location} = self.props;
        if (location.state && location.state.nextPathname) {
          self.props.router.replace(location.state.nextPathname)
        } else {
          self.props.router.replace('/')
        }
      }
    });
  }
};
