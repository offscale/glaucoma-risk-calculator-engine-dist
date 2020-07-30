"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calc_relative_risk = exports.calc_default_multiplicative_risks = exports.ethnicity2study = exports.list_ethnicities = exports.pos_in_range = exports.place_in_array = exports.risks_from_study = exports.combined_risk = exports.familial_risks_from_study = exports.risk_from_study = exports.sort_ranges = exports.preprocess_studies = exports.uniq2 = exports.uniq = exports.lowest_range = exports.in_range = exports.s_col_to_s = exports.ethnicities_pretty = void 0;
var assert = require("assert");
var math = require("mathjs");
var isNullOrUndefined = function (o) { return o == null; };
var isNumber = function (n) { return !isNullOrUndefined(n) && typeof n === 'number'; };
exports.ethnicities_pretty = function (ethnicities) {
    return ethnicities.map(function (study) { return (function (study_name) { return study_name + ": " + study[study_name].join(', '); })(Object.keys(study)[0]); });
};
exports.s_col_to_s = function (s) { return s.slice(0, s.indexOf(':')); };
exports.in_range = function (range, num) {
    if (range === 'all' || range[0] === '_')
        return false;
    var dash = range.indexOf('-');
    if (dash !== -1)
        return num >= parseInt(range.slice(0, dash - range.length), 10) && num <= parseInt(range.slice(-dash), 10);
    var last = range.slice(-2);
    if (!isNaN(parseInt(last[0], 10)))
        last = last[1];
    if (isNaN(parseInt(last, 10))) {
        var _rest = parseInt(range, 10);
        var operators = Object.freeze({
            '>': num > _rest,
            '+': num >= _rest,
            '>=': num >= _rest,
            '=>': num >= _rest
        });
        if (Object.keys(operators).indexOf(last) === -1)
            throw TypeError("Invalid operation of `" + last + "`");
        return operators[last];
    }
    var op = range.slice(0, 2);
    var rest = parseInt(range.slice(2), 10);
    if (op === '<=' || op === '=<')
        return num <= rest;
    else if (op[0] === '<')
        return num < parseInt(range.slice(1), 10);
    else if (op === '>=' || op === '=>')
        return num >= rest;
    return range === num;
};
exports.lowest_range = function (ranges) {
    return ranges.reduce(function (prevNum, currentValue) {
        var curNum = parseInt(currentValue, 10);
        return curNum < prevNum ? curNum : prevNum;
    }, 100);
};
exports.uniq = function (a) {
    var seen = {};
    return a.filter(function (item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    }).filter(function (k) { return k !== undefined; });
};
exports.uniq2 = function (arr) {
    var keys = arr.length === 0 ? [] : Object.keys(arr[0]);
    var seen = new Map();
    arr.forEach(function (a) {
        var key = keys.map(function (k) { return a[k]; }).join('|');
        if (!seen.has(key))
            seen.set(key, a);
    });
    return Array.from(seen.values());
};
exports.preprocess_studies = function (risk_json) {
    Object.keys(risk_json.studies).forEach(function (study_name) {
        var _a;
        if (risk_json.studies[study_name].hasOwnProperty('age')) {
            if (!risk_json.studies[study_name].hasOwnProperty('age_map') || !risk_json.studies[study_name].age_map.size)
                risk_json.studies[study_name].age_map = new Map();
            var sr = exports.sort_ranges(Object.keys(risk_json.studies[study_name].age));
            if (sr[0][0] !== '<') {
                var lt = "<" + parseInt(sr[0], 10);
                risk_json.studies[study_name].age = Object.assign((_a = {}, _a[lt] = risk_json.studies[study_name].age[sr[0]], _a), risk_json.studies[study_name].age);
                risk_json.studies[study_name].age_map.set(lt, risk_json.studies[study_name].age[sr[0]]);
            }
            if (['>', '+'].indexOf(sr[sr.length - 1][0].slice(-1)) === -1) {
                var top_bars = sr.map(function (r) { return [parseInt(r.indexOf('-') === -1 ? r : r.split('-')[1], 10), r]; }).filter(function (n) { return !isNaN(n[0]); }).sort();
                var top_bar = top_bars[top_bars.length - 1];
                if (['>', '+'].indexOf(top_bar[1].slice(-1)) === -1) {
                    risk_json.studies[study_name].age[top_bar + "+"] = risk_json.studies[study_name].age[top_bar[1]];
                }
            }
            risk_json.studies[study_name].age_map.set(sr[0], risk_json.studies[study_name].age[sr[0]]);
        }
        if (risk_json.studies[study_name].hasOwnProperty('agenda')) {
            var all_genders_seen = exports.uniq(risk_json.studies[study_name].agenda.map(function (agenda) { return agenda.gender; }));
            var gendersAssigned_1 = 0;
            all_genders_seen.forEach(function (gender) {
                var sr = exports.sort_ranges(risk_json.studies[study_name].agenda.filter(function (agenda) {
                    return agenda.gender === gender;
                }).map(function (agenda) { return agenda.age; }));
                if (sr.length) {
                    var lowest_bar_1 = sr.find(function (o) { return ['=<', '<='].indexOf(o.slice(0, 2)) === -1 && ['<', '>'].indexOf(o[0][0]) === -1; });
                    gendersAssigned_1++;
                    var lt = parseInt(lowest_bar_1, 10);
                    assert(!isNaN(lt), lowest_bar_1 + " unexpectedly pareses to NaN");
                    risk_json.studies[study_name].agenda.unshift(Object.assign({}, risk_json.studies[study_name].agenda.filter(function (agenda) { return agenda.age === lowest_bar_1 && agenda.gender === gender; })[0], { age: "<" + lt }));
                    var top_bars = sr.map(function (r) { return [parseInt(r.indexOf('-') === -1 ? r : r.split('-')[1], 10), r]; }).filter(function (n) { return !isNaN(n[0]); }).sort();
                    var top_bar_1 = top_bars[top_bars.length - 1];
                    if (top_bar_1)
                        risk_json.studies[study_name].agenda.push(risk_json.studies[study_name].agenda
                            .filter(function (agenda) { return agenda.age === top_bar_1[1] && agenda.gender === gender; })
                            .map(function (o) { return Object.assign({}, o, { age: top_bar_1[0] + "+" }); })[0]);
                }
            });
            assert.equal(gendersAssigned_1, all_genders_seen.length, 'Genders assigned != all genders');
            risk_json.studies[study_name].agenda = exports.uniq2(risk_json.studies[study_name].agenda);
        }
    });
    return risk_json;
};
exports.sort_ranges = function (ranges) {
    return ranges.sort(function (a, b) {
        if (a[0] === '<')
            return -1;
        else if (a[0] === '>')
            return a[0].charCodeAt(0) - b[0].charCodeAt(0);
        else if (isNaN(parseInt(a[0], 10)) || b[0] === '<')
            return 1;
        else if (b[0] === '>' || isNaN(parseInt(b[0], 10)))
            return -1;
        return parseInt(a.split('-')[0], 10) - parseInt(b.split('-')[0], 10);
    });
};
var ensure_map = function (k) {
    if (k === 'map')
        return true;
    throw TypeError("Expected map, got " + k);
};
exports.risk_from_study = function (risk_json, input) {
    if (isNullOrUndefined(risk_json))
        throw TypeError('`risk_json` must be defined');
    else if (isNullOrUndefined(input))
        throw TypeError('`input` must be defined');
    exports.preprocess_studies(risk_json);
    var study = risk_json.studies[input.study];
    var study_vals = study[study.expr[0].key];
    var out = Array.isArray(study_vals) ? study_vals
        .filter(function (o) { return study.expr[0].filter
        .every(function (k) {
        return k === 'age' ?
            exports.in_range(o.age, input.age) :
            (input.hasOwnProperty(k) ?
                o[k] === input[k] : true);
    }); })[study.expr[0].take > 0 ? study.expr[0].take - 1 : 0]
        : study_vals[ensure_map(study.expr[0].type) && Object.keys(study_vals).filter(function (k) {
            return exports.in_range(k, input[study.expr[0].key]);
        })[study.expr[0].take - 1]];
    if (!out)
        throw TypeError('Expected out to match something');
    return isNumber(out) ? out : out[study.expr[0].extract];
};
exports.familial_risks_from_study = function (risk_json, input, warn) {
    if (warn === void 0) { warn = true; }
    var study = risk_json.studies[input.study];
    var res = [];
    if (!study.hasOwnProperty('sibling_pc')) {
        warn && console.warn("Using sibling from " + risk_json.default_family_history.from_study);
        study['sibling_pc'] = risk_json.default_family_history.sibling_pc;
    }
    input.sibling && res.push(study['sibling_pc']);
    if (!study.hasOwnProperty('parents_pc')) {
        warn && console.warn("Using parents_pc from " + risk_json.default_family_history.from_study);
        study['parents_pc'] = risk_json.default_family_history.parents_pc;
        risk_json.default_family_history.ref.forEach(function (ref) { return study.ref.push(ref); });
    }
    input.parent && res.push(study['sibling_pc']);
    return res;
};
exports.combined_risk = function (familial_risks_from_study_l, risk_from_studies) {
    return math.add(familial_risks_from_study_l
        .map(function (r) { return math.multiply(math.divide(r, 100), risk_from_studies); })
        .reduce(math.add), risk_from_studies);
};
exports.risks_from_study = function (risk_json, input) {
    if (isNullOrUndefined(risk_json))
        throw TypeError('`risk_json` must be defined');
    else if (isNullOrUndefined(input))
        throw TypeError('`input` must be defined');
    exports.preprocess_studies(risk_json);
    var study = risk_json.studies[input.study];
    var study_vals = study[study.expr[0].key];
    var out = Array.isArray(study_vals) ?
        study_vals
            .filter(function (o) { return input.gender ? o.gender === input.gender : true; })
            .map(function (o) { return o[study.expr[0].extract]; })
        : ensure_map(study.expr[0].type)
            && Object
                .keys(study_vals)
                .filter(function (k) { return ['a', '_'].indexOf(k[0]) === -1; })
                .map(function (k) { return study_vals[k]; });
    if (!out)
        throw TypeError('Expected out to match something');
    return exports.uniq(out);
};
exports.place_in_array = function (entry, a) {
    if (isNullOrUndefined(entry))
        throw TypeError('`entry` must be defined');
    else if (isNullOrUndefined(a))
        throw TypeError('`a` must be defined');
    var sortedA = a.sort();
    for (var i = 0; i < sortedA.length; i++)
        if (sortedA[i] === entry)
            return i;
    return -1;
};
exports.pos_in_range = function (ranges, num) {
    ranges = exports.sort_ranges(ranges);
    for (var i = 0; i < ranges.length; i++)
        if (exports.in_range(ranges[i], num))
            return i;
    return -1;
};
exports.list_ethnicities = function (risk_json) {
    if (isNullOrUndefined(risk_json))
        throw TypeError('`risk_json` must be defined');
    return Object
        .keys(risk_json.studies)
        .map(function (k) {
        var _a;
        return _a = {}, _a[k] = risk_json.studies[k].ethnicities, _a;
    });
};
exports.ethnicity2study = function (risk_json) {
    var o = {};
    Object
        .keys(risk_json.studies)
        .map(function (study_name) {
        return risk_json.studies[study_name].ethnicities.map(function (ethnicity) {
            var _a;
            return (_a = {}, _a[ethnicity] = study_name, _a);
        });
    })
        .reduce(function (a, b) { return a.concat(b); }, [])
        .forEach(function (obj) { return Object.assign(o, obj); });
    return o;
};
exports.calc_default_multiplicative_risks = function (risk_json, user) {
    return {
        age: risk_json.default_multiplicative_risks.age[Object
            .keys(risk_json.default_multiplicative_risks.age)
            .filter(function (range) { return exports.in_range(range, user.age); })[0]],
        myopia: user.myopia ? risk_json.default_multiplicative_risks.myopia.existent : 1,
        family_history: user.family_history ? risk_json.default_multiplicative_risks.family_history.existent : 1,
        diabetes: user.diabetes ? risk_json.default_multiplicative_risks.diabetes.existent : 1
    };
};
exports.calc_relative_risk = function (risk_json, input) {
    var has_gender = input.gender != null;
    var risk_per_study = has_gender ?
        Object
            .keys(risk_json.studies)
            .map(function (study_name) {
            var _a;
            return (_a = {},
                _a[study_name] = risk_json.studies[study_name].agenda == null ?
                    (function (age_range) { return ({
                        max_prevalence: risk_json.studies[study_name].age[age_range],
                        age: age_range[0]
                    }); })(Object
                        .keys(risk_json.studies[study_name].age)
                        .filter(function (age_range) { return exports.in_range(age_range, input.age); }))
                    : risk_json.studies[study_name].agenda
                        .filter(function (stat) { return input.gender === stat.gender && exports.in_range(stat.age, input.age); })[0],
                _a);
        })
            .reduce(function (obj, item) {
            var k = Object.keys(item)[0];
            obj[k] = item[k];
            return obj;
        }, {}) : null;
    var relative_risk = Object
        .keys(risk_per_study)
        .map(function (study_name) {
        var _a;
        return (_a = {},
            _a[study_name] = risk_per_study[study_name][risk_json.studies[study_name].expr[0].extract] || risk_per_study[study_name][Object
                .keys(risk_per_study[study_name])
                .filter(function (k) { return typeof risk_per_study[study_name][k] === 'number'; })[0]],
            _a);
    })
        .sort(function (a, b) { return a[Object.keys(a)[0]] > b[Object.keys(b)[0]]; });
    var graphed_rr = relative_risk.map(function (atoi) {
        var study_name = Object.keys(atoi)[0];
        var risk_val = atoi[study_name];
        return {
            name: risk_json.studies[study_name].ethnicities[0],
            size: risk_val, value: risk_val
        };
    });
    return Object.assign({
        age: input.age,
        study: input.study,
        rr: relative_risk,
        risk_per_study: risk_per_study,
        graphed_rr: graphed_rr
    }, has_gender ? { gender: input.gender } : {});
};
