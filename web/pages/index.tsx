import Axios from "axios";
import { formatDistanceToNowStrict } from "date-fns";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [prices, setPrices] = useState<Array<{ name: string; price: number }>>([]);
  const [specials, setSpecials] = useState<Array<{ name: string; price: number }>>([]);
  const [timestamp, setTimestamp] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [loadTime, setLoadTime] = useState(0);

  useEffect(() => {
    setLoading(true)
    const start = Date.now();
    Axios.get("http://localhost:8081/prices").then(({ data: { prices, timestamp } }) => {
      setPrices(prices);
      setTimestamp(timestamp);
    }).finally(() => {
      setLoading(false)
      setLoadTime(Date.now() - start);
    });
  }, []);

  const updateprices = () => {
    const start = Date.now();
    Axios.get("http://localhost:8081/prices").then(({ data: { prices, timestamp } }) => {
      setPrices(prices);
      setTimestamp(timestamp);
    }).finally(() => {
      setLoadTime(Date.now() - start);
    });
  }

  useEffect(() => {
    Axios.get("http://localhost:8081/specials").then(({ data }) => {
      setSpecials(data);
    }).catch(e => console.log("error fetching specials", e))
  }, []);


  return (
    <div className={styles.root}>
      <Head>
        <title>Bier!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.header}>
          <h3>
            {loading ? "loading..." : `Load time: ${loadTime}ms - Datenstand ${formatDistanceToNowStrict(new Date(timestamp))} alt`}
            <button onClick={updateprices}>update</button>
          </h3>
        </div>
        <h4>Specials</h4>
        <div className={styles.specials}>
          {specials.map(({ name, price }) => (
            <div key={name} className={styles.beer}>
              <h3>{name}</h3>
              <p>
                {price}
              </p>
            </div>
          ))}
        </div>
        <h4>All beer prices</h4>
        <div className={styles.beers}>
          {prices.sort((a, b) => a.price - b.price).map(({ name, price }) => (
            <div key={name} className={styles.beer}>
              <h3>{name}</h3>
              <p>
                {price}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
