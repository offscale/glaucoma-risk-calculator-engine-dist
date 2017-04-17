"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var __1 = require("./..");
var shuffleArray = function (array) {
    array = array.slice(0);
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};
describe('range sorting', function () {
    it('sorts with `all`, `num+` and `_denominator`', function () {
        chai_1.expect(__1.sort_ranges(['65-74', 'all', '75+', '30-65', '_denominator'])).to.be.eql([
            '30-65', '65-74', '75+', '_denominator', 'all'
        ]);
        chai_1.expect(__1.sort_ranges(['>=70', '40-49', '50-59', '60-69', 'all'])).to.be.eql([
            '40-49', '50-59', '60-69', '>=70', 'all'
        ]);
    });
    it('sorts with `<num`, `>=` and random shuffling', function () {
        var arr = ['<40', '40-49', '50-59', '60-69', '>=70'];
        for (var i = 0; i < arr.length * 2; i++)
            chai_1.expect(__1.sort_ranges(shuffleArray(arr))).to.be.eql(arr);
    });
});
