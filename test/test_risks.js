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
        var risk_distribution = [0.8, 0.5, 1.2, 2.2, 2.9, 5.6, 1.1, 3.9, 1.6, 1.7, 4.7];
        chai_1.expect(__1.risks_from_study(risk_json, { study: 'framingham', age: null })).to.have.members(risk_distribution);
        chai_1.expect(__1.place_in_array(0.5, risk_distribution)).to.eql(0);
        chai_1.expect(__1.place_in_array(1.1, risk_distribution)).to.eql(risk_distribution.indexOf(1.1));
        chai_1.expect(__1.place_in_array(4.7, risk_distribution)).to.eql(risk_distribution.lastIndexOf(4.7));
    });
    it('olmsted', function () {
        var risk_distribution = [0.1895492496, 0.2737165686, 1.13260785, 3, 9.455706986, 7.381032154];
        chai_1.expect(__1.risks_from_study(risk_json, { study: 'olmsted', age: null })).to.have.members(risk_distribution);
        chai_1.expect(__1.place_in_array(0.1895492496, risk_distribution)).to.eql(0);
        chai_1.expect(__1.place_in_array(1.13260785, risk_distribution)).to.eql(risk_distribution.indexOf(1.13260785));
        chai_1.expect(__1.place_in_array(7.381032154, risk_distribution)).to.eql(risk_distribution.lastIndexOf(7.381032154));
    });
    it('singapore', function () {
        var risk_distribution = [0.3, 0.6, 0.4, 1.5, 2.6, 0.7, 2, 3.2, 3, 2.7];
        chai_1.expect(__1.risks_from_study(risk_json, { study: 'singapore', age: null })).to.have.members(risk_distribution);
    });
});
