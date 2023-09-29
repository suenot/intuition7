import {Exchange, Instrument, Asset, Pair} from '../../types';
import debug from "debug";
const log = debug("mongo");

export const mongoInstances = {};

// Need upsert all keys except `active`
export const upsertExchange = (exchange: Exchange) => {
// TODO: write code
}

// Need upsert all keys except `active`
export const upsertAsset = (instrument: Asset) => {
  // TODO: write code
  }

// Need upsert all keys except `active`
export const upsertPair = (instrument: Pair) => {
// TODO: write code
}

// Need upsert all keys except `active`
export const upsertInstrument = (instrument: Instrument) => {
  // TODO: write code
  }
