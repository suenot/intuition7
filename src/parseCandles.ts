import ccxt from "ccxt";
import debug from "debug";
import _ from "lodash";
import { OHLCV as CcxtCandle, OHLCVSubscription as CcxtCandleSubscription } from "./ccxtTypes";
import { upsertCandle } from "./db/db";
import { sleep } from "./index";
const log = debug("parseCandles");

export const parseCandles = async ({exchangeIds, pairIds}: {exchangeIds: string[], pairIds: string[]}) => {
  log('parseCandles', {exchangeIds, pairIds});
  log('For each exchange we have a separate ws connection with all pairs')
  for (const exchangeId of exchangeIds) {
    log({exchangeId});
    parseCandlesOneExchange({exchangeId, pairIds});
  }
}

export const parseCandlesOneExchange = async ({exchangeId, pairIds}: {exchangeId: string, pairIds: string[]}) => {
  log('parseCandlesOneExchange', {exchangeId, pairIds});
  const pairIdsEmpty = _.isEmpty(pairIds);
  log({pairIdsEmpty});
  const exchangeInstance = new (ccxt.pro as any)[exchangeId]({});
  if (exchangeId in ccxt.pro) {
    while (true) {
      if (pairIdsEmpty) {
        log('sleep 5s');
        await sleep(5000);
      } else {
        try {
          // const pairIds = _.filter(store.pairs, pair => (pair. === exchangeId && pair.active === true))
          const pairIdsWithFrames = _.map(pairIds, pairId => [pairId, '1m']);
          log({pairIdsWithFrames});
          const tradeCcxt: CcxtCandleSubscription = await exchangeInstance.watchCandlesForSymbols(pairIdsWithFrames);
          log({tradeCcxt});
          // const trade = tradeCcxtToCore({tradeCcxt, exchangeId});
          // log({trade});
          // upsertCandles(trade);
        } catch (e) { log(e) };
      }
    }
  }
}