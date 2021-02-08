import * as apicache from "apicache";
import * as compression from "compression";
import * as cors from "cors";
import * as express from "express";
import * as morgan from "morgan";
import { getCurrentPrices, startBeerPriceUpdater } from "./service";

const app = express();
const port = process.env.PORT || 8081;

let cache = apicache.middleware;
const cacheSuccesses = cache(
  "30 seconds",
  // Only cache HTTP 200
  (_: express.Request, res: express.Response) => res.statusCode === 200
);

app.use(cors());
app.use(compression());

app.use(
  morgan(":method :url :status :response-time ms - :res[content-length]")
);

app.get("/prices", cacheSuccesses, async (_, res: express.Response) => {
  const prices = await getCurrentPrices();
  if (prices.prices.length === 0) {
    // tell cache middleware that this is not cacheable
    // 222 is fictive
    res.status(222).send(prices);
    return;
  }
  res.send(prices);
});

app.get("/search", async (req: express.Request, res: express.Response) => {
  const { prices, timestamp } = await getCurrentPrices();
  const query = String(req.query.q);

  console.log("search", query, req.query);

  const results = prices
    .filter((info) => info.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 10);

  res.send({
    prices: results,
    timestamp,
  });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  startBeerPriceUpdater();
});
