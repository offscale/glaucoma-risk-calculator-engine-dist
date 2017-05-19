"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var __1 = require("./..");
var risk_json = require('../risk');
var test = function (user, expectation) {
    var mrisks = __1.calc_default_multiplicative_risks(risk_json, user);
    chai_1.expect(mrisks).to.be.an.instanceof(Object);
    chai_1.expect(mrisks).to.have.property('myopia');
    chai_1.expect(mrisks).to.have.property('diabetes');
    chai_1.expect(mrisks).to.have.property('family_history');
    chai_1.expect(mrisks).to.have.property('age');
    chai_1.expect(mrisks).to.be.eql(expectation);
};
describe('default_multiplicative_risks', function () {
    it('worst-case', function () {
        var user = {
            myopia: true,
            family_history: true,
            diabetes: true,
            age: 81
        };
        var user_risk = {
            myopia: '4x',
            diabetes: '3x',
            family_history: '3x',
            age: '12x'
        };
        test(user, user_risk);
    });
    it('bad age', function () {
        var user = {
            myopia: false,
            family_history: false,
            diabetes: false,
            age: 80
        };
        var user_risk = {
            myopia: '1x',
            family_history: '1x',
            diabetes: '1x',
            age: '3x'
        };
        test(user, user_risk);
    });
    it('best-case', function () {
        var user = {
            myopia: false,
            family_history: false,
            diabetes: false,
            age: 49
        };
        var user_risk = {
            myopia: '1x',
            family_history: '1x',
            diabetes: '1x',
            age: '1x'
        };
        test(user, user_risk);
    });
});
