"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const __1 = require("./..");
const risk_json = require('../risk');
const test = (user, expectation) => {
    const mrisks = __1.calc_default_multiplicative_risks(risk_json, user);
    chai_1.expect(mrisks).to.be.an.instanceof(Object);
    chai_1.expect(mrisks).to.have.property('myopia');
    chai_1.expect(mrisks).to.have.property('diabetes');
    chai_1.expect(mrisks).to.have.property('family_history');
    chai_1.expect(mrisks).to.have.property('age');
    chai_1.expect(mrisks).to.be.eql(expectation);
};
describe('default_multiplicative_risks', () => {
    it('worst-case', () => {
        const user = {
            myopia: true,
            family_history: true,
            diabetes: true,
            age: 81
        };
        const user_risk = {
            myopia: 4,
            diabetes: 3,
            family_history: 3,
            age: 12
        };
        test(user, user_risk);
    });
    it('bad age', () => {
        const user = {
            myopia: false,
            family_history: false,
            diabetes: false,
            age: 80
        };
        const user_risk = {
            myopia: 1,
            family_history: 1,
            diabetes: 1,
            age: 3
        };
        test(user, user_risk);
    });
    it('best-case', () => {
        const user = {
            myopia: false,
            family_history: false,
            diabetes: false,
            age: 49
        };
        const user_risk = {
            myopia: 1,
            family_history: 1,
            diabetes: 1,
            age: 1
        };
        test(user, user_risk);
    });
});
