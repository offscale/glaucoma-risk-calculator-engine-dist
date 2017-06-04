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
            'White [Olmsted]',
            'German [Olmsted]',
            'Norwegian [Olmsted]',
            'Irish [Olmsted]',
            'English [Olmsted]'
        ]);
        chai_1.expect(ethnicity_list.filter(function (o) { return Object.keys(o)[0] === 'framingham'; })[0]['framingham']).to.be.eql([
            'White [Framingham]',
            'English [Framingham]',
            'Scottish [Framingham]',
            'Wales [Framingham]',
            'Irish [Framingham]',
            'Italian [Framingham]',
            'Canadian [Framingham]',
            'European [Framingham]'
        ]);
        chai_1.expect(ethnicity_list.filter(function (o) { return Object.keys(o)[0] === 'barbados'; })[0]['barbados']).to.be.eql([
            'Black [Barbados]',
            'African [Barbados, Lesser Antilles, Caribbean]',
            'Afro-Barbadian',
            'Mixed [Barbados]'
        ]);
        chai_1.expect(ethnicity_list.filter(function (o) { return Object.keys(o)[0] === 'ghana'; })[0]['ghana']).to.be.eql([
            'Black [Ghana]',
            'African [Ghana]',
            'Ghanaian',
            'Akwapim',
            'Ewe',
            'Ga',
            'Adangbe'
        ]);
    });
    it('ethnicity2study', function () {
        var ethnicity2study_res = __1.ethnicity2study(risk_json);
        chai_1.expect(ethnicity2study_res).to.include.keys('White [Olmsted]');
        chai_1.expect(ethnicity2study_res['White [Olmsted]']).to.be.eql('olmsted');
        chai_1.expect(Object.keys(ethnicity2study_res)).to.have.length(24);
    });
});
