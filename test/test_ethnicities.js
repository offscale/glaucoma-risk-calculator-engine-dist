"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const __1 = require("./..");
const risk_json = require('../risk');
it('lists ethnicities', () => {
    const ethnicity_list = __1.list_ethnicities(risk_json);
    chai_1.expect(ethnicity_list).to.be.an.instanceof(Array);
    chai_1.expect(ethnicity_list).to.be.eql([
        { olmsted: ['White', 'German', 'Norwegian', 'Irish', 'English'] },
        { framingham: ['White', 'England', 'Scotland', 'Wales', 'Ireland', 'Italy', 'Canadian', 'Europe'] },
        { barbados: ['Black', 'African', 'Afro-Barbadian', 'Mulatto', 'Mixed'] }
    ]);
});
