import * as apicache from "apicache";
import * as cors from "cors";
import * as express from "express";
import * as morgan from "morgan";
import { getCurrentPrices, startBeerPriceUpdater } from "./service";
import * as compression from "compression";

const app = express();
const port = process.env.PORT || 8081;

let cache = apicache.middleware;
const cacheSuccesses = cache(
  "30 seconds",
  (_: express.Request, res: express.Response) => res.statusCode === 200
);

app.use(cors());
app.use(compression());

app.use(
  morgan(":method :url :status :response-time ms - :res[content-length]")
);

app.get(
  "/prices",
  cacheSuccesses,
  async (req: express.Request, res: express.Response) => {
    const prices = await getCurrentPrices();
    if (prices.prices.length === 0) {
      // tell cache middleware that this is not cacheable
      res.status(204).send(prices);
      return;
    }
    res.send(prices);
  }
);

app.get(
  "/specials",
  cacheSuccesses,
  async (req: express.Request, res: express.Response) => {
    const { prices } = await getCurrentPrices();

    const top10Specials = prices.filter((price) => price.special).slice(0, 10);
    if (prices.length === 0) {
      // tell cache middleware that this is not cacheable
      res.status(204).send([]);
      return;
    }
    res.send(top10Specials);
  }
);

startBeerPriceUpdater();

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
