"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const math = require("mathjs");
const __1 = require("./..");
const risk_json = require('../risk');
const trans = Object.freeze([
    Object.freeze({ age: 55, gender: 'male' }),
    Object.freeze({ age: 23, gender: 'female' }),
    Object.freeze({ age: 100, gender: 'male' }),
    Object.freeze({ age: 50, gender: 'male' }),
    Object.freeze({ age: 50, gender: 'male', sibling: true }),
    Object.freeze({ age: 50, gender: 'male', offspring: true })
]);
describe('test calc', () => {
    describe('barbados', () => {
        const study = 'barbados';
        it('calculates risk_from_study', () => {
            chai_1.expect(__1.risk_from_study(risk_json, Object.assign({ study }, trans[0]))).to.eql(4.6);
            chai_1.expect(__1.risk_from_study(risk_json, Object.assign({ study }, trans[1]))).to.eql(1);
        });
        it('correctly identifies most at risk', () => {
            const input = Object.assign({ study }, trans[2]);
            const risk = __1.risk_from_study(risk_json, input);
            chai_1.expect(risk).to.eql(24.8);
            const risks = __1.risks_from_study(risk_json, input);
            chai_1.expect(math.divide(risks.lastIndexOf(risk) + 1, risks.length)).to.eql(1);
        });
        it('calculates added risk of family history', () => {
            const no_fam = { age: trans[3].age, gender: trans[4].gender, study };
            const fam = Object.assign({ study }, trans[4]);
            const no_fam_risk = __1.risk_from_study(risk_json, no_fam);
            const fam_risk_from_study = __1.risk_from_study(risk_json, fam);
            const fam_risk = __1.combined_risk(__1.familial_risks_from_study(risk_json, fam), fam_risk_from_study);
            chai_1.expect(no_fam_risk).to.eql(4.6);
            chai_1.expect(fam_risk).to.be.gt(no_fam_risk);
        });
    });
    describe('framingham', () => {
        const study = 'framingham';
        it('calculates risk_from_study', () => {
            chai_1.expect(__1.risk_from_study(risk_json, Object.assign({ study }, trans[0]))).to.eql(1.2);
            chai_1.expect(__1.risk_from_study(risk_json, Object.assign({ study }, trans[1]))).to.eql(0.5);
        });
        it('correctly identifies most at risk', () => {
            const input = Object.assign({ study }, trans[2]);
            const risk = __1.risk_from_study(risk_json, input);
            chai_1.expect(risk).to.eql(5.6);
            const risks = __1.risks_from_study(risk_json, input);
            chai_1.expect(math.divide(risks.lastIndexOf(risk) + 1, risks.length)).to.eql(1);
        });
        it('calculates added risk of family history', () => {
            const no_fam = { age: trans[3].age, gender: trans[4].gender, study };
            const fam = Object.assign({ study }, trans[4]);
            const no_fam_risk = __1.risk_from_study(risk_json, no_fam);
            const fam_risk_from_study = __1.risk_from_study(risk_json, fam);
            const fam_risk = __1.combined_risk(__1.familial_risks_from_study(risk_json, fam), fam_risk_from_study);
            chai_1.expect(no_fam_risk).to.eql(1.2);
            chai_1.expect(fam_risk).to.be.gt(no_fam_risk);
        });
    });
    describe('olmsted', () => {
        const study = 'olmsted';
        it('calculates risk_from_study', () => {
            chai_1.expect(__1.risk_from_study(risk_json, Object.assign({ study }, trans[0]))).to.eql(1.13260785);
            chai_1.expect(__1.risk_from_study(risk_json, Object.assign({ study }, trans[1]))).to.eql(0.1895492496);
        });
        it('correctly identifies most at risk', () => {
            const input = Object.assign({ study }, trans[2]);
            const risk = __1.risk_from_study(risk_json, input);
            chai_1.expect(risk).to.eql(7.381032154);
            const risks = __1.risks_from_study(risk_json, input);
            chai_1.expect(math.divide(risks.lastIndexOf(risk) + 1, risks.length)).to.eql(1);
        });
        it('calculates added risk of family history', () => {
            const no_fam = { age: trans[3].age, gender: trans[4].gender, study };
            const fam = Object.assign({ study }, trans[4]);
            const no_fam_risk = __1.risk_from_study(risk_json, no_fam);
            const fam_risk_from_study = __1.risk_from_study(risk_json, fam);
            const fam_risk = __1.combined_risk(__1.familial_risks_from_study(risk_json, fam), fam_risk_from_study);
            chai_1.expect(no_fam_risk).to.eql(1.13260785);
            chai_1.expect(fam_risk).to.be.gt(no_fam_risk);
        });
    });
    describe('singapore', () => {
        const study = 'singapore';
        it('calculates risk_from_study', () => {
            chai_1.expect(__1.risk_from_study(risk_json, Object.assign({ study }, trans[0]))).to.eql(2.6);
            chai_1.expect(__1.risk_from_study(risk_json, Object.assign({ study }, trans[1]))).to.eql(0.3);
        });
        it('correctly identifies most at risk', () => {
            const input = Object.assign({ study }, trans[2]);
            const risk = __1.risk_from_study(risk_json, input);
            chai_1.expect(risk).to.eql(3.2);
            const risks = __1.risks_from_study(risk_json, input);
            chai_1.expect(math.divide(risks.lastIndexOf(risk) + 1, risks.length)).to.eql(1);
        });
        it('calculates added risk of family history', () => {
            const no_fam = { age: trans[3].age, gender: trans[4].gender, study };
            const fam = Object.assign({ study }, trans[4]);
            const no_fam_risk = __1.risk_from_study(risk_json, no_fam);
            const fam_risk_from_study = __1.risk_from_study(risk_json, fam);
            const fam_risk = __1.combined_risk(__1.familial_risks_from_study(risk_json, fam), fam_risk_from_study);
            chai_1.expect(no_fam_risk).to.eql(2.6);
            chai_1.expect(fam_risk).to.be.gt(no_fam_risk);
        });
    });
});
