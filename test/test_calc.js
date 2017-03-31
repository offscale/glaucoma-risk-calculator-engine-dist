"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var __1 = require("./..");
var risk_json = require('../risk');
var trans = Object.freeze([
    Object.freeze({ age: 55, gender: 'male' }),
    Object.freeze({ age: 23, gender: 'female' })
]);
it('barbados', function () {
    chai_1.expect(__1.risk_from_study(risk_json, Object.assign({
        study: 'barbados'
    }, trans[0]))).to.eql(4.1);
    chai_1.expect(__1.risk_from_study(risk_json, Object.assign({
        study: 'barbados'
    }, trans[1]))).to.eql(2.4);
});
it('framingham', function () {
    chai_1.expect(__1.risk_from_study(risk_json, Object.assign({
        study: 'framingham'
    }, trans[0]))).to.eql(0.012);
    chai_1.expect(__1.risk_from_study(risk_json, Object.assign({
        study: 'framingham'
    }, trans[1]))).to.eql(0.005);
});
it('olmsted', function () {
    chai_1.expect(__1.risk_from_study(risk_json, Object.assign({
        study: 'olmsted'
    }, trans[0]))).to.eql(11.326078497068);
    chai_1.expect(__1.risk_from_study(risk_json, Object.assign({
        study: 'olmsted'
    }, trans[1]))).to.eql(1.89549249600724);
});
