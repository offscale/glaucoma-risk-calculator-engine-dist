"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var __1 = require("./..");
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
            console.info(JSON.stringify(__1.calc_relative_risk(risk_json, Object.assign({
                study: study
            }, trans[0])).graphed_rr));
            chai_1.expect(__1.calc_relative_risk(risk_json, Object.assign({
                study: study
            }, trans[0]))).to.eql({
                age: 55,
                study: 'barbados',
                graphed_rr: [{ "name": "framingham", "size": 0.012, "value": 0.012 }, {
                        "name": "barbados",
                        "size": 4.6,
                        "value": 4.6
                    }, { "name": "ghana", "size": 6.5, "value": 6.5 }, {
                        "name": "olmsted",
                        "size": 11.326078497068,
                        "value": 11.326078497068
                    }],
                relative_risk: [
                    {
                        framingham: 0.012
                    },
                    {
                        barbados: 4.6
                    },
                    {
                        ghana: 6.5
                    },
                    {
                        olmsted: 11.326078497068
                    }
                ],
                risk_per_study: {
                    olmsted: {
                        max_prevalence: 11.326078497068,
                        age: '50-59'
                    },
                    framingham: {
                        gender: 'male',
                        age: '52-64',
                        n: 601,
                        oags: 6,
                        meth2_prevalence: 0.01,
                        meth3_prevalence: 0.012
                    },
                    barbados: {
                        gender: 'male',
                        age: '50-59',
                        max_prevalence: 4.6,
                        ci: '2.9-7.0',
                        _denominator: 100
                    },
                    ghana: {
                        max_prevalence: 6.5,
                        age: '55-59'
                    }
                },
                gender: 'male'
            });
        });
    });
});
