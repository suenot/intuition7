import { Instrument, Dictionary } from '../../types';

export const store: {
  listingInstruments: Dictionary<Instrument>,
  blackListInstruments: Dictionary<Instrument>,
} = {
  listingInstruments: {},
  blackListInstruments: {}
}