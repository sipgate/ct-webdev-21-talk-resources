import Axios from "axios";
import { formatDistanceToNowStrict } from "date-fns";
import Head from "next/head";
import React, { ChangeEvent, useState } from "react";
import { FadeLoader } from "react-spinners";
import useSWR from 'swr';
import styles from "../styles/Home.module.css";

type BeerPriceInfo = {
  name: string;
  price: number;
  special: boolean;
}

type BeerPriceData = {
  timestamp: number,
  prices: BeerPriceInfo[];
}

async function fetchPrices() {
  const { data } = await Axios.get<BeerPriceData>("http://localhost:8081/prices")
  console.log("Fetched beer prices", data)
  return data
}

async function fetchSearchResults(query: string) {
  const { data } = await Axios.get<BeerPriceData>("http://localhost:8081/search", {
    params: {
      q: query
    }
  })
  console.log("Fetched search results", data)
  return data
}

const Beer: React.FC<{ beer: BeerPriceInfo }> = ({ beer: { price, name } }) => {
  return (<div key={name} className={styles.beer}>
    <div className={styles.beerPrice}>
      {price}€/l
  </div>
    <div className={styles.beerName}>{name}
    </div>
    <button>Jetzt kaufen!</button>
  </div>)
}

export default function Home() {
  const [searchResults, setSearchResults] = useState<BeerPriceInfo[]>([]);
  const [query, setQuery] = useState<string>("");
  const { data: beerPriceData } = useSWR('beer-prices', fetchPrices, {
    refreshInterval: 30
  });

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }

  const handleSearch = async () => {
    const res = await fetchSearchResults(query);
    console.log("Search Results", res)
    setSearchResults(res.prices)
  }


  if (!beerPriceData) {
    return <div className={styles.loading}>
      <FadeLoader />
    </div>
  }

  return (
    <div className={styles.root}>
      <Head>
        <title>Bier Börse 3000</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.search}>
          <div>
            <input placeholder="Search" value={query} onChange={handleSearchChange}></input><button onClick={handleSearch}>Search</button>
          </div>
          <div className={styles.searchResults}>
            {searchResults.map((beer) => (
              <Beer key={beer.name} beer={beer} />
            ))}
          </div>
        </div>
        <div>
          Datenstand: {formatDistanceToNowStrict(new Date(beerPriceData.timestamp))}
        </div>
        <div className={styles.beers}>
          {beerPriceData.prices.sort((a, b) => a.price - b.price)
            .map((beer) => (
              <Beer key={beer.name} beer={beer} />
            ))}
        </div>
      </main>
    </div>
  );
}
