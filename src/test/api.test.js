const { LiquidityAPI } = require("../../lib");
const WelWeb = require("welweb");

const factoryAddress = "WG9XB6uxeQNxn9DXCh7HpFvKcj7mBrY17n";
describe("api.ts", () => {
  const webInstance = new WelWeb({
    fullNode: "https://api-main.welscan.io",
    solidityNode: "https://api-main.welscan.io",
  });

  let addressPart;
  webInstance.setAddress("WDHWCZjBCNcY6XN64S43DBMS3pQ5jEtoH8");
  const LiquidityAPI = new LiquidityAPI(webInstance);

  test("get list pair", async () => {
    addressPart = await LiquidityAPI.getListPair(factoryAddress);
    require();
  });

  test("get pair info", async () => {
    const pair = await LiquidityAPI.getPairByAddress(addressPart[1]);
    console.log(pair.reserves.reserve0._hex);
  });
});
