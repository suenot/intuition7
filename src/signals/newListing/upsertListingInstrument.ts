import { store } from './store';
import { Instrument } from '../../types';

export const upsertListingInstrument = (listingInstruments: Instrument[]) => {
  for (const instrument of listingInstruments) {
    store.listingInstruments[instrument.id] = instrument;
  }
}