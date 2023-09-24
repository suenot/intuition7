import _ from "lodash";
import { getExchangeInfo } from "./getExchangeInfo";
import { getExchangeInstruments } from "./getExchangeInstruments";
import { getExchangeAssets } from "./getExchangeAssets";
import { getExchangeOrderbook } from "./getExchangeOrderbook";
import { store } from "./store";
import { toShift } from "./toShift/toShift";
import { insertExchange, insertInstrument } from "./nedb";
import debug from "debug";
const log = debug("intervalFn");

export const intervalFn = async () => {
  log("interval");

  // TODO: получить список бирж
  // записать их в nedb
  // exchanges.forEach((exchange) => {
  //   insertExchange(exchange);
  // });

  const exchangeId = "okex"; // Замените на ID биржи, которую хотите исследовать
  const exchangeInfo = await getExchangeInfo(exchangeId);
  log("Информация о бирже:", exchangeInfo);

  log("before getExchangeInstruments");
  const instruments = await getExchangeInstruments(exchangeId);
  log("after getExchangeInstruments");
  log({ instruments });
  log("Доступные пары (инструменты) на бирже:", instruments);
  store.instruments = instruments;
  instruments.forEach((instrument) => {
    insertInstrument(instrument);
  });

  const assets = await getExchangeAssets(exchangeId);
  log("Доступные активы (монеты) на бирже:", assets);
  store.assets = assets;

  const base = "BTC";
  const quote = "USDT";
  const pairId = `${base}/${quote}`; // Замените на ID пары, которую хотите исследовать
  const instrumentId = `${base}/${quote}/${exchangeId}`; // Замените на ID инструмента, который хотите исследовать
  const orderbook = await getExchangeOrderbook(exchangeId, pairId);
  store.orderBooks[instrumentId] = orderbook;
  if (!store.orderBooksByBase[base]) store.orderBooksByBase[base] = {};
  if (!store.orderBooksByBase[base][quote])
    store.orderBooksByBase[base][quote] = {};
  store.orderBooksByBase[base][quote][exchangeId] =
    store.orderBooks[instrumentId];
  if (!store.orderBooksHistory[instrumentId])
    store.orderBooksHistory[instrumentId] = [];
  if (!store.orderBooksHistoryByBase[base]) store.orderBooksHistoryByBase[base] = {};
  if (!store.orderBooksHistoryByBase[base][quote])
    store.orderBooksHistoryByBase[base][quote] = {};
  if (!store.orderBooksHistoryByBase[base][quote][exchangeId])
    store.orderBooksHistoryByBase[base][quote][exchangeId] = [];
  store.orderBooksHistoryByBase[base][quote][exchangeId].push(_.cloneDeep(orderbook));
  toShift(store.orderBooksHistory[instrumentId], [orderbook], 100);
};
