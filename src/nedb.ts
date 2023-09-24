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
  nedbInstance.exchanges.insert(exchange, (err: any) => {
    if (err) log(err);
  });
}

export const insertInstrument = (instrument: Instrument) => {
  nedbInstance.instruments.insert(instrument, (err: any) => {
    if (err) log(err);
  });
}
