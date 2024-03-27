import { Instrument } from '../../types';

// Нужно обратить внимание, что в store инструменты хранять в словаре, а не в массиве.
export const diffInstruments = ({oldInstruments, newInstruments, alreadyListingInstruments, blacklistInstruments}: {oldInstruments: Instrument[], newInstruments: Instrument[], alreadyListingInstruments: Instrument[], blacklistInstruments: Instrument[]}): Instrument[] => {
  const oldInstrumentIds = new Set(oldInstruments.map(instrument => instrument.id));
  const alreadyListingInstrumentsIds = new Set(alreadyListingInstruments.map(instrument => instrument.id));
  const blacklistInstrumentIds = new Set(blacklistInstruments.map(instrument => instrument.id));
  return newInstruments
    .filter(instrument => !oldInstrumentIds.has(instrument.id))
    .filter(instrument => !alreadyListingInstrumentsIds.has(instrument.id))
    .filter(instrument => !blacklistInstrumentIds.has(instrument.id))
  ;
};