"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const __1 = require("./..");
it('lowest_range within', () => {
    chai_1.expect(__1.lowest_range(['55-66'])).to.be.eql(55);
});
