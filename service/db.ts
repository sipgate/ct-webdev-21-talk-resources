import * as fs from "fs";
import { sleepRandom } from "./utils";

export async function getCurrentPrices() {
  console.log("Get current beer prices from \"DB\"");
  const startTime = Date.now();
  await sleepRandom(5000); // Emulate network, db speed, etc. Sleep up to 5s
  const names = await getBeerNames();

  const priceList = names.map((name) => ({
      name,
      price: (Math.random() * 2).toFixed(3)
  }));
  
  const totalTime = (Date.now() - startTime).toFixed(2);
  console.log(`Getting beer prices took ${totalTime}ms`);
  return priceList;
}

async function getBeerNames() {
  const names = fs.readFileSync("./beers.txt").toString().split("\n");
  console.log(`Found ${names.length} beers`);
  return names;
}
