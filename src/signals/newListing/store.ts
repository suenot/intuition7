import { Instrument, Dictionary } from '../../types';

export interface ListingInstrument extends Instrument {
  tradable: boolean;
}

export const store: {
  listingInstruments: Dictionary<ListingInstrument>,
  blackListInstruments: Dictionary<Instrument>,
} = {
  listingInstruments: {},
  blackListInstruments: {}
}