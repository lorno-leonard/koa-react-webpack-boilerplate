/* globals app */
import {expect} from 'chai';
import Token from '../lib/token';
import rand from 'rand-token';
import moment from 'moment';

let request;
let token;

describe('Authentication API', function() {
  this.timeout(20000);

  let admin = {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD
  };

  before(function * () {
    yield app.started;
    request = require('supertest')(app.server);
  });

  after(function * () {
    app.server.close();
  });

  describe('POST /login', function() {
    it('should fail - using GET method', function * () {
      yield request
        .get('/login')
        .expect(405);
    });

    it('should fail - with no username or password', function * () {
      yield request
        .post('/login')
        .send({})
        .expect(403)
        .expect(function(res) {
          expect(res.body).to.be.an('object');

          expect(res.body).to.have.property('code');
          expect(res.body.code).to.equal('FORBIDDEN');

          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Username and Password required.');
        });
    });

    it('should fail - to non existent username', function * () {
      yield request
        .post('/login')
        .send({
          username: 'user_' + rand.generate(6),
          password: admin.password
        })
        .expect(403)
        .expect(function(res) {
          expect(res.body).to.be.an('object');

          expect(res.body).to.have.property('code');
          expect(res.body.code).to.equal('INVALID_USERNAME');

          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Username does not exist.');
        });
    });

    it('should fail - to invalid password', function * () {
      yield request
        .post('/login')
        .send({
          username: admin.username,
          password: admin.password + rand.generate(6)
        })
        .expect(403)
        .expect(function(res) {
          expect(res.body).to.be.an('object');

          expect(res.body).to.have.property('code');
          expect(res.body.code).to.equal('INVALID_PASSWORD');

          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Invalid password.');
        });
    });

    it('should be able to login', function * () {
      yield request
        .post('/login')
        .send(admin)
        .expect(200)
        .expect(function(res) {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('token');
          token = res.body.token;
        });
    });
  });

  describe('POST /logout', function() {
    it('should fail - using GET method', function * () {
      yield request
        .get('/logout')
        .expect(405);
    });

    it('should fail - with no token', function * () {
      yield request
        .post('/logout')
        .expect(401)
        .expect(function(res) {
          expect(res.body).to.be.an('object');

          expect(res.body).to.have.property('code');
          expect(res.body.code).to.equal('UNAUTHORIZED');

          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Unathorized access.');
        });
    });

    it('should fail - with an invalid token', function * () {
      let fakeToken = yield Token.create({lorem: 'ipsum'});
      yield request
        .post('/logout')
        .query({token: fakeToken})
        .expect(401)
        .expect(function(res) {
          expect(res.body).to.be.an('object');

          expect(res.body).to.have.property('code');
          expect(res.body.code).to.equal('UNAUTHORIZED');

          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Invalid token.');
        });
    });

    it('should fail - with an expired token', function * () {
      let payload = yield Token.decode(token);
      payload.expire = moment().subtract(1, 'd').unix();
      let newToken = yield Token.create(payload);
      yield request
        .post('/logout')
        .query({token: newToken})
        .expect(401)
        .expect(function(res) {
          expect(res.body).to.be.an('object');

          expect(res.body).to.have.property('code');
          expect(res.body.code).to.equal('UNAUTHORIZED');

          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Token expired.');
        });
    });

    it('should be able to logout', function * () {
      yield request
        .post('/logout')
        .query({token: token})
        .expect(200);
    });
  });
});
