import { store } from './store';

export const upsertListingInstrument = (listingInstruments: Instrument[]) => {]
  for (const instrument of listingInstruments) {
    store.listingInstruments[instrument.id] = instrument;
  }
}