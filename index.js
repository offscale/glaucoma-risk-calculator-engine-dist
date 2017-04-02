"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var fs_1 = require("fs");
var assert = require("assert");
function ethnicities_pretty(ethnicities) {
    return ethnicities.map(function (study) {
        return (function (study_name) { return study_name + ": " + study[study_name].join(', '); })(Object.keys(study)[0]);
    });
}
exports.ethnicities_pretty = ethnicities_pretty;
function s_col_to_s(s) {
    return s.slice(0, s.indexOf(':'));
}
exports.s_col_to_s = s_col_to_s;
function in_range(range, num) {
    if (range === 'all' || range[0] === '_')
        return false;
    var dash = range.indexOf('-');
    if (dash !== -1)
        return num >= parseInt(range.slice(0, dash - range.length)) && num <= parseInt(range.slice(-dash));
    var last = range.slice(-2);
    if (!isNaN(parseInt(last[0])))
        last = last[1];
    if (isNaN(parseInt(last))) {
        var rest_1 = parseInt(range);
        var operators = Object.freeze({
            '>': num > rest_1,
            '+': num >= rest_1,
            '>=': num >= rest_1,
            '=>': num >= rest_1
        });
        if (Object.keys(operators).indexOf(last) === -1)
            throw TypeError("Invalid operation of `" + last + "`");
        return operators[last];
    }
    var op = range.slice(0, 2), rest = parseInt(range.slice(2));
    if (op === '<=' || op === '=<')
        return num <= rest;
    else if (op[0] === '<')
        return num < parseInt(range.slice(1));
    else if (op === '>=' || op === '=>')
        return num >= rest;
    return range === num;
}
exports.in_range = in_range;
function lowest_range(ranges) {
    return ranges.reduce(function (prevNum, currentValue) {
        var curNum = parseInt(currentValue);
        return curNum < prevNum ? curNum : prevNum;
    }, 100);
}
exports.lowest_range = lowest_range;
function uniq(a) {
    var seen = {};
    return a.filter(function (item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    }).filter(function (k) { return k !== undefined; });
}
exports.uniq = uniq;
function preprocess_studies(risk_json) {
    Object.keys(risk_json.studies).forEach(function (study_name) {
        if (risk_json.studies[study_name].hasOwnProperty('age')) {
            var sr = sort_ranges(Object.keys(risk_json.studies[study_name].age));
            if (sr[0][0] !== '<') {
                var lt = "<" + parseInt(sr[0]);
                risk_json.studies[study_name].age = Object.assign((_a = {}, _a[lt] = risk_json.studies[study_name].age[sr[0]], _a), risk_json.studies[study_name].age);
            }
        }
        if (risk_json.studies[study_name].hasOwnProperty('agenda')) {
            var all_genders_seen = uniq(risk_json.studies[study_name].agenda.map(function (agenda) { return agenda.gender; }));
            var gendersAssigned_1 = 0;
            all_genders_seen.forEach(function (gender) {
                var sr = sort_ranges(risk_json.studies[study_name].agenda.filter(function (agenda) {
                    return agenda.gender === gender;
                }).map(function (agenda) { return agenda.age; }));
                if (sr.length) {
                    var lowest_bar_1 = sr.find(function (o) { return ['=<', '<='].indexOf(o.slice(0, 2)) === -1 && ['<', '>'].indexOf(o[0][0]) === -1; });
                    gendersAssigned_1++;
                    var lt = parseInt(lowest_bar_1);
                    assert(!isNaN(lt), lowest_bar_1 + " unexpectedly pareses to NaN");
                    risk_json.studies[study_name].agenda.unshift(Object.assign({}, risk_json.studies[study_name].agenda.filter(function (agenda) { return agenda.age === lowest_bar_1 && agenda.gender === gender; })[0], { age: "<" + lt }));
                }
            });
            assert.equal(gendersAssigned_1, all_genders_seen.length, 'Genders assigned != all genders');
        }
        var _a;
    });
    return risk_json;
}
exports.preprocess_studies = preprocess_studies;
function sort_ranges(ranges) {
    var collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base',
        ignorePunctuation: true
    });
    return ranges.sort(function (a, b) {
        return a[0] === '>' && !isNaN(parseInt(b[0])) ? 1 : collator.compare(a, b);
    });
}
exports.sort_ranges = sort_ranges;
function ensure_map(k) {
    if (k === 'map')
        return true;
    throw TypeError("Expected map, got " + k);
}
function risk_from_study(risk_json, input) {
    if (util_1.isNullOrUndefined(risk_json))
        throw TypeError('`risk_json` must be defined');
    else if (util_1.isNullOrUndefined(input))
        throw TypeError('`input` must be defined');
    preprocess_studies(risk_json);
    var study = risk_json.studies[input.study];
    var study_vals = study[study.expr[0].key];
    var out1 = util_1.isArray(study_vals) ? study_vals.filter(function (o) {
        return study.expr[0].filter.every(function (k) {
            return k === 'age' ? in_range(o.age, input.age) : input.hasOwnProperty(k) ? o[k] === input[k] : true;
        });
    })[study.expr[0].take > 0 ? study.expr[0].take - 1 : 0]
        : study_vals[ensure_map(study.expr[0].type) && Object.keys(study_vals).filter(function (k) {
            return in_range(k, input[study.expr[0].key]);
        })[study.expr[0].take - 1]];
    if (!out1)
        throw TypeError('Expected out to match something');
    return util_1.isNumber(out1) ? out1 : out1[study.expr[0].extract];
}
exports.risk_from_study = risk_from_study;
function risks_from_study(risk_json, study_name) {
    if (util_1.isNullOrUndefined(risk_json))
        throw TypeError('`risk_json` must be defined');
    else if (util_1.isNullOrUndefined(study_name))
        throw TypeError('`study_name` must be defined');
    preprocess_studies(risk_json);
    var study = risk_json.studies[study_name];
    var study_vals = study[study.expr[0].key];
    var out1 = util_1.isArray(study_vals) ?
        study_vals.map(function (o) { return o[study.expr[0].extract]; })
        : ensure_map(study.expr[0].type) && Object.keys(study_vals).filter(function (k) { return ['a', '_'].indexOf(k[0]) === -1; }).map(function (k) { return study_vals[k]; });
    if (!out1)
        throw TypeError('Expected out to match something');
    return uniq(out1);
}
exports.risks_from_study = risks_from_study;
function place_in_array(entry, a) {
    if (util_1.isNullOrUndefined(entry))
        throw TypeError('`entry` must be defined');
    else if (util_1.isNullOrUndefined(a))
        throw TypeError('`a` must be defined');
    var sortedA = a.sort();
    for (var i = 0; i < sortedA.length; i++)
        if (sortedA[i] === entry)
            return i;
    return -1;
}
exports.place_in_array = place_in_array;
function list_ethnicities(risk_json) {
    if (util_1.isNullOrUndefined(risk_json))
        throw TypeError('`risk_json` must be defined');
    return Object.keys(risk_json.studies).map(function (k) {
        return _a = {}, _a[k] = risk_json.studies[k].ethnicities, _a;
        var _a;
    });
}
exports.list_ethnicities = list_ethnicities;
if (require.main === module) {
    fs_1.exists('./risk.json', function (fs_exists) {
        console.error("fs_exists = " + fs_exists);
        fs_1.writeFile("/tmp/a.txt", "fs_exists = " + fs_exists, function (err) {
            if (err)
                throw err;
            console.info('saved');
            fs_1.readFile('./risk.json', 'utf8', function (err, data) {
                if (err)
                    throw err;
                console.info(data);
            });
        });
    });
}
