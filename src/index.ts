import abiPair from "./abi/pair.json";
import BigNumber from "bignumber.js";
import { getOutputAmount } from "./trade";

export class LiquidityAPI {
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

    const [token0Info, token1Info] = await Promise.all([
      this.tokenInfo(this.webInstance.address.fromHex(token0)),
      this.tokenInfo(this.webInstance.address.fromHex(token1)),
    ]);

    const reserve0 = this.toDecimal(reserves._reserve0);
    const reserve1 = this.toDecimal(reserves._reserve1);
    const price0CumulativeLastNumber = this.toDecimal(price0CumulativeLast);
    const price1CumulativeLastNumber = this.toDecimal(price1CumulativeLast);
    const price = this.getPrice(
      reserve0,
      reserve1,
      token0Info.decimals,
      token1Info.decimals
    );
    return {
      token0: token0Info,
      token1: token1Info,
      reserves: {
        reserve0,
        reserve1,
        blockTimestampLast: reserves._blockTimestampLast,
      },
      price,
      price0CumulativeLast: price0CumulativeLastNumber,
      price1CumulativeLast: price1CumulativeLastNumber,
      kLast: this.toDecimal(kLast),
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

  async tokenInfo(address: string) {
    const token = await this.getSmartContract(address);
    const [name, totalSupply, decimals, symbol] = await Promise.all([
      token.name().call(),
      this.totalSupply(address),
      token.decimals().call(),
      token.symbol().call(),
    ]);
    return {
      name,
      symbol,
      totalSupply,
      decimals,
      address,
    };
  }

  async totalSupply(address: any) {
    try {
      const token = await this.getSmartContract(address);
      const totalSupply = await token.totalSupply().call();
      return totalSupply;
    } catch (error) {
      return "";
    }
  }

  toDecimal(value: any) {
    const number = new BigNumber(value._hex || value);
    return number.toString(10);
  }

  getPrice(r0: string, r1: string, d0: number, d1: number) {
    const { value } = getOutputAmount(
      {
        r0,
        r1,
      },
      1
    );
    const kd = Number(`10e${d0}`) / Number(`10e${d1}`);
    return new BigNumber(1).dividedBy(value.times(kd).toString(10));
  }
}
