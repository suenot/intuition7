import { getExchangeInfo } from './getExchangeInfo';
import { getExchangeInstruments } from './getExchangeInstruments';
import { getExchangeAssets } from './getExchangeAssets';
import { getExchangeOrderbook } from './getExchangeOrderbook';
import { store } from './store';
import _ from 'lodash';

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

  const base = 'BTC';
  const quote = 'USDT';
  const pairId = `${base}/${quote}`; // Замените на ID пары, которую хотите исследовать
  const instrumentId = `${base}/${quote}/${exchangeId}`; // Замените на ID инструмента, который хотите исследовать
  const orderbook = await getExchangeOrderbook(exchangeId, pairId);
  store.orderBooks[instrumentId] = orderbook;
  if (!store.orderBooksByBase[base]) store.orderBooksByBase[base] = {};
  if (!store.orderBooksByBase[base][quote]) store.orderBooksByBase[base][quote] = {};
  store.orderBooksByBase[base][quote][exchangeId] = store.orderBooks[instrumentId];
  if (!store.orderBooksHistory[instrumentId]) store.orderBooksHistory[instrumentId] = [];
  store.orderBooksHistory[instrumentId].push(_.cloneDeep(orderbook));
}