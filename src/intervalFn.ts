import _ from "lodash";
import { store } from "./db/store/store";
import { upsertExchange, upsertInstrument, upsertAsset, upsertPair } from "./db/db";
import debug from "debug";
import { getMarketData } from "./getMarketData";
const log = debug("intervalFn");
import { getExchangeOrderbook } from "./getExchangeOrderbook";

export const intervalFn = async () => {
  log("interval");

  const { assets, pairs, instruments, exchanges, exchangesInstances } = await getMarketData();
  log({ assets, pairs, instruments, exchanges });

  for (const exchange of Object.values(exchanges)) {
    upsertExchange({ dbs: ['store'], exchange });
  }
  for (const asset of Object.values(assets)) {
    upsertAsset({ dbs: ['store'], asset });
  }
  for (const pair of Object.values(pairs)) {
    upsertPair({ dbs: ['store'], pair } );
  }
  for (const instrument of Object.values(instruments)) {
    upsertInstrument({ dbs: ['store'], instrument });
  }

};
