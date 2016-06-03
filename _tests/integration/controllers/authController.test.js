'use strict';
import request from 'supertest';
import chai from "chai";
const expect = chai.expect;
import sinon from 'sinon';
import {cleanupCollections } from '../../mongo-test-utils';
import {app} from "../../../app";
import {getMongoPool} from '../../../middlewares/mongodb';


const userData = {
  mobile_number: {
    prefix: '11',
    number: '123123'
  },
  mobile_number_verification_token: '123',
  gender: 'male',
  nickname: 'test-nickname',
  password: '$2a$10$WYBi7O/RvyfM.48uh2zu/O2t0T2eXI1C8Xrx2cJW0V0lMxsxfPu6m',
  birthdate: new Date()
};
const server = app.listen();

describe("Auth controller", function() {
  describe("POST: /login", function() {
    beforeEach(function(done) {
      cleanupCollections(['users'], async () =>{
        getMongoPool().collection('users').insertOne(userData).then((res) => done());
      });
    });

    it ("should set return a 401 if credentials aren't correct", function (done) {
      request(server)
      .post('/api/auth/signin')
      .set('Accept', 'application/json')
      .send({})
      .expect(401)
      .expect(function(res) {
        if (!('error' in res.body)) throw new Error("Respond does not contain an error object");
      })
      .end(function(err, res){
        if (err) return done(err);
        done();
      });
    });

    it ("should set return a session if credential are correct", function (done) {
      request(server)
      .post('/api/auth/signin')
      .send({mobile_number: userData.mobile_number.number, password: '123' })
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        done();
      });
    });
  });
})