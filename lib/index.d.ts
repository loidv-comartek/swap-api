export declare class LiquidityAPI {
    private webInstance;
    private contractInstance;
    constructor(_webInstance: any);
    getListPair(address: string): Promise<string[]>;
    tokensToPair(tokenA: string, tokenB: string, factoryAddress: string): Promise<string>;
    getPairByAddress(address: string): Promise<{
        token0: {
            name: any;
            symbol: any;
            totalSupply: any;
            decimals: any;
            address: string;
        };
        token1: {
            name: any;
            symbol: any;
            totalSupply: any;
            decimals: any;
            address: string;
        };
        reserves: {
            reserve0: string;
            reserve1: string;
            blockTimestampLast: any;
        };
        price: {
            price0: string;
            price1: string;
        };
        price0CumulativeLast: string;
        price1CumulativeLast: string;
        kLast: string;
    }>;
    getSmartContract(address: string, abi?: any): Promise<any>;
    tokenInfo(address: string): Promise<{
        name: any;
        symbol: any;
        totalSupply: any;
        decimals: any;
        address: string;
    }>;
    totalSupply(address: any): Promise<any>;
    private toTokenNumber;
    toDecimal(value: any): string;
    getPrice(r0: string, r1: string, d0: number, d1: number): {
        price0: string;
        price1: string;
    };
}
