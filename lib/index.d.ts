export declare class LiquidityAPI {
    private webInstance;
    private contractInstance;
    constructor(_webInstance: any);
    getListPair(address: string): Promise<string[]>;
    tokensToPair(tokenA: string, tokenB: string, factoryAddress: string): Promise<string>;
    getPairByAddress(address: string): Promise<{
        token0: any;
        token1: any;
        reserves: {
            reserve0: any;
            reserve1: any;
            blockTimestampLast: any;
        };
        price0CumulativeLast: any;
        price1CumulativeLast: any;
        kLast: any;
    }>;
    getSmartContract(address: string, abi?: any): Promise<any>;
}
