import { getExchangeInfo } from './getExchangeInfo';
import { getExchangeInstruments } from './getExchangeInstruments';
import { getExchangeAssets } from './getExchangeAssets';
import { getExchangeOrderbook } from './getExchangeOrderbook';
import { store } from './store';

export const intervalFn = async () => {
  console.log('interval');
  const exchangeId = 'okex'; // Замените на ID биржи, которую хотите исследовать
  const exchangeInfo = await getExchangeInfo(exchangeId);
  console.log('Информация о бирже:', exchangeInfo);

  console.log('before getExchangeInstruments');
  const instruments = await getExchangeInstruments(exchangeId);
  console.log('after getExchangeInstruments');
  console.log({instruments});
  console.log('Доступные пары (инструменты) на бирже:', instruments);
  store.instruments = instruments;

  const assets = await getExchangeAssets(exchangeId);
  console.log('Доступные активы (монеты) на бирже:', assets);
  store.assets = assets;

  const orderbook = await getExchangeOrderbook(exchangeId, 'BTC/USDT');
  // store.orderbooks['BTC/USDT'] = orderbook;
  store.orderbooks['BTC_USDT'] = orderbook;
  if (!store.orderbooksByBase['BTC']) store.orderbooksByBase['BTC'] = {};
  if (!store.orderbooksByBase['BTC']['USDT']) store.orderbooksByBase['BTC']['USDT'] = {};
  store.orderbooksByBase['BTC']['USDT'][exchangeId] = store.orderbooks['BTC_USDT'];
}