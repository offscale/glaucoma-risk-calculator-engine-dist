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
            console.info('calc_relative_risk(risk_json, Object.assign({ study }, trans[0]))', _1.calc_relative_risk(risk_json, Object.assign({ study: study }, trans[0])), ';');
            chai_1.expect(_1.calc_relative_risk(risk_json, Object.assign({ study: study }, trans[0]))).to.eql({
                age: 55,
                study: 'barbados',
                rr: [
                    { indian: 3.6998972250770814 },
                    { aboriginal: 1.1 },
                    { nepal: 0.79 },
                    { olmsted: 1.13260785 },
                    { framingham: 1.2 },
                    { bmes: 1.242064887 },
                    { korean: 1.99 },
                    { singapore: 2.6 },
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
                    bmes: {
                        age: '<60',
                        gender: 'male',
                        positive: 0.3399192356321839,
                        'positive (%)': 1.242064887
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
                    korean: { max_prevalence: 1.99, age: '50-59' },
                    nepal: {
                        N: 506,
                        age: '50-59',
                        gender: 'male',
                        'n (%)': '4 (0.79)',
                        prevalence: 0.79
                    },
                    olmsted: { max_prevalence: 1.13260785, age: '50-59' },
                    singapore: {
                        _denominator: 100,
                        age: '50-59',
                        gender: 'male',
                        prevalence: 2.6
                    }
                },
                graphed_rr: [
                    {
                        name: 'Indian',
                        size: 3.6998972250770814,
                        value: 3.6998972250770814
                    },
                    { name: 'Australian Aboriginal', size: 1.1, value: 1.1 },
                    { name: 'Nepalese', size: 0.79, value: 0.79 },
                    {
                        name: 'White (German; Norwegian; Irish; English)',
                        size: 1.13260785,
                        value: 1.13260785
                    },
                    {
                        name: 'White European (Canadian; Italian; Irish; Welsh; Scottish)',
                        size: 1.2,
                        value: 1.2
                    },
                    {
                        name: 'White (Northern European: Australian)',
                        size: 1.242064887,
                        value: 1.242064887
                    },
                    { name: 'Korean', size: 1.99, value: 1.99 },
                    { name: 'Chinese [Singapore: urban]', size: 2.6, value: 2.6 },
                    {
                        name: 'Black African (Barbados, Lesser Antilles, Caribbean)',
                        size: 4.6,
                        value: 4.6
                    },
                    { name: 'Black African (Ghana)', size: 6.5, value: 6.5 },
                    { name: 'Japanese', size: 7.7, value: 7.7 }
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
    describe('nepal', function () {
        var study = 'nepal';
        it('calculates risk_from_study', function () {
            chai_1.expect(_1.risk_from_study(risk_json, Object.assign({ study: study }, trans[0]))).to.eql(0.79);
            chai_1.expect(_1.risk_from_study(risk_json, Object.assign({ study: study }, trans[1]))).to.eql(0.12);
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
