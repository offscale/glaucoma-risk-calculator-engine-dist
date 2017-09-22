"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var __1 = require("./..");
var risk_json = require('../risk');
describe('ethnicities', function () {
    it('lists ethnicities', function () {
        var ethnicity_list = __1.list_ethnicities(risk_json);
        chai_1.expect(ethnicity_list).to.be.an.instanceof(Array);
        chai_1.expect(ethnicity_list.filter(function (o) { return Object.keys(o)[0] === 'olmsted'; })[0]['olmsted']).to.be.eql([
            'White (German; Norwegian; Irish; English)'
        ]);
        chai_1.expect(ethnicity_list.filter(function (o) { return Object.keys(o)[0] === 'framingham'; })[0]['framingham']).to.be.eql([
            'White European (Canadian; Italian; Irish; Welsh; Scottish)'
        ]);
        chai_1.expect(ethnicity_list.filter(function (o) { return Object.keys(o)[0] === 'barbados'; })[0]['barbados']).to.be.eql([
            'Black African (Barbados, Lesser Antilles, Caribbean)'
        ]);
        chai_1.expect(ethnicity_list.filter(function (o) { return Object.keys(o)[0] === 'ghana'; })[0]['ghana']).to.be.eql([
            'Black African (Ghana)'
        ]);
    });
    it('ethnicity2study', function () {
        var ethnicity2study_res = __1.ethnicity2study(risk_json);
        var ethnicity = 'White (German; Norwegian; Irish; English)';
        chai_1.expect(ethnicity2study_res).to.include.keys(ethnicity);
        chai_1.expect(ethnicity2study_res[ethnicity]).to.be.eql('olmsted');
        chai_1.expect(Object.keys(ethnicity2study_res)).to.have.length(10);
    });
});
