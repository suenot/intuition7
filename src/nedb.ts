import _ from 'lodash';
import Datastore from 'nedb';
import {Exchange, Instrument} from './types';
import debug from "debug";
const log = debug("nedb");
interface NedbInstance {
  exchanges: Datastore<Exchange>,
  instruments: Datastore<Instrument>,
}

export const nedbInstance: NedbInstance = {
  exchanges: new Datastore({ filename: 'exchanges.db', autoload: true }),
  instruments: new Datastore({ filename: 'instruments.db', autoload: true }),
}

export const insertExchange = (exchange: Exchange) => {
  // nedbInstance.exchanges.insert(exchange, (err: any) => {
  //   if (err) log(err);
  // });
  nedbInstance.exchanges.update({ id: exchange.id }, _.omit(exchange, ['active']), { upsert: true }, function (err, numReplaced, upsert) {
    console.log({err, numReplaced, upsert});
  });
}

export const insertInstrument = (instrument: Instrument) => {
  // nedbInstance.instruments.insert(instrument, (err: any) => {
  //   if (err) log(err);
  // });
  nedbInstance.instruments.update({ id: instrument.id }, _.omit(instrument, ['active']), { upsert: true }, function (err, numReplaced, upsert) {
    console.log({err, numReplaced, upsert});
  });
}
