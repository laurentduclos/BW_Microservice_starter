'use strict';

const expect = require('expect');
const sinon = require('sinon');

import User from "../../../repos/User";

const collection = {
	findById() {},
	insert() {},
	find() {},
	remove() {}
}
const repo = new User(collection);

describe("Repo master class", function() {
	it ("be able to get user count", function (done) {
		done()
	});
})