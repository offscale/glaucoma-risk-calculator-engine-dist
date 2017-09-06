"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
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
describe('test calc_relative_risk', () => {
    describe('barbados', () => {
        const study = 'barbados';
        it('calculates relative risk', () => {
            chai_1.expect(__1.calc_relative_risk(risk_json, Object.assign({ study }, trans[0]))).to.eql({
                age: 55,
                study: 'barbados',
                risk_per_study: {
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
                    { name: 'White [Framingham]', size: 1.2, value: 1.2 },
                    { name: 'Black [Barbados]', size: 4.6, value: 4.6 },
                    { name: 'Black [Ghana]', size: 6.5, value: 6.5 },
                    { name: 'Tajima [Japanese]', size: 7.7, value: 7.7 },
                    { name: 'White [Olmsted]', size: 1.13260785, value: 1.13260785 },
                    { name: 'Chinese [Singapore: urban]', size: 2.6, value: 2.6 }
                ],
                gender: 'male'
            });
        });
    });
});
