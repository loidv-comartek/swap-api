import BigNumber from "bignumber.js";

export const getOutputAmount = (pair: any, inputAmount: number) => {
  const inputReserve = new BigNumber(pair.r0);
  const outputReserve = new BigNumber(pair.r1);
  if (!inputReserve.gt(0) || !outputReserve.gt(0)) {
    return { value: new BigNumber(0) };
  }
  const inputAmountWithFee = new BigNumber(inputAmount).times(997);
  const numerator = inputAmountWithFee.times(outputReserve);
  const denominator = inputReserve.times(1000).plus(inputAmountWithFee);
  return { numerator, denominator, value: numerator.div(denominator) };
};

export const getInputAmount = (pair: any, outputAmount: number) => {
  const inputReserve = new BigNumber(pair.r0);
  const outputReserve = new BigNumber(pair.r1);
  if (!inputReserve.gt(0) || !outputReserve.gt(0)) {
    return { value: new BigNumber(0) };
  }
  const numerator = inputReserve.times(outputAmount).times(1000);
  const denominator = outputReserve.minus(outputAmount).times(997);
  if (denominator.eq(0)) {
    return { value: new BigNumber(0) };
  }
  return { numerator, denominator, value: numerator.div(denominator).plus(1) };
};
