export default {
  // Page API
  'GET /': 'PageController.index',

  // Authentication API
  'POST /login': 'AuthController.login',
  'POST /logout': 'AuthController.logout'
};
