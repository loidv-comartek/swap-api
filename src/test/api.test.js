const { LiquidityAPI } = require("../../lib");
const WelWeb = require("welweb");
const { saveAs } = require("file-saver");
var fs = require("fs");

const factoryAddress = "WG9XB6uxeQNxn9DXCh7HpFvKcj7mBrY17n";
describe("api.ts", () => {
  const webInstance = new WelWeb({
    fullNode: "https://api-main.welscan.io",
    solidityNode: "https://api-main.welscan.io",
  });

  let addressPart;
  webInstance.setAddress("WDHWCZjBCNcY6XN64S43DBMS3pQ5jEtoH8");
  const liquidityAPI = new LiquidityAPI(webInstance);

  test("get list pair", async () => {
    addressPart = await liquidityAPI.getListPair(factoryAddress);
  });

  test("get pair info", async () => {
    const data = await Promise.all(
      addressPart.map((ad) => liquidityAPI.getPairByAddress(ad))
    );

    saveAs({}, "./export.json");

    fs.writeFile("test.txt", JSON.stringify(data), function (err) {
      if (err) {
        console.log(err);
      }
    });
  });

  test("test price", async () => {});
});
