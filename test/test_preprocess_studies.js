"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const __1 = require("./..");
const risk_json = require('../risk');
it('preprocess_studies', () => {
    const processedRiskJson = __1.preprocess_studies(risk_json);
    Object.keys(processedRiskJson.studies).forEach(study_name => {
        if (risk_json.studies[study_name].hasOwnProperty('age')) {
            for (const i in risk_json.studies[study_name].age)
                if (risk_json.studies[study_name].age.hasOwnProperty(i)
                    && typeof (i) !== 'function' && (i[0] === '<' || !isNaN(parseInt(i[0], 10)))) {
                    chai_1.expect(i[0]).to.be.eql('<');
                    break;
                }
        }
        if (risk_json.studies[study_name].hasOwnProperty('agenda')) {
            const lt_genders_seen = [];
            const all_genders_seen = [];
            risk_json.studies[study_name].agenda.forEach(agenda => {
                if (agenda.age[0] === '<')
                    lt_genders_seen.push(agenda.gender);
                all_genders_seen.push(agenda.gender);
            });
            chai_1.expect(lt_genders_seen).to.have.members(__1.uniq(all_genders_seen));
        }
    });
});
