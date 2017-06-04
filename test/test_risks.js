"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var __1 = require("./..");
var risk_json = require('../risk');
describe('tests risks', function () {
    it('barbados', function () {
        var risk_distribution = [1.9, 1, 1.4, 4.6, 3.7, 4.1, 9.4, 4.9, 6.7, 17.5, 12.7, 14.8, 24.8, 22, 23.2, 10.6];
        chai_1.expect(__1.risks_from_study(risk_json, { study: 'barbados', age: null })).to.have.members(risk_distribution);
        chai_1.expect(__1.place_in_array(1, risk_distribution)).to.eql(0);
        chai_1.expect(__1.place_in_array(6.7, risk_distribution)).to.eql(risk_distribution.indexOf(6.7));
        chai_1.expect(__1.place_in_array(24.8, risk_distribution)).to.eql(risk_distribution.lastIndexOf(24.8));
    });
    it('framingham', function () {
        var risk_distribution = [0.005, 0.008, 0.012, 0.022, 0.029, 0.056, 0.011, 0.039, 0.016, 0.017, 0.047];
        chai_1.expect(__1.risks_from_study(risk_json, { study: 'framingham', age: null })).to.have.members(risk_distribution);
        chai_1.expect(__1.place_in_array(0.005, risk_distribution)).to.eql(0);
        chai_1.expect(__1.place_in_array(0.011, risk_distribution)).to.eql(risk_distribution.indexOf(0.011));
        chai_1.expect(__1.place_in_array(0.047, risk_distribution)).to.eql(risk_distribution.lastIndexOf(0.047));
    });
    it('olmsted', function () {
        var risk_distribution = [
            1.89549249600724, 2.73716568581642, 11.326078497068, 30, 94.5570698594758, 73.8103215395919
        ];
        chai_1.expect(__1.risks_from_study(risk_json, { study: 'olmsted', age: null })).to.have.members(risk_distribution);
        chai_1.expect(__1.place_in_array(1.89549249600724, risk_distribution)).to.eql(0);
        chai_1.expect(__1.place_in_array(11.326078497068, risk_distribution)).to.eql(risk_distribution.indexOf(11.326078497068));
        chai_1.expect(__1.place_in_array(73.8103215395919, risk_distribution)).to.eql(risk_distribution.lastIndexOf(73.8103215395919));
    });
});
