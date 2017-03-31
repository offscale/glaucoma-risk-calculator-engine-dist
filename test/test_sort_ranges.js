"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var __1 = require("./..");
it('sorts ranges', function () {
    chai_1.expect(__1.sort_ranges(['65-74', 'all', '75+', '30-65', '_denominator'])).to.be.eql([
        '30-65', '65-74', '75+', 'all', '_denominator'
    ]);
    chai_1.expect(__1.sort_ranges(['>=70', '40-49', '50-59', '60-69', 'all'])).to.be.eql([
        '40-49', '50-59', '60-69', '>=70', 'all'
    ]);
});
