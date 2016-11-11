import path from 'path';

export default {
  staticCache: {
    path: path.join(__dirname, '../../public'),
    options: {
      maxAge: 86400000
    }
  },
  render: {
    root: path.join(__dirname, '../../public'),
    viewExt: 'html',
    layout: false,
    cache: false
  }
};
