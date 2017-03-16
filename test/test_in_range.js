"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const __1 = require("./..");
it('edge', () => {
    chai_1.expect(__1.in_range('all', 55)).to.be.false;
});
it('within', () => {
    chai_1.expect(__1.in_range('55-66', 55)).to.be.true;
    chai_1.expect(__1.in_range('55-66', 60)).to.be.true;
    chai_1.expect(__1.in_range('55-66', 66)).to.be.true;
    chai_1.expect(__1.in_range('55-66', 67)).to.be.false;
});
it('beyond', () => {
    chai_1.expect(__1.in_range('55+', 55)).to.be.true;
    chai_1.expect(__1.in_range('55>', 55)).to.be.false;
    chai_1.expect(__1.in_range('55>', 56)).to.be.true;
    chai_1.expect(__1.in_range('55>=', 66)).to.be.true;
    chai_1.expect(__1.in_range('55+', 50)).to.be.false;
});
