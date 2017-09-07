"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const fs_1 = require("fs");
const assert = require("assert");
const math = require("mathjs");
exports.ethnicities_pretty = (ethnicities) => ethnicities.map(study => (study_name => `${study_name}: ${study[study_name].join(', ')}`)(Object.keys(study)[0]));
exports.s_col_to_s = (s) => s.slice(0, s.indexOf(':'));
exports.in_range = (range, num) => {
    if (range === 'all' || range[0] === '_')
        return false;
    const dash = range.indexOf('-');
    if (dash !== -1)
        return num >= parseInt(range.slice(0, dash - range.length), 10) && num <= parseInt(range.slice(-dash), 10);
    let last = range.slice(-2);
    if (!isNaN(parseInt(last[0], 10)))
        last = last[1];
    if (isNaN(parseInt(last, 10))) {
        const _rest = parseInt(range, 10);
        const operators = Object.freeze({
            '>': num > _rest,
            '+': num >= _rest,
            '>=': num >= _rest,
            '=>': num >= _rest
        });
        if (Object.keys(operators).indexOf(last) === -1)
            throw TypeError(`Invalid operation of \`${last}\``);
        return operators[last];
    }
    const op = range.slice(0, 2);
    const rest = parseInt(range.slice(2), 10);
    if (op === '<=' || op === '=<')
        return num <= rest;
    else if (op[0] === '<')
        return num < parseInt(range.slice(1), 10);
    else if (op === '>=' || op === '=>')
        return num >= rest;
    return range === num;
};
exports.lowest_range = (ranges) => ranges.reduce((prevNum, currentValue) => {
    const curNum = parseInt(currentValue, 10);
    return curNum < prevNum ? curNum : prevNum;
}, 100);
exports.uniq = (a) => {
    const seen = {};
    return a.filter(item => seen.hasOwnProperty(item) ? false : (seen[item] = true)).filter(k => k !== undefined);
};
exports.uniq2 = (arr) => {
    const keys = arr.length === 0 ? [] : Object.keys(arr[0]);
    const seen = new Map();
    arr.forEach((a) => {
        const key = keys.map(k => a[k]).join('|');
        if (!seen.has(key))
            seen.set(key, a);
    });
    return Array.from(seen.values());
};
exports.preprocess_studies = (risk_json) => {
    Object.keys(risk_json.studies).forEach(study_name => {
        if (risk_json.studies[study_name].hasOwnProperty('age')) {
            if (!risk_json.studies[study_name].hasOwnProperty('age_map') || !risk_json.studies[study_name].age_map.size)
                risk_json.studies[study_name].age_map = new Map();
            const sr = exports.sort_ranges(Object.keys(risk_json.studies[study_name].age));
            if (sr[0][0] !== '<') {
                const lt = `<${parseInt(sr[0], 10)}`;
                risk_json.studies[study_name].age = Object.assign({ [lt]: risk_json.studies[study_name].age[sr[0]] }, risk_json.studies[study_name].age);
                risk_json.studies[study_name].age_map.set(lt, risk_json.studies[study_name].age[sr[0]]);
            }
            if (['>', '+'].indexOf(sr[sr.length - 1][0].slice(-1)) === -1) {
                const top_bars = sr.map(r => [parseInt(r.indexOf('-') === -1 ? r : r.split('-')[1], 10), r]).filter((n) => !isNaN(n[0])).sort();
                const top_bar = top_bars[top_bars.length - 1];
                if (['>', '+'].indexOf(top_bar[1].slice(-1)) === -1) {
                    risk_json.studies[study_name].age[`${top_bar}+`] = risk_json.studies[study_name].age[top_bar[1]];
                }
            }
            risk_json.studies[study_name].age_map.set(sr[0], risk_json.studies[study_name].age[sr[0]]);
        }
        if (risk_json.studies[study_name].hasOwnProperty('agenda')) {
            const all_genders_seen = exports.uniq(risk_json.studies[study_name].agenda.map(agenda => agenda.gender));
            let gendersAssigned = 0;
            all_genders_seen.forEach(gender => {
                const sr = exports.sort_ranges(risk_json.studies[study_name].agenda.filter(agenda => agenda.gender === gender).map(agenda => agenda.age));
                if (sr.length) {
                    const lowest_bar = sr.find(o => ['=<', '<='].indexOf(o.slice(0, 2)) === -1 && ['<', '>'].indexOf(o[0][0]) === -1);
                    gendersAssigned++;
                    const lt = parseInt(lowest_bar, 10);
                    assert(!isNaN(lt), `${lowest_bar} unexpectedly pareses to NaN`);
                    risk_json.studies[study_name].agenda.unshift(Object.assign({}, risk_json.studies[study_name].agenda.filter(agenda => agenda.age === lowest_bar && agenda.gender === gender)[0], { age: `<${lt}` }));
                    const top_bars = sr.map(r => [parseInt(r.indexOf('-') === -1 ? r : r.split('-')[1], 10), r]).filter((n) => !isNaN(n[0])).sort();
                    const top_bar = top_bars[top_bars.length - 1];
                    if (top_bar)
                        risk_json.studies[study_name].agenda.push(risk_json.studies[study_name].agenda
                            .filter(agenda => agenda.age === top_bar[1] && agenda.gender === gender)
                            .map(o => Object.assign({}, o, { age: `${top_bar[0]}+` }))[0]);
                }
            });
            assert.equal(gendersAssigned, all_genders_seen.length, 'Genders assigned != all genders');
            risk_json.studies[study_name].agenda = exports.uniq2(risk_json.studies[study_name].agenda);
        }
    });
    return risk_json;
};
exports.sort_ranges = (ranges) => ranges.sort((a, b) => {
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
const ensure_map = (k) => {
    if (k === 'map')
        return true;
    throw TypeError(`Expected map, got ${k}`);
};
exports.risk_from_study = (risk_json, input) => {
    if (util_1.isNullOrUndefined(risk_json))
        throw TypeError('`risk_json` must be defined');
    else if (util_1.isNullOrUndefined(input))
        throw TypeError('`input` must be defined');
    exports.preprocess_studies(risk_json);
    const study = risk_json.studies[input.study];
    const study_vals = study[study.expr[0].key];
    const out = util_1.isArray(study_vals) ? study_vals.filter(o => study.expr[0].filter.every(k => k === 'age' ? exports.in_range(o.age, input.age) : input.hasOwnProperty(k) ? o[k] === input[k] : true))[study.expr[0].take > 0 ? study.expr[0].take - 1 : 0]
        : study_vals[ensure_map(study.expr[0].type) && Object.keys(study_vals).filter(k => exports.in_range(k, input[study.expr[0].key]))[study.expr[0].take - 1]];
    if (!out)
        throw TypeError('Expected out to match something');
    return util_1.isNumber(out) ? out : out[study.expr[0].extract];
};
exports.familial_risks_from_study = (risk_json, input, warn = true) => {
    const study = risk_json.studies[input.study];
    const res = [];
    if (!study.hasOwnProperty('sibling_pc')) {
        warn && console.warn(`Using sibling from ${risk_json.default_family_history.from_study}`);
        study['sibling_pc'] = risk_json.default_family_history.sibling_pc;
    }
    input.sibling && res.push(study['sibling_pc']);
    if (!study.hasOwnProperty('parents_pc')) {
        warn && console.warn(`Using parents_pc from ${risk_json.default_family_history.from_study}`);
        study['parents_pc'] = risk_json.default_family_history.parents_pc;
        risk_json.default_family_history.ref.forEach(ref => study.ref.push(ref));
    }
    input.parent && res.push(study['sibling_pc']);
    return res;
};
exports.combined_risk = (familial_risks_from_study_l, risk_from_studies) => math.add(familial_risks_from_study_l
    .map(r => math.multiply(math.divide(r, 100), risk_from_studies))
    .reduce(math.add), risk_from_studies);
exports.risks_from_study = (risk_json, input) => {
    if (util_1.isNullOrUndefined(risk_json))
        throw TypeError('`risk_json` must be defined');
    else if (util_1.isNullOrUndefined(input))
        throw TypeError('`input` must be defined');
    exports.preprocess_studies(risk_json);
    const study = risk_json.studies[input.study];
    const study_vals = study[study.expr[0].key];
    const out = util_1.isArray(study_vals) ?
        study_vals
            .filter(o => input.gender ? o.gender === input.gender : true)
            .map(o => o[study.expr[0].extract])
        : ensure_map(study.expr[0].type)
            && Object
                .keys(study_vals)
                .filter(k => ['a', '_'].indexOf(k[0]) === -1)
                .map(k => study_vals[k]);
    if (!out)
        throw TypeError('Expected out to match something');
    return exports.uniq(out);
};
exports.place_in_array = (entry, a) => {
    if (util_1.isNullOrUndefined(entry))
        throw TypeError('`entry` must be defined');
    else if (util_1.isNullOrUndefined(a))
        throw TypeError('`a` must be defined');
    const sortedA = a.sort();
    for (let i = 0; i < sortedA.length; i++)
        if (sortedA[i] === entry)
            return i;
    return -1;
};
exports.pos_in_range = (ranges, num) => {
    ranges = exports.sort_ranges(ranges);
    for (let i = 0; i < ranges.length; i++)
        if (exports.in_range(ranges[i], num))
            return i;
    return -1;
};
exports.list_ethnicities = (risk_json) => {
    if (util_1.isNullOrUndefined(risk_json))
        throw TypeError('`risk_json` must be defined');
    return Object
        .keys(risk_json.studies)
        .map(k => {
        return { [k]: risk_json.studies[k].ethnicities };
    });
};
exports.ethnicity2study = (risk_json) => {
    const o = {};
    Object
        .keys(risk_json.studies)
        .map(study_name => risk_json.studies[study_name].ethnicities.map(ethnicity => ({ [ethnicity]: study_name })))
        .reduce((a, b) => a.concat(b), [])
        .forEach(obj => Object.assign(o, obj));
    return o;
};
exports.calc_default_multiplicative_risks = (risk_json, user) => {
    return {
        age: risk_json.default_multiplicative_risks.age[Object
            .keys(risk_json.default_multiplicative_risks.age)
            .filter(range => exports.in_range(range, user.age))[0]],
        myopia: user.myopia ? risk_json.default_multiplicative_risks.myopia.existent : 1,
        family_history: user.family_history ? risk_json.default_multiplicative_risks.family_history.existent : 1,
        diabetes: user.diabetes ? risk_json.default_multiplicative_risks.diabetes.existent : 1
    };
};
exports.calc_relative_risk = (risk_json, input) => {
    const has_gender = input.gender != null;
    const risk_per_study = has_gender ?
        Object
            .keys(risk_json.studies)
            .map(study_name => ({
            [study_name]: risk_json.studies[study_name].agenda != null ?
                risk_json.studies[study_name].agenda
                    .filter(stat => input.gender === stat.gender && exports.in_range(stat.age, input.age))[0]
                : (age_range => ({
                    max_prevalence: risk_json.studies[study_name].age[age_range],
                    age: age_range[0]
                }))(Object
                    .keys(risk_json.studies[study_name].age)
                    .filter(age_range => exports.in_range(age_range, input.age)))
        }))
            .reduce((obj, item) => {
            const k = Object.keys(item)[0];
            obj[k] = item[k];
            return obj;
        }, {}) : null;
    const relative_risk = Object
        .keys(risk_per_study)
        .map(study_name => ({
        [study_name]: risk_per_study[study_name][risk_json.studies[study_name].expr[0].extract] || risk_per_study[study_name][Object
            .keys(risk_per_study[study_name])
            .filter(k => typeof risk_per_study[study_name][k] === 'number')[0]]
    }))
        .sort((a, b) => a[Object.keys(a)[0]] > b[Object.keys(b)[0]]);
    const graphed_rr = relative_risk.map(atoi => {
        const study_name = Object.keys(atoi)[0];
        const risk_val = atoi[study_name];
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
        graphed_rr
    }, has_gender ? { gender: input.gender } : {});
};
if (require.main === module) {
    fs_1.exists('./risk.json', fs_exists => {
        console.error(`fs_exists = ${fs_exists}`);
        fs_1.writeFile('/tmp/a.txt', `fs_exists = ${fs_exists}`, err => {
            if (err)
                throw err;
            fs_1.readFile('./risk.json', 'utf8', (e, data) => {
                if (e)
                    throw e;
                console.info(data);
            });
        });
    });
}
