"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var math = require("mathjs");
var _1 = require("../.");
var risk_json = require('../risk');
var trans = Object.freeze([
    Object.freeze({ age: 55, gender: 'male' }),
    Object.freeze({ age: 23, gender: 'female' }),
    Object.freeze({ age: 100, gender: 'male' }),
    Object.freeze({ age: 50, gender: 'male' }),
    Object.freeze({ age: 50, gender: 'male', sibling: true }),
    Object.freeze({ age: 50, gender: 'male', offspring: true })
]);
describe('test calc_relative_risk', function () {
    describe('barbados', function () {
        var study = 'barbados';
        it('calculates relative risk', function () {
            chai_1.expect(_1.calc_relative_risk(risk_json, Object.assign({ study: study }, trans[0]))).to.eql({
                age: 55,
                study: 'barbados',
                rr: [
                    { aboriginal: 1.1 },
                    { olmsted: 1.13260785 },
                    { framingham: 1.2 },
                    { singapore: 2.6 },
                    { indian: 3.6998972250770814 },
                    { barbados: 4.6 },
                    { ghana: 6.5 },
                    { japanese: 7.7 }
                ],
                risk_per_study: {
                    aboriginal: { max_prevalence: 1.1, age: '50-59' },
                    barbados: {
                        _denominator: 100,
                        age: '50-59',
                        ci: '2.9-7.0',
                        gender: 'male',
                        max_prevalence: 4.6
                    },
                    framingham: {
                        age: '52-64',
                        gender: 'male',
                        meth2_prevalence: 1,
                        meth3_prevalence: 1.2,
                        n: 601,
                        oags: 6
                    },
                    ghana: { max_prevalence: 6.5, age: '55-59' },
                    indian: {
                        N: 973,
                        age: '50-59',
                        gender: 'male',
                        positive: 36,
                        prevalence: 3.6998972250770814
                    },
                    japanese: { age: '50-59', gender: 'male', max_prevalence: 7.7 },
                    olmsted: { max_prevalence: 1.13260785, age: '50-59' },
                    singapore: {
                        _denominator: 100,
                        age: '50-59',
                        gender: 'male',
                        prevalence: 2.6
                    }
                },
                graphed_rr: [
                    { name: 'Australian Aboriginal', size: 1.1, value: 1.1 },
                    { name: 'White [Olmsted]', size: 1.13260785, value: 1.13260785 },
                    { name: 'White [Framingham]', size: 1.2, value: 1.2 },
                    { name: 'Chinese [Singapore: urban]', size: 2.6, value: 2.6 },
                    { name: 'Indian', size: 3.6998972250770814, value: 3.6998972250770814 },
                    { name: 'Black [Barbados]', size: 4.6, value: 4.6 },
                    { name: 'Black [Ghana]', size: 6.5, value: 6.5 },
                    { name: 'Tajima [Japanese]', size: 7.7, value: 7.7 }
                ],
                gender: 'male'
            });
        });
        it('correctly identifies most at risk', function () {
            var input = Object.assign({ study: study }, trans[2]);
            var risk = _1.risk_from_study(risk_json, input);
            chai_1.expect(risk).to.eql(24.8);
            var risks = _1.risks_from_study(risk_json, input);
            chai_1.expect(math.divide(risks.lastIndexOf(risk) + 1, risks.length)).to.eql(1);
        });
        it('calculates added risk of family history', function () {
            var no_fam = { age: trans[3].age, gender: trans[4].gender, study: study };
            var fam = Object.assign({ study: study }, trans[4]);
            var no_fam_risk = _1.risk_from_study(risk_json, no_fam);
            var fam_risk_from_study = _1.risk_from_study(risk_json, fam);
            var fam_risk = _1.combined_risk(_1.familial_risks_from_study(risk_json, fam), fam_risk_from_study);
            chai_1.expect(no_fam_risk).to.eql(4.6);
            chai_1.expect(fam_risk).to.be.gt(no_fam_risk);
        });
    });
    describe('framingham', function () {
        var study = 'framingham';
        it('calculates risk_from_study', function () {
            chai_1.expect(_1.risk_from_study(risk_json, Object.assign({ study: study }, trans[0]))).to.eql(1.2);
            chai_1.expect(_1.risk_from_study(risk_json, Object.assign({ study: study }, trans[1]))).to.eql(0.5);
        });
        it('correctly identifies most at risk', function () {
            var input = Object.assign({ study: study }, trans[2]);
            var risk = _1.risk_from_study(risk_json, input);
            chai_1.expect(risk).to.eql(5.6);
            var risks = _1.risks_from_study(risk_json, input);
            chai_1.expect(math.divide(risks.lastIndexOf(risk) + 1, risks.length)).to.eql(1);
        });
        it('calculates added risk of family history', function () {
            var no_fam = { age: trans[3].age, gender: trans[4].gender, study: study };
            var fam = Object.assign({ study: study }, trans[4]);
            var no_fam_risk = _1.risk_from_study(risk_json, no_fam);
            var fam_risk_from_study = _1.risk_from_study(risk_json, fam);
            var fam_risk = _1.combined_risk(_1.familial_risks_from_study(risk_json, fam), fam_risk_from_study);
            chai_1.expect(no_fam_risk).to.eql(1.2);
            chai_1.expect(fam_risk).to.be.gt(no_fam_risk);
        });
    });
    describe('olmsted', function () {
        var study = 'olmsted';
        it('calculates risk_from_study', function () {
            chai_1.expect(_1.risk_from_study(risk_json, Object.assign({ study: study }, trans[0]))).to.eql(1.13260785);
            chai_1.expect(_1.risk_from_study(risk_json, Object.assign({ study: study }, trans[1]))).to.eql(0.1895492496);
        });
        it('correctly identifies most at risk', function () {
            var input = Object.assign({ study: study }, trans[2]);
            var risk = _1.risk_from_study(risk_json, input);
            chai_1.expect(risk).to.eql(7.381032154);
            var risks = _1.risks_from_study(risk_json, input);
            chai_1.expect(math.divide(risks.lastIndexOf(risk) + 1, risks.length)).to.eql(1);
        });
        it('calculates added risk of family history', function () {
            var no_fam = { age: trans[3].age, gender: trans[4].gender, study: study };
            var fam = Object.assign({ study: study }, trans[4]);
            var no_fam_risk = _1.risk_from_study(risk_json, no_fam);
            var fam_risk_from_study = _1.risk_from_study(risk_json, fam);
            var fam_risk = _1.combined_risk(_1.familial_risks_from_study(risk_json, fam), fam_risk_from_study);
            chai_1.expect(no_fam_risk).to.eql(1.13260785);
            chai_1.expect(fam_risk).to.be.gt(no_fam_risk);
        });
    });
});
