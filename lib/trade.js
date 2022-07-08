"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInputAmount = exports.getOutputAmount = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const getOutputAmount = (pair, inputAmount) => {
    const inputReserve = new bignumber_js_1.default(pair.r0);
    const outputReserve = new bignumber_js_1.default(pair.r1);
    if (!inputReserve.gt(0) || !outputReserve.gt(0)) {
        return { value: new bignumber_js_1.default(0) };
    }
    const inputAmountWithFee = new bignumber_js_1.default(inputAmount).times(997);
    const numerator = inputAmountWithFee.times(outputReserve);
    const denominator = inputReserve.times(1000).plus(inputAmountWithFee);
    return { numerator, denominator, value: numerator.div(denominator) };
};
exports.getOutputAmount = getOutputAmount;
const getInputAmount = (pair, outputAmount) => {
    const inputReserve = new bignumber_js_1.default(pair.r0);
    const outputReserve = new bignumber_js_1.default(pair.r1);
    if (!inputReserve.gt(0) || !outputReserve.gt(0)) {
        return { value: new bignumber_js_1.default(0) };
    }
    const numerator = inputReserve.times(outputAmount).times(1000);
    const denominator = outputReserve.minus(outputAmount).times(997);
    if (denominator.eq(0)) {
        return { value: new bignumber_js_1.default(0) };
    }
    return { numerator, denominator, value: numerator.div(denominator).plus(1) };
};
exports.getInputAmount = getInputAmount;
