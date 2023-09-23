import debug from "debug";
import _ from "lodash";
import { getExchangeInfo } from "./getExchangeInfo";
import { getExchangeInstruments } from "./getExchangeInstruments";
import { getExchangeAssets } from "./getExchangeAssets";
import { getExchangeOrderbook } from "./getExchangeOrderbook";
import { store } from "./store";
import { toShift } from "./toShift/toShift";
const log = debug("intervalFn");

export const intervalFn = async () => {
  log("interval");
  const exchangeId = "okex"; // Замените на ID биржи, которую хотите исследовать
  const exchangeInfo = await getExchangeInfo(exchangeId);
  log("Информация о бирже:", exchangeInfo);

  log("before getExchangeInstruments");
  const instruments = await getExchangeInstruments(exchangeId);
  log("after getExchangeInstruments");
  log({ instruments });
  log("Доступные пары (инструменты) на бирже:", instruments);
  store.instruments = instruments;

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
  // store.orderBooksHistory[instrumentId].push(_.cloneDeep(orderbook));
  toShift(store.orderBooksHistory[instrumentId], [orderbook], 100);
};
