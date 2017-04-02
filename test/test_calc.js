"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var math = require("mathjs");
var __1 = require("./..");
var risk_json = require('../risk');
var trans = Object.freeze([
    Object.freeze({ age: 55, gender: 'male' }),
    Object.freeze({ age: 23, gender: 'female' }),
    Object.freeze({ age: 100, gender: 'male' })
]);
describe('test calc', function () {
    describe('barbados', function () {
        var study = 'barbados';
        it('calculates risk_from_study', function () {
            chai_1.expect(__1.risk_from_study(risk_json, Object.assign({
                study: study
            }, trans[0]))).to.eql(4.1);
            chai_1.expect(__1.risk_from_study(risk_json, Object.assign({
                study: study
            }, trans[1]))).to.eql(2.4);
        });
        it('correctly identifies most at risk', function () {
            var input = Object.assign({ study: study }, trans[2]);
            var risk = __1.risk_from_study(risk_json, input);
            chai_1.expect(risk).to.eql(8.2);
            var risks = __1.risks_from_study(risk_json, input);
            chai_1.expect(math.divide(risks.lastIndexOf(risk) + 1, risks.length)).to.eql(1);
        });
    });
    describe('framingham', function () {
        var study = 'framingham';
        it('calculates risk_from_study', function () {
            chai_1.expect(__1.risk_from_study(risk_json, Object.assign({
                study: study
            }, trans[0]))).to.eql(0.012);
            chai_1.expect(__1.risk_from_study(risk_json, Object.assign({
                study: study
            }, trans[1]))).to.eql(0.005);
        });
        it('correctly identifies most at risk', function () {
            var input = Object.assign({ study: study }, trans[2]);
            var risk = __1.risk_from_study(risk_json, input);
            chai_1.expect(risk).to.eql(0.056);
            var risks = __1.risks_from_study(risk_json, input);
            chai_1.expect(math.divide(risks.lastIndexOf(risk) + 1, risks.length)).to.eql(1);
        });
    });
    describe('olmsted', function () {
        var study = 'olmsted';
        it('calculates risk_from_study', function () {
            chai_1.expect(__1.risk_from_study(risk_json, Object.assign({
                study: study
            }, trans[0]))).to.eql(11.326078497068);
            chai_1.expect(__1.risk_from_study(risk_json, Object.assign({
                study: study
            }, trans[1]))).to.eql(1.89549249600724);
        });
        it('correctly identifies most at risk', function () {
            var input = Object.assign({ study: study }, trans[2]);
            var risk = __1.risk_from_study(risk_json, input);
            chai_1.expect(risk).to.eql(73.8103215395919);
            var risks = __1.risks_from_study(risk_json, input);
            chai_1.expect(math.divide(risks.lastIndexOf(risk) + 1, risks.length)).to.eql(1);
        });
    });
});
