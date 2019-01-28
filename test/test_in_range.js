"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var __1 = require("../");
describe('tests in range', function () {
    var ranges = ['<40', '40-49', '50-59', '60-69', '>=70'];
    it('edge', function () {
        chai_1.expect(__1.in_range('all', 55)).to.be.false;
    });
    it('lower', function () {
        chai_1.expect(__1.pos_in_range(ranges, 5)).to.be.eql(0);
    });
    it('within', function () {
        chai_1.expect(__1.in_range('55-66', 55)).to.be.true;
        chai_1.expect(__1.in_range('55-66', 60)).to.be.true;
        chai_1.expect(__1.in_range('55-66', 66)).to.be.true;
        chai_1.expect(__1.in_range('55-66', 67)).to.be.false;
        chai_1.expect(__1.pos_in_range(ranges, 51)).to.be.eql(2);
    });
    it('upper', function () {
        chai_1.expect(__1.in_range('55+', 55)).to.be.true;
        chai_1.expect(__1.in_range('55>', 55)).to.be.false;
        chai_1.expect(__1.in_range('55>', 56)).to.be.true;
        chai_1.expect(__1.in_range('55>=', 66)).to.be.true;
        chai_1.expect(__1.in_range('55+', 50)).to.be.false;
        chai_1.expect(__1.in_range('85+', 100)).to.be.true;
        chai_1.expect(__1.pos_in_range(ranges, 500)).to.be.eql(4);
    });
});
