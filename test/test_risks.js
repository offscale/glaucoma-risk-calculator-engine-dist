"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var __1 = require("./..");
var risk_json = require('../risk');
it('barbados', function () {
    var risk_distribution = [2.1, 3, 2.4, 2.6, 4.1, 2.5, 4.5, 7.7, 4.8, 6.8, 8.2, 6.3];
    chai_1.expect(__1.uniq(__1.risks_from_study(risk_json, 'barbados'))).to.eql(risk_distribution);
    chai_1.expect(__1.place_in_array(2.1, risk_distribution)).to.eql(0);
    chai_1.expect(__1.place_in_array(8.2, risk_distribution)).to.eql(risk_distribution.indexOf(8.2));
});
