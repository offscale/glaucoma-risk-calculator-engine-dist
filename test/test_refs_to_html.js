"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var __1 = require("./..");
var fs_1 = require("fs");
var risk_json = require('../risk');
describe('test ref to HTML', function () {
    it('turns refs to HTML', function (done) {
        var Cite = require('citation-js');
        var res_html = (new Cite(__1.get_all_refs(risk_json))).get({ format: 'string', type: 'html' });
        risk_json.html_of_all_refs = JSON.stringify(res_html);
        fs_1.writeFile('risk.json', JSON.stringify(risk_json, null, 4), 'utf8', function (err) {
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
