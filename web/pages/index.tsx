import Axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadTime, setLoadTime] = useState(0);

  useEffect(() => {
    setLoading(true)
    const start = Date.now();
    Axios.get("http://localhost:8080/prices").then(({ data }) => {
      setPrices(data);
    }).finally(() => {
      setLoading(false)
      setLoadTime(Date.now() - start);
    });
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
            {loading ? "loading..." : `Load time: ${loadTime}ms`}
          </h3>
        </div>
        {prices.sort((a, b) => a.price - b.price).map(({ name, price }) => (
          <div key={name} className={styles.beer}>
            <h3>{name}</h3>
            <p>
              {price}
            </p>
          </div>
        ))}
      </main>
    </div>
  );
}
