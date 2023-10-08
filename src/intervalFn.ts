import _ from "lodash";
import { store } from "./db/store/store";
import { upsertExchange, upsertInstrument, upsertAsset, upsertPair, upsertOrderBoook } from "./db/db";
import debug from "debug";
import { getMarketData } from "./getMarketData";
const log = debug("intervalFn");
import { getExchangeOrderbook } from "./getExchangeOrderbook";

export const intervalFn = async () => {
  log("interval");

  const { assets, pairs, instruments, exchanges, exchangesInstances } = await getMarketData(); // TODO:
  log({ assets, pairs, instruments, exchanges });

  for (const exchange of Object.values(exchanges)) {
    upsertExchange({ dbs: ['store', 'nedb'], exchange });
  }
  for (const asset of Object.values(assets)) {
    upsertAsset({ dbs: ['store', 'nedb'], asset });
  }
  for (const pair of Object.values(pairs)) {
    upsertPair({ dbs: ['store', 'nedb'], pair } );
  }
  for (const instrument of Object.values(instruments)) {
    upsertInstrument({ dbs: ['store', 'nedb'], instrument });
  }


  // TODO: временный конфиг для теста
  // store.exchanges['binance'].active = true;
  // store.exchanges['okex'].active = true;
  // store.instruments['BTC/USDT/binance'].active = true;
  // store.instruments['BTC/USDT/okex'].active = true;
  
  // for (const instrument of Object.values(instruments)) {
  //   if (!(instrument.exchangeId === 'binance')) continue;
    
  //   const base = instrument.baseId;
  //   const quote = instrument.quoteId;
  //   const pairId = `${base}/${quote}`;
  //   const instrumentId = instrument.id;
  //   const exchangeId = instrument.exchangeId;
  //   const orderbook = await getExchangeOrderbook(exchangeId, pairId);
  //   upsertOrderBoook({ orderbook, instrumentId, exchangeId, pairId, base, quote });
  // }

};
