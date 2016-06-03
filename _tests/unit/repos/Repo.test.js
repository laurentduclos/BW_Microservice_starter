'use strict';
import chai from "chai";
import sinon from 'sinon';
const expect = chai.expect;

const getPoolMock = () => ({collection: collectionMock});
const collectionMock = () => collection;
const collection = {
	findById:()=> {},
	insert: ()=> {},
	find: ()=> {},
	remove:()=> {}
}

import Repo from "../../../repos/Repo";

//require('../../../middlewares/mongodb');

const repo = new Repo(getPoolMock, 'test');

describe("Repo master class", function() {
	beforeEach((done) => {
		// mockery.enable();
		// mockery.registerMock('../middlewares/mongodb', () => {collection});
		done()
	})
	// afterEach((done) => {
	// 	mockery.disable();
	// 	done();
	// })
	it ("should store a reference to the collection on the collection property", function (done) {
		expect(repo.collection).to.deep.equal(collection);
		done()
	});
	it("should have a 'findById' method", function(done) {
		expect(repo.findById).to.be.a('function');
		done();
	});
	it("should have an 'insert' method to insert a document", function(done) {
		expect(repo.insert).to.be.a('function');
		done();
	});
	it("should have an 'all' method to retrve all documents", function(done) {
		expect(repo.all).to.be.a('function');
		done();
	});
	it("should have an 'all' method to retrve all documents", function(done) {
		expect(repo.all).to.be.a('function');
		done();
	});
	describe("should have a 'remove'", function() {
		let spy = sinon.spy(collection, 'remove');
		it("that destroys documents selected form query", function(done) {
			repo.remove({"_id": 1});
			expect(spy.calledWith({"_id": 1})).to.equal(true);
			done();
		});
		it("that destroys all documents if no query is passed", function(done) {
			repo.remove();
			expect(spy.calledWith({})).to.equal(true);
			done();
		});
	});
})