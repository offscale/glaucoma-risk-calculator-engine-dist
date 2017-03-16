"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const __1 = require("./..");
const risk_json = require('../risk');
const trans = Object.freeze({ age: 55, gender: 'male' });
it('barbados', () => {
    chai_1.expect(__1.risk_from_study(risk_json, Object.assign({
        study: 'barbados'
    }, trans))).to.eql(4.1);
});
it('framingham', () => {
    chai_1.expect(__1.risk_from_study(risk_json, Object.assign({
        study: 'framingham'
    }, trans))).to.eql(0.012);
});
it('olmsted', () => {
    chai_1.expect(__1.risk_from_study(risk_json, Object.assign({
        study: 'olmsted'
    }, trans))).to.eql(11.326078497068);
});
