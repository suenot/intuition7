import _ from 'lodash';
import Datastore from 'nedb';
import {Exchange, Instrument, Asset, Pair} from '../../types';
import debug from "debug";
const log = debug("nedb");

 interface NedbInstance {
  exchanges: Datastore<Exchange>,
  assets: Datastore<Asset>,
  pairs: Datastore<Pair>,
  instruments: Datastore<Instrument>,
}

export const nedbInstance: NedbInstance = {
  exchanges: new Datastore({ filename: 'exchanges.db', autoload: true }),
  assets: new Datastore({ filename: 'assets.db', autoload: true }),
  pairs: new Datastore({ filename: 'pairs.db', autoload: true }),
  instruments: new Datastore({ filename: 'instruments.db', autoload: true }),
}

export const upsertExchange = (exchange: Exchange) => {
  nedbInstance.exchanges.update({ id: exchange.id }, _.omit(exchange, ['active']), { upsert: true }, function (err, numReplaced, upsert) {
    console.log({err, numReplaced, upsert});
  });
}

export const upsertAsset = (asset: Asset) => {
  nedbInstance.assets.update({ id: asset.id }, _.omit(asset, ['active']), { upsert: true }, function (err, numReplaced, upsert) {
    console.log({err, numReplaced, upsert});
  });
}

export const upsertPair = (pair: Pair) => {
  nedbInstance.pairs.update({ id: pair.id }, _.omit(pair, ['active']), { upsert: true }, function (err, numReplaced, upsert) {
    console.log({err, numReplaced, upsert});
  });
}

export const upsertInstrument = (instrument: Instrument) => {
  nedbInstance.instruments.update({ id: instrument.id }, _.omit(instrument, ['active']), { upsert: true }, function (err, numReplaced, upsert) {
    console.log({err, numReplaced, upsert});
  });
}
