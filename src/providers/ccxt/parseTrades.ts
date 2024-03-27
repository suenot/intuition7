import ccxt from "ccxt";
import _ from "lodash";
import debug from "debug";
import { Trade as CcxtTrade, TradeSubscription as CcxtTradeSubscription } from "./ccxtTypes";
import { Trade } from "../../types";
import { tradeCcxtToCore } from "./tradesCcxtToCore/tradesCcxtToCore";
import { upsertCandles, upsertTrades } from "../../db/db";
import { sleep } from "../../index";
import { tradesToCandles } from "../../backend/tradesToCandles/tradesToCandles";
const log = debug("parseTrades");

export const parseTrades = async ({exchangeIds, pairIds}: {exchangeIds: string[], pairIds: string[]}) => {
  log('parseTrades', {exchangeIds, pairIds});
  log('For each exchange we have a separate ws connection with all pairs')
  for (const exchangeId of exchangeIds) {
    log({exchangeId});
    parseTradesOneExchange({exchangeId, pairIds});
  }
}

export const parseTradesOneExchange = async ({exchangeId, pairIds}: {exchangeId: string, pairIds: string[]}) => {
  log('parseTradesOneExchange', {exchangeId, pairIds});
  const pairIdsEmpty = _.isEmpty(pairIds);
  log({pairIdsEmpty});
  const exchangeInstance = new (ccxt.pro as any)[exchangeId]({});
  if (exchangeId in ccxt.pro) {
    while (true) {
      if (pairIdsEmpty) {
        console.log('sleep 5s');
        await sleep(5000);
      } else {
        try {
          // const pairIds = _.filter(store.pairs, pair => (pair. === exchangeId && pair.active === true))
          const tradesCcxt: CcxtTradeSubscription[] = await exchangeInstance.watchTradesForSymbols(pairIds);
          log({tradesCcxt});
          const trades: Trade[] = [];
          for (const tradeCcxt of tradesCcxt) {
            const trade = tradeCcxtToCore({tradeCcxt, exchangeId});
            log({trade});
            trades.push(trade);
          }
          upsertTrades({trades, callback: () => {
            log('upsertTrades callback'); // TODO: возможно callback не нужен
          }});
          // генерировать свечи
          // TODO: HERE
          if (trades.length === 0) continue;

          const firstTrade = trades[0];
          const pair = firstTrade?.pairId; // TODO: убдиться, что трейды приходят по одной торговой паре
          const candles = await tradesToCandles({trades, pair, timeframeName: '1s'});
          log({candles});
          upsertCandles({candles});

        } catch (e) { log(e) };
      }
    }
  }
}

// TODO: написать тест, а то может и не работает xD
export const parseTradesRest = async ({exchangeId, pairId}: {exchangeId: string, pairId: string}) => {
  const exchangeInstance = new (ccxt.pro as any)[exchangeId]({});
  if (exchangeId in ccxt.pro) {
    try {
      const trades: CcxtTrade = await exchangeInstance.fetchTrades(pairId);
      log({trades});
      return { success: true, data: trades };
    } catch (e) { 
      log(e);
      return { success: false, error: e };
    };
  }
  return { success: false, error: new Error('Exchange not found in ccxt.pro') };
}

