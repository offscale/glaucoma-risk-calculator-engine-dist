"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var __1 = require("./..");
var risk_json = require('../risk');
var trans = Object.freeze({ age: 55, gender: 'male' });
it('barbados', function () {
    chai_1.expect(__1.risk_from_study(risk_json, Object.assign({
        study: 'barbados'
    }, trans))).to.eql(4.1);
});
it('framingham', function () {
    chai_1.expect(__1.risk_from_study(risk_json, Object.assign({
        study: 'framingham'
    }, trans))).to.eql(0.012);
});
it('olmsted', function () {
    chai_1.expect(__1.risk_from_study(risk_json, Object.assign({
        study: 'olmsted'
    }, trans))).to.eql(11.326078497068);
});
