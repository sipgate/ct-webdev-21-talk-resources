import * as fs from "fs";
import * as NodeCache from "node-cache";
import { sleepRandom } from "./utils";

const beerPriceCache = new NodeCache({
  stdTTL: 0, // unlimited
});

export async function getCurrentPrices() {
  const priceList = beerPriceCache.get("prices");
  return priceList;
}

async function updateCurrentPrices() {
  console.log('Get current beer prices from "DB"');
  const startTime = Date.now();
  await sleepRandom(5000); // Emulate network, db speed, etc. Sleep up to 5s
  const names = await getBeerNames();

  const priceList = names.map((name: string) => ({
    name,
    price: (Math.random() * 2).toFixed(3),
  }));

  const totalTime = (Date.now() - startTime).toFixed(2);
  console.log(`Getting beer prices took ${totalTime}ms`);
  beerPriceCache.set("prices", {
    prices: priceList,
    timestamp: Date.now()
  });
}

async function getBeerNames() {
  const names = fs.readFileSync("./beers.txt").toString().split("\n");
  console.log(`Found ${names.length} beers`);
  return names;
}

export async function startBeerPriceUpdater() {
  while (true) {
    await updateCurrentPrices();
  }
}
