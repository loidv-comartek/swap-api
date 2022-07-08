import BigNumber from "bignumber.js";
export declare const getOutputAmount: (pair: any, inputAmount: number) => {
    value: BigNumber;
    numerator?: undefined;
    denominator?: undefined;
} | {
    numerator: BigNumber;
    denominator: BigNumber;
    value: BigNumber;
};
export declare const getInputAmount: (pair: any, outputAmount: number) => {
    value: BigNumber;
    numerator?: undefined;
    denominator?: undefined;
} | {
    numerator: BigNumber;
    denominator: BigNumber;
    value: BigNumber;
};
