import { intervalFn } from './intervalFn';
import { upsertExchange, upsertPair } from './db/db';
import { store } from './db/store/store';
import { parseTrades } from './parseTrades';
import { parseOrderBooks } from './parseOrderBooks';
import { startExpressApollo } from './api/express-apollo/express-apollo';

export const main = async () => {
  // Сбор ассетов, пар, инструментов, бирж
  await intervalFn();

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
  parseOrderBooks({exchangeIds, pairIds});
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