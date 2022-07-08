import abiPair from "./abi/pair.json";

export class LiqAPI {
  private webInstance: any;
  private contractInstance: Record<string, any> = {};
  constructor(_webInstance: any) {
    this.webInstance = _webInstance;
  }

  async getListPair(address: string): Promise<string[]> {
    const factory = await this.getSmartContract(address);
    const pairCount = await factory.allPairsLength().call();

    const arrayCount = Array.from(
      Array(this.webInstance.toDecimal(pairCount)).keys()
    );
    const plsAddress = await Promise.all(
      arrayCount.map((index) => factory.allPairs(index).call())
    );
    return plsAddress;
  }

  async tokensToPair(
    tokenA: string,
    tokenB: string,
    factoryAddress: string
  ): Promise<string> {
    const factory = await this.getSmartContract(factoryAddress);
    const pair = await factory.tokensToPair(tokenA, tokenB).call();
    return pair;
  }

  async getPairByAddress(address: string) {
    const pair = await this.getSmartContract(address, abiPair);

    const token0Api = pair.token0().call();
    const token1Api = pair.token1().call();
    const reservesApi = pair.getReserves().call();
    const price0CumulativeLastApi = pair.price0CumulativeLast().call();
    const price1CumulativeLastApi = pair.price1CumulativeLast().call();
    const kLastApi = pair.kLast().call();

    const [
      token0,
      token1,
      reserves,
      price0CumulativeLast,
      price1CumulativeLast,
      kLast,
    ] = await Promise.all([
      token0Api,
      token1Api,
      reservesApi,
      price0CumulativeLastApi,
      price1CumulativeLastApi,
      kLastApi,
    ]);

    return {
      token0: this.webInstance.address.fromHex(token0),
      token1: this.webInstance.address.fromHex(token1),
      reserves: {
        reserve0: reserves._reserve0,
        reserve1: reserves._reserve1,
        blockTimestampLast: reserves._blockTimestampLast,
      },
      price0CumulativeLast,
      price1CumulativeLast,
      kLast,
    };
  }

  async getSmartContract(address: string, abi?: any) {
    if (!this.contractInstance[address]) {
      this.contractInstance[address] = abi
        ? await this.webInstance.contract(abiPair, address)
        : await this.webInstance.contract().at(address);
    }
    return this.contractInstance[address];
  }
}
