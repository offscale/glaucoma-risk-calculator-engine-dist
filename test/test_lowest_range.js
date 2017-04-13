"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var chai_1 = require("chai");
var __1 = require("./..");
it('lowest_range within', function () {
    chai_1.expect(__1.lowest_range(['55-66'])).to.be.eql(55);
});
