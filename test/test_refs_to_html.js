"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const fs_1 = require("fs");
const risk_json = require('../risk');
describe('test ref to HTML', () => {
    it('turns refs to HTML', (done) => {
        const Cite = require('citation-js');
        const jsonStableStringify = require('json-stable-stringify');
        const res_html = Object
            .keys(risk_json.studies)
            .map(study => `<h5>${study[0].toUpperCase()}${study.slice(1)}</h5> ${(new Cite(risk_json.studies[study].ref)).get({
            format: 'string', type: 'html', style: 'citation-harvard1', lang: 'en-US'
        })}`)
            .reduce((a, b) => a.concat(b));
        risk_json.html_of_all_refs = JSON.stringify(res_html);
        fs_1.writeFile('risk.json', jsonStableStringify(risk_json, { space: 4 }), 'utf8', err => {
            if (err)
                return done(err);
            let er = void 0;
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
