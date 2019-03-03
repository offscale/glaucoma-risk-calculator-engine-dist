"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var fs_1 = require("fs");
var risk_json = require('../risk');
describe('test ref to HTML', function () {
    it('turns refs to HTML', function (done) {
        var Cite = require('citation-js');
        var jsonStableStringify = require('json-stable-stringify');
        var res_html = Object
            .keys(risk_json.studies)
            .map(function (study) {
            return "<h5>" + study[0].toUpperCase() + study.slice(1) + " [n=" + risk_json.studies[study].n + "]: "
                + (risk_json.studies[study].ethnicities[0] + "</h5>\n                 " + (typeof risk_json.studies[study].notes === 'undefined' ? ''
                    : '<ul>' + risk_json.studies[study].notes.map(function (l) { return '<li>' + l + '</li>'; }).join('') + '</ul>') + "\n                 " + (new Cite(risk_json.studies[study].ref)).get({
                    format: 'string', type: 'html', style: 'citation-harvard1', lang: 'en-US'
                })).replace('\n', '').replace('                 ', ' ');
        })
            .reduce(function (a, b) { return a.concat(b); });
        var last_elem = risk_json.global_notes.pop();
        if (last_elem.indexOf('Same multiplicative risks used for:') === -1)
            risk_json.global_notes.push(last_elem);
        risk_json.global_notes.push("With the exception of the Korean study, the same multiplicative risks are used for: myopia; hyperopia; diabetes; and family history, as per:" +
            ("" + (new Cite(risk_json.default_multiplicative_risks.ref
                .concat(risk_json.default_family_history.ref)))
                .get({ format: 'string', type: 'html', style: 'citation-harvard1', lang: 'en-US' })));
        risk_json.html_of_all_refs = JSON.stringify(res_html);
        fs_1.writeFile('risk.json', jsonStableStringify(risk_json, { space: 2 }), 'utf8', function (err) {
            if (err)
                return done(err);
            var er = void 0;
            try {
                chai_1.expect(res_html).to.be.a('string');
            }
            catch (e) {
                er = e;
            }
            finally {
                done(er);
            }
        });
    });
});
