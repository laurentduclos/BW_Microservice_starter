'use strict';
import request from 'supertest';
import chai from "chai";
const expect = chai.expect;
import sinon from 'sinon';
import {app} from "../../../app";

const server = app.listen();

describe("Common controller (controllers/commonController.js)", function() {
  describe("GET: /", function() {
    it ("should respond 200", function (done) {
      request(server)
      .get('/')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        console.log(res.body)
        expect(res.body.data).to.equal('Hello world');
        if (err) return done(err);
        done();
      });
    });
  });
})