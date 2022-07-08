"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiqAPI = void 0;
const pair_json_1 = __importDefault(require("./abi/pair.json"));
class LiqAPI {
    constructor(_webInstance) {
        this.contractInstance = {};
        this.webInstance = _webInstance;
    }
    getListPair(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const factory = yield this.getSmartContract(address);
            const pairCount = yield factory.allPairsLength().call();
            const arrayCount = Array.from(Array(this.webInstance.toDecimal(pairCount)).keys());
            const plsAddress = yield Promise.all(arrayCount.map((index) => factory.allPairs(index).call()));
            return plsAddress;
        });
    }
    tokensToPair(tokenA, tokenB, factoryAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const factory = yield this.getSmartContract(factoryAddress);
            const pair = yield factory.tokensToPair(tokenA, tokenB).call();
            return pair;
        });
    }
    getPairByAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const pair = yield this.getSmartContract(address, pair_json_1.default);
            const token0Api = pair.token0().call();
            const token1Api = pair.token1().call();
            const reservesApi = pair.getReserves().call();
            const price0CumulativeLastApi = pair.price0CumulativeLast().call();
            const price1CumulativeLastApi = pair.price1CumulativeLast().call();
            const kLastApi = pair.kLast().call();
            const [token0, token1, reserves, price0CumulativeLast, price1CumulativeLast, kLast,] = yield Promise.all([
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
        });
    }
    getSmartContract(address, abi) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.contractInstance[address]) {
                this.contractInstance[address] = abi
                    ? yield this.webInstance.contract(pair_json_1.default, address)
                    : yield this.webInstance.contract().at(address);
            }
            return this.contractInstance[address];
        });
    }
}
exports.LiqAPI = LiqAPI;
