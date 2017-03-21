"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var __1 = require("./..");
var risk_json = require('../risk');
it('lists ethnicities', function () {
    var ethnicity_list = __1.list_ethnicities(risk_json);
    chai_1.expect(ethnicity_list).to.be.an.instanceof(Array);
    chai_1.expect(ethnicity_list).to.be.eql([
        { olmsted: ['White', 'German', 'Norwegian', 'Irish', 'English'] },
        { framingham: ['White', 'England', 'Scotland', 'Wales', 'Ireland', 'Italy', 'Canadian', 'Europe'] },
        { barbados: ['Black', 'African', 'Afro-Barbadian', 'Mulatto', 'Mixed'] }
    ]);
});
