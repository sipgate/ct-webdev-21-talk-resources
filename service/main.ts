import * as express from "express";
import { getCurrentPrices, startBeerPriceUpdater } from "./service";
import * as cors from "cors"

const app = express();
const port = process.env.PORT || 8081;

app.use(cors())

app.get("/prices", async (req: express.Request, res: express.Response) => {
  console.log("Request prices", req.headers);
  const prices = await getCurrentPrices();
  res.send(prices);
});


startBeerPriceUpdater();

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
