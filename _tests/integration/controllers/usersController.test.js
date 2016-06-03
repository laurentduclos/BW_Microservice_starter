'use strict';

import request from 'supertest';
import chai from "chai";
const expect = chai.expect;
import sinon from 'sinon';
import {cleanupCollections, prepareMongo, userId, cookie} from '../../mongo-test-utils';
import {app} from "../../../app";
import {TEST_NUM_VALID} from "../../../services/SMSProvider";

const properUserData = {
  mobile_number: {
    prefix: '11',
    number: TEST_NUM_VALID
  },
  mobile_number_verification_token: 123,
  gender: 'male',
  nickname: 'test-nickname',
  password: '123',
  birthdate: new Date()
};
describe("Users controller", () => {
  beforeEach(done => {
    cleanupCollections(['users'], done);
  });
  // afterEach(function(done) {
  //   cleanupCollections(['users'], done);
  // });

  describe("GET: /verify-phone/:prefix/:num", () => {
    it ("should send error if number is already in use", done => {
      const server = app.listen();
      request(server)
      .get('/api/users/verify-phone/111/123123123')
      .set('Accept', 'application/json')
      .expect(422)
      .expect( res => {
        if (!('error' in res.body)) throw new Error("Respond does not contain an error object");
        expect(res.body.error.message).to.equal('notifications.number_in_use');
      })
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
    });
  });

  describe("GET: /users", () => {
    it ("should respond", done => {
      const server = app.listen();
      request(server)
      .get('/api/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/vnd.api+json')
      .expect(200, done);
    });
  });

  describe("POST: /users/:id", () => {
    it ("should return 403 if user is not the resource owner", done => {
      const server = app.listen();
      request(server)
        .post('/api/users/' + userId)
        .set('Content-Type', 'multipart/form-data')
        .field('jybrish', 'acbcd')
        .expect(403)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

    it ("should return 422 if validation fails", done => {
      const server = app.listen();
      request(server)
        .post('/api/users/' + userId)
        .set('Content-Type', 'multipart/form-data')
        .set('Cookie', cookie)
        .field('jybrish', 'acbcd')
        .expect(422)
        .expect( res => {
          if (!('error' in res.body)) throw new Error("Respond does not contain an error object");
          expect(res.body.error.message).to.equal('notifications.validation_failed');
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

    it ("should update user data", done => {
      const server = app.listen();
      request(server)
        .post('/api/users/' + userId)
        .set('Content-Type', 'multipart/form-data')
        .set('Cookie', cookie)
        .field('nickname', 'acbcd')
        .field('gender', 'acbcd')
        .field('birthdate', 'asdfsd')
        .expect(201)
        .end((err, res) => {
          expect(res.body.data.nickname).to.equal('acbcd');
          if (err) return done(err);
          done();
        });
    });
  });

  describe("POST: /users", () => {
    it ("should return errors if validation failed", done => {
      const server = app.listen();
      request(server)
        .post('/api/users')
        .send({})
        .expect(422)
        .expect( res => {
          if (!('error' in res.body)) throw new Error("Respond does not contain an error object");
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

    it ("should save a user if no error are found", done => {
      const server = app.listen();
      request(server)
        .post('/api/users')
        .send(properUserData)
        .expect(201)
        .end((err, res) => {
          expect(res.body.data.user).to.contain({nickname: 'test-nickname'})
          if (err) return done(err);
          done();
        });
    });
  });
})