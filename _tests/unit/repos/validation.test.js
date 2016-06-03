'use strict';
import chai from "chai";
import sinon from 'sinon';
const expect = chai.expect;
import Repo from "../../../repos/Repo";
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const makeClass = (rules) => {
	class Test extends Repo {
		constructor() {
			super();
			this.rules = rules
		}
	}
	return new Test();
}

describe("Repo validation", function() {
	it ("Should throw if no rules have been defined", function (done) {
		const test = makeClass();
		test.validate()
			.then(() => done( new Error('Fail test')))
			.catch( e => {
				expect(e.message).to.equal('No validation rule are present on the model');
				done()
			})
	});

	it ("Should pass if rules array is empty", function (done) {
		const test = makeClass({});
		test.validate({}).then((res) => {
			expect(res).to.equal(true);
			done();
		})
	});

	it ("Should throw an error containing error data when validation fails", function () {
		const test = makeClass({name: 'required|alpha'});
		return test.validate({name:null}).catch(function(e) {
			expect(e.message).to.equal('notifications.validation_failed');
		});
	});

	it ("the error object should hold the informations about the errros and be properly formated", function () {
		const test = makeClass({name: 'required|alpha'});
		return test.validate({name: null}).catch((error) => {
			expect(error.meta['name'].errors.length).to.equal(1);
			expect(error.meta['name'].errors[0]).to.equal('alpha validation failed on name');
		})
	});
})