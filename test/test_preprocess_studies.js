"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var __1 = require("./..");
var risk_json = require('../risk');
it('preprocess_studies', function () {
    var processedRiskJson = __1.preprocess_studies(risk_json);
    Object.keys(processedRiskJson.studies).forEach(function (study_name) {
        if (risk_json.studies[study_name].hasOwnProperty('age')) {
            for (var i in risk_json.studies[study_name].age)
                if (risk_json.studies[study_name].age.hasOwnProperty(i)
                    && typeof (i) !== 'function' && (i[0] === '<' || !isNaN(parseInt(i[0], 10)))) {
                    if (i[0] === '<')
                        break;
                }
        }
        if (risk_json.studies[study_name].hasOwnProperty('agenda')) {
            var lt_genders_seen_1 = [];
            var all_genders_seen_1 = [];
            risk_json.studies[study_name].agenda.forEach(function (agenda) {
                if (agenda.age[0] === '<')
                    lt_genders_seen_1.push(agenda.gender);
                all_genders_seen_1.push(agenda.gender);
            });
            chai_1.expect(__1.uniq(lt_genders_seen_1)).to.have.members(__1.uniq(all_genders_seen_1));
        }
    });
});
