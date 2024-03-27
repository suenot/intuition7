import { store } from './db/store/store';
import { parseTrades } from './providers/ccxt/parseTrades';
import { parseOrderBooks } from './providers/ccxt/parseOrderBooks';
import { startExpressApollo } from './api/express-apollo/express-apollo';
import { upsertExchange, upsertInstrument, upsertAsset, upsertPair } from "./db/db";
import { Exchange, Asset, Pair, Instrument } from "./types";
import { getMarketData } from "./providers/ccxt/getMarketData";
import debug from "debug";
const log = debug("main");

// TODO: функция для проверки валидности модулей, все ли зависимости для модулей подключены

export const main = async () => {
  // Сбор ассетов, пар, инструментов, бирж
  const { assets, pairs, instruments, exchanges, exchangesInstances } = await getMarketData();
  log({ assets, pairs, instruments, exchanges });

  for (const exchange of Object.values(exchanges) as Exchange[]) {
    upsertExchange({ dbs: ['store'], exchange});
  }
  for (const asset of Object.values(assets) as Asset[]) {
    upsertAsset({ dbs: ['store'], asset});
  }
  for (const pair of Object.values(pairs) as Pair[]) {
    upsertPair({ dbs: ['store'], pair} );
  }
  for (const instrument of Object.values(instruments) as Instrument[]) {
    upsertInstrument({ dbs: ['store'], instrument });
  }
  // end Сбор ассетов, пар, инструментов, бирж

  // Сделать активными часть бирж и пар
  const exchangeIds = ['binance', 'okx', 'kucoin'];
  const pairIds = ['ETH/BTC', 'LTC/BTC', 'BTC/USDT', 'ETH/USDT', 'DOGE/USDT'];
  for (const exchangeId of exchangeIds) {
    await upsertExchange({ dbs: ['store'], exchange: {...store.exchanges[exchangeId], active: true}});
  }
  for (const pairId of pairIds) {
    await upsertPair({ dbs: ['store'], pair: {...store.pairs[pairId], active: true}});
  }

    // TODO: вынести эту логику выше, так как она повторяется в сборе трейдов и свечек
    // получаем список пар, которые есть на бирже
    // const exchangePairs = store.exchanges[exchangeId].pairs;
    // console.log({exchangePairs});

    // ОТЛАДКА:
    // выводим список пар на бирже okex (почему-то пустой список)
    // const exchangePairsOkex = store.exchanges['okex'].pairs;
    // console.log(exchangePairsOkex);

    // получаем список активных пар
    // const exchangePairsActive = _.filter(exchangePairs, pair => pair.active === true); // TODO: не работает, так как в store нет active

  // Сбор ордербуков, тиков, свечей, трейдов вебсокетами
  parseTrades({exchangeIds, pairIds});
  // parseOrderBooks({exchangeIds, pairIds}); // TODO: работает, просто временно выключил
  // parseCandles({exchangeIds, pairIds});

  // Раз в 1 секунду собирать исторические данные
  // saveOrderBookHistoryByTimer(1000)

  console.log('*******************************');
  // Сбор ассетов, пар, инструментов, бирж в цикле
  // setInterval(async () => {
  //   await intervalFn();
  // }, 30000);

  startExpressApollo();
};

main();